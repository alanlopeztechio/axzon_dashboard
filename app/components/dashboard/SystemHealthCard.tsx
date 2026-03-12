'use client';

import { AlertTriangle, Route, ShieldCheck, Thermometer } from 'lucide-react';
import { DashboardCard } from './DashboardCard';

interface SystemHealthCardProps {
  totalReadings: number;
  validatedReadings: number;
  anomalousReadings: number;
  avgTemp: number | null;
  impactedRoutes: number;
}

export function SystemHealthCard({
  totalReadings,
  validatedReadings,
  anomalousReadings,
  avgTemp,
  impactedRoutes,
}: SystemHealthCardProps) {
  const safeTotal = Math.max(totalReadings, 1);
  const validatedRatio = validatedReadings / safeTotal;
  const anomalyRatio = anomalousReadings / safeTotal;
  const radius = 62;
  const circumference = 2 * Math.PI * radius;
  const anomalyStroke = circumference * anomalyRatio;
  const validatedStroke = circumference * validatedRatio;

  return (
    <DashboardCard
      title="Systemic health"
      subtitle="Operational balance between compliant and anomalous telemetry."
      className="h-full"
    >
      <div className="grid gap-6 lg:grid-cols-[260px_1fr] lg:items-center">
        <div className="flex flex-col items-center justify-center">
          <div className="relative h-44 w-44">
            <svg viewBox="0 0 160 160" className="h-full w-full -rotate-90">
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="12"
                fill="transparent"
              />
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke="#ff5a6f"
                strokeWidth="12"
                fill="transparent"
                strokeLinecap="round"
                strokeDasharray={`${anomalyStroke} ${circumference}`}
              />
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke="#0fd6d8"
                strokeWidth="12"
                fill="transparent"
                strokeLinecap="round"
                strokeDasharray={`${validatedStroke} ${circumference}`}
                strokeDashoffset={-anomalyStroke}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <p className="text-3xl font-semibold text-white">
                {totalReadings.toLocaleString()}
              </p>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Total readings
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap justify-center gap-3 text-xs">
            <span className="inline-flex items-center gap-2 rounded-full bg-cyan-400/10 px-3 py-1.5 text-cyan-200">
              <span className="h-2 w-2 rounded-full bg-cyan-400" />
              {validatedReadings.toLocaleString()} validated
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-rose-400/10 px-3 py-1.5 text-rose-200">
              <span className="h-2 w-2 rounded-full bg-rose-400" />
              {anomalousReadings.toLocaleString()} anomalous
            </span>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <MetricChip
            icon={<ShieldCheck className="h-4 w-4 text-cyan-300" />}
            label="Compliance window"
            value={`${Math.round(validatedRatio * 100)}%`}
            helper="Readings inside acceptable range"
          />
          <MetricChip
            icon={<AlertTriangle className="h-4 w-4 text-rose-300" />}
            label="Anomaly load"
            value={`${Math.round(anomalyRatio * 100)}%`}
            helper="Readings requiring attention"
          />
          <MetricChip
            icon={<Thermometer className="h-4 w-4 text-amber-300" />}
            label="Average temperature"
            value={avgTemp === null ? 'N/A' : `${avgTemp.toFixed(1)}°C`}
            helper="Across all reported readings"
          />
          <MetricChip
            icon={<Route className="h-4 w-4 text-violet-300" />}
            label="Impacted routes"
            value={impactedRoutes.toString()}
            helper="Routes with at least one anomaly"
          />
        </div>
      </div>
    </DashboardCard>
  );
}

function MetricChip({
  icon,
  label,
  value,
  helper,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  helper: string;
}) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/5 p-4">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-slate-400">
        {icon}
        {label}
      </div>
      <p className="mt-4 text-2xl font-semibold text-white">{value}</p>
      <p className="mt-2 text-sm text-slate-400">{helper}</p>
    </div>
  );
}
