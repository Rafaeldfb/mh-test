import { expect, it } from "vitest";
import { formatRatioTick } from "./format";

it("uses a Portuguese decimal separator for compact ROI ticks", () => {
  expect(formatRatioTick(1.2)).toBe("1,2×");
  expect(formatRatioTick(0)).toBe("0×");
});
