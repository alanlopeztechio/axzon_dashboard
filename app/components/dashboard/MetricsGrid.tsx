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

const accentClasses: Record<Accent, { helper: string; badge: string }> = {
  cyan: {
    helper: 'text-[#FCA5A5]',
    badge: 'border-[#FCA5A5]/35 text-[#FECACA] bg-[#FCA5A5]/10',
  },
  teal: {
    helper: 'text-[#F87171]',
    badge: 'border-[#F87171]/35 text-[#FCA5A5] bg-[#F87171]/10',
  },
  amber: {
    helper: 'text-[#FB7185]',
    badge: 'border-[#FB7185]/35 text-[#FBCFE8] bg-[#FB7185]/10',
  },
  rose: {
    helper: 'text-[#DC2626]',
    badge: 'border-[#DC2626]/35 text-[#FCA5A5] bg-[#DC2626]/10',
  },
};

export function MetricsGrid({ items }: MetricsGridProps) {
  return (
    // <div className="mt-10 grid gap-8 sm:grid-cols-2 2xl:grid-cols-4">
    <div className="mt-10 col-span-2 row-span-4 flex flex-col gap-8">
      {items.map((item) => {
        const accent = accentClasses[item.accent];

        return (
          <article
            key={item.label}
            className="relative rounded-3xl border border-[#B50404]/35 bg-[linear-gradient(145deg,#2A0202,#160101)] p-5 shadow-[0_8px_24px_rgba(62,1,1,0.35)]"
          >
            <div className="absolute -top-6 left-1/2 grid h-12 w-12 -translate-x-1/2 place-items-center rounded-full border border-[#B50404]/45 bg-[#3E0101] text-[#FCA5A5] shadow-[0_6px_14px_rgba(0,0,0,0.35)]">
              {item.icon}
            </div>

            <div className="mt-6 text-center">
              <p className="mt-2 text-5xl font-semibold tracking-tight text-white">
                {item.value}
              </p>
              <p className="mt-2 text-xl font-medium text-[#E2E8F0]">
                {item.label}
              </p>

              <div className="mt-4 flex justify-center">
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${accent.badge}`}
                >
                  {item.badge}
                </span>
              </div>

              <p
                className={`mt-4 flex items-center justify-center gap-2 text-xs font-semibold ${accent.helper}`}
              >
                <span aria-hidden>↑</span>
                {item.helper}
              </p>
            </div>
          </article>
        );
      })}
    </div>
  );
}
