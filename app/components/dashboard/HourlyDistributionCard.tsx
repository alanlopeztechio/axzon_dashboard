'use client';

import { DashboardCard } from './DashboardCard';

interface HourPoint {
  hour: string;
  value: number;
}

interface HourlyDistributionCardProps {
  hours: HourPoint[];
}

export function HourlyDistributionCard({ hours }: HourlyDistributionCardProps) {
  const safeHours = hours.length > 1 ? hours : defaultHours;
  const max = Math.max(...safeHours.map((hour) => hour.value), 1);

  const points = safeHours
    .map((hour, index) => {
      const x = 40 + (index / Math.max(safeHours.length - 1, 1)) * 700;
      const y = 220 - (hour.value / max) * 160;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <DashboardCard
      title="Distribution by hour of day"
      subtitle="Daily average telemetry volume per hour across the available dataset."
    >
      <div className="overflow-x-auto">
        <svg viewBox="0 0 780 250" className="min-w-[740px]">
          {[0, 0.25, 0.5, 0.75, 1].map((tick) => {
            const y = 220 - tick * 160;
            return (
              <line
                key={tick}
                x1="40"
                y1={y}
                x2="740"
                y2={y}
                stroke="rgba(255,255,255,0.08)"
              />
            );
          })}

          <polyline
            points={points}
            fill="none"
            stroke="rgba(16,214,216,0.28)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <polyline
            points={points}
            fill="none"
            stroke="#0fd6d8"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {safeHours.map((hour, index) => {
            const x = 40 + (index / Math.max(safeHours.length - 1, 1)) * 700;
            return (
              <text
                key={hour.hour}
                x={x}
                y="244"
                textAnchor="middle"
                fill="rgba(148,163,184,0.7)"
                fontSize="11"
              >
                {index % 3 === 0 ? hour.hour : ''}
              </text>
            );
          })}
        </svg>
      </div>
    </DashboardCard>
  );
}

const defaultHours: HourPoint[] = [
  { hour: '00:00', value: 0 },
  { hour: '12:00', value: 0 },
  { hour: '23:00', value: 0 },
];
