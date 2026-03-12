'use client';

import { useMemo, useState } from 'react';
import { APIProvider, InfoWindow, Map } from '@vis.gl/react-google-maps';
import { Gauge, MapPinned, Thermometer } from 'lucide-react';
import DeckGlOverlay from '../DeckGlOverlay';
import { getIconUbicationLayer } from '../../layers/IconUbicationLayer';
import { getRouterLayer } from '../../layers/RouterLayer';
import type { SensorPoint, SensorRoute } from '../../types';
import { DashboardCard } from './DashboardCard';

interface FleetMapPanelProps {
  points: SensorPoint[];
  routes: SensorRoute[];
}

export function FleetMapPanel({ points, routes }: FleetMapPanelProps) {
  const [hoveredPointId, setHoveredPointId] = useState<string | null>(null);
  const [clickedStation, setClickedStation] = useState<SensorPoint | null>(
    null,
  );
  const [hoverInfo, setHoverInfo] = useState<{
    object: SensorPoint;
    x: number;
    y: number;
  } | null>(null);

  const routeLayers = useMemo(() => getRouterLayer(routes), [routes]);
  const iconLayers = useMemo(
    () =>
      getIconUbicationLayer(
        points,
        hoveredPointId,
        setHoveredPointId,
        setClickedStation,
        setHoverInfo,
        clickedStation,
      ),
    [points, hoveredPointId, clickedStation],
  );

  const defaultCenter = useMemo(() => {
    if (points.length === 0) {
      return { lat: 35, lng: -97 };
    }

    const { latSum, lngSum } = points.reduce(
      (acc, point) => ({
        latSum: acc.latSum + point.position[1],
        lngSum: acc.lngSum + point.position[0],
      }),
      { latSum: 0, lngSum: 0 },
    );

    return {
      lat: latSum / points.length,
      lng: lngSum / points.length,
    };
  }, [points]);

  return (
    <DashboardCard
      title="Live fleet map"
      subtitle="Interactive map with route glow, sensor markers, and thermal inspection."
      action={
        <div className="flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-200">
          <span className="h-2 w-2 rounded-full bg-cyan-400" />
          {routes.length} routes · {points.length.toLocaleString()} readings
        </div>
      }
      className="h-full"
    >
      <div className="relative overflow-hidden rounded-[26px] border border-white/8 bg-slate-950">
        <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between gap-3 px-4 py-3">
          <div className="rounded-full border border-white/10 bg-slate-950/85 px-3 py-1.5 text-xs text-slate-300 backdrop-blur-md">
            Use drag / zoom to inspect the route network.
          </div>
        </div>

        <div className="relative h-105 w-full sm:h-120">
          <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
            <Map
              id="main-map"
              className="h-full w-full"
              defaultCenter={defaultCenter}
              defaultZoom={5}
              colorScheme="DARK"
              mapId={process.env.NEXT_PUBLIC_MAP_ID_VECTOR}
              disableDefaultUI={true}
              clickableIcons={false}
              gestureHandling="greedy"
            >
              {clickedStation ? (
                <InfoWindow
                  shouldFocus={false}
                  headerDisabled={true}
                  position={{
                    lat: clickedStation.position[1],
                    lng: clickedStation.position[0],
                  }}
                >
                  <div className="flex max-h-80  flex-col overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(180deg,#0d1835_0%,#060f23_100%)] text-white shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
                    <div className="sticky top-0 z-10 flex items-center justify-between bg-[linear-gradient(90deg,#cc1b2f_0%,#ff6b7a_100%)] px-4 py-3">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/70">
                          Sensor
                        </p>
                        <h3 className="text-lg font-semibold">
                          {clickedStation.sensorId}
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => setClickedStation(null)}
                        className="rounded-full bg-white/15 px-2 py-1 text-sm text-white transition hover:bg-white/25"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="overflow-y-auto space-y-3 px-4 py-4">
                      <DataRow
                        icon={<Thermometer className="h-4 w-4 text-cyan-300" />}
                        label="Temperature"
                        value={
                          clickedStation.tempInC === null
                            ? 'N/A'
                            : `${clickedStation.tempInC.toFixed(1)}°C`
                        }
                      />
                      <DataRow
                        icon={<MapPinned className="h-4 w-4 text-cyan-300" />}
                        label="Route"
                        value={clickedStation.routeName}
                      />
                      <DataRow
                        icon={<Gauge className="h-4 w-4 text-cyan-300" />}
                        label="Timestamp"
                        value={new Date(
                          clickedStation.timestamp,
                        ).toLocaleString()}
                      />
                      <div className="rounded-2xl border border-white/8 bg-white/5 p-3 text-xs text-slate-400">
                        <p>File: {clickedStation.fileName}</p>
                        <p className="mt-1">
                          Coordinates: {clickedStation.position[1].toFixed(4)},{' '}
                          {clickedStation.position[0].toFixed(4)}
                        </p>
                      </div>
                    </div>
                  </div>
                </InfoWindow>
              ) : null}

              <DeckGlOverlay layers={[routeLayers, iconLayers]} />
            </Map>
          </APIProvider>

          {hoverInfo ? (
            <div
              className="pointer-events-none absolute z-20 transition-all duration-100"
              style={{
                left: hoverInfo.x,
                top: hoverInfo.y,
                transform: 'translate(-50%, calc(-100% - 18px))',
              }}
            >
              <div className="min-w-52 rounded-3xl border border-white/10 bg-slate-950/92 p-4 text-white shadow-[0_24px_60px_rgba(0,0,0,0.5)] backdrop-blur-xl">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-200/70">
                  Sensor preview
                </p>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {hoverInfo.object.sensorId}
                    </p>
                    <p className="text-xs text-slate-400">
                      {hoverInfo.object.routeName}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-semibold text-cyan-200">
                      {hoverInfo.object.tempInC === null
                        ? 'N/A'
                        : `${hoverInfo.object.tempInC.toFixed(1)}°C`}
                    </p>
                    <p className="text-[11px] text-slate-400">Latest reading</p>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </DashboardCard>
  );
}

function DataRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/8 bg-white/5 px-3 py-2.5">
      <div className="flex items-center gap-2 text-sm text-slate-300">
        {icon}
        {label}
      </div>
      <span className="text-right text-sm font-medium text-white">{value}</span>
    </div>
  );
}
