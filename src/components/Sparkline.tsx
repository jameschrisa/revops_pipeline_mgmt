export function Sparkline({
  points,
  width = 96,
  height = 28,
  stroke = "#265397",
}: {
  points: number[];
  width?: number;
  height?: number;
  stroke?: string;
}) {
  if (points.length < 2) return null;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const span = max - min || 1;
  const step = width / (points.length - 1);
  const path = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${(i * step).toFixed(1)},${(height - 3 - ((p - min) / span) * (height - 6)).toFixed(1)}`)
    .join(" ");
  return (
    <svg width={width} height={height} role="img" aria-label={`Score trend: ${points.join(", ")}`}>
      <path d={path} fill="none" stroke={stroke} strokeWidth="1.5" />
      <circle
        cx={(points.length - 1) * step}
        cy={height - 3 - ((points[points.length - 1] - min) / span) * (height - 6)}
        r="2.5"
        fill={stroke}
      />
    </svg>
  );
}
