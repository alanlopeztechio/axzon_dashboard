import {
  pgTable,
  uuid,
  text,
  timestamp,
  jsonb,
  doublePrecision,
  integer,
  boolean,
  real,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ─── Enums ───

export const transportModeEnum = pgEnum('transport_mode', [
  'driving-car',
  'driving-hgv',
  'cycling-regular',
  'foot-walking',
]);

export const armStatusEnum = pgEnum('arm_status', [
  'SUCCESSFUL',
  'FAILED',
  'PENDING',
]);

export const loggerStateEnum = pgEnum('logger_state', [
  'LOGGING',
  'STOPPED',
  'ARMED',
  'IDLE',
]);

export const ledModeEnum = pgEnum('led_mode', [
  'ON_DEMAND',
  'ALWAYS_ON',
  'ALWAYS_OFF',
]);

export const tamperPolarityEnum = pgEnum('tamper_polarity', [
  'DETECT_CONNECTION_OR_LIGHT',
  'DETECT_DISCONNECTION_OR_DARK',
]);

// ─── Simulation Runs ───

export const simulationRuns = pgTable('simulation_runs', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull(),
  version: text('version').notNull(),
  epc: text('epc').notNull(),
  tid: text('tid').notNull(),
  reeferId: uuid('reefer_id'),
  sectionId: integer('section_id'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// ─── Raw JSON (JSON completo sin procesar) ───

export const simulationRawData = pgTable('simulation_raw_data', {
  id: uuid('id').defaultRandom().primaryKey(),
  simulationRunId: uuid('simulation_run_id').references(() => simulationRuns.id, { onDelete: 'cascade' }).notNull().unique(),
  raw: jsonb('raw').notNull(),
  uploadedAt: timestamp('uploaded_at', { withTimezone: true }).defaultNow().notNull(),
});

// ─── Route Metadata ───

export const routeMetadata = pgTable('route_metadata', {
  id: uuid('id').defaultRandom().primaryKey(),
  simulationRunId: uuid('simulation_run_id').references(() => simulationRuns.id, { onDelete: 'cascade' }).notNull(),
  routeName: text('route_name').notNull(),
  routeId: integer('route_id'),
  companyId: text('company_id'),
  useRealRoute: boolean('use_real_route').default(true),
  transportMode: transportModeEnum('transport_mode'),
  distributionType: text('distribution_type'),
  totalDistanceKm: doublePrecision('total_distance_km'),
});

// ─── Tag Configuration ───

export const tagConfigurations = pgTable('tag_configurations', {
  id: uuid('id').defaultRandom().primaryKey(),
  simulationRunId: uuid('simulation_run_id').references(() => simulationRuns.id, { onDelete: 'cascade' }).notNull(),
  logIntervalInSeconds: integer('log_interval_in_seconds'),
  logDelayedStartInSamples: integer('log_delayed_start_in_samples'),
  logNumberOfSamples: integer('log_number_of_samples'),
  temperatureLowerLimit: real('temperature_lower_limit'),
  temperatureLowerLimitAlarmDelay: integer('temperature_lower_limit_alarm_delay'),
  temperatureUpperLimit: real('temperature_upper_limit'),
  temperatureUpperLimitAlarmDelay: integer('temperature_upper_limit_alarm_delay'),
  ledEnabled: boolean('led_enabled'),
  ledMode: ledModeEnum('led_mode'),
  ledOffTimeInSeconds: integer('led_off_time_in_seconds'),
  ledOnTimeInMilliseconds: integer('led_on_time_in_milliseconds'),
  fingerSpotEnabled: boolean('finger_spot_enabled'),
  fingerSpotForLoggerArming: boolean('finger_spot_for_logger_arming'),
  antiTamperEnabled: boolean('anti_tamper_enabled'),
  antiTamperPolarity: tamperPolarityEnum('anti_tamper_polarity'),
});

// ─── Arming ───

export const armingRecords = pgTable('arming_records', {
  id: uuid('id').defaultRandom().primaryKey(),
  simulationRunId: uuid('simulation_run_id').references(() => simulationRuns.id, { onDelete: 'cascade' }).notNull(),
  armStatus: armStatusEnum('arm_status'),
  armErrorNumber: integer('arm_error_number'),
  armErrorMessage: text('arm_error_message'),
  armTimestamp: timestamp('arm_timestamp', { withTimezone: true }),
  armFingerSpotTimestamp: timestamp('arm_finger_spot_timestamp', { withTimezone: true }),
});

// ─── Alarms ───

export const alarmRecords = pgTable('alarm_records', {
  id: uuid('id').defaultRandom().primaryKey(),
  simulationRunId: uuid('simulation_run_id').references(() => simulationRuns.id, { onDelete: 'cascade' }).notNull(),
  alarmAny: boolean('alarm_any').default(false),
  alarmTemperature: boolean('alarm_temperature').default(false),
  alarmLowTemperature: boolean('alarm_low_temperature').default(false),
  alarmHighTemperature: boolean('alarm_high_temperature').default(false),
  alarmTamper: boolean('alarm_tamper').default(false),
  alarmLowBattery: boolean('alarm_low_battery').default(false),
  alarmInitialBattery: boolean('alarm_initial_battery').default(false),
  alarmTemperatureTimestamp: timestamp('alarm_temperature_timestamp', { withTimezone: true }),
  alarmTemperatureValue: real('alarm_temperature_value'),
  alarmTamperTimestamp: timestamp('alarm_tamper_timestamp', { withTimezone: true }),
  alarmBatteryTimestamp: timestamp('alarm_battery_timestamp', { withTimezone: true }),
});

// ─── Inventories (reader scans) ───

export const inventories = pgTable('inventories', {
  id: uuid('id').defaultRandom().primaryKey(),
  simulationRunId: uuid('simulation_run_id').references(() => simulationRuns.id, { onDelete: 'cascade' }).notNull(),
  readerTimestamp: timestamp('reader_timestamp', { withTimezone: true }).notNull(),
  readerHost: text('reader_host'),
  readerMac: text('reader_mac'),
  readerLatitude: doublePrecision('reader_latitude'),
  readerLongitude: doublePrecision('reader_longitude'),
  readerAccuracyInMeters: real('reader_accuracy_in_meters'),
  countryCode: text('country_code'),
  countryName: text('country_name'),
  locality: text('locality'),
  readerChannel: integer('reader_channel'),
  readerRssi: real('reader_rssi'),
  tagPacketPc: text('tag_packet_pc'),
  tagXpcW1: text('tag_xpc_w1'),
  tagTemperatureInC: real('tag_temperature_in_c'),
  tagBatteryPresent: boolean('tag_battery_present'),
  tagBatteryVoltage: real('tag_battery_voltage'),
  tagSensorCode: integer('tag_sensor_code'),
  tagOnChipRssi: integer('tag_on_chip_rssi'),
  loggerState: loggerStateEnum('logger_state'),
  loggerRtc: timestamp('logger_rtc', { withTimezone: true }),
  loggerNextSample: integer('logger_next_sample'),
});

// ─── Logged Data (sensor readings along the route) ───

export const loggedData = pgTable('logged_data', {
  id: uuid('id').defaultRandom().primaryKey(),
  simulationRunId: uuid('simulation_run_id').references(() => simulationRuns.id, { onDelete: 'cascade' }).notNull(),
  timestamp: timestamp('timestamp', { withTimezone: true }).notNull(),
  tempInC: real('temp_in_c'),
  tamper: boolean('tamper').default(false),
  latitude: doublePrecision('latitude'),
  longitude: doublePrecision('longitude'),
  locationName: text('location_name'),
});

// ─── Relations ───

export const simulationRunsRelations = relations(simulationRuns, ({ one, many }) => ({
  rawData: one(simulationRawData),
  routeMetadata: one(routeMetadata),
  tagConfiguration: one(tagConfigurations),
  arming: one(armingRecords),
  alarms: one(alarmRecords),
  inventories: many(inventories),
  loggedData: many(loggedData),
}));

export const simulationRawDataRelations = relations(simulationRawData, ({ one }) => ({
  simulationRun: one(simulationRuns, {
    fields: [simulationRawData.simulationRunId],
    references: [simulationRuns.id],
  }),
}));

export const routeMetadataRelations = relations(routeMetadata, ({ one }) => ({
  simulationRun: one(simulationRuns, {
    fields: [routeMetadata.simulationRunId],
    references: [simulationRuns.id],
  }),
}));

export const tagConfigurationsRelations = relations(tagConfigurations, ({ one }) => ({
  simulationRun: one(simulationRuns, {
    fields: [tagConfigurations.simulationRunId],
    references: [simulationRuns.id],
  }),
}));

export const armingRecordsRelations = relations(armingRecords, ({ one }) => ({
  simulationRun: one(simulationRuns, {
    fields: [armingRecords.simulationRunId],
    references: [simulationRuns.id],
  }),
}));

export const alarmRecordsRelations = relations(alarmRecords, ({ one }) => ({
  simulationRun: one(simulationRuns, {
    fields: [alarmRecords.simulationRunId],
    references: [simulationRuns.id],
  }),
}));

export const inventoriesRelations = relations(inventories, ({ one }) => ({
  simulationRun: one(simulationRuns, {
    fields: [inventories.simulationRunId],
    references: [simulationRuns.id],
  }),
}));

export const loggedDataRelations = relations(loggedData, ({ one }) => ({
  simulationRun: one(simulationRuns, {
    fields: [loggedData.simulationRunId],
    references: [simulationRuns.id],
  }),
}));

// ─── Types ───

export type SimulationRun = typeof simulationRuns.$inferSelect;
export type SimulationRawData = typeof simulationRawData.$inferSelect;
export type NewSimulationRun = typeof simulationRuns.$inferInsert;
export type RouteMetadata = typeof routeMetadata.$inferSelect;
export type Inventory = typeof inventories.$inferSelect;
export type LoggedDataEntry = typeof loggedData.$inferSelect;
export type AlarmRecord = typeof alarmRecords.$inferSelect;
export type TagConfiguration = typeof tagConfigurations.$inferSelect;
export type ArmingRecord = typeof armingRecords.$inferSelect;
