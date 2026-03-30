import React from 'react';
import { MapPin, Navigation } from 'lucide-react';

interface Point {
  id: string;
  name: string;
  description?: string;
}

const routePoints: Point[] = [
  {
    id: '1',
    name: 'Paseo Durango',
    description: 'Paseo Durango, Durango, Mexico',
  },
  {
    id: '2',
    name: 'Waypoint: Gasolinera',
    description: 'Carga de combustible',
  },
  {
    id: '3',
    name: 'Waypoint: Caseta',
    description: 'Pago de peaje',
  },
  {
    id: '4',
    name: 'Flor de Azahar 208',
    description: 'Flor de Azahar 208, Durango, Mexico',
  },
];

export default function RouteTimeline() {
  return (
    <div className="flex flex-col">
      {routePoints.map((point, index) => {
        const isFirst = index === 0;
        const isLast = index === routePoints.length - 1;
        const isWaypoint = !isFirst && !isLast;

        return (
          <div key={point.id} className="relative flex gap-6 pb-4 last:pb-0">
            {!isLast && (
              <div className="absolute left-3.5 top-8  bottom-0 w-0.5 border-l-2 border-dashed border-emerald-500/30 z-0" />
            )}

            <div className="relative z-10 flex items-center justify-center w-8 h-8 shrink-0">
              {isFirst && (
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/40">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_12px_#10b981]" />
                </div>
              )}

              {isWaypoint && (
                <div className="w-6 h-6 rounded-full bg-orange-500/10 flex items-center justify-center border border-dashed border-orange-500/30">
                  <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse shadow-[0_0_8px_#f97316]" />
                </div>
              )}

              {isLast && (
                <div className="w-6 h-6 rounded-full bg-blue-600/20 flex items-center justify-center border border-blue-500/30">
                  <MapPin className="text-blue-400 w-3 h-3 stroke-[2.5]" />
                </div>
              )}
            </div>

            <div className="flex flex-col justify-center">
              <h4
                className={`leading-none ${isWaypoint ? 'text-gray-300 font-medium text-base' : 'text-white font-bold text-lg'}`}
              >
                {point.name}
              </h4>
              {point.description && (
                <p className="text-gray-500 text-sm mt-1.5 font-normal tracking-wide">
                  {point.description}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
