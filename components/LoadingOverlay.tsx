'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface LoadingOverlayProps {
  message: string;
}

export function LoadingOverlay({ message }: LoadingOverlayProps) {
  return (
    <Dialog open>
      <DialogContent
        showCloseButton={false}
        className="max-w-lg overflow-hidden border border-white/10 bg-zinc-900 p-0 text-zinc-100 shadow-[0_20px_80px_rgba(0,0,0,0.55)] backdrop-blur-xl"
        onInteractOutside={(event) => event.preventDefault()}
        onEscapeKeyDown={(event) => event.preventDefault()}
      >
        <div className="relative space-y-5 p-7">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-xl font-semibold tracking-tight text-zinc-50">
              Cargando datos
            </DialogTitle>
            <DialogDescription className="text-sm text-zinc-400">
              Estamos preparando el panel. Esto puede tardar unos segundos.
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-xl border border-white/10 bg-zinc-900/50 p-4">
            <div className="flex items-center gap-4">
              <div className="relative h-10 w-10 shrink-0">
                <div className="absolute inset-0 animate-ping rounded-full bg-[#c0392b55]" />
                <div className="absolute inset-0 animate-spin rounded-full border-[3px] border-[#c0392b55] border-t-[#c0392b55]" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-zinc-100">
                  {message}
                </p>
                <p className="text-xs text-zinc-500">
                  No cierres esta ventana hasta finalizar.
                </p>
              </div>
            </div>
          </div>

          <div className="h-1.5 overflow-hidden rounded-full bg-zinc-800">
            <div className="h-full w-1/2 animate-pulse rounded-full bg-[#c0392b55]" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
