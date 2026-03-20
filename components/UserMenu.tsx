'use client';

import { useEffect, useRef, useState } from 'react';
import { LogOut } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export function UserMenu() {
  const [email, setEmail] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
    });
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const initials = email ? email[0].toUpperCase() : '?';

  return (
    <div
      ref={menuRef}
      className="fixed top-10 right-10 z-50 flex flex-col items-end gap-2"
    >
      {/* Avatar button */}
      <button
        onClick={() => setOpen((v) => !v)}
        title={email ?? ''}
        className="w-12 h-12 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-400 text-base font-semibold flex items-center justify-center shadow-lg backdrop-blur-sm hover:bg-blue-500/30 transition-colors duration-200 focus:outline-none cursor-pointer"
      >
        {initials}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="bg-zinc-900/95 backdrop-blur-sm border border-zinc-800 rounded-xl shadow-2xl overflow-hidden min-w-[220px]">
          {/* User info header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-400 text-base font-semibold flex items-center justify-center shrink-0">
              {initials}
            </div>
            <span className="text-sm font-medium text-white truncate">{email}</span>
          </div>

          {/* Sign out */}
          <form action="/auth/signout" method="POST">
            <button
              type="submit"
              className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-zinc-800/50 transition-colors focus:outline-none cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Cerrar sesión
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
