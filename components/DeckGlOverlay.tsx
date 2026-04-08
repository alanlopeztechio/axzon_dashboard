'use client';

import { useMap } from '@vis.gl/react-google-maps';
import { GoogleMapsOverlay } from '@deck.gl/google-maps';
import { useEffect, useMemo, useState, useCallback, memo } from 'react';
import { IconLayer, PathLayer } from '@deck.gl/layers';
import type { PickingInfo } from '@deck.gl/core';

import type { SensorPoint, SensorRoute } from '../types/simulation';
import { PulsingRadarLayer } from '../layers/PulsingRadarLayer';
import { useSimulationData } from '../hooks/useSimulationData';
import { useMapAnimations } from '../hooks/useAnimations';
import { getColorFromText } from '../utils/colors';
import { useData } from './providers/DataProvider';

interface DeckGlOverlayProps {
  // onLoadingChange: (loading: boolean) => void;
  // onLoadingMessageChange: (message: string) => void;
}

function DeckGlOverlayComponent(
  {
    // onLoadingChange,
    // onLoadingMessageChange,
  }: DeckGlOverlayProps,
) {
  const map = useMap('main-map');
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const googleMapsOverlay = useMemo(
    () => new GoogleMapsOverlay({ layers: [] }),
    [],
  );

  const simulationData = useData();

  // const { data: simulationData } = useSimulationData({
  //   onLoadingChange,
  //   onLoadingMessageChange,
  // });

  const { time, hoverScale } = useMapAnimations(hoveredId);

  const handleHover = useCallback((info: PickingInfo<SensorPoint>) => {
    setHoveredId(info.object?.id ?? null);
  }, []);

  useEffect(() => {
    if (!map) return;
    googleMapsOverlay.setMap(map);
    return () => googleMapsOverlay.setMap(null);
  }, [map, googleMapsOverlay]);

  useEffect(() => {
    const routeLayer = new PathLayer<SensorRoute>({
      id: 'sensor-routes',
      data: simulationData.routes,
      pickable: true,
      widthMinPixels: 2,
      getPath: (d) => d.path,
      getWidth: 4,
      getColor: (d) => getColorFromText(d.sensorId),
    });

    const logIconLayer = new IconLayer<SensorPoint>({
      id: 'sensor-log-points',
      data: simulationData.points,
      pickable: true,
      getPosition: (d) => d.position,
      getIcon: (d) => {
        let url =
          'https://cdn.jsdelivr.net/npm/lucide-static@latest/icons/map-pin.svg';

        if (!d.tempInC) {
          url =
            'https://cdn.jsdelivr.net/npm/lucide-static@latest/icons/help-circle.svg';
        } else if (d.tempInC > 1) {
          url =
            'https://cdn.jsdelivr.net/npm/lucide-static@latest/icons/alert-triangle.svg';
        }

        return {
          url,
          mask: true,

          width: 1024,
          height: 1024,
        };
      },
      alphaCutoff: 0.05,
      sizeUnits: 'meters',
      sizeScale: 1,
      getColor: ({ tempInC }) => {
        if (!tempInC) return [200, 200, 200];
        if (tempInC > 1) return [255, 50, 50];
        if (tempInC > -1) return [255, 165, 0];
        return [59, 130, 246];
      },
      updateTriggers: {
        getSize: [hoveredId, hoverScale],
        getIcon: [simulationData.points],
      },
      getSize: (d) => (d.id === hoveredId ? 4000 * hoverScale : 4000),
      onHover: handleHover,
    });

    const radarLayer = new PulsingRadarLayer<SensorPoint>({
      id: 'sensor-radars',
      data: simulationData.points,
      getPosition: (d) => d.position,
      getRadius: 300,
      getFillColor: (d) =>
        d.tempInC && d.tempInC > 30 ? [255, 50, 50] : [59, 130, 246],
      time,
      updateTriggers: {
        time: [time],
        getFillColor: [simulationData.points],
      },
    });

    googleMapsOverlay.setProps({
      layers: [routeLayer, logIconLayer],
      getTooltip: ({ object }) => {
        if (!object) return null;
        return {
          html: `<div style="padding: 8px; background: #111; color: #fff; border-radius: 4px;">
                  ${'position' in object ? '📍 Punto de Control' : '🛣️ Ruta Sensor'}<br/>
                  <strong>ID:</strong> ${object.sensorId}
                 </div>`,
        };
      },
    });

    return () => googleMapsOverlay.setProps({ layers: [] });
  }, [googleMapsOverlay, simulationData, hoveredId, hoverScale]);

  // Cleanup al desmontar
  useEffect(() => {
    return () => googleMapsOverlay.finalize();
  }, [googleMapsOverlay]);

  return null;
}

// Memoizar el componente para evitar re-renders innecesarios
export const DeckGlOverlay = memo(DeckGlOverlayComponent);
