import { describe, expect, it } from "vitest";
import rows from "../server/contribution-rows.json";
import { validateChannelTotals } from "./data-integrity";

const tv = rows.filter((row) => row.channel === "TV");

describe("channel total integrity", () => {
  it("accepts consistent fixtures without changing their rows", () => {
    const input = rows.map((row) => Object.freeze({ ...row }));
    Object.freeze(input);
    expect(() => validateChannelTotals(input)).not.toThrow();
    expect(input).toEqual(rows);
  });

  it("rejects a repeated total rather than counting it twice", () => {
    expect(() => validateChannelTotals([...rows, rows[0]])).toThrow(
      expect.objectContaining({ issue: "duplicate-total", channel: "TV" }),
    );
  });

  it("rejects vehicle details without a channel total", () => {
    expect(() => validateChannelTotals(rows.slice(1))).toThrow(
      expect.objectContaining({ issue: "missing-total", channel: "TV" }),
    );
  });

  it("rejects a nonzero total without its vehicle details", () => {
    expect(() => validateChannelTotals([rows[0]])).toThrow(
      expect.objectContaining({ issue: "totals-mismatch", channel: "TV" }),
    );
  });

  for (const field of ["investment", "contribution"] as const) {
    it(`rejects a material ${field} discrepancy`, () => {
      const changed = tv.map((row, index) => index === 0 ? { ...row, [field]: row[field] + 100 } : row);
      expect(() => validateChannelTotals(changed)).toThrow(
        expect.objectContaining({ issue: "totals-mismatch", channel: "TV" }),
      );
    });

    it(`allows one rounded cent of ${field} discrepancy, but not two`, () => {
      const changed = tv.map((row) => ({ ...row }));
      changed[0][field] += 0.01;
      expect(() => validateChannelTotals(changed)).not.toThrow();
      changed[0][field] += 0.01;
      expect(() => validateChannelTotals(changed)).toThrow(
        expect.objectContaining({ issue: "totals-mismatch", channel: "TV" }),
      );
    });
  }
});
