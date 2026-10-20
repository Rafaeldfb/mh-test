import { expect, it } from "vitest";
import { formatInvestmentChange, formatRatioTick } from "./format";

it("uses a Portuguese decimal separator for compact ROI ticks", () => {
  expect(formatRatioTick(1.2)).toBe("1,2×");
  expect(formatRatioTick(0)).toBe("0×");
});

it("formats fractional changes with a sign and exactly two Portuguese decimals", () => {
  const fractions = [50000 / 1550000, 2 / 3, 0.25, -50000 / 650000, -1, 0, -0];
  expect(fractions.map(formatInvestmentChange)).toEqual([
    "+3,23%", "+66,67%", "+25,00%", "-7,69%", "-100,00%", "0,00%", "0,00%",
  ]);
});

it("retains direction for changes that round to zero while normalizing actual negative zero", () => {
  expect(formatInvestmentChange(0.000001)).toBe("+0,00%");
  expect(formatInvestmentChange(-0.000001)).toBe("-0,00%");
  expect(formatInvestmentChange(-0)).toBe("0,00%");
});
