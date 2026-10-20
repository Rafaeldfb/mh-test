import { DashboardCharts } from "./DashboardCharts";
import { InvestmentComparisonFlow } from "./InvestmentComparisonFlow";
import { formatDate } from "./format";
import type { DashboardResponse } from "./api";
import type { DashboardState } from "./useDashboard";

export function DashboardMetadata({ response }: { response: DashboardResponse }) {
  const { agent } = response;
  return (
    <header className="result-heading reveal">
      <p className="eyebrow">Análise de marketing · {agent.period.label}</p>
      <h1>{agent.title}</h1>
      <p className="summary">{agent.summary}</p>
      <p className="period">Período: <time dateTime={agent.period.start}>{formatDate(agent.period.start)}</time>
        {" a "}<time dateTime={agent.period.end}>{formatDate(agent.period.end)}</time></p>
    </header>
  );
}

export function DashboardAnnouncements({ state }: { state: DashboardState }) {
  const status = {
    idle: "",
    loading: "Carregando o painel…",
    success: "Painel carregado.",
    error: "",
  };
  return (
    <>
      <p role="status" aria-atomic="true" className="sr-only">{status[state.status]}</p>
      <p role="alert" aria-atomic="true" className="sr-only">
        {state.status === "error" ? state.message : ""}
      </p>
    </>
  );
}

export function DashboardWorkspace({ state, retry }: { state: DashboardState; retry: () => void }) {
  if (state.status === "idle") return (
    <section className="empty-state">
      <p className="eyebrow">Do investimento ao resultado</p>
      <h1>Uma pergunta. Uma visão mais clara.</h1>
      <p>Pergunte sobre seus canais para explorar o painel de marketing.</p>
    </section>
  );
  if (state.status === "loading") return (
    <section aria-label="Painel em carregamento">
      <p>Carregando o painel…</p>
      <div className="skeleton skeleton-title" aria-hidden="true" />
      <div className="skeleton-grid" aria-hidden="true">
        {[0, 1, 2].map((index) => <div className="skeleton skeleton-card" key={index} />)}
      </div>
    </section>
  );
  if (state.status === "error") return (
    <section className="error-state">
      <h1>O painel não foi carregado</h1>
      <p>{state.message}</p>
      <p>Pergunta: {state.question}</p>
      <button type="button" onClick={retry}>Tentar novamente</button>
    </section>
  );
  return (
    <section aria-label="Resultado da análise">
      <DashboardMetadata response={state.response} />
      <DashboardCharts charts={state.response.agent.charts} rows={state.response.data.rows} />
      <InvestmentComparisonFlow rows={state.response.data.rows} period={state.response.data.period} />
    </section>
  );
}
