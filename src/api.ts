import { parseAgent, parseData } from "./api-validation";

export type ApiFailure = "http" | "network" | "json" | "contract";
export class ApiError extends Error {
  constructor(public endpoint: string, public kind: ApiFailure, options?: ErrorOptions) {
    super(`${endpoint}: ${kind}`, options);
    this.name = "ApiError";
  }
}

async function getJson<T>(
  url: string, endpoint: string, parse: (value: unknown) => T, signal?: AbortSignal,
): Promise<T> {
  signal?.throwIfAborted();
  let response: Response;
  try {
    response = await fetch(url, { signal });
  } catch (cause) {
    signal?.throwIfAborted();
    throw new ApiError(endpoint, "network", { cause });
  }
  if (!response.ok) throw new ApiError(endpoint, "http", { cause: response.status });
  let value: unknown;
  try {
    value = await response.json();
  } catch (cause) {
    signal?.throwIfAborted();
    throw new ApiError(endpoint, "json", { cause });
  }
  signal?.throwIfAborted();
  try {
    return parse(value);
  } catch (cause) {
    throw new ApiError(endpoint, "contract", { cause });
  }
}

export function askAgent(question: string, signal?: AbortSignal) {
  return getJson(`/api/agent?q=${encodeURIComponent(question)}`, "/api/agent", parseAgent, signal);
}
export function fetchData(signal?: AbortSignal) {
  return getJson("/api/data", "/api/data", parseData, signal);
}

// The React caller owns this signal and aborts siblings on failure.
export async function loadDashboard(question: string, signal?: AbortSignal) {
  const [agent, data] = await Promise.all([askAgent(question, signal), fetchData(signal)]);
  if (agent.question !== question) throw new ApiError("/api/agent", "contract");
  if (agent.period.start !== data.period.start || agent.period.end !== data.period.end) {
    throw new ApiError("/api/agent + /api/data", "contract");
  }
  return { agent, data };
}
export type DashboardResponse = Awaited<ReturnType<typeof loadDashboard>>;
