import type { AgentResponse, DataResponse } from "./types";

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} respondeu ${res.status}`);
  return res.json() as Promise<T>;
}

export function askAgent(question: string) {
  return getJson<AgentResponse>(`/api/agent?q=${encodeURIComponent(question)}`);
}

export function fetchData() {
  return getJson<DataResponse>("/api/data");
}
