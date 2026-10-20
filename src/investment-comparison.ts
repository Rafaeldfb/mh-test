import type { ContributionRow } from "./types";

export type HistoricalInvestment =
  | { kind: "positive" | "zero"; amount: number }
  | { kind: "missing" | "invalid" };

export type InvestmentChange =
  | { kind: "available"; fraction: number }
  | { kind: "missing" | "invalid" | "zero" | "overflow" };

export type InvestmentComparison = {
  channel: string;
  current: number;
  history: HistoricalInvestment;
  change: InvestmentChange;
};

export function classifyHistory(value: unknown): HistoricalInvestment {
  if (value === null) return { kind: "missing" };
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) return { kind: "invalid" };
  return { kind: value === 0 ? "zero" : "positive", amount: value };
}

function investmentChange(current: number, history: HistoricalInvestment): InvestmentChange {
  if (history.kind !== "positive") return { kind: history.kind };
  const fraction = (current - history.amount) / history.amount;
  return Number.isFinite(fraction) ? { kind: "available", fraction } : { kind: "overflow" };
}

export function compareInvestments(rows: readonly ContributionRow[]): InvestmentComparison[] {
  return rows.filter((row) => row.vehicle === null).map((row) => {
    const history = classifyHistory(row.baseline);
    return { channel: row.channel, current: row.investment, history, change: investmentChange(row.investment, history) };
  });
}
