'use client';

import {
  Activity,
  BarChart3,
  Map,
  Menu,
  Radar,
  Route,
  ShieldAlert,
  Thermometer,
  Waypoints,
  X,
} from 'lucide-react';

interface DashboardSidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { label: 'Overview', icon: Activity, active: true },
  { label: 'Live Map', icon: Map },
  { label: 'Routes', icon: Route },
  { label: 'Sensors', icon: Radar },
  { label: 'Analytics', icon: BarChart3 },
  { label: 'Fleet Health', icon: Thermometer },
  { label: 'Alerts', icon: ShieldAlert },
  { label: 'Network', icon: Waypoints },
];

export function DashboardSidebar({
  mobileOpen,
  onClose,
}: DashboardSidebarProps) {
  return (
    <>
      <div
        className={[
          'fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm transition lg:hidden',
          mobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        ].join(' ')}
        onClick={onClose}
      />

      <aside
        className={[
          'fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-white/10',
          'bg-[linear-gradient(180deg,rgba(5,13,31,0.98)_0%,rgba(3,10,24,0.98)_100%)]',
          'px-4 py-5 shadow-[0_20px_80px_rgba(0,0,0,0.45)] transition-transform duration-300',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        ].join(' ')}
      >
        <div className="flex items-center justify-between gap-3 px-2">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl border border-[#ff5a6f]/40 bg-[#19050b] shadow-[0_0_30px_rgba(204,27,47,0.25)]">
              <div className="h-5 w-5 rounded-full border-2 border-[#ff6676] border-y-transparent" />
            </div>
            <div>
              <p className="text-lg font-semibold tracking-[0.28em] text-white">
                AXZON
              </p>
              <p className="text-xs text-slate-400">Fleet intelligence</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/10 p-2 text-slate-300 lg:hidden"
            aria-label="Close navigation"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-8 rounded-2xl border border-cyan-400/10 bg-cyan-400/5 px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-200/70">
            Network status
          </p>
          <div className="mt-3 flex items-center justify-between">
            <div>
              <p className="text-2xl font-semibold text-white">Live</p>
              <p className="text-sm text-slate-400">Telemetry synchronized</p>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Online
            </div>
          </div>
        </div>

        <nav className="mt-6 flex-1 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.label}
              type="button"
              className={[
                'flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition',
                item.active
                  ? 'bg-[#122341] text-white shadow-[inset_0_0_0_1px_rgba(103,232,249,0.15)]'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white',
              ].join(' ')}
            >
              <item.icon className="h-4 w-4" />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="rounded-2xl border border-white/8 bg-white/5 p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Telemetry integrity</span>
            <span>98.2%</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/5">
            <div className="h-full w-[98.2%] rounded-full bg-[linear-gradient(90deg,#12d6df_0%,#ff5a6f_100%)]" />
          </div>
        </div>
      </aside>
    </>
  );
}

export function MobileMenuButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex rounded-2xl border border-white/10 bg-white/5 p-3 text-slate-100 lg:hidden"
      aria-label="Open navigation"
    >
      <Menu className="h-5 w-5" />
    </button>
  );
}
