import { ApiError } from "./api";
import { DataIntegrityError } from "./data-integrity";

const DATA_REASONS = {
  "missing-total": "falta o total do canal",
  "duplicate-total": "há mais de um total para o canal",
  "totals-mismatch": "o total do canal não corresponde à soma dos veículos",
};
const SERVICE_REASONS = {
  http: "O serviço não respondeu com sucesso",
  network: "Não foi possível conectar ao serviço",
  json: "O serviço retornou uma resposta ilegível",
  contract: "O serviço retornou informações incompatíveis",
};

export function failureMessage(error: unknown): string {
  if (!(error instanceof ApiError)) return "Não foi possível carregar o painel. Tente novamente.";
  if (error.cause instanceof DataIntegrityError) {
    const { channel, issue } = error.cause;
    return `Os dados de ${channel} estão inconsistentes: ${DATA_REASONS[issue]}. Tente novamente.`;
  }
  if (error.endpoint === "/api/agent + /api/data") {
    return "O período da especificação não corresponde ao período dos dados. Tente novamente.";
  }
  const origin = error.endpoint === "/api/data" ? "os dados" : "a especificação do painel";
  return `${SERVICE_REASONS[error.kind]} ao consultar ${origin}. Tente novamente.`;
}
