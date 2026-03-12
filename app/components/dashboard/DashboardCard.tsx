'use client';

import type { ReactNode } from 'react';

interface DashboardCardProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function DashboardCard({
  title,
  subtitle,
  action,
  children,
  className = '',
}: DashboardCardProps) {
  return (
    <section
      className={[
        'overflow-hidden rounded-3xl border border-white/10',
        'bg-[linear-gradient(180deg,rgba(8,22,50,0.96)_0%,rgba(4,12,30,0.96)_100%)]',
        'shadow-[0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl',
        className,
      ].join(' ')}
    >
      <div className="flex items-start justify-between gap-4 border-b border-white/6 px-5 py-4 sm:px-6">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-200/70">
            {title}
          </p>
          {subtitle ? (
            <p className="mt-1 text-sm text-slate-300/70">{subtitle}</p>
          ) : null}
        </div>
        {action}
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}
