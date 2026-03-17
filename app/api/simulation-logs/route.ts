import { NextResponse } from 'next/server';
import { promises as fs } from 'node:fs';
import path from 'node:path';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type LoggedDataPoint = {
  timestamp?: string;
  tempInC?: number;
  latitude?: number;
  longitude?: number;
};

type SimulationFile = {
  EPC?: string;
  metadata?: {
    route_name?: string;
  };
  loggedData?: LoggedDataPoint[];
};

type MapPoint = {
  id: string;
  sensorId: string;
  fileName: string;
  routeName: string;
  timestamp: string;
  tempInC: number | null;
  position: [number, number];
};

type MapRoute = {
  id: string;
  sensorId: string;
  fileName: string;
  routeName: string;
  path: [number, number][];
};

type SimulationResponse = {
  points: MapPoint[];
  routes: MapRoute[];
};

async function readSimulationLogs(): Promise<SimulationResponse> {
  const simulationDir = path.resolve(process.cwd(), 'simulation_outputs');

  try {
    await fs.access(simulationDir);
  } catch {
    console.error('Directorio no encontrado:', simulationDir);
    return { points: [], routes: [] };
  }

  const entries = await fs.readdir(simulationDir, { withFileTypes: true });
  const fileNames = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.json'))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));

  console.log(`Encontrados ${fileNames.length} archivos JSON`);

  const points: MapPoint[] = [];
  const routes: MapRoute[] = [];

  for (const fileName of fileNames) {
    const absolutePath = path.join(simulationDir, fileName);
    const raw = await fs.readFile(absolutePath, 'utf8');

    let parsed: SimulationFile;
    try {
      parsed = JSON.parse(raw) as SimulationFile;
    } catch {
      continue;
    }

    const sensorId = parsed.EPC ?? fileName.replace('.json', '');
    const routeName = parsed.metadata?.route_name ?? 'unknown-route';
    const rawPoints = parsed.loggedData ?? [];

    const routePath: [number, number][] = [];

    for (let index = 0; index < rawPoints.length; index += 1) {
      console.log(
        `Procesando ${fileName}: punto ${index + 1} de ${rawPoints.length}`,
      );
      const sample = rawPoints[index];
      if (
        typeof sample.longitude !== 'number' ||
        typeof sample.latitude !== 'number'
      ) {
        continue;
      }

      const position: [number, number] = [sample.longitude, sample.latitude];
      routePath.push(position);

      points.push({
        id: `${fileName}-${index}`,
        sensorId,
        fileName,
        routeName,
        timestamp: sample.timestamp ?? '',
        tempInC: typeof sample.tempInC === 'number' ? sample.tempInC : null,
        position,
      });
    }

    if (routePath.length > 1) {
      routes.push({
        id: fileName,
        sensorId,
        fileName,
        routeName,
        path: routePath,
      });
    }
  }

  console.log(`Procesados: ${routes.length} rutas, ${points.length} puntos`);
  return { points, routes };
}

export async function GET() {
  try {
    const data = await readSimulationLogs();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        error: 'No se pudieron leer los archivos de simulation_outputs.',
        details: error instanceof Error ? error.message : 'unknown-error',
      },
      { status: 500 },
    );
  }
}
