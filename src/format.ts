const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const compactCurrency = new Intl.NumberFormat("pt-BR", {
  style: "currency", currency: "BRL", notation: "compact", maximumFractionDigits: 1,
});
const ratio = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 2, minimumFractionDigits: 2 });
const ratioTick = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 2 });
const percent = new Intl.NumberFormat("pt-BR", { style: "percent", maximumFractionDigits: 1 });
export const formatCurrency = (value: number) => currency.format(value);
export const formatCompactCurrency = (value: number) => compactCurrency.format(value);
export const formatRatioTick = (value: number) => `${ratioTick.format(value)}×`;
export const formatRatio = (value: number) => `R$ ${ratio.format(value)} / R$ 1`;
export const formatShare = (value: number, total: number) => percent.format(value / total);
export function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(new Date(value));
}

const investmentChange = new Intl.NumberFormat("pt-BR", {
  style: "percent", minimumFractionDigits: 2, maximumFractionDigits: 2, signDisplay: "always",
});
const unchangedInvestment = new Intl.NumberFormat("pt-BR", {
  style: "percent", minimumFractionDigits: 2, maximumFractionDigits: 2,
}).format(0);
/** Receives a fraction: 0.25 means +25,00%. */
export const formatInvestmentChange = (fraction: number) => fraction === 0
  ? unchangedInvestment : investmentChange.format(fraction);
