'use client';

import { AlertTriangle, Gauge, MapPinned } from 'lucide-react';
import { DashboardCard } from './DashboardCard';

interface RouteAnomaly {
  id: string;
  routeName: string;
  sensorId: string;
  anomalyCount: number;
  maxTemp: number | null;
  series: number[];
}

interface AnomalyFeedCardProps {
  items: RouteAnomaly[];
}

export function AnomalyFeedCard({ items }: AnomalyFeedCardProps) {
  return (
    <DashboardCard
      title="Anomaly feed"
      subtitle="Routes prioritized by thermal risk and peak temperatures."
      action={
        <span className="rounded-full border border-rose-400/15 bg-rose-400/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-rose-200">
          {items.length} flagged
        </span>
      }
      className="h-full"
    >
      <div className="space-y-3">
        {items.length === 0 ? (
          <EmptyFeed />
        ) : (
          items.map((item) => (
            <article
              key={item.id}
              className="rounded-2xl border border-white/8 bg-white/5 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-white">
                    {item.sensorId}
                  </p>
                  <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
                    <MapPinned className="h-3.5 w-3.5" />
                    <span className="truncate">{item.routeName}</span>
                  </div>
                </div>
                <div className="rounded-full border border-rose-400/15 bg-rose-400/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-rose-200">
                  {item.anomalyCount} alerts
                </div>
              </div>

              <div className="mt-4 grid grid-cols-[1fr_auto] items-center gap-4">
                <MiniSparkline values={item.series} />
                <div className="text-right">
                  <div className="inline-flex items-center gap-1 text-xs text-amber-300">
                    <Gauge className="h-3.5 w-3.5" />
                    Peak
                  </div>
                  <p className="mt-1 text-lg font-semibold text-white">
                    {item.maxTemp === null
                      ? 'N/A'
                      : `${item.maxTemp.toFixed(1)}°C`}
                  </p>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </DashboardCard>
  );
}

function MiniSparkline({ values }: { values: number[] }) {
  const normalized =
    values.length > 1 ? values : [0, ...(values[0] ? [values[0]] : [0])];
  const max = Math.max(...normalized, 1);
  const min = Math.min(...normalized, 0);
  const range = Math.max(max - min, 1);

  const points = normalized
    .map((value, index) => {
      const x = (index / Math.max(normalized.length - 1, 1)) * 180;
      const y = 44 - ((value - min) / range) * 36;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg viewBox="0 0 180 44" className="h-12 w-full">
      <polyline
        fill="none"
        stroke="rgba(255,90,111,0.28)"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
      <polyline
        fill="none"
        stroke="#ff5a6f"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}

function EmptyFeed() {
  return (
    <div className="rounded-2xl border border-dashed border-white/10 bg-white/3 px-4 py-10 text-center">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-emerald-400/10 text-emerald-300">
        <AlertTriangle className="h-5 w-5" />
      </div>
      <p className="mt-4 text-base font-medium text-white">
        No active anomalies
      </p>
      <p className="mt-2 text-sm text-slate-400">
        Incoming telemetry is currently inside the healthy temperature window.
      </p>
    </div>
  );
}
