import { useEffect, useRef, useState } from "react";
import { ApiError, loadDashboard } from "./api";
import type { DashboardResponse } from "./api";

export type DashboardState =
  | { status: "idle" }
  | { status: "loading"; question: string }
  | { status: "success"; question: string; response: DashboardResponse }
  | { status: "error"; question: string; message: string };

function failureMessage(error: unknown): string {
  if (!(error instanceof ApiError)) return "Não foi possível carregar o painel. Tente novamente.";
  const origin = error.endpoint === "/api/data" ? "os dados" : "a especificação do painel";
  const reasons = {
    http: "O serviço não respondeu com sucesso",
    network: "Não foi possível conectar ao serviço",
    json: "O serviço retornou uma resposta ilegível",
    contract: "O serviço retornou informações incompatíveis",
  };
  return `${reasons[error.kind]} ao consultar ${origin}. Tente novamente.`;
}

export function useDashboard() {
  const [state, setState] = useState<DashboardState>({ status: "idle" });
  const active = useRef<AbortController | null>(null);
  useEffect(() => () => {
    const controller = active.current;
    active.current = null;
    controller?.abort();
  }, []);

  async function submit(input: string) {
    const question = input.trim();
    if (!question || active.current) return;
    const controller = new AbortController();
    active.current = controller;
    setState({ status: "loading", question });
    try {
      const response = await loadDashboard(question, controller.signal);
      if (active.current === controller) setState({ status: "success", question, response });
    } catch (error) {
      if (active.current !== controller) return;
      // Preserve the original failure before cancelling the other request.
      controller.abort();
      setState({ status: "error", question, message: failureMessage(error) });
    } finally {
      if (active.current === controller) active.current = null;
    }
  }

  function retry() {
    if (state.status === "error") void submit(state.question);
  }
  return { state, submit, retry };
}
