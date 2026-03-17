'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push('/');
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950">
      <div className="w-full max-w-md rounded-xl bg-zinc-900/95 backdrop-blur-sm border border-zinc-800 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-8 py-6 border-b border-zinc-800 text-center">
          <h1 className="text-xl font-semibold text-white">Axzon Dashboard</h1>
          <p className="mt-1 text-sm text-zinc-400">Inicia sesión para continuar</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 py-6 flex flex-col gap-4">
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-zinc-400">Correo electrónico</label>
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-800/50 focus-within:border-blue-500/50 transition-colors">
              <Mail className="w-4 h-4 text-zinc-500 shrink-0" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@ejemplo.com"
                required
                className="flex-1 bg-transparent text-sm text-white placeholder-zinc-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-zinc-400">Contraseña</label>
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-800/50 focus-within:border-blue-500/50 transition-colors">
              <Lock className="w-4 h-4 text-zinc-500 shrink-0" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="flex-1 bg-transparent text-sm text-white placeholder-zinc-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-400 text-sm font-medium hover:bg-blue-500/30 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-4 h-4 rounded-full border-2 border-blue-400 border-t-transparent animate-spin" />
            ) : (
              <LogIn className="w-4 h-4" />
            )}
            {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>
        </form>
      </div>
    </div>
  );
}
