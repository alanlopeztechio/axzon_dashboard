import { IconLayer } from '@deck.gl/layers';
import { SensorPoint } from '../types';
import { Color } from '@deck.gl/core';

export function getIconUbicationLayer(
  data: SensorPoint[],
  hoveredPointId: string | null,
  setHoveredPointId: (id: string | null) => void,
  setClickedStation: (station: SensorPoint | null) => void,
  setHoverInfo: (
    data: {
      object: SensorPoint;
      x: number;
      y: number;
    } | null,
  ) => void,
  clickStationData: SensorPoint | null,
) {
  return new IconLayer<SensorPoint>({
    id: 'ScatterplotLayer',
    data: data,
    getPosition: (d) => d.position,
    getIcon: (d) => {
      const color = COLORS.green;
      const svg = createMarkerSvg(color, BOLT_ICON);
      return {
        url: toDataUrl(svg),
        width: 256,
        height: 256,
        anchorY: 224,
      };
    },
    getSize: (d) => (d.id === hoveredPointId ? 3000 : 2500),
    sizeScale: 1,
    pickable: true,
    sizeUnits: 'meters',
    onHover: (info, event) => {
      if (clickStationData?.id === info.object?.id) {
        setHoverInfo(null);
        setHoveredPointId(null);
        return;
      }

      if (info.object) {
        setHoveredPointId(info.object.id);
        setHoverInfo({
          object: info.object,
          x: info.x,
          y: info.y,
        });
      } else {
        setHoverInfo(null);
        setHoveredPointId(null);
      }
    },
    onClick: (data) => {
      if (data.object) {
        setClickedStation(data.object as SensorPoint);
        setHoverInfo(null);
        setHoveredPointId(null);
      }
    },
    transitions: {
      getSize: {
        type: 'spring',
        stiffness: 0.1,
        damping: 0.15,
        enter: () => [0],
      },
      getFillColor: {
        duration: 600,
        easing: (x: number) => -(Math.cos(Math.PI * x) - 1) / 2,
        enter: ([r, g, b]: Color) => [r, g, b, 0],
      },
    },
    updateTriggers: {
      getSize: [hoveredPointId],
    },
  });
}

function createMarkerSvg(color: string, icon: string) {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="2048" height="2048" viewBox="0 0 64 64">
      <defs>
        <!-- Halo exterior difuso -->
        <filter id="halo" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur"/>
        </filter>
        <!-- Borde brillante del círculo -->
        <filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur"/>
          <feComposite in="SourceGraphic" in2="blur" operator="over"/>
        </filter>
      </defs>

      <!-- Halo exterior muy difuso (el más grande y transparente) -->
      <circle cx="32" cy="32" r="24" fill="${color}" opacity="0.15" filter="url(#halo)"/>

      <!-- Anillo medio -->
      <circle cx="32" cy="32" r="21" fill="${color}" opacity="0.25" filter="url(#halo)"/>

      <!-- Círculo principal con borde brillante -->
      <circle cx="32" cy="32" r="18" fill="${color}" filter="url(#glow)"/>

      <!-- Borde interior claro para dar profundidad -->
      <circle cx="32" cy="32" r="18" fill="none" 
        stroke="rgba(255,255,255,0.3)" stroke-width="1.5"/>

      <!-- Ícono centrado -->
      <svg x="24" y="24" width="16" height="16" viewBox="0 0 16 16">
        ${icon}
      </svg>
    </svg>
  `;
}

const BOLT_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="#FFFFFF" aria-hidden="true" id="Map-Pin--Streamline-Heroicons" height="16" width="16">
  <desc>
    Map Pin Streamline Icon: https://streamlinehq.com
  </desc>
  <path fill-rule="evenodd" d="m7.6933333333333325 14.900666666666666 0.04666666666666667 0.026666666666666665 0.018666666666666665 0.010666666666666666a0.5066666666666666 0.5066666666666666 0 0 0 0.482 0l0.018666666666666665 -0.009999999999999998 0.047333333333333324 -0.027333333333333334a11.316666666666666 11.316666666666666 0 0 0 0.7626666666666666 -0.49466666666666664 13.053333333333331 13.053333333333331 0 0 0 1.7886666666666664 -1.5213333333333332c1.2959999999999998 -1.3266666666666667 2.642 -3.3200000000000003 2.642 -5.884666666666666a5.5 5.5 0 0 0 -11 0c0 2.564 1.3466666666666667 4.558 2.642 5.884666666666666a13.053333333333331 13.053333333333331 0 0 0 1.7879999999999998 1.5213333333333332 11.316666666666666 11.316666666666666 0 0 0 0.7633333333333333 0.49466666666666664ZM8 9a2 2 0 1 0 0 -4 2 2 0 0 0 0 4Z" clip-rule="evenodd" stroke-width="0.6667"></path>
</svg>`;

const COLORS = {
  green: '#22c55e',
  orange: '#f97316',
  gray: '#6b7280',
};

const toDataUrl = (svg: string) =>
  `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
