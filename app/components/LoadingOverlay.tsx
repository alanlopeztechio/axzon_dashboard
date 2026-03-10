interface LoadingOverlayProps {
  message: string;
}

export function LoadingOverlay({ message }: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="rounded-xl bg-white px-8 py-6 shadow-2xl dark:bg-zinc-800">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
          <p className="text-lg font-medium text-zinc-700 dark:text-zinc-200">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}
