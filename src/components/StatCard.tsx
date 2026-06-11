export function StatCard({
  label,
  value,
  sub,
  accent = false,
}: {
  label: string;
  value: string;
  sub?: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-4 ${
        accent ? "border-gold-300 bg-gold-50" : "border-mist-200 bg-white"
      }`}
    >
      <div className="text-xs font-medium uppercase tracking-wide text-mist-600">{label}</div>
      <div className="mt-1 font-data text-2xl font-semibold text-navy-900">{value}</div>
      {sub ? <div className="mt-1 text-xs text-mist-600">{sub}</div> : null}
    </div>
  );
}

export function Delta({ value, suffix = "%" }: { value: number; suffix?: string }) {
  const up = value > 0;
  const flat = value === 0;
  return (
    <span
      className={`font-data text-xs font-medium ${
        flat ? "text-mist-500" : up ? "text-emerald-600" : "text-red-600"
      }`}
    >
      {flat ? "–" : up ? "▲" : "▼"} {Math.abs(value)}
      {suffix}
    </span>
  );
}
