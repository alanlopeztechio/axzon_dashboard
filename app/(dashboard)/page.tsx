'use client';

import { useState, useCallback, useMemo } from 'react';
import { APIProvider, Map } from '@vis.gl/react-google-maps';
import {
  DeckGlOverlay,
  LoadingOverlay,
  Sidebar,
  StatsPanel,
  MapControls,
  RoutesList,
  SearchBar,
  Timeline,
  UserMenu,
} from '../components';
import { useSimulationData } from '../hooks';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState('Cargando mapa...');
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // Memoizar callbacks para evitar re-renders
  const handleLoadingChange = useCallback((loading: boolean) => {
    setIsLoading(loading);
    if (!loading) {
      setLastUpdate(new Date());
    }
  }, []);

  const handleLoadingMessageChange = useCallback((message: string) => {
    setLoadingMessage(message);
  }, []);

  // Cargar datos de simulación
  const { data: simulationData } = useSimulationData({
    onLoadingChange: handleLoadingChange,
    onLoadingMessageChange: handleLoadingMessageChange,
  });

  // Calcular estadísticas
  const stats = useMemo(() => {
    const temps = simulationData.points
      .filter((p) => p.tempInC !== null)
      .map((p) => p.tempInC as number);
    const avgTemp =
      temps.length > 0
        ? temps.reduce((a, b) => a + b, 0) / temps.length
        : undefined;
    const anomalies = simulationData.points.filter(
      (p) => p.tempInC && p.tempInC > 1,
    ).length;

    return {
      totalRoutes: simulationData.routes.length,
      totalPoints: simulationData.points.length,
      avgTemp,
      anomalies,
    };
  }, [simulationData]);

  return (
    <div className="flex min-h-screen bg-zinc-950 font-sans">
      {/* Sidebar */}
      {/* <Sidebar /> */}

      {/* Main Content */}
      <main className="flex-1">
        {/* Map Container */}
        <div className="relative w-full h-screen">
          <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
            <Map
              id="main-map"
              className="w-full h-full"
              defaultCenter={{ lat: 35, lng: -97 }}
              defaultZoom={5}
              colorScheme="DARK"
              disableDefaultUI={true}
            />
            <DeckGlOverlay
              onLoadingChange={handleLoadingChange}
              onLoadingMessageChange={handleLoadingMessageChange}
            />
          </APIProvider>

          {/* Search Bar */}
          {/* <SearchBar /> */}

          {/* Stats Panel */}
          <StatsPanel
            totalRoutes={stats.totalRoutes}
            totalPoints={stats.totalPoints}
            anomalies={stats.anomalies}
            avgTemp={stats.avgTemp}
          />

          {/* Map Controls */}
          {/* <MapControls /> */}

          {/* Routes List */}
          <RoutesList
            routes={simulationData.routes}
            points={simulationData.points}
          />

          {/* Timeline */}
          {/* <Timeline lastUpdate={lastUpdate ?? undefined} /> */}

          {/* User menu */}
          <UserMenu />
        </div>
      </main>

      {/* Loading Overlay */}
      {isLoading && <LoadingOverlay message={loadingMessage} />}
    </div>
  );
}
