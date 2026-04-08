'use client';

import { APIProvider, Map, useMap } from '@vis.gl/react-google-maps';
import { useEffect } from 'react';

export type ShipmentMapPoint = {
  lat: number;
  lng: number;
};

function RouteOverlay({ points }: { points: ShipmentMapPoint[] }) {
  const map = useMap('shipment-route-map');

  useEffect(() => {
    if (!map || points.length === 0 || typeof google === 'undefined') {
      return;
    }

    const path = points.map((point) => ({ lat: point.lat, lng: point.lng }));

    const polyline = new google.maps.Polyline({
      path,
      geodesic: true,
      strokeColor: '#14b8a6',
      strokeOpacity: 0.95,
      strokeWeight: 4,
      map,
    });

    const startMarker = new google.maps.Marker({
      position: path[0],
      map,
      title: 'Origin',
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: '#f59e0b',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 2,
        scale: 8,
      },
    });

    const endMarker = new google.maps.Marker({
      position: path[path.length - 1],
      map,
      title: 'Destination',
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: '#ef4444',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 2,
        scale: 8,
      },
    });

    const waypointMarkers: google.maps.Marker[] = [];

    if (path.length > 2) {
      const waypointPosition = path[Math.floor(path.length / 2)];
      waypointMarkers.push(
        new google.maps.Marker({
          position: waypointPosition,
          map,
          title: 'Waypoint',
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: '#22c55e',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2,
            scale: 7,
          },
        }),
      );
    }

    const bounds = new google.maps.LatLngBounds();
    path.forEach((point) => bounds.extend(point));

    if (path.length === 1) {
      map.setCenter(path[0]);
      map.setZoom(8);
    } else {
      map.fitBounds(bounds, 50);
    }

    return () => {
      polyline.setMap(null);
      startMarker.setMap(null);
      endMarker.setMap(null);
      waypointMarkers.forEach((marker) => marker.setMap(null));
    };
  }, [map, points]);

  return null;
}

const FALLBACK_CENTER = { lat: 25.6866, lng: -100.3161 };

export default function ShipmentRouteMap({
  points,
}: {
  points: ShipmentMapPoint[];
}) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div className="flex h-95 items-center justify-center rounded-xl border border-[#1f3e61] bg-[#071a36] text-sm text-[#8ca7ca]">
        Missing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
      </div>
    );
  }

  const initialCenter = points[0] ?? FALLBACK_CENTER;

  return (
    <div className="h-95 overflow-hidden rounded-xl border border-[#1f3e61]">
      <APIProvider apiKey={apiKey}>
        <Map
          id="shipment-route-map"
          className="h-full w-full"
          defaultCenter={initialCenter}
          defaultZoom={6}
          colorScheme="LIGHT"
          disableDefaultUI={false}
          clickableIcons={false}
          gestureHandling="greedy"
        />
        <RouteOverlay points={points} />
      </APIProvider>
    </div>
  );
}
