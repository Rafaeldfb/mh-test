import { DashboardCharts } from "./DashboardCharts";
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

export function DashboardSource({ response }: { response: DashboardResponse }) {
  return (
    <footer className="source">
      <p>Fonte: <code>{response.agent.source.table}</code></p>
      <p>Modelo: <code>{response.agent.source.model}</code></p>
    </footer>
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
      <p role="status">Carregando o painel…</p>
      <div className="skeleton skeleton-title" aria-hidden="true" />
      <div className="skeleton-grid" aria-hidden="true" aria-busy="true">
        {[0, 1, 2].map((index) => <div className="skeleton skeleton-card" key={index} />)}
      </div>
    </section>
  );
  if (state.status === "error") return (
    <section className="error-state">
      <div role="alert"><h1>O painel não foi carregado</h1><p>{state.message}</p></div>
      <p>Pergunta: {state.question}</p>
      <button type="button" onClick={retry}>Tentar novamente</button>
    </section>
  );
  return (
    <section aria-label="Resultado da análise">
      <p role="status" className="sr-only">Painel carregado.</p>
      <DashboardMetadata response={state.response} />
      <DashboardCharts charts={state.response.agent.charts} rows={state.response.data.rows} />
      <DashboardSource response={state.response} />
    </section>
  );
}
