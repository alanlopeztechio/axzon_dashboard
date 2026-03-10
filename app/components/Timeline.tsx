'use client';

import { Clock, Activity } from 'lucide-react';

interface TimelineProps {
  lastUpdate?: Date;
}

export function Timeline({ lastUpdate }: TimelineProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div className="fixed bottom-4 right-4 z-30">
      <div className="flex items-center gap-4 px-4 py-3 bg-zinc-900/90 backdrop-blur-sm rounded-xl border border-zinc-800">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-green-400 animate-pulse" />
          <span className="text-xs text-zinc-400">Real-time</span>
        </div>
        <div className="h-4 w-px bg-zinc-700" />
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-zinc-400" />
          <span className="text-xs text-zinc-300">
            {lastUpdate ? formatTime(lastUpdate) : '--:--:--'}
          </span>
        </div>
      </div>
    </div>
  );
}
