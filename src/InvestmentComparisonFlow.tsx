import { useLayoutEffect, useRef, useState } from "react";
import { InvestmentComparison } from "./InvestmentComparison";
import { compareInvestments } from "./investment-comparison";
import type { ContributionRow, Period } from "./types";

export function InvestmentComparisonFlow({ rows, period }: { rows: ContributionRow[]; period: Period }) {
  const [stage, setStage] = useState<"offered" | "preparing" | "ready">("offered");
  const accepted = useRef(false);
  const heading = useRef<HTMLHeadingElement>(null);

  useLayoutEffect(() => {
    if (stage !== "preparing") return;
    let active = true;
    let revealFrame = 0;
    heading.current?.focus({ preventScroll: true });
    heading.current?.scrollIntoView({ behavior: "instant", block: "start" });
    // Two frames allow the committed skeleton to paint before local content replaces it.
    const paintFrame = requestAnimationFrame(() => {
      if (!active) return;
      revealFrame = requestAnimationFrame(() => {
        if (active) setStage("ready");
      });
    });
    return () => {
      active = false;
      cancelAnimationFrame(paintFrame);
      cancelAnimationFrame(revealFrame);
    };
  }, [stage]);

  function activate() {
    if (accepted.current) return;
    accepted.current = true;
    setStage("preparing");
  }

  return (
    <>
      <div className="comparison-offer" style={{ visibility: stage === "offered" ? "visible" : "hidden" }}
        aria-hidden={stage !== "offered"} inert={stage !== "offered"}>
        <div><p className="eyebrow">Media Hero</p>
          <p>Você deseja comparar o investimento por canal com o mesmo período do ano anterior?</p></div>
        <button type="button" onClick={activate} disabled={stage !== "offered"}>Comparar investimentos</button>
      </div>
      <p className="sr-only" role="status" aria-atomic="true">
        {stage === "ready" ? "Comparação de investimentos disponível." : ""}
      </p>
      {stage !== "offered" && <InvestmentComparison points={compareInvestments(rows)} period={period}
        preparing={stage === "preparing"} headingRef={heading} />}
    </>
  );
}
