'use client';

import { DashboardCard } from './DashboardCard';

type CalendarTone = 'empty' | 'idle' | 'active' | 'warn' | 'critical';

export interface CalendarCell {
  key: string;
  label: string;
  tone: CalendarTone;
  isToday: boolean;
}

interface ActivityCalendarCardProps {
  monthLabel: string;
  cells: CalendarCell[];
}

const toneClasses: Record<CalendarTone, string> = {
  empty: 'border-white/5 bg-white/[0.02] text-slate-700',
  idle: 'border-white/6 bg-white/[0.03] text-slate-300',
  active: 'border-cyan-300/20 bg-cyan-300/12 text-cyan-100',
  warn: 'border-amber-300/25 bg-amber-300/15 text-amber-100',
  critical: 'border-rose-400/25 bg-rose-500/20 text-rose-50',
};

export function ActivityCalendarCard({
  monthLabel,
  cells,
}: ActivityCalendarCardProps) {
  return (
    <DashboardCard title="Operations calendar" subtitle={monthLabel}>
      <div className="grid grid-cols-7 gap-2 text-center text-xs text-slate-500">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
          <div
            key={day}
            className="pb-1 font-medium uppercase tracking-[0.2em]"
          >
            {day}
          </div>
        ))}

        {cells.map((cell) => (
          <div
            key={cell.key}
            className={[
              'flex aspect-square items-center justify-center rounded-2xl border text-sm font-medium transition',
              toneClasses[cell.tone],
              cell.isToday ? 'ring-2 ring-cyan-300/40' : '',
            ].join(' ')}
          >
            {cell.label}
          </div>
        ))}
      </div>
    </DashboardCard>
  );
}
