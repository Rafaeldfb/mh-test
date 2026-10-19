import type { ContributionRow } from "./types";

export type ChartPoint = {
  label: string;
  channel: string;
  investment: number;
  contribution: number;
  roi: number | null;
};

export function salesPerReal(investment: number, contribution: number): number | null {
  if (!Number.isFinite(investment) || investment <= 0) return null;
  const ratio = contribution / investment;
  return Number.isFinite(ratio) ? ratio : null;
}

export function chartData(rows: readonly ContributionRow[]) {
  const point = (row: ContributionRow): ChartPoint => ({
    label: row.vehicle ?? row.channel,
    channel: row.channel,
    investment: row.investment,
    contribution: row.contribution,
    roi: salesPerReal(row.investment, row.contribution),
  });
  // Totals and details describe the same money at different granularities.
  return {
    channels: rows.filter((row) => row.vehicle === null).map(point),
    vehicles: rows.filter((row) => row.vehicle !== null).map(point),
  };
}
