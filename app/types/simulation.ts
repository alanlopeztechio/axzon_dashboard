export type SensorPoint = {
  id: string;
  sensorId: string;
  fileName: string;
  routeName: string;
  timestamp: string;
  tempInC: number | null;
  position: [number, number];
};

export type SensorRoute = {
  id: string;
  sensorId: string;
  fileName: string;
  routeName: string;
  path: [number, number][];
};

export type SimulationPayload = {
  points: SensorPoint[];
  routes: SensorRoute[];
};
