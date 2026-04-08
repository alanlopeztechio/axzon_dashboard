import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { db } from '@/lib/db';
import { ArrowLeft, Box, Clock, Download, Thermometer } from 'lucide-react';
import Pie from '@/components/logistics/Pie';
import ShipmentRouteMap, {
  ShipmentMapPoint,
} from '@/components/logistics/ShipmentRouteMap';

interface ShipmentDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

function formatToken(token: string): string {
  return token
    .replace(/[_-]+/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .trim();
}

function getRouteLabels(routeName: string | null | undefined): {
  compactName: string;
  subtitle: string;
} {
  if (!routeName) {
    return {
      compactName: 'Unassigned Route',
      subtitle: 'Origin pending -> Destination pending',
    };
  }

  const [originRaw, destinationRaw] = routeName.split('-');
  const origin = formatToken(originRaw ?? 'Origin');
  const destination = formatToken(destinationRaw ?? 'Destination');

  return {
    compactName: routeName,
    subtitle: `${origin} -> ${destination}`,
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function formatShortDate(value: Date | null | undefined): string {
  if (!value) {
    return '--/--/----';
  }

  return value.toLocaleDateString('en-GB');
}

function truncateText(value: string, maxLength: number): string {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength - 1)}...`;
}

const ShipmentDetailsPage = async ({ params }: ShipmentDetailsPageProps) => {
  const { id } = await params;
  const simulationRuns = await db.query.simulationRuns.findFirst({
    where: (runs, { eq }) => {
      return eq(runs.epc, id);
    },
    with: {
      routeMetadata: true,
      alarms: true,
      loggedData: {
        columns: {
          tempInC: true,
          latitude: true,
          longitude: true,
          locationName: true,
          timestamp: true,
        },
      },
    },
  });

  const routeLabels = getRouteLabels(simulationRuns?.routeMetadata?.routeName);

  const temperatures =
    simulationRuns?.loggedData
      .map((entry) => entry.tempInC)
      .filter((temp): temp is number => typeof temp === 'number') ?? [];

  const complianceScore =
    temperatures.length > 0
      ? Math.round(
          (temperatures.filter((temp) => temp >= -1 && temp <= 1).length /
            temperatures.length) *
            100,
        )
      : 81;

  const normalizedCompliance = clamp(complianceScore, 0, 100);
  const hasCriticalAlarm = simulationRuns?.alarms?.alarmAny ?? false;
  const statusLabel =
    hasCriticalAlarm || normalizedCompliance < 90 ? 'Critical' : 'Stable';

  const orderedLogs = [...(simulationRuns?.loggedData ?? [])].sort(
    (a, b) => a.timestamp.getTime() - b.timestamp.getTime(),
  );

  const mapPoints: ShipmentMapPoint[] = orderedLogs
    .filter(
      (entry) =>
        typeof entry.latitude === 'number' &&
        typeof entry.longitude === 'number',
    )
    .map((entry) => ({
      lat: entry.latitude as number,
      lng: entry.longitude as number,
    }));

  const minTemp = temperatures.length ? Math.min(...temperatures) : null;
  const maxTemp = temperatures.length ? Math.max(...temperatures) : null;

  const stopIndexes = Array.from(
    new Set([
      0,
      Math.floor((orderedLogs.length - 1) / 2),
      Math.max(orderedLogs.length - 1, 0),
    ]),
  ).filter((index) => index >= 0 && index < orderedLogs.length);

  const timelineStops = stopIndexes.map((entryIndex, index) => {
    const entry = orderedLogs[entryIndex];
    const role =
      index === 0
        ? 'Origin'
        : index === stopIndexes.length - 1
          ? 'Destination'
          : 'Waypoint';

    return {
      step: index,
      label: truncateText(entry.locationName ?? `Stop ${entryIndex + 1}`, 16),
      role,
      date: formatShortDate(entry.timestamp),
    };
  });

  return (
    <div className="space-y-6 px-4 py-6 md:px-8 lg:px-10">
      <header className="p-4 md:p-5">
        <div className="flex flex-row gap-4 justify-between flex-wrap">
          <div className="flex items-start gap-4">
            <Link
              href="/logistics/shipments"
              className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#20446b] bg-[#071a36] text-[#dbeafe] transition-colors hover:border-[#3b6ea8] hover:bg-[#0c2446]"
              aria-label="Back to shipments"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>

            <div className="space-y-1">
              <h1 className="text-xl font-bold leading-tight md:text-[2rem]">
                {simulationRuns?.epc ?? id}
                <span className="mx-2 text-[#6e85a3]">&middot;</span>
                {routeLabels.compactName}
              </h1>
              <p className="text-sm md:text-xl">{routeLabels.subtitle}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Pie value={normalizedCompliance} />

            <div className="space-y-1">
              <p className="text-xl leading-none">Compliance</p>
              <span
                className={
                  statusLabel === 'Critical'
                    ? 'inline-flex rounded-md border border-[#e75b66]/60 px-2.5 py-1 text-lg font-semibold text-[#ff727c]'
                    : 'inline-flex rounded-md border border-[#39b986]/60 px-2.5 py-1 text-lg font-semibold text-[#56d8a3]'
                }
              >
                {statusLabel}
              </span>
            </div>

            <Button
              type="button"
              variant="outline"
              className="h-10 border-[#26466a] bg-[#061d3a] px-4 text-base font-semibold text-[#f3f8ff] hover:border-[#3f6fa4] hover:bg-[#0b2a52] hover:text-white"
            >
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex flex-row items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#103742] p-2">
              <Thermometer className="text-chart-1" />
            </div>
            <div className="flex flex-col gap-2">
              <p>Min Temp</p>
              <p>- 2.4 C</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-row items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#103742] p-2">
              <Thermometer className="text-chart-1" />
            </div>
            <div className="flex flex-col gap-2">
              <p>Max Temp</p>
              <p>1.3 C</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-row items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#103742] p-2">
              <Thermometer className="text-chart-1" />
            </div>
            <div className="flex flex-col gap-2">
              <p>Avg Temp</p>
              <p>1.3 C</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-row items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#103742] p-2">
              <Clock className="text-chart-1" />
            </div>
            <div className="flex flex-col gap-2">
              <p>Duration</p>
              <p>62.4 hours</p>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card>
          <CardContent>
            <h2 className="text-2xl font-bold">Route Map</h2>
            <p className="mt-2 text-xl">
              Temp: {minTemp !== null ? minTemp.toFixed(2) : '--.--'}C to{' '}
              {maxTemp !== null ? maxTemp.toFixed(2) : '--.--'}C
            </p>

            <div className="mt-6">
              <ShipmentRouteMap points={mapPoints} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex items-center gap-3">
              <Box className="h-5 w-5 text-white" />
              <h2 className="text-2xl font-bold">Stops Timeline</h2>
            </div>

            {timelineStops.length > 0 ? (
              <>
                <div className="relative mt-8">
                  <div className="absolute left-6 right-6 top-6 h-0.5 bg-[#1f3d62]" />
                  <div
                    className="relative grid gap-4"
                    style={{
                      gridTemplateColumns: `repeat(${timelineStops.length}, minmax(0, 1fr))`,
                    }}
                  >
                    {timelineStops.map((stop) => (
                      <div
                        key={`${stop.step}-${stop.label}`}
                        className="text-center"
                      >
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#00d2cd] bg-[#072042] text-3xl font-semibold text-[#00d2cd]">
                          {stop.step}
                        </div>
                        <p className="mt-4 text-[2rem] font-semibold leading-tight text-white">
                          {stop.label}
                        </p>
                        <p className="mt-1 text-3xl text-[#9dc0e9]">
                          {stop.role}
                        </p>
                        <p className="mt-2 text-xl text-[#7ea4d3]">
                          {stop.date}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 h-3 rounded-full var(--background)">
                  <div className="h-full w-1/2 rounded-full bg-linear-to-r from-[#3f5578] to-[#304b72]" />
                </div>
              </>
            ) : (
              <div className="mt-8 rounded-xl border  var(--background) p-6">
                No timeline data available for this shipment.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ShipmentDetailsPage;
