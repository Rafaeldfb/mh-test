import { describe, expect, it } from "vitest";
import { ApiError } from "./api";
import { failureMessage } from "./dashboard-messages";
import { DataIntegrityError } from "./data-integrity";

describe("dashboard failure messages", () => {
  it("identifies incompatible periods across both responses", () => {
    expect(failureMessage(new ApiError("/api/agent + /api/data", "contract"))).toBe(
      "O período da especificação não corresponde ao período dos dados. Tente novamente.",
    );
  });

  it.each([
    ["missing-total", "falta o total do canal"],
    ["duplicate-total", "há mais de um total para o canal"],
    ["totals-mismatch", "o total do canal não corresponde à soma dos veículos"],
  ] as const)("explains %s with channel context", (issue, explanation) => {
    const cause = new DataIntegrityError(issue, "TV");
    expect(failureMessage(new ApiError("/api/data", "contract", { cause }))).toBe(
      `Os dados de TV estão inconsistentes: ${explanation}. Tente novamente.`,
    );
  });
});
