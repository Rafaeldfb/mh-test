import { formatDate, formatInvestmentChange } from "./format";
import type { InvestmentChange } from "./investment-comparison";
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

export function investmentChangeLabel(change: InvestmentChange): string {
  switch (change.kind) {
    case "available": return formatInvestmentChange(change.fraction);
    case "missing": return "Comparação indisponível: histórico não informado.";
    case "invalid": return "Comparação indisponível: histórico inválido.";
    case "zero": return "Variação percentual indisponível: investimento anterior igual a zero.";
    case "overflow": return "Variação percentual indisponível: resultado fora do limite numérico.";
  }
}
