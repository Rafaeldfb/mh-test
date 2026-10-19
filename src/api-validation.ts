import { validateChannelTotals } from "./data-integrity";
import type { AgentResponse, ChartSpec, DataResponse, Period } from "./types";

type RecordValue = Record<string, unknown>;
function record(value: unknown): RecordValue {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Expected object");
  return value as RecordValue;
}
function text(value: unknown): string {
  if (typeof value !== "string" || !value.trim()) throw new Error("Expected text");
  return value;
}
function amount(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value)) throw new Error("Expected finite amount");
  return value;
}
function date(value: unknown): string {
  const date = text(value);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error("Expected ISO date");
  if (new Date(date).toISOString().slice(0, 10) !== date) throw new Error("Invalid date");
  return date;
}
function period(value: unknown): Period {
  const p = record(value);
  const result = { start: date(p.start), end: date(p.end), label: text(p.label) };
  if (result.start > result.end) throw new Error("Reversed period");
  return result;
}
function list(value: unknown): unknown[] {
  if (!Array.isArray(value) || value.length === 0) throw new Error("Expected nonempty list");
  return value;
}
function chart(value: unknown): ChartSpec {
  const c = record(value);
  const type = text(c.type);
  const metric = text(c.metric);
  const breakdown = text(c.breakdown);
  const combination = `${type}/${metric}/${breakdown}`;
  if (!["bar/roi/channel", "bar/investment/vehicle", "pie/contribution/channel"].includes(combination)) {
    throw new Error("Unsupported chart combination");
  }
  return {
    id: text(c.id),
    title: text(c.title),
    type,
    metric,
    breakdown,
  } as ChartSpec;
}
export function parseAgent(value: unknown): AgentResponse {
  const a = record(value);
  const source = record(a.source);
  const charts = list(a.charts).map(chart);
  if (new Set(charts.map((c) => c.id)).size !== charts.length) throw new Error("Duplicate chart ID");
  return {
    question: text(a.question),
    title: text(a.title),
    summary: text(a.summary),
    period: period(a.period),
    source: { table: text(source.table), model: text(source.model) },
    charts,
  };
}
export function parseData(value: unknown): DataResponse {
  const d = record(value);
  const rows = list(d.rows).map((value) => {
    const r = record(value);
    return {
      channel: text(r.channel),
      vehicle: r.vehicle === null ? null : text(r.vehicle),
      investment: amount(r.investment),
      contribution: amount(r.contribution),
      // Annual baselines are not consumed by Task 01.
      baseline: r.baseline as number | null,
    };
  });
  validateChannelTotals(rows);
  return { period: period(d.period), rows };
}
