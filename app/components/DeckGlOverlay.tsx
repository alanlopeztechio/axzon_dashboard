'use client';

import { useMap } from '@vis.gl/react-google-maps';
import { GoogleMapsOverlay } from '@deck.gl/google-maps';
import { useEffect, useMemo, memo } from 'react';
import type { LayersList } from '@deck.gl/core';

interface DeckGlOverlayProps {
  layers: LayersList;
}

export default function DeckGlOverlayComponent({ layers }: DeckGlOverlayProps) {
  const map = useMap('main-map');

  const googleMapsOverlay = useMemo(
    () => new GoogleMapsOverlay({ interleaved: true }),
    [],
  );

  useEffect(() => {
    if (!map) return;
    googleMapsOverlay.setMap(map);
    return () => googleMapsOverlay.setMap(null);
  }, [map, googleMapsOverlay]);

  // useEffect(() => {
  // const logIconLayer = new IconLayer<SensorPoint>({
  //   id: 'sensor-log-points',
  //   data: simulationData.points,
  //   pickable: true,
  //   getPosition: (d) => d.position,
  //   getIcon: (d) => {
  //     let url =
  //       'https://cdn.jsdelivr.net/npm/lucide-static@latest/icons/map-pin.svg';

  //     if (!d.tempInC) {
  //       url =
  //         'https://cdn.jsdelivr.net/npm/lucide-static@latest/icons/help-circle.svg';
  //     } else if (d.tempInC > 1) {
  //       url =
  //         'https://cdn.jsdelivr.net/npm/lucide-static@latest/icons/alert-triangle.svg';
  //     }

  //     return {
  //       url,
  //       mask: true,

  //       width: 1024,
  //       height: 1024,
  //     };
  //   },
  //   alphaCutoff: 0.05,
  //   sizeUnits: 'meters',
  //   sizeScale: 1,
  //   getColor: ({ tempInC }) => {
  //     if (!tempInC) return [200, 200, 200];
  //     if (tempInC > 1) return [255, 50, 50];
  //     if (tempInC > -1) return [255, 165, 0];
  //     return [59, 130, 246];
  //   },
  //   updateTriggers: {
  //     getSize: [hoveredId, hoverScale],
  //     getIcon: [simulationData.points],
  //   },
  //   getSize: (d) => (d.id === hoveredId ? 4000 * hoverScale : 4000),
  //   onHover: handleHover,
  // });

  // const radarLayer = new PulsingRadarLayer<SensorPoint>({
  //   id: 'sensor-radars',
  //   data: simulationData.points,
  //   getPosition: (d) => d.position,
  //   getRadius: 300,
  //   getFillColor: (d) =>
  //     d.tempInC && d.tempInC > 30 ? [255, 50, 50] : [59, 130, 246],
  //   time,
  //   updateTriggers: {
  //     time: [time],
  //     getFillColor: [simulationData.points],
  //   },
  // });

  // googleMapsOverlay.setProps({
  //   layers: [routeLayer, logIconLayer],
  //   getTooltip: (info: PickingInfo<SensorPoint | SensorRoute>) => {
  //     const { object } = info;

  //     if (!object) return null;

  //     if (info.layer?.id === 'sensor-log-points') {
  //       return {
  //         html: `<div style="padding: 8px; background: #111; color: #fff; border-radius: 4px;">
  //               ${'position' in object ? '📍 Punto de Control' : '🛣️ Ruta Sensor'}<br/>
  //               <strong>ID:</strong> ${object.sensorId}
  //              </div>`,
  //       };
  //     }
  //     return null;
  //   },
  // });

  //   return () => googleMapsOverlay.setProps({ layers: [] });
  // }, [googleMapsOverlay, simulationData, hoveredId, hoverScale]);

  useEffect(() => {
    googleMapsOverlay.setProps({
      layers,
    });
  }, [googleMapsOverlay, layers]);

  useEffect(() => {
    return () => googleMapsOverlay.finalize();
  }, [googleMapsOverlay]);

  return null;
}
