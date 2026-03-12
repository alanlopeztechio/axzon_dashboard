'use client';

import { Bell, Clock3, Search } from 'lucide-react';
import { MobileMenuButton } from './DashboardSidebar';

interface DashboardTopbarProps {
  validatedPct: number;
  anomalousPct: number;
  lastUpdate?: Date | null;
  onMenuClick: () => void;
}

export function DashboardTopbar({
  validatedPct,
  anomalousPct,
  lastUpdate,
  onMenuClick,
}: DashboardTopbarProps) {
  return (
    <header className="rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(8,22,50,0.9)_0%,rgba(4,12,30,0.9)_100%)] px-4 py-4 shadow-[0_24px_60px_rgba(0,0,0,0.28)] sm:px-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-start gap-3 sm:items-center">
          <MobileMenuButton onClick={onMenuClick} />
          <div>
            <p className="text-sm font-medium text-slate-400">
              Fleet Health at a Glance
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-white sm:text-3xl">
              Live cold-chain operations dashboard
            </h1>
            <p className="mt-1 max-w-3xl text-sm text-slate-400">
              Monitor route compliance, thermal anomalies, and live sensor
              activity from a single operational cockpit.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
          <div className="flex min-w-65 items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
            <Search className="h-4 w-4 text-slate-500" />
            <span className="text-slate-500">
              Search route, sensor, file...
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm font-semibold text-emerald-300">
              {validatedPct}% Validated
            </div>
            <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm font-semibold text-rose-300">
              {anomalousPct}% Anomalous
            </div>
            <button
              type="button"
              className="rounded-2xl border border-white/10 bg-white/5 p-3 text-slate-100"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
          <Clock3 className="h-3.5 w-3.5" />
          Last sync:{' '}
          {lastUpdate ? lastUpdate.toLocaleString() : 'Waiting for telemetry'}
        </div>
        <div className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-cyan-200">
          Operations-grade visibility across route, temperature, and device
          status
        </div>
      </div>
    </header>
  );
}
