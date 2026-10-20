import { useEffect, useState } from "react";
import type { CSSProperties, Ref } from "react";
import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCompactCurrency, formatCurrency } from "./format";
import type { InvestmentComparison as ComparisonPoint } from "./investment-comparison";
import type { Period } from "./types";
import { comparisonPeriods, investmentChangeLabel } from "./comparison-presentation";

type Props = {
  points: ComparisonPoint[];
  period: Period;
  preparing: boolean;
  headingRef?: Ref<HTMLHeadingElement>;
};

const MOBILE_QUERY = "(max-width: 720px)";

function ComparisonTooltip({ active, point }: { active?: boolean; point?: ComparisonPoint }) {
  if (!active || !point) return null;
  return (
    <div className="comparison-tooltip" role="status" aria-live="polite" aria-atomic="true">
      <strong>{point.channel}</strong>
      <p>Atual: {formatCurrency(point.current)}<br />Anterior: {"amount" in point.history
        ? formatCurrency(point.history.amount) : "Indisponível"}</p>
      <p>Variação: {investmentChangeLabel(point.change)}</p>
    </div>
  );
}

function ComparisonBars({ points }: { points: ComparisonPoint[] }) {
  const [mobile, setMobile] = useState(() => window.matchMedia(MOBILE_QUERY).matches);
  useEffect(() => {
    const media = window.matchMedia(MOBILE_QUERY);
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
    <div className="comparison-plot">
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
          {/* Keep keyboard tooltips inside the plot across viewport changes. */}
          <Tooltip position={{ x: 0, y: 0 }} content={({ active, label }) => (
            <ComparisonTooltip active={active} point={points.find((point) => point.channel === label)} />
          )} />
          <Bar dataKey="current" name="Atual" fill="#365f4b" isAnimationActive={false}>
            <LabelList dataKey="current" position={mobile ? "right" : "top"}
              formatter={(value) => formatCompactCurrency(Number(value))} fontSize={10} />
          </Bar>
          <Bar dataKey="prior" name="Anterior" fill="#79739a" isAnimationActive={false}>
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
  const unavailable = points.filter((point) => point.history.kind === "missing" || point.history.kind === "invalid");
  return (
    <article className="chart-card comparison-card" aria-labelledby="investment-comparison-heading"
      style={{ "--comparison-mobile-height": `${points.length * 100}px` } as CSSProperties}>
      <h2 id="investment-comparison-heading" tabIndex={-1} ref={headingRef}>
        Comparação de investimento por canal
      </h2>
      <p className="period">Atual: {current}<br />Mesmo período do ano anterior: {prior}</p>
      {preparing ? <div className="skeleton comparison-skeleton" aria-hidden="true" /> : <>
        <ul className="comparison-legend" aria-label="Legenda dos períodos">
          <li><span className="legend-dot current-dot" aria-hidden="true" />Atual</li>
          <li><span className="legend-dot prior-dot" aria-hidden="true" />Anterior</li>
        </ul>
        <ComparisonBars points={points} />
        <ul className="comparison-unavailable">
          {unavailable.map((point) => <li key={point.channel}>
            {point.channel}: {investmentChangeLabel(point.change)}
          </li>)}
        </ul>
        <p className="chart-note">Percentuais indicam variação do investimento, sem avaliar desempenho.</p>
        <ul className="comparison-values" aria-label="Valores e variação por canal">
          {points.map((point) => <li key={point.channel}>
            <h3>{point.channel}</h3>
            <p>Variação: {investmentChangeLabel(point.change)}</p>
            <p>Atual: {formatCurrency(point.current)}<br />Anterior: {"amount" in point.history
              ? formatCurrency(point.history.amount) : "Indisponível"}</p>
          </li>)}
        </ul>
      </>}
    </article>
  );
}
