import { useEffect, useState } from "react";
import type { Ref } from "react";
import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCompactCurrency, formatCurrency, formatInvestmentChange } from "./format";
import type { InvestmentComparison as ComparisonPoint, InvestmentChange } from "./investment-comparison";
import type { Period } from "./types";
import { comparisonPeriods } from "./comparison-presentation";

type Props = {
  points: ComparisonPoint[];
  period: Period;
  preparing: boolean;
  headingRef?: Ref<HTMLHeadingElement>;
};

function changeLabel(change: InvestmentChange): string {
  switch (change.kind) {
    case "available": return formatInvestmentChange(change.fraction);
    case "missing": return "Comparação indisponível: histórico não informado.";
    case "invalid": return "Comparação indisponível: histórico inválido.";
    case "zero": return "Variação percentual indisponível: investimento anterior igual a zero.";
    case "overflow": return "Variação percentual indisponível: resultado fora do limite numérico.";
  }
}

function ComparisonBars({ points, currentLabel, priorLabel }: {
  points: ComparisonPoint[]; currentLabel: string; priorLabel: string;
}) {
  const [mobile, setMobile] = useState(() => window.matchMedia("(max-width: 720px)").matches);
  useEffect(() => {
    const media = window.matchMedia("(max-width: 720px)");
    const update = () => setMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  const data = points.map((point) => ({
    channel: point.channel,
    current: point.current,
    prior: "amount" in point.history ? point.history.amount : null,
  }));
  return (
    <div className="comparison-plot" style={{ height: mobile ? points.length * 100 : 340 }}>
      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
        <BarChart data={data} layout={mobile ? "vertical" : "horizontal"} accessibilityLayer
          aria-label="Investimento atual e do ano anterior por canal"
          margin={{ top: 30, right: mobile ? 75 : 12, left: 0, bottom: 12 }}>
          <CartesianGrid stroke="#e9eae4" />
          {mobile ? <>
            <XAxis type="number" tickFormatter={formatCompactCurrency} tick={{ fontSize: 10 }} />
            <YAxis type="category" dataKey="channel" width={82} tick={{ fontSize: 11 }} />
          </> : <>
            <XAxis type="category" dataKey="channel" interval={0} tick={{ fontSize: 12 }} />
            <YAxis type="number" tickFormatter={formatCompactCurrency} width={80} tick={{ fontSize: 11 }} />
          </>}
          <Tooltip formatter={(value) => formatCurrency(Number(value))}
            contentStyle={{ width: mobile ? 170 : 300, whiteSpace: "normal", overflowWrap: "anywhere" }} />
          <Bar dataKey="current" name={currentLabel} fill="#365f4b" isAnimationActive={false}>
            <LabelList dataKey="current" position={mobile ? "right" : "top"}
              formatter={(value) => formatCompactCurrency(Number(value))} fontSize={10} />
          </Bar>
          <Bar dataKey="prior" name={priorLabel} fill="#79739a" isAnimationActive={false}>
            <LabelList dataKey="prior" position={mobile ? "right" : "top"}
              formatter={(value) => value == null ? "" : formatCompactCurrency(Number(value))} fontSize={10} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function InvestmentComparison({ points, period, preparing, headingRef }: Props) {
  const { current, prior } = comparisonPeriods(period);
  return (
    <article className="chart-card comparison-card" aria-labelledby="investment-comparison-heading">
      <h2 id="investment-comparison-heading" tabIndex={-1} ref={headingRef}>
        Comparação de investimento por canal
      </h2>
      <p className="period">Atual: {current}<br />Mesmo período do ano anterior: {prior}</p>
      {preparing ? <div className="skeleton comparison-skeleton" aria-hidden="true" /> : <>
        <ul className="comparison-legend" aria-label="Legenda dos períodos">
          <li><span className="legend-dot current-dot" aria-hidden="true" />Atual · {current}</li>
          <li><span className="legend-dot prior-dot" aria-hidden="true" />Anterior · {prior}</li>
        </ul>
        <ComparisonBars points={points} currentLabel={`Atual · ${current}`} priorLabel={`Anterior · ${prior}`} />
        <p className="chart-note">Percentuais indicam variação do investimento, sem avaliar desempenho.</p>
        <ul className="comparison-values" aria-label="Valores e variação por canal">
          {points.map((point) => <li key={point.channel}>
            <h3>{point.channel} <span>{changeLabel(point.change)}</span></h3>
            <p>Atual: {formatCurrency(point.current)}<br />Anterior: {"amount" in point.history
              ? formatCurrency(point.history.amount) : "Indisponível"}</p>
          </li>)}
        </ul>
      </>}
    </article>
  );
}
