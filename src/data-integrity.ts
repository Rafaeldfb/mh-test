import type { ContributionRow } from "./types";

export type DataIssue = "missing-total" | "duplicate-total" | "totals-mismatch";

export class DataIntegrityError extends Error {
  constructor(public issue: DataIssue, public channel: string) {
    super(`${issue}: ${channel}`);
    this.name = "DataIntegrityError";
  }
}

function matchesTotal(actual: number, expected: number) {
  // Compare rounded cents, allowing one cent for summed monetary rounding.
  return Math.abs(Math.round(actual * 100) - Math.round(expected * 100)) <= 1;
}

function validateChannel(rows: readonly ContributionRow[], channel: string) {
  const totals = rows.filter((row) => row.vehicle === null);
  if (totals.length === 0) throw new DataIntegrityError("missing-total", channel);
  if (totals.length > 1) throw new DataIntegrityError("duplicate-total", channel);
  const details = rows.filter((row) => row.vehicle !== null);
  const investment = details.reduce((sum, row) => sum + row.investment, 0);
  const contribution = details.reduce((sum, row) => sum + row.contribution, 0);
  if (!matchesTotal(investment, totals[0].investment) ||
      !matchesTotal(contribution, totals[0].contribution)) {
    throw new DataIntegrityError("totals-mismatch", channel);
  }
}

export function validateChannelTotals(rows: readonly ContributionRow[]) {
  const channels = new Set(rows.map((row) => row.channel));
  for (const channel of channels) {
    validateChannel(rows.filter((row) => row.channel === channel), channel);
  }
}
