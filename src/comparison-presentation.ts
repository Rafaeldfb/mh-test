import { formatDate } from "./format";
import type { Period } from "./types";

function priorYear(date: string): string {
  const value = new Date(date);
  const month = value.getUTCMonth();
  value.setUTCFullYear(value.getUTCFullYear() - 1);
  // February 29 uses the last day of February in a non-leap comparison year.
  if (value.getUTCMonth() !== month) value.setUTCDate(0);
  return value.toISOString().slice(0, 10);
}

export function comparisonPeriods(period: Period) {
  return {
    current: `${formatDate(period.start)} a ${formatDate(period.end)}`,
    prior: `${formatDate(priorYear(period.start))} a ${formatDate(priorYear(period.end))}`,
  };
}
