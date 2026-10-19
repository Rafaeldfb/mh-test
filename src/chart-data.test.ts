import { describe, expect, it } from "vitest";
import rows from "../server/contribution-rows.json";
import { chartData, salesPerReal } from "./chart-data";

describe("chartData", () => {
  it("separates channel totals from vehicle detail without mutating rows", () => {
    const input = rows.map((row) => Object.freeze({ ...row }));
    Object.freeze(input);
    const { channels, vehicles } = chartData(input);
    expect(channels.map(({ label, roi }) => [label, roi])).toEqual([
      ["TV", 2.25], ["YouTube", 3], ["Meta", 2.8], ["Google Search", 4], ["TikTok", 2],
    ]);
    expect(vehicles.map(({ channel, label }) => [channel, label])).toEqual([
      ["TV", "Globo"], ["TV", "SBT"], ["YouTube", "YouTube"],
      ["Meta", "Facebook"], ["Meta", "Instagram"],
      ["Google Search", "Google"], ["TikTok", "TikTok"],
    ]);
    for (const points of [channels, vehicles]) {
      expect(points.reduce((sum, p) => sum + p.investment, 0)).toBe(3700000);
      expect(points.reduce((sum, p) => sum + p.contribution, 0)).toBe(10100000);
    }
    expect(vehicles[0]).toMatchObject({ investment: 1200000, contribution: 3000000 });
    expect(input).toEqual(rows);
  });

  it("uses the supplied TV total rather than averaging vehicle ratios", () => {
    const { channels, vehicles } = chartData(rows);
    expect(channels[0].roi).toBe(2.25);
    expect((vehicles[0].roi! + vehicles[1].roi!) / 2).toBe(2);
  });
});

describe("salesPerReal", () => {
  it("keeps zero sales distinct from an unavailable ratio", () => {
    expect(salesPerReal(100, 0)).toBe(0);
    for (const investment of [0, -1, Infinity, -Infinity, NaN]) {
      expect(salesPerReal(investment, 100)).toBeNull();
    }
    expect(salesPerReal(Number.MIN_VALUE, Number.MAX_VALUE)).toBeNull();
  });
});
