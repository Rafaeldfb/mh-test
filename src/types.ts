export type ChartType = "bar" | "line" | "pie";

/** roi = vendas atribuídas / investimento */
export type Metric = "investment" | "contribution" | "roi";

export type Breakdown = "channel" | "vehicle";

export type ChartSpec = {
  id: string;
  type: ChartType;
  title: string;
  metric: Metric;
  breakdown: Breakdown;
};

export type Period = {
  start: string;
  end: string;
  label: string;
};

export type AgentResponse = {
  question: string;
  title: string;
  summary: string;
  period: Period;
  source: { table: string; model: string };
  charts: ChartSpec[];
};

export type ContributionRow = {
  channel: string;
  vehicle: string | null;
  /** investimento no período, em reais */
  investment: number;
  /** vendas atribuídas ao canal pelo modelo, em reais */
  contribution: number;
  /** Histórico recebido; classificar antes de calcular a comparação anual. */
  baseline: unknown;
};

export type DataResponse = {
  period: Period;
  rows: ContributionRow[];
};
