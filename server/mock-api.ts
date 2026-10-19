import type { Plugin } from "vite";
import agentResponse from "./agent-response.json";
import contributionRows from "./contribution-rows.json";

// Simula a API da plataforma. Roda dentro do servidor do Vite, sem rede.
//
//   GET /api/agent?q=...   resposta do agente (especificação do painel)
//   GET /api/data          linhas de contribuição e investimento
//
// Acrescente &fail=1 a qualquer rota para simular uma falha.

const AGENT_DELAY_MS = 1500;
const DATA_DELAY_MS = 400;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function mockApi(): Plugin {
  return {
    name: "mock-api",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url ?? "/", "http://localhost");
        if (!url.pathname.startsWith("/api/")) return next();

        const send = (status: number, body: unknown) => {
          res.statusCode = status;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(body));
        };

        if (url.searchParams.get("fail") === "1") {
          await sleep(DATA_DELAY_MS);
          return send(500, { error: "internal_error", message: "Falha ao consultar o agente." });
        }

        if (url.pathname === "/api/agent") {
          const question = url.searchParams.get("q");
          if (!question) return send(400, { error: "missing_question" });
          await sleep(AGENT_DELAY_MS);
          return send(200, { ...agentResponse, question });
        }

        if (url.pathname === "/api/data") {
          await sleep(DATA_DELAY_MS);
          return send(200, { period: agentResponse.period, rows: contributionRows });
        }

        send(404, { error: "not_found" });
      });
    },
  };
}
