'use client';

import type { ReactNode } from 'react';

type Accent = 'cyan' | 'teal' | 'amber' | 'rose';

interface MetricItem {
  label: string;
  value: string;
  helper: string;
  badge: string;
  accent: Accent;
  icon: ReactNode;
}

interface MetricsGridProps {
  items: MetricItem[];
}

const accentClasses: Record<Accent, string> = {
  cyan: 'from-cyan-400/25 to-cyan-400/0 text-cyan-200 border-cyan-400/20',
  teal: 'from-teal-400/25 to-teal-400/0 text-teal-200 border-teal-400/20',
  amber: 'from-amber-400/25 to-amber-400/0 text-amber-200 border-amber-400/20',
  rose: 'from-rose-400/25 to-rose-400/0 text-rose-200 border-rose-400/20',
};

export function MetricsGrid({ items }: MetricsGridProps) {
  return (
    <div className="mt-5 grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
      {items.map((item) => (
        <article
          key={item.label}
          className={[
            'rounded-3xl border bg-[linear-gradient(180deg,rgba(9,20,45,0.95)_0%,rgba(5,12,28,0.95)_100%)] p-5',
            'shadow-[0_20px_40px_rgba(0,0,0,0.22)]',
            accentClasses[item.accent],
          ].join(' ')}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl border border-current/15 bg-white/5">
              {item.icon}
            </div>
            <span className="rounded-full border border-current/20 bg-white/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-current/90">
              {item.badge}
            </span>
          </div>

          <div className="mt-6">
            <p className="text-sm text-slate-400">{item.label}</p>
            <p className="mt-2 text-3xl font-semibold text-white">
              {item.value}
            </p>
            <p className="mt-2 text-sm text-slate-400">{item.helper}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
