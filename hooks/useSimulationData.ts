import { useEffect, useState } from 'react';
import type { SimulationPayload } from '../types/simulation';

interface UseSimulationDataOptions {
  onLoadingChange?: (loading: boolean) => void;
  onLoadingMessageChange?: (message: string) => void;
}

export function useSimulationData(options: UseSimulationDataOptions = {}) {
  const { onLoadingChange, onLoadingMessageChange } = options;

  const [data, setData] = useState<SimulationPayload>({
    points: [],
    routes: [],
  });
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        onLoadingMessageChange?.('Cargando datos de sensores...');
        onLoadingChange?.(true);
        setIsLoading(true);

        const response = await fetch('/api/simulation-logs');

        if (!response.ok) {
          throw new Error('Error al cargar simulation logs');
        }

        onLoadingMessageChange?.('Procesando rutas...');
        const payload = (await response.json()) as SimulationPayload;

        if (cancelled) return;

        onLoadingMessageChange?.(
          `Renderizando ${payload.routes.length} rutas...`,
        );
        setData(payload);
        setError(null);

        // Pequeño delay para mostrar el mensaje de renderizado
        setTimeout(() => {
          if (!cancelled) {
            onLoadingChange?.(false);
            setIsLoading(false);
          }
        }, 500);
      } catch (err) {
        if (cancelled) return;

        const error =
          err instanceof Error ? err : new Error('Error desconocido');
        setError(error);
        setData({ points: [], routes: [] });
        onLoadingChange?.(false);
        setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [onLoadingChange, onLoadingMessageChange]);

  return { data, error, isLoading };
}
