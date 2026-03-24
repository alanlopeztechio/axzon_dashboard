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

export type SimulationInventoryEntry = {
  readerTimestamp: string;
  readerHost: string;
  readerMAC: string;
  readerLatitude: number;
  readerLongitude: number;
  readerAccuracyInMeters: number;
  adminArea: string;
  countryCode: string;
  countryName: string;
  featureName: string;
  locality: string;
  postalCode: string;
  subAdminArea: string;
  subLocality: string;
  subThoroughfare: string;
  thoroughfare: string;
  readerChannel: number;
  readerRSSI: number;
  tagPacketPC: string;
  tagXPC_W1: string;
  tagTemperatureInC: number;
  tagBatteryPresent: boolean;
  tagBatteryVoltage: number;
  tagSensorCode: number;
  tagOnChipRSSI: number;
  loggerState: string;
  loggerRtc: string;
  loggerNextSample: number;
};

export type SimulationConfiguration = {
  logIntervalInSeconds: number;
  logDelayedStartInSamples: number;
  logNumberOfSamples: number;
  temperatureLowerLimit: number;
  temperatureLowerLimitAlarmDelay: number;
  temperatureUpperLimit: number;
  temperatureUpperLimitAlarmDelay: number;
  ledEnabled: boolean;
  ledMode: string;
  ledOffTimeInSeconds: number;
  ledOnTimeInMilliseconds: number;
  fingerSpotEnabled: boolean;
  fingerSpotForLoggerArming: boolean;
  antiTamperEnabled: boolean;
  antiTamperpolarity: string;
};

export type SimulationArming = {
  armStatus: string;
  armErrorNumber: number;
  armErrorMessage: string | null;
  armTimestamp: string;
  armFingerSpotTimestamp: string | null;
};

export type SimulationAlarms = {
  alarmAny: boolean;
  alarmTemperature: boolean;
  alarmLowTemperature: boolean;
  alarmHighTemperature: boolean;
  alarmTamper: boolean;
  alarmLowBattery: boolean;
  alarmInitialBattery: boolean;
  alarmTemperatureTimestamp: string | null;
  alarmTemperatureValue: number | null;
  alarmTamperTimestamp: string | null;
  alarmBatteryTimestamp: string | null;
};

export type SimulationLoggedDataEntry = {
  timestamp: string;
  tempInC: number;
  tamper: boolean;
  latitude: number;
  longitude: number;
  locationName?: string;
};

export type SimulationMetadata = {
  route_name: string;
  use_real_route: boolean;
  transport_mode: string;
  distribution_type: string;
  total_distance_km: number;
  company_id: number | string | null;
  route_id: number;
};

export type SimulationRawJson = {
  version: string;
  EPC: string;
  TID: string;
  inventories: SimulationInventoryEntry[];
  configuration: SimulationConfiguration;
  arming: SimulationArming;
  alarms: SimulationAlarms;
  loggedData: SimulationLoggedDataEntry[];
  metadata: SimulationMetadata;
  reeferId: string;
  sectionId: number;
};
