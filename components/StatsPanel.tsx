'use client';

import { Truck, Thermometer, AlertTriangle, TrendingUp } from 'lucide-react';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  trend?: string;
  trendUp?: boolean;
  color?: 'blue' | 'green' | 'yellow' | 'red';
}

function StatCard({
  icon,
  label,
  value,
  trend,
  trendUp,
  color = 'blue',
}: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    green: 'bg-green-500/20 text-green-400 border-green-500/30',
    yellow: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    red: 'bg-red-500/20 text-red-400 border-red-500/30',
  };

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-sm ${colorClasses[color]}`}
    >
      <div className="flex-shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-zinc-400 truncate">{label}</p>
        <p className="text-lg font-semibold text-white">{value}</p>
      </div>
      {trend && (
        <div
          className={`flex items-center gap-1 text-xs ${trendUp ? 'text-green-400' : 'text-red-400'}`}
        >
          <TrendingUp className={`w-3 h-3 ${!trendUp ? 'rotate-180' : ''}`} />
          <span>{trend}</span>
        </div>
      )}
    </div>
  );
}

interface StatsPanelProps {
  totalRoutes: number;
  totalPoints: number;
  anomalies?: number;
  avgTemp?: number;
}

export function StatsPanel({
  totalRoutes,
  totalPoints,
  anomalies = 0,
  avgTemp,
}: StatsPanelProps) {
  return (
    <div className="absolute top-10 left-10 z-30 flex flex-col gap-3">
      <StatCard
        icon={<Truck className="w-5 h-5" />}
        label="Active Routes"
        value={totalRoutes}
        trend="+12%"
        trendUp={true}
        color="blue"
      />
      <StatCard
        icon={<Thermometer className="w-5 h-5" />}
        label="Avg Temperature"
        value={avgTemp ? `${avgTemp.toFixed(1)}°C` : 'N/A'}
        color="green"
      />
      <StatCard
        icon={<AlertTriangle className="w-5 h-5" />}
        label="Anomalies"
        value={anomalies}
        color={anomalies > 0 ? 'yellow' : 'green'}
      />
    </div>
  );
}
