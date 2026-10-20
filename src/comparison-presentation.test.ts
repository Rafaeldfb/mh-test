import { expect, it } from "vitest";
import { comparisonPeriods, investmentChangeLabel } from "./comparison-presentation";

it("labels the exact response dates and corresponding prior-year dates", () => {
  expect(comparisonPeriods({ start: "2026-07-01", end: "2026-09-30", label: "Q3" })).toEqual({
    current: "01/07/2026 a 30/09/2026", prior: "01/07/2025 a 30/09/2025",
  });
});

it("keeps a leap-day comparison in February", () => {
  expect(comparisonPeriods({ start: "2024-02-29", end: "2024-03-31", label: "Test" }).prior)
    .toBe("28/02/2023 a 31/03/2023");
});

it("labels available changes and each distinct unavailable reason", () => {
  expect(investmentChangeLabel({ kind: "available", fraction: 0.25 })).toBe("+25,00%");
  expect(investmentChangeLabel({ kind: "missing" })).toContain("histórico não informado");
  expect(investmentChangeLabel({ kind: "invalid" })).toContain("histórico inválido");
  expect(investmentChangeLabel({ kind: "zero" })).toContain("anterior igual a zero");
  expect(investmentChangeLabel({ kind: "overflow" })).toContain("limite numérico");
});
