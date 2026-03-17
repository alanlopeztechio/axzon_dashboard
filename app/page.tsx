'use client';

import { useState, useCallback, useMemo } from 'react';
import {
  Activity,
  AlertTriangle,
  Radar,
  Route,
  Thermometer,
} from 'lucide-react';
import { LoadingOverlay } from './components';
import {
  ActivityCalendarCard,
  AnomalyFeedCard,
  CalendarCell,
  DashboardSidebar,
  DashboardTopbar,
  FleetHealthTrendCard,
  FleetMapPanel,
  HourlyDistributionCard,
  MetricsGrid,
  SystemHealthCard,
} from './components/dashboard';
import { useSimulationData } from './hooks';
import { SensorPoint, SensorRoute } from './types';

const ANOMALY_THRESHOLD = 30;

export default function Home() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState('Cargando mapa...');
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const handleLoadingChange = useCallback((loading: boolean) => {
    setIsLoading(loading);
    if (!loading) {
      setLastUpdate(new Date());
    }
  }, []);

  const handleLoadingMessageChange = useCallback((message: string) => {
    setLoadingMessage(message);
  }, []);

  const { data: simulationData } = useSimulationData({
    onLoadingChange: handleLoadingChange,
    onLoadingMessageChange: handleLoadingMessageChange,
  });

  const analytics = useMemo(() => {
    const points = simulationData.points;
    const routes = simulationData.routes;

    const pointsWithTemp = points.filter(
      (point): point is SensorPoint & { tempInC: number } =>
        typeof point.tempInC === 'number',
    );

    const validatedReadings = pointsWithTemp.filter(
      (point) => point.tempInC <= ANOMALY_THRESHOLD,
    );
    const anomalousReadings = pointsWithTemp.filter(
      (point) => point.tempInC > ANOMALY_THRESHOLD,
    );

    const avgTemp =
      pointsWithTemp.length > 0
        ? pointsWithTemp.reduce((sum, point) => sum + point.tempInC, 0) /
          pointsWithTemp.length
        : null;

    const latestTimestamp = points.reduce<Date | null>((latest, point) => {
      const current = new Date(point.timestamp);
      if (Number.isNaN(current.getTime())) {
        return latest;
      }
      return !latest || current > latest ? current : latest;
    }, null);

    const uniqueSensors = new Set(points.map((point) => point.sensorId)).size;
    const impactedRoutes = new Set(
      anomalousReadings.map((point) => `${point.sensorId}-${point.routeName}`),
    ).size;

    const routeMetrics = dedupeRoutes(routes).map((route) => {
      const routePoints = pointsWithTemp.filter(
        (point) =>
          point.sensorId === route.sensorId &&
          point.routeName === route.routeName,
      );
      const anomalyCount = routePoints.filter(
        (point) => point.tempInC > ANOMALY_THRESHOLD,
      ).length;
      const maxTemp =
        routePoints.length > 0
          ? Math.max(...routePoints.map((point) => point.tempInC))
          : null;

      return {
        id: route.id,
        routeName: route.routeName,
        sensorId: route.sensorId,
        anomalyCount,
        maxTemp,
        series: routePoints.slice(-12).map((point) => point.tempInC),
      };
    });

    const dailyBuckets = new Map<string, { total: number; valid: number }>();

    pointsWithTemp.forEach((point) => {
      const date = new Date(point.timestamp);
      if (Number.isNaN(date.getTime())) {
        return;
      }
      const key = date.toISOString().slice(0, 10);
      const bucket = dailyBuckets.get(key) ?? { total: 0, valid: 0 };
      bucket.total += 1;
      if (point.tempInC <= ANOMALY_THRESHOLD) {
        bucket.valid += 1;
      }
      dailyBuckets.set(key, bucket);
    });

    const fleetHealthTrend = Array.from(dailyBuckets.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-7)
      .map(([dateKey, bucket]) => ({
        label: new Date(`${dateKey}T00:00:00`).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }),
        value:
          bucket.total > 0
            ? Math.round((bucket.valid / bucket.total) * 100)
            : 0,
      }));

    const hourBuckets = Array.from({ length: 24 }, (_, hour) => ({
      hour,
      total: 0,
    }));

    points.forEach((point) => {
      const date = new Date(point.timestamp);
      if (Number.isNaN(date.getTime())) {
        return;
      }
      hourBuckets[date.getHours()].total += 1;
    });

    const hourlyDistribution = hourBuckets.map(({ hour, total }) => ({
      hour: `${hour.toString().padStart(2, '0')}:00`,
      value: total,
    }));

    const calendarReference = latestTimestamp ?? new Date();
    const calendarCells = buildCalendarCells(calendarReference, pointsWithTemp);

    return {
      totalReadings: points.length,
      validatedReadings: validatedReadings.length,
      anomalousReadings: anomalousReadings.length,
      validatedPct:
        pointsWithTemp.length > 0
          ? Math.round((validatedReadings.length / pointsWithTemp.length) * 100)
          : 0,
      anomalyPct:
        pointsWithTemp.length > 0
          ? Math.round((anomalousReadings.length / pointsWithTemp.length) * 100)
          : 0,
      avgTemp,
      activeSensors: uniqueSensors,
      impactedRoutes,
      latestTimestamp,
      anomalyFeed: routeMetrics
        .filter((route) => route.anomalyCount > 0)
        .sort(
          (a, b) =>
            b.anomalyCount - a.anomalyCount ||
            (b.maxTemp ?? 0) - (a.maxTemp ?? 0),
        )
        .slice(0, 5),
      fleetHealthTrend,
      hourlyDistribution,
      calendarMonthLabel: calendarReference.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      }),
      calendarCells,
    };
  }, [simulationData]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#102449_0%,#060c1e_36%,#030711_100%)] text-white">
      {/* <DashboardSidebar
        mobileOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      /> */}

      <main>
        <div className="px-4 w-full py-4 sm:px-6 lg:px-8 grid grid-cols-6 grid-rows-4 gap-2">
          {/* <DashboardTopbar
            validatedPct={analytics.validatedPct}
            anomalousPct={analytics.anomalyPct}
            lastUpdate={lastUpdate ?? analytics.latestTimestamp}
            onMenuClick={() => setMobileSidebarOpen(true)}
          /> */}

          <MetricsGrid
            items={[
              {
                label: 'Active sensors',
                value: analytics.activeSensors.toLocaleString(),
                helper: `${simulationData.routes.length.toLocaleString()} routes reporting`,
                badge: 'Live devices',
                accent: 'cyan',
                icon: <Radar className="h-5 w-5 text-[#B50404]" />,
              },
              {
                label: 'Average temperature',
                value:
                  analytics.avgTemp === null
                    ? 'N/A'
                    : `${analytics.avgTemp.toFixed(1)}°C`,
                helper: 'Cross-route thermal average',
                badge: 'Thermal',
                accent: 'teal',
                icon: <Thermometer className="h-5 w-5" />,
              },
              {
                label: 'Captured readings',
                value: analytics.totalReadings.toLocaleString(),
                helper: `${analytics.validatedReadings.toLocaleString()} readings in safe range`,
                badge: 'Telemetry',
                accent: 'amber',
                icon: <Activity className="h-5 w-5" />,
              },
              {
                label: 'Anomalies detected',
                value: analytics.anomalousReadings.toLocaleString(),
                helper: `${analytics.impactedRoutes.toLocaleString()} impacted routes`,
                badge: 'Attention',
                accent: 'rose',
                icon: <AlertTriangle className="h-5 w-5" />,
              },
            ]}
          />

          <div className="col-span-4 row-span-2 col-start-3">
            {/* <FleetHealthTrendCard points={analytics.fleetHealthTrend} /> */}
            <FleetMapPanel
              points={simulationData.points}
              routes={simulationData.routes}
            />
          </div>

          <div className="col-span-4 row-span-2 col-start-3 row-start-3">
            <SystemHealthCard
              totalReadings={analytics.totalReadings}
              validatedReadings={analytics.validatedReadings}
              anomalousReadings={analytics.anomalousReadings}
              avgTemp={analytics.avgTemp}
              impactedRoutes={analytics.impactedRoutes}
            />
            {/* <AnomalyFeedCard items={analytics.anomalyFeed} /> */}
          </div>

          {/* <div className="mt-5 grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
            <ActivityCalendarCard
              monthLabel={analytics.calendarMonthLabel}
              cells={analytics.calendarCells as CalendarCell[]}
            />
            <HourlyDistributionCard hours={analytics.hourlyDistribution} />
          </div> */}
        </div>
      </main>

      {isLoading && <LoadingOverlay message={loadingMessage} />}
    </div>
  );
}

function dedupeRoutes(routes: SensorRoute[]) {
  return Array.from(
    new Map(
      routes.map((route) => [`${route.sensorId}-${route.routeName}`, route]),
    ).values(),
  );
}

function buildCalendarCells(
  referenceDate: Date,
  points: Array<SensorPoint & { tempInC: number }>,
) {
  const year = referenceDate.getFullYear();
  const month = referenceDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const offset = firstDay.getDay();

  const activityMap = new Map<string, { total: number; anomalies: number }>();

  points.forEach((point) => {
    const date = new Date(point.timestamp);
    if (
      Number.isNaN(date.getTime()) ||
      date.getFullYear() !== year ||
      date.getMonth() !== month
    ) {
      return;
    }

    const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    const bucket = activityMap.get(key) ?? { total: 0, anomalies: 0 };
    bucket.total += 1;
    if (point.tempInC > ANOMALY_THRESHOLD) {
      bucket.anomalies += 1;
    }
    activityMap.set(key, bucket);
  });

  const emptyPrefix = Array.from({ length: offset }, (_, index) => ({
    key: `empty-${index}`,
    label: '',
    tone: 'empty' as const,
    isToday: false,
  }));

  const monthCells = Array.from({ length: daysInMonth }, (_, index) => {
    const day = index + 1;
    const key = `${year}-${month}-${day}`;
    const bucket = activityMap.get(key);
    const tone = !bucket
      ? 'idle'
      : bucket.anomalies > 0
        ? 'critical'
        : bucket.total > 10
          ? 'warn'
          : 'active';

    return {
      key,
      label: day.toString(),
      tone,
      isToday:
        day === referenceDate.getDate() &&
        month === referenceDate.getMonth() &&
        year === referenceDate.getFullYear(),
    };
  });

  return [...emptyPrefix, ...monthCells];
}
