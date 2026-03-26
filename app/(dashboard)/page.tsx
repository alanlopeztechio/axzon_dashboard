'use client';

import { useState, useCallback, useMemo } from 'react';
import { APIProvider, Map } from '@vis.gl/react-google-maps';

import { useSimulationData } from '@/hooks';
import { DeckGlOverlay } from '@/components/DeckGlOverlay';
import { LoadingOverlay } from '@/components/LoadingOverlay';
import { RoutesList } from '@/components/RoutesList';
import { StatsPanel } from '@/components/StatsPanel';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Area,
  AreaChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import {
  AlertTriangle,
  MapIcon,
  Shield,
  ShieldCheck,
  Thermometer,
} from 'lucide-react';

const data = [
  { v: 62 },
  { v: 65 },
  { v: 68 },
  { v: 66 },
  { v: 67 },
  { v: 66 },
  { v: 65 },
  { v: 64 },
  { v: 65 },
  { v: 64 },
];

const donutData = [
  { name: 'Issue', value: 3200, color: '#ef2c2c' },
  { name: 'Healthy', value: 19801, color: '#16c79a' },
];

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
    <div className="flex h-full font-sans">
      {/* Sidebar */}
      {/* <Sidebar /> */}

      {/* Main Content */}
      <main className="flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 gap-4 px-4 py-6">
          <Card className="mt-4 border shadow-lg mb-2">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-4 bg-[#103742] rounded-xl">
                  <MapIcon className="text-chart-1" />
                </div>
                <h2 className="border px-3 py-1 border-[#0d6851] rounded-xl text-[#0d6851] font-bold">
                  Global Logistics
                </h2>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 p-4">
              <p className="text-sm">Active Shipments</p>
              <p className="text-4xl font-semibold leading-none">23,001</p>

              <ResponsiveContainer width="100%" height={70}>
                <AreaChart
                  data={data}
                  margin={{ top: 8, right: 0, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="shipmentsAreaFade"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#00d6c8"
                        stopOpacity={0.35}
                      />
                      <stop
                        offset="55%"
                        stopColor="#00d6c8"
                        stopOpacity={0.12}
                      />
                      <stop offset="100%" stopColor="#00d6c8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="v"
                    stroke="#00d6c8"
                    strokeWidth={2}
                    fill="url(#shipmentsAreaFade)"
                    strokeLinecap="round"
                    dot={false}
                    activeDot={{
                      r: 4,
                      fill: '#00d6c8',
                      stroke: '#0b1220',
                      strokeWidth: 2,
                    }}
                    isAnimationActive={false}
                  />
                  <Tooltip
                    cursor={{
                      stroke: '#00d6c8',
                      strokeOpacity: 0.25,
                      strokeWidth: 1,
                    }}
                    contentStyle={{
                      backgroundColor: '#0b1220',
                      border: '1px solid rgba(0, 214, 200, 0.25)',
                      borderRadius: '10px',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
                      color: '#e5e7eb',
                      fontSize: '12px',
                    }}
                    labelStyle={{ display: 'none' }}
                    formatter={(value) => [
                      `${Number(value ?? 0).toLocaleString()} envios`,
                      'Valor',
                    ]}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card className="mt-4 border shadow-lg mb-2">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-4 bg-[#103742] rounded-xl">
                  <Thermometer className="text-chart-1" />
                </div>
                <h2 className="border px-3 py-1 border-[#0d6851] rounded-xl text-[#0d6851] font-bold">
                  Stable
                </h2>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 p-4">
              <p className="text-sm">MKT</p>
              <p className="text-4xl font-semibold leading-none">5.2 C</p>

              <ResponsiveContainer width="100%" height={70}>
                <AreaChart
                  data={data}
                  margin={{ top: 8, right: 0, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="shipmentsAreaFade"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#00d6c8"
                        stopOpacity={0.35}
                      />
                      <stop
                        offset="55%"
                        stopColor="#00d6c8"
                        stopOpacity={0.12}
                      />
                      <stop offset="100%" stopColor="#00d6c8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="v"
                    stroke="#00d6c8"
                    strokeWidth={2}
                    fill="url(#shipmentsAreaFade)"
                    strokeLinecap="round"
                    dot={false}
                    activeDot={{
                      r: 4,
                      fill: '#00d6c8',
                      stroke: '#0b1220',
                      strokeWidth: 2,
                    }}
                    isAnimationActive={false}
                  />
                  <Tooltip
                    cursor={{
                      stroke: '#00d6c8',
                      strokeOpacity: 0.25,
                      strokeWidth: 1,
                    }}
                    contentStyle={{
                      backgroundColor: '#0b1220',
                      border: '1px solid rgba(0, 214, 200, 0.25)',
                      borderRadius: '10px',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
                      color: '#e5e7eb',
                      fontSize: '12px',
                    }}
                    labelStyle={{ display: 'none' }}
                    formatter={(value) => [
                      `${Number(value ?? 0).toLocaleString()} envios`,
                      'Valor',
                    ]}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card className="mt-4 border shadow-lg mb-2">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-4 bg-[#423117] rounded-xl">
                  <ShieldCheck color="#f59f0a" />
                </div>
                <h2 className="border px-3 py-1 border-[#0d6851] rounded-xl text-[#0d6851] font-bold">
                  +4.5%
                </h2>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 p-4">
              <p className="text-sm">Loss Avoided</p>
              <p className="text-4xl font-semibold leading-none wrap-break-word">
                $23,254,800
              </p>

              <ResponsiveContainer width="100%" height={70}>
                <AreaChart
                  data={data}
                  margin={{ top: 8, right: 0, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="shipmentsAreaFade2"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#f59f0a"
                        stopOpacity={0.35}
                      />
                      <stop
                        offset="55%"
                        stopColor="#f59f0a"
                        stopOpacity={0.12}
                      />
                      <stop offset="100%" stopColor="#f59f0a" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="v"
                    stroke="#f59f0a"
                    strokeWidth={2}
                    fill="url(#shipmentsAreaFade2)"
                    strokeLinecap="round"
                    dot={false}
                    activeDot={{
                      r: 4,
                      fill: '#f59f0a',
                      stroke: '#0b1220',
                      strokeWidth: 2,
                    }}
                    isAnimationActive={false}
                  />
                  <Tooltip
                    cursor={{
                      stroke: '#f59f0a',
                      strokeOpacity: 0.25,
                      strokeWidth: 1,
                    }}
                    contentStyle={{
                      backgroundColor: '#0b1220',
                      border: '1px solid rgba(245, 159, 10, 0.25)',
                      borderRadius: '10px',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
                      color: '#e5e7eb',
                      fontSize: '12px',
                    }}
                    labelStyle={{ display: 'none' }}
                    formatter={(value) => [
                      `${Number(value ?? 0).toLocaleString()} envios`,
                      'Valor',
                    ]}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card className="mt-4 border border-red-500/10 shadow-lg mb-2 bg-red-500/5">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-4 bg-[#411b24] rounded-xl">
                  <AlertTriangle color="#ef4444" />
                </div>
                <h2 className="border px-3 py-1 border-[#411b24] rounded-xl text-[#ef4444] font-bold">
                  Requires Atention
                </h2>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 p-4 ">
              <p className="text-sm">Active Shipments</p>
              <p className="text-4xl font-semibold leading-none">23,001</p>

              <ResponsiveContainer width="100%" height={70}>
                <AreaChart
                  data={data}
                  margin={{ top: 8, right: 0, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="shipmentsAreaFade3"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#ef4444"
                        stopOpacity={0.35}
                      />
                      <stop
                        offset="55%"
                        stopColor="#ef4444"
                        stopOpacity={0.12}
                      />
                      <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="v"
                    stroke="#ef4444"
                    strokeWidth={2}
                    fill="url(#shipmentsAreaFade3)"
                    strokeLinecap="round"
                    dot={false}
                    activeDot={{
                      r: 4,
                      fill: '#ef4444',
                      stroke: '#0b1220',
                      strokeWidth: 2,
                    }}
                    isAnimationActive={false}
                  />
                  <Tooltip
                    cursor={{
                      stroke: '#ef4444',
                      strokeOpacity: 0.25,
                      strokeWidth: 1,
                    }}
                    contentStyle={{
                      backgroundColor: '#0b1220',
                      border: '1px solid rgba(239, 68, 68, 0.25)',
                      borderRadius: '10px',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
                      color: '#e5e7eb',
                      fontSize: '12px',
                    }}
                    labelStyle={{ display: 'none' }}
                    formatter={(value) => [
                      `${Number(value ?? 0).toLocaleString()} envios`,
                      'Valor',
                    ]}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        <div className="flex flex-col px-4 py-6 gap-6 border mx-4 mb-4 rounded-2xl bg-card shadow-lg">
          <h2 className="text-center text-2xl font-bold">Systemic Health</h2>
          <div className="mx-auto w-full">
            <div className="relative mx-auto h-58 w-58">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[{ value: 1 }]}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    innerRadius={90}
                    outerRadius={112}
                    startAngle={0}
                    endAngle={360}
                    cornerRadius={0}
                    stroke="none"
                  >
                    <Cell fill="#00C49F" />
                  </Pie>
                  <Pie
                    data={donutData}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    innerRadius={90} // ← igual que el verde
                    outerRadius={112} // ← igual que el verde
                    startAngle={210}
                    endAngle={-150}
                    stroke="none"
                    style={{ zIndex: 10 }}
                  >
                    {donutData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              <div className="pointer-events-none w-full absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-5xl font-bold leading-none">23001</p>
                  <p className="mt-2 text-2xl font-light">Total</p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex w-full flex-row justify-between ">
              <p className="text-green-500 font-bold text-xl">
                <span className="mr-3 inline-block h-3 w-3 rounded-full bg-green-400 align-middle" />
                18001 Validated
              </p>
              <p className="text-red-900 font-bold text-xl">
                <span className="mr-3 inline-block h-3 w-3 animate-pulse rounded-full bg-red-900 align-middle shadow-[0_0_0_4px_rgba(127,29,29,0.18)]" />
                5000 Anomalous
              </p>
            </div>
          </div>
        </div>
        {/* Map Container */}
        <div className="relative w-full h-full">
          <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
            <Map
              id="main-map"
              className="w-full h-full"
              defaultCenter={{ lat: 35, lng: -97 }}
              defaultZoom={5}
              colorScheme="FOLLOW_SYSTEM"
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
          {/* <UserMenu /> */}
        </div>
      </main>
      {isLoading && <LoadingOverlay message={loadingMessage} />}
    </div>
  );
}
