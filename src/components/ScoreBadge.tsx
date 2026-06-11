const bandStyles = {
  good: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  warn: "bg-amber-50 text-amber-700 ring-amber-600/20",
  risk: "bg-red-50 text-red-700 ring-red-600/20",
} as const;

const dotStyles = {
  good: "bg-emerald-500",
  warn: "bg-amber-500",
  risk: "bg-red-500",
} as const;

export function ScoreBadge({
  score,
  band,
  size = "md",
}: {
  score: number;
  band: "good" | "warn" | "risk";
  size?: "md" | "lg";
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-data font-medium ring-1 ring-inset ${bandStyles[band]} ${
        size === "lg" ? "px-3 py-1 text-base" : "px-2 py-0.5 text-xs"
      }`}
      title={`Health score: ${score}/100`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dotStyles[band]}`} aria-hidden />
      {score}
    </span>
  );
}
