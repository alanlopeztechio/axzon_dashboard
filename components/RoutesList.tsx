'use client';

import { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  MapPin,
  Clock,
  Thermometer,
} from 'lucide-react';
import type { SensorRoute, SensorPoint } from '../types/simulation';

interface RoutesListProps {
  routes: SensorRoute[];
  points: SensorPoint[];
  onRouteHover?: (routeId: string | null) => void;
  onRouteSelect?: (routeId: string) => void;
}

export function RoutesList({
  routes,
  points,
  onRouteHover,
  onRouteSelect,
}: RoutesListProps) {
  const [expanded, setExpanded] = useState(true);
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);

  // Group points by route
  const pointsByRoute = points.reduce(
    (acc, point) => {
      const key = point.routeName;
      if (!acc[key]) acc[key] = [];
      acc[key].push(point);
      return acc;
    },
    {} as Record<string, SensorPoint[]>,
  );

  // Calculate route stats
  const routeStats = routes.map((route) => {
    const routePoints = pointsByRoute[route.routeName] || [];
    const temps = routePoints
      .filter((p) => p.tempInC !== null)
      .map((p) => p.tempInC as number);
    const avgTemp =
      temps.length > 0 ? temps.reduce((a, b) => a + b, 0) / temps.length : null;
    const anomalies = routePoints.filter(
      (p) => p.tempInC && p.tempInC > 1,
    ).length;

    return {
      ...route,
      pointCount: routePoints.length,
      avgTemp,
      anomalies,
    };
  });

  const handleRouteClick = (routeId: string) => {
    setSelectedRoute(routeId === selectedRoute ? null : routeId);
    onRouteSelect?.(routeId);
  };

  return (
    <div className="fixed bottom-4 left-20 z-30 w-80 max-h-[400px] bg-zinc-900/95 backdrop-blur-sm rounded-xl border border-zinc-800 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-blue-400" />
          <span className="font-medium text-white">Active Routes</span>
          <span className="px-2 py-0.5 text-xs bg-blue-500/20 text-blue-400 rounded-full">
            {routes.length}
          </span>
        </div>
        {expanded ? (
          <ChevronDown className="w-4 h-4 text-zinc-400" />
        ) : (
          <ChevronUp className="w-4 h-4 text-zinc-400" />
        )}
      </button>

      {/* Routes List */}
      {expanded && (
        <div className="overflow-y-auto max-h-[320px] divide-y divide-zinc-800/50">
          {routeStats.map((route) => (
            <div
              key={route.id}
              className={`px-4 py-3 cursor-pointer transition-colors ${
                selectedRoute === route.id
                  ? 'bg-blue-500/10'
                  : 'hover:bg-zinc-800/50'
              }`}
              onClick={() => handleRouteClick(route.id)}
              onMouseEnter={() => onRouteHover?.(route.id)}
              onMouseLeave={() => onRouteHover?.(null)}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-white truncate max-w-[180px]">
                  {route.routeName}
                </span>
                {route.anomalies > 0 && (
                  <span className="px-2 py-0.5 text-xs bg-yellow-500/20 text-yellow-400 rounded-full">
                    {route.anomalies} alerts
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 text-xs text-zinc-400">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {route.pointCount} points
                </span>
                {route.avgTemp !== null && (
                  <span className="flex items-center gap-1">
                    <Thermometer className="w-3 h-3" />
                    {route.avgTemp.toFixed(1)}°C
                  </span>
                )}
              </div>
            </div>
          ))}

          {routes.length === 0 && (
            <div className="px-4 py-8 text-center text-zinc-500 text-sm">
              No routes available
            </div>
          )}
        </div>
      )}
    </div>
  );
}
