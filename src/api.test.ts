import { afterEach, describe, expect, it, vi } from "vitest";
import specification from "../server/agent-response.json";
import rows from "../server/contribution-rows.json";
import { askAgent, fetchData, loadDashboard } from "./api";

const question = "canal com mais vendas?";
const agent = { ...specification, question };
const data = { period: specification.period, rows };
const json = (value: unknown) => new Response(JSON.stringify(value));
afterEach(() => vi.unstubAllGlobals());

function mockPair(agentValue: unknown = agent, dataValue: unknown = data) {
  const mock = vi.fn((url: string) => Promise.resolve(json(url.startsWith("/api/agent") ? agentValue : dataValue)));
  vi.stubGlobal("fetch", mock);
  return mock;
}
function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((done) => { resolve = done; });
  return { promise, resolve };
}

describe("API boundary", () => {
  it("encodes the question, validates fixtures and forwards the same signal", async () => {
    const mock = mockPair();
    const signal = new AbortController().signal;
    expect(await loadDashboard(question, signal)).toEqual({ agent, data });
    expect(mock).toHaveBeenCalledWith("/api/agent?q=canal%20com%20mais%20vendas%3F", { signal });
    expect(mock).toHaveBeenCalledWith("/api/data", { signal });
  });

  for (const endpoint of ["/api/agent", "/api/data"]) {
    const call = () => endpoint === "/api/data" ? fetchData() : askAgent(question);
    it(`identifies HTTP, network, JSON and contract errors for ${endpoint}`, async () => {
      const mock = vi.fn().mockResolvedValue(new Response("", { status: 500 }));
      vi.stubGlobal("fetch", mock);
      await expect(call()).rejects.toMatchObject({ endpoint, kind: "http" });
      mock.mockRejectedValueOnce(new TypeError("offline"));
      await expect(call()).rejects.toMatchObject({ endpoint, kind: "network" });
      mock.mockResolvedValueOnce(new Response("{"));
      await expect(call()).rejects.toMatchObject({ endpoint, kind: "json" });
      mock.mockResolvedValueOnce(json({}));
      await expect(call()).rejects.toMatchObject({ endpoint, kind: "contract" });
    });
  }

  it("rejects invalid consumed values and unsupported charts, accepting zero amounts", async () => {
    mockPair({ ...agent, charts: [{ ...agent.charts[0], type: "line" }] });
    await expect(loadDashboard(question)).rejects.toMatchObject({ kind: "contract" });
    mockPair(agent, { ...data, rows: [{ ...rows[0], investment: "100" }] });
    await expect(fetchData()).rejects.toMatchObject({ kind: "contract" });
    mockPair(agent, { ...data, rows: [{ ...rows[0], investment: 0, contribution: 0 }] });
    expect((await fetchData()).rows[0].investment).toBe(0);
    mockPair({ ...agent, period: { ...agent.period, start: "2026-02-30" } });
    await expect(askAgent(question)).rejects.toMatchObject({ kind: "contract" });
  });

  it("rejects array-valued chart discriminants", async () => {
    for (const field of ["type", "metric", "breakdown"] as const) {
      const chart = agent.charts[0];
      mockPair({ ...agent, charts: [{ ...chart, [field]: [chart[field]] }] });
      await expect(askAgent(question)).rejects.toMatchObject({ kind: "contract" });
    }
  });

  it("rejects inconsistent boundaries and question snapshots", async () => {
    mockPair(agent, { ...data, period: { ...data.period, end: "2026-10-01" } });
    await expect(loadDashboard(question)).rejects.toMatchObject({ kind: "contract" });
    mockPair({ ...agent, question: "other" });
    await expect(loadDashboard(question)).rejects.toMatchObject({ endpoint: "/api/agent", kind: "contract" });
  });

  it("rejects pre-aborted and pending operations without disguising cancellation", async () => {
    const controller = new AbortController();
    const mock = vi.fn((_url: string, { signal }: { signal: AbortSignal }) =>
      new Promise<Response>((_resolve, reject) => {
        signal.addEventListener("abort", () => reject(signal.reason), { once: true });
      }));
    vi.stubGlobal("fetch", mock);
    const pending = loadDashboard(question, controller.signal);
    controller.abort();
    await expect(pending).rejects.toMatchObject({ name: "AbortError" });
    expect(mock).toHaveBeenCalledTimes(2);
    await expect(loadDashboard(question, controller.signal)).rejects.toMatchObject({ name: "AbortError" });
    expect(mock).toHaveBeenCalledTimes(2);
    mockPair();
    expect(await loadDashboard(question, new AbortController().signal)).toEqual({ agent, data });
  });
});

describe("combined loading", () => {
  for (const first of ["agent", "data"]) {
    it(`starts both calls and waits when ${first} finishes first`, async () => {
      const a = deferred<Response>();
      const d = deferred<Response>();
      const mock = vi.fn((url: string) => url.startsWith("/api/agent") ? a.promise : d.promise);
      vi.stubGlobal("fetch", mock);
      let settled = false;
      const pending = loadDashboard(question).then((result) => { settled = true; return result; });
      expect(mock).toHaveBeenCalledTimes(2);
      if (first === "agent") a.resolve(json(agent));
      else d.resolve(json(data));
      await new Promise<void>((resolve) => queueMicrotask(resolve));
      expect(settled).toBe(false);
      if (first === "agent") d.resolve(json(data));
      else a.resolve(json(agent));
      expect(await pending).toEqual({ agent, data });
    });
  }
  for (const failing of ["/api/agent", "/api/data"]) {
    it(`rejects a combined result when ${failing} fails`, async () => {
      vi.stubGlobal("fetch", vi.fn((url: string) => {
        if (url.startsWith(failing)) return Promise.resolve(new Response("", { status: 500 }));
        return Promise.resolve(json(url.startsWith("/api/agent") ? agent : data));
      }));
      await expect(loadDashboard(question)).rejects.toMatchObject({ endpoint: failing, kind: "http" });
    });
  }
});
