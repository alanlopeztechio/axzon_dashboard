'use client';

import { DashboardCard } from './DashboardCard';

interface TrendPoint {
  label: string;
  value: number;
}

interface FleetHealthTrendCardProps {
  points: TrendPoint[];
}

export function FleetHealthTrendCard({ points }: FleetHealthTrendCardProps) {
  const safePoints = points.length > 1 ? points : defaultTrend;
  const max = Math.max(...safePoints.map((point) => point.value), 100);
  const min = Math.min(...safePoints.map((point) => point.value), 0);
  const range = Math.max(max - min, 1);

  const linePoints = safePoints
    .map((point, index) => {
      const x = 40 + (index / Math.max(safePoints.length - 1, 1)) * 680;
      const y = 220 - ((point.value - min) / range) * 160;
      return `${x},${y}`;
    })
    .join(' ');

  const areaPath = `M 40 220 L ${safePoints
    .map((point, index) => {
      const x = 40 + (index / Math.max(safePoints.length - 1, 1)) * 680;
      const y = 220 - ((point.value - min) / range) * 160;
      return `${x} ${y}`;
    })
    .join(' L ')} L 720 220 Z`;

  return (
    <DashboardCard
      title="Fleet health"
      subtitle="Validated telemetry ratio over recent reporting windows."
      action={
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
          Last {safePoints.length} days
        </span>
      }
    >
      <div className="overflow-x-auto">
        <svg viewBox="0 0 760 250" className="min-w-180">
          <defs>
            <linearGradient id="healthArea" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="rgba(255,192,51,0.42)" />
              <stop offset="100%" stopColor="rgba(255,192,51,0.02)" />
            </linearGradient>
          </defs>

          {[0, 25, 50, 75, 100].map((tick, index) => {
            const y = 220 - (index / 4) * 160;
            return (
              <g key={tick}>
                <line
                  x1="40"
                  y1={y}
                  x2="720"
                  y2={y}
                  stroke="rgba(255,255,255,0.08)"
                />
                <text
                  x="8"
                  y={y + 4}
                  fill="rgba(148,163,184,0.7)"
                  fontSize="11"
                >
                  {tick}%
                </text>
              </g>
            );
          })}

          <path d={areaPath} fill="url(#healthArea)" />
          <polyline
            points={linePoints}
            fill="none"
            stroke="#ffca43"
            strokeWidth="4"
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {safePoints.map((point, index) => {
            const x = 40 + (index / Math.max(safePoints.length - 1, 1)) * 680;
            const y = 220 - ((point.value - min) / range) * 160;

            return (
              <g key={point.label}>
                <circle cx={x} cy={y} r="4" fill="#fff" />
                <circle cx={x} cy={y} r="9" fill="rgba(255,202,67,0.18)" />
                <text
                  x={x}
                  y="242"
                  textAnchor="middle"
                  fill="rgba(148,163,184,0.7)"
                  fontSize="11"
                >
                  {point.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </DashboardCard>
  );
}

const defaultTrend: TrendPoint[] = [
  { label: 'Day 1', value: 0 },
  { label: 'Day 2', value: 0 },
];
