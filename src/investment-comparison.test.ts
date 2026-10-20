import { describe, expect, it } from "vitest";
import rows from "../server/contribution-rows.json";
import { chartData } from "./chart-data";
import { classifyHistory, compareInvestments } from "./investment-comparison";

describe("annual investment comparison", () => {
  it("uses only immutable channel totals in supplied order, without historical fallback", () => {
    const input = Object.freeze(rows.map((row) => Object.freeze({ ...row })));
    const points = compareInvestments(input);
    expect(points.map((p) => p.channel)).toEqual(["TV", "YouTube", "Meta", "Google Search", "TikTok"]);
    const expected = [50000 / 1550000, 200000 / 300000, 0.25, -50000 / 650000];
    points.slice(0, 4).forEach((point, index) => {
      expect(point.change.kind).toBe("available");
      if (point.change.kind === "available") expect(point.change.fraction).toBeCloseTo(expected[index]);
    });
    expect(points[4]).toEqual({ channel: "TikTok", current: 250000, history: { kind: "missing" }, change: { kind: "missing" } });
    expect(input).toEqual(rows);
  });

  it("distinguishes null, invalid and known zero without coercion", () => {
    expect(classifyHistory(null)).toEqual({ kind: "missing" });
    for (const value of [undefined, "100", -1, NaN, Infinity, -Infinity, {}, false]) {
      expect(classifyHistory(value)).toEqual({ kind: "invalid" });
    }
    expect(classifyHistory(0)).toEqual({ kind: "zero", amount: 0 });
    expect(classifyHistory(100)).toEqual({ kind: "positive", amount: 100 });
  });

  it.each([
    [200, 100, { kind: "available", fraction: 1 }],
    [50, 100, { kind: "available", fraction: -0.5 }],
    [100, 100, { kind: "available", fraction: 0 }],
    [0, 100, { kind: "available", fraction: -1 }],
    [100, 0, { kind: "zero" }],
    [0, 0, { kind: "zero" }],
    [Number.MAX_VALUE, Number.MIN_VALUE, { kind: "overflow" }],
  ])("compares current %s and baseline %s safely", (current, baseline, change) => {
    const point = compareInvestments([{ ...rows[0], investment: current, baseline }])[0];
    expect(point.change).toEqual(change);
    expect(point.history).toHaveProperty("amount", baseline);
  });

  it("isolates historical defects from other channels and existing chart points", () => {
    for (const baseline of [null, undefined, "bad", -1, Infinity, NaN]) {
      const changed = rows.map((row, index) => index === 0 ? { ...row, baseline } : row);
      expect(compareInvestments(changed).slice(1)).toEqual(compareInvestments(rows).slice(1));
      expect(compareInvestments(changed)[0].current).toBe(1600000);
      expect(chartData(changed)).toEqual(chartData(rows));
    }
  });
});
