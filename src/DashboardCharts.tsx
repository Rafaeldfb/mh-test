import type { CSSProperties } from "react";
import {
  Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { chartData } from "./chart-data";
import type { ChartPoint } from "./chart-data";
import type { ChartSpec, ContributionRow } from "./types";
import {
  formatCompactCurrency, formatCurrency, formatRatio, formatRatioTick, formatShare,
} from "./format";

const COLORS = ["#365f4b", "#517b98", "#a16c38", "#79739a", "#588781"];
type CardProps = { spec: ChartSpec; points: ChartPoint[]; index: number };
function displayValue(metric: ChartSpec["metric"], value: number | null) {
  if (value === null) return "Indisponível";
  return metric === "roi" ? formatRatio(value) : formatCurrency(value);
}

function Bars({ spec, points }: Omit<CardProps, "index">) {
  const isRatio = spec.metric === "roi";
  return (
    <div className="chart-plot" style={{ height: Math.max(280, points.length * 44) }}>
      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
        <BarChart
          data={points}
          layout="vertical"
          margin={{ top: 12, right: 24, bottom: 8, left: 0 }}
          accessibilityLayer
          aria-label={spec.title}
        >
          <CartesianGrid horizontal={false} stroke="#e9eae4" />
          <XAxis
            type="number" tickLine={false} axisLine={false}
            tickFormatter={isRatio ? formatRatioTick : formatCompactCurrency}
          />
          <YAxis
            type="category" dataKey="label" width={105} tickLine={false} axisLine={false}
            tick={{ fontSize: 12, fill: "#474b43" }}
            tickFormatter={(label: string) => label.length > 16 ? `${label.slice(0, 15)}…` : label}
          />
          <Tooltip formatter={(value) => [
            displayValue(spec.metric, Number(value)),
            isRatio ? "Vendas / investimento" : "Investimento",
          ]} />
          <Bar
            dataKey={spec.metric} fill="#365f4b" radius={[0, 4, 4, 0]}
            barSize={22} isAnimationActive={false}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function ContributionPie({ spec, points }: Omit<CardProps, "index">) {
  const total = points.reduce((sum, point) => sum + point.contribution, 0);
  const available = Number.isFinite(total) && total > 0 && points.every((point) => point.contribution >= 0);
  if (!available) return (
    <p>Participação indisponível: requer vendas não negativas e total positivo e finito.
      Consulte os valores abaixo.</p>
  );
  return (
    <>
      <div className="chart-plot pie-plot">
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <PieChart accessibilityLayer aria-label={spec.title}>
            <Pie
              data={points} dataKey="contribution" nameKey="label"
              innerRadius="54%" outerRadius="82%" paddingAngle={2} isAnimationActive={false}
            >
              {points.map((point, index) => (
                <Cell key={point.channel} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value, name) => [
              formatCurrency(Number(value)), `${name} · Vendas atribuídas`,
            ]} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="pie-legend">
        {points.map((point, index) => <li key={point.channel}>
          <span
            className="legend-dot" aria-hidden="true"
            style={{ background: COLORS[index % COLORS.length] }}
          />
          <span>{point.label}</span><strong>{formatShare(point.contribution, total)}</strong>
        </li>)}
      </ul>
      <p className="chart-note">Percentuais arredondados; a soma pode diferir de 100%.</p>
    </>
  );
}

function ExactValues({ spec, points }: Omit<CardProps, "index">) {
  return (
    <details className="exact-values">
      <summary>Ver valores exatos</summary>
      <table>
        <caption>{spec.title} — valores por {spec.breakdown === "channel" ? "canal" : "veículo"}</caption>
        <thead>
          <tr>
            <th scope="col">{spec.breakdown === "channel" ? "Canal" : "Veículo (canal)"}</th>
            <th scope="col">{spec.metric === "roi" ? "Vendas por R$ 1" : "Valor em reais"}</th>
          </tr>
        </thead>
        <tbody>{points.map((point) => <tr key={JSON.stringify([point.channel, point.label])}>
          <th scope="row">{point.label}{spec.breakdown === "vehicle" ? ` (${point.channel})` : ""}</th>
          <td>{displayValue(spec.metric, point[spec.metric])}</td>
        </tr>)}</tbody>
      </table>
    </details>
  );
}

function ChartCard({ spec, points, index }: CardProps) {
  const hasUnavailable = spec.metric === "roi" && points.some((point) => point.roi === null);
  return (
    <article
      className="chart-card reveal" aria-labelledby={`chart-${spec.id}`}
      style={{ "--reveal-delay": `${(index + 1) * 90}ms` } as CSSProperties}
    >
      <header>
        <p className="eyebrow">{spec.breakdown === "channel" ? "Por canal" : "Por veículo"}</p>
        <h2 id={`chart-${spec.id}`}>{spec.title}</h2>
      </header>
      {spec.type === "pie"
        ? <ContributionPie spec={spec} points={points} />
        : <Bars spec={spec} points={points} />}
      {spec.metric === "roi" && (
        <p className="chart-note">Vendas atribuídas por real investido; não representa lucro.</p>
      )}
      {hasUnavailable && (
        <p className="chart-note">
          ROI indisponível para investimento não positivo ou resultado não finito;
          categoria mantida sem barra.
        </p>
      )}
      <ExactValues spec={spec} points={points} />
    </article>
  );
}

export function DashboardCharts({ charts, rows }: { charts: ChartSpec[]; rows: ContributionRow[] }) {
  const { channels, vehicles } = chartData(rows);
  return <div className="chart-grid">{charts.map((spec, index) => (
    <ChartCard
      key={spec.id} spec={spec} index={index}
      points={spec.breakdown === "channel" ? channels : vehicles}
    />
  ))}</div>;
}
