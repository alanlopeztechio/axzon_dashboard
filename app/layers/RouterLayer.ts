import { PathLayer } from '@deck.gl/layers';
import { SensorRoute } from '../types';
import { getAxzonColor } from '../utils';

export function getRouterLayer(data: SensorRoute[]) {
  const commonProps = {
    data,
    getPath: (d: SensorRoute) => d.path,
    jointRounded: true,
    capRounded: true,
    billboard: false,
    miterLimit: 2,
    parameters: {
      blend: true,
      blendFunc: [770, 771, 1, 771],
    },
  };

  // const glowOuter = new PathLayer({
  //   ...commonProps,
  //   id: 'sensor-routes-glow-outer',
  //   pickable: false,
  //   getWidth: 18,
  //   widthUnits: 'pixels',
  //   widthMinPixels: 8,
  //   widthMaxPixels: 18,
  //   getColor: (d: SensorRoute) => {
  //     const [r, g, b] = getAxzonColor(d.sensorId);
  //     return [r, g, b, 25];
  //   },
  // });

  // const glowInner = new PathLayer({
  //   ...commonProps,
  //   id: 'sensor-routes-glow-inner',
  //   pickable: false,
  //   getWidth: 9,
  //   widthUnits: 'pixels',
  //   widthMinPixels: 4,
  //   widthMaxPixels: 9,
  //   getColor: (d: SensorRoute) => {
  //     const [r, g, b] = getAxzonColor(d.sensorId);
  //     return [r, g, b, 70];
  //   },
  // });

  const core = new PathLayer({
    ...commonProps,
    id: 'sensor-routes-core',
    pickable: true,
    getWidth: 3,
    widthUnits: 'pixels',
    widthMinPixels: 1,
    widthMaxPixels: 3,
    getColor: (d: SensorRoute) => {
      const [r, g, b] = getAxzonColor(d.sensorId);
      return [r, g, b, 230];
    },
    transitions: {
      getColor: {
        duration: 400,
        easing: (t: number) => t * t * t,
      },
    },
  });

  // const highlight = new PathLayer({
  //   ...commonProps,
  //   id: 'sensor-routes-highlight',
  //   pickable: false,
  //   getWidth: 1,
  //   widthUnits: 'pixels',
  //   widthMinPixels: 1,
  //   widthMaxPixels: 1,
  //   getColor: (_d: SensorRoute) =>
  //     [255, 255, 255, 180] as [number, number, number, number],
  // });

  return [
    //glowOuter,
    //glowInner,
    core,
    //highlight,
  ];
}
