'use client';

import { Search, Command } from 'lucide-react';

export function SearchBar() {
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-30">
      <div className="flex items-center gap-3 px-4 py-2.5 bg-zinc-900/90 backdrop-blur-sm rounded-xl border border-zinc-800 w-96">
        <Search className="w-4 h-4 text-zinc-400" />
        <span className="flex-1 text-sm text-zinc-500">
          Search routes, sensors...
        </span>
        <div className="flex items-center gap-1 px-2 py-1 bg-zinc-800 rounded-md">
          <Command className="w-3 h-3 text-zinc-400" />
          <span className="text-xs text-zinc-400">K</span>
        </div>
      </div>
    </div>
  );
}
