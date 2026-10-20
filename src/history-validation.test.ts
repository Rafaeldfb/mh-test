import { afterEach, expect, it, vi } from "vitest";
import specification from "../server/agent-response.json";
import rows from "../server/contribution-rows.json";
import { loadDashboard } from "./api";
import { parseData } from "./api-validation";

afterEach(() => vi.unstubAllGlobals());

it.each([null, undefined, "100", -1, Infinity, NaN])(
  "preserves historical input %s directly at the parser boundary", (baseline) => {
    const changed = rows.map((row, index) => index === 0 ? { ...row, baseline } : row);
    expect(parseData({ period: specification.period, rows: changed }).rows[0].baseline).toBe(baseline);
  },
);

it.each([null, undefined, "100", -1])("loads JSON-representable historical input %s", async (baseline) => {
  const changed = rows.map((row, index) => index === 0 ? { ...row, baseline } : row);
  const data = { period: specification.period, rows: changed };
  vi.stubGlobal("fetch", vi.fn((url: string) => Promise.resolve(new Response(JSON.stringify(
    url.startsWith("/api/agent") ? { ...specification, question: "test" } : data,
  )))));
  expect((await loadDashboard("test")).data.rows[0].baseline).toBe(baseline);
});

const invalidCurrentCases = ["investment", "contribution"].flatMap((field) =>
  ["100", NaN, Infinity, undefined].map((value) => ({ field, value })));
it.each(invalidCurrentCases)("rejects malformed current $field: $value", ({ field, value }) => {
  const changed = [{ ...rows[0], [field]: value }, ...rows.slice(1)];
  expect(() => parseData({ period: specification.period, rows: changed })).toThrow();
});
