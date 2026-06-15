"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { moneyCompact, monthLabel, shortDate } from "@/lib/format";

const NAVY = "#12305a";
const BLUE = "#3568b5";
const GOLD = "#c9a227";
const MIST = "#a9bdcd";

const axisStyle = { fontSize: 11, fill: "#6b8499", fontFamily: "var(--font-plex-mono)" };

// Disable chart draw-in when the user prefers reduced motion.
const animate =
  typeof window === "undefined" ||
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const anim = {
  isAnimationActive: animate,
  animationDuration: 700,
  animationEasing: "ease-out" as const,
  animationBegin: 150,
};

export function ForecastHistoryChart({
  data,
}: {
  data: { date: string; bestCase: number; commit: number; mostLikely: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 8, right: 12, left: 4, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#dfe8ef" />
        <XAxis dataKey="date" tick={axisStyle} tickFormatter={(d: string) => shortDate(d).replace(/, \d{4}/, "")} />
        <YAxis tick={axisStyle} tickFormatter={(v: number) => moneyCompact(v)} width={56} />
        <Tooltip formatter={(v) => moneyCompact(Number(v))} labelFormatter={(l) => shortDate(String(l))} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Line {...anim} type="monotone" dataKey="bestCase" name="Best case" stroke={MIST} strokeWidth={2} dot={false} />
        <Line {...anim} type="monotone" dataKey="mostLikely" name="Most likely" stroke={GOLD} strokeWidth={2.5} dot={false} />
        <Line {...anim} type="monotone" dataKey="commit" name="Commit" stroke={NAVY} strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function PipelineAreaChart({
  data,
}: {
  data: { date: string; total: number; weighted: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 8, right: 12, left: 4, bottom: 0 }}>
        <defs>
          <linearGradient id="gTotal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={BLUE} stopOpacity={0.25} />
            <stop offset="100%" stopColor={BLUE} stopOpacity={0.02} />
          </linearGradient>
          <linearGradient id="gWeighted" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={GOLD} stopOpacity={0.3} />
            <stop offset="100%" stopColor={GOLD} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#dfe8ef" />
        <XAxis dataKey="date" tick={axisStyle} tickFormatter={(d: string) => shortDate(d).replace(/, \d{4}/, "")} minTickGap={48} />
        <YAxis tick={axisStyle} tickFormatter={(v: number) => moneyCompact(v)} width={56} />
        <Tooltip formatter={(v) => moneyCompact(Number(v))} labelFormatter={(l) => shortDate(String(l))} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Area {...anim} type="monotone" dataKey="total" name="Total pipeline" stroke={BLUE} fill="url(#gTotal)" strokeWidth={2} />
        <Area {...anim} type="monotone" dataKey="weighted" name="Weighted pipeline" stroke={GOLD} fill="url(#gWeighted)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function MonthlyBarChart({
  data,
  name,
  color = BLUE,
  suffix = "",
}: {
  data: { month: string; value: number }[];
  name: string;
  color?: string;
  suffix?: string;
}) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#dfe8ef" vertical={false} />
        <XAxis dataKey="month" tick={axisStyle} tickFormatter={monthLabel} />
        <YAxis tick={axisStyle} tickFormatter={(v: number) => `${v}${suffix}`} />
        <Tooltip formatter={(v) => [`${v}${suffix}`, name]} labelFormatter={(l) => monthLabel(String(l))} />
        <Bar {...anim} dataKey="value" name={name} fill={color} radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function StageFunnelChart({
  data,
}: {
  data: { stage: string; rate: number; entered: number }[];
}) {
  const chartData = data.map((d) => ({ ...d, pct: Math.round(d.rate * 100) }));
  const colors = [BLUE, "#5e89c9", GOLD, NAVY];
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={chartData} layout="vertical" margin={{ top: 4, right: 32, left: 12, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#dfe8ef" horizontal={false} />
        <XAxis type="number" domain={[0, 100]} tick={axisStyle} tickFormatter={(v: number) => `${v}%`} />
        <YAxis type="category" dataKey="stage" tick={{ ...axisStyle, fontSize: 12 }} width={88} />
        <Tooltip formatter={(v, _n, item) => [`${v}% advance (${item?.payload?.entered ?? "—"} entered)`, "Conversion"]} />
        <Bar {...anim} dataKey="pct" name="Stage conversion" radius={[0, 3, 3, 0]} label={{ position: "right", fontSize: 11, formatter: (v: number) => `${v}%` }}>
          {chartData.map((_, i) => (
            <Cell key={i} fill={colors[i % colors.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function SegmentBarChart({
  data,
}: {
  data: { name: string; commit: number; mostLikely: number; bestCase: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 4, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#dfe8ef" vertical={false} />
        <XAxis dataKey="name" tick={{ ...axisStyle, fontSize: 12 }} />
        <YAxis tick={axisStyle} tickFormatter={(v: number) => moneyCompact(v)} width={56} />
        <Tooltip formatter={(v) => moneyCompact(Number(v))} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar {...anim} dataKey="commit" name="Commit" fill={NAVY} radius={[3, 3, 0, 0]} />
        <Bar {...anim} dataKey="mostLikely" name="Most likely" fill={GOLD} radius={[3, 3, 0, 0]} />
        <Bar {...anim} dataKey="bestCase" name="Best case" fill={MIST} radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
