const DashboardSkeleton = () => {
  return (
    <div className="relative w-full h-full bg-zinc-950 overflow-hidden animate-pulse">
      {/* ── Fondo tipo mapa ── */}
      <div className="absolute inset-0 bg-zinc-900" />
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            'linear-gradient(#3f3f46 1px, transparent 1px), linear-gradient(90deg, #3f3f46 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* ── StatsPanel (top-left) ── */}
      <div className="fixed top-10 left-10 z-30 flex flex-col gap-3">
        {[
          'bg-blue-500/10 border-blue-500/20',
          'bg-green-500/10 border-green-500/20',
          'bg-yellow-500/10 border-yellow-500/20',
        ].map((colors, i) => (
          <div
            key={i}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-sm w-56 ${colors}`}
          >
            {/* Icono */}
            <div className="w-5 h-5 rounded-full bg-zinc-700 flex-shrink-0" />
            {/* Texto */}
            <div className="flex-1 space-y-1.5">
              <div className="h-2.5 w-20 bg-zinc-700 rounded" />
              <div className="h-5 w-12 bg-zinc-600 rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* ── RoutesList (bottom-left) ── */}
      <div className="fixed bottom-4 left-20 z-30 w-80 bg-zinc-900/95 backdrop-blur-sm rounded-xl border border-zinc-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-zinc-700" />
            <div className="h-3 w-24 bg-zinc-700 rounded" />
            <div className="h-4 w-6 rounded-full bg-zinc-700" />
          </div>
          <div className="w-4 h-4 rounded bg-zinc-700" />
        </div>

        {/* Filas de rutas */}
        <div className="divide-y divide-zinc-800/50">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="px-4 py-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="h-3 w-36 bg-zinc-700 rounded" />
                <div className="h-4 w-14 rounded-full bg-zinc-800" />
              </div>
              <div className="flex items-center gap-4">
                <div className="h-2.5 w-16 bg-zinc-800 rounded" />
                <div className="h-2.5 w-14 bg-zinc-800 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Spinner central ── */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-20">
        <div className="w-10 h-10 rounded-full border-2 border-zinc-700 border-t-blue-500 animate-spin" />
        <p className="text-xs text-zinc-500 tracking-widest uppercase">
          Cargando datos de simulación…
        </p>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
