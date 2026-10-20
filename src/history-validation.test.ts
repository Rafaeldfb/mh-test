import { afterEach, expect, it, vi } from "vitest";
import specification from "../server/agent-response.json";
import rows from "../server/contribution-rows.json";
import { loadDashboard } from "./api";
import { parseData } from "./api-validation";

afterEach(() => vi.unstubAllGlobals());

it("preserves unknown or absent history while loading a valid dashboard", async () => {
  for (const baseline of [null, undefined, "100", -1, Infinity, NaN]) {
    const changed = rows.map((row, index) => index === 0 ? { ...row, baseline } : row);
    // Direct decoding preserves non-finite inputs, unlike JSON serialization.
    expect(parseData({ period: specification.period, rows: changed }).rows[0].baseline).toBe(baseline);
    const data = { period: specification.period, rows: changed };
    vi.stubGlobal("fetch", vi.fn((url: string) => Promise.resolve(new Response(JSON.stringify(
      url.startsWith("/api/agent") ? { ...specification, question: "test" } : data,
    )))));
    const received = (await loadDashboard("test")).data.rows[0].baseline;
    expect(received).toBe(typeof baseline === "number" && !Number.isFinite(baseline) ? null : baseline);
  }
});

it("still rejects malformed current investment and contribution", () => {
  for (const field of ["investment", "contribution"]) {
    for (const value of ["100", NaN, Infinity, undefined]) {
      const changed = [{ ...rows[0], [field]: value }, ...rows.slice(1)];
      expect(() => parseData({ period: specification.period, rows: changed })).toThrow();
    }
  }
});
