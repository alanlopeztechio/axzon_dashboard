import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import type { SimulationPayload, SimulationRawJson } from '@/types';

function transformRawToPayload(
  records: Array<{ id: string; raw: unknown }>,
): SimulationPayload {
  const points: SimulationPayload['points'] = [];
  const routes: SimulationPayload['routes'] = [];

  for (const record of records) {
    const simulation = record.raw as SimulationRawJson;
    const routeName = simulation.metadata?.route_name ?? 'unknown-route';
    const sensorId = simulation.EPC ?? simulation.TID ?? record.id;
    const fileName = `${routeName}_${sensorId}.json`;
    const samples = simulation.loggedData ?? [];
    const path: [number, number][] = [];

    for (let index = 0; index < samples.length; index += 1) {
      const sample = samples[index];

      if (
        typeof sample?.longitude !== 'number' ||
        typeof sample?.latitude !== 'number'
      ) {
        continue;
      }

      const position: [number, number] = [sample.longitude, sample.latitude];
      path.push(position);

      points.push({
        id: `${record.id}-${index}`,
        sensorId,
        fileName,
        routeName,
        timestamp: sample.timestamp ?? '',
        tempInC: typeof sample.tempInC === 'number' ? sample.tempInC : null,
        position,
      });
    }

    if (path.length > 1) {
      routes.push({
        id: record.id,
        sensorId,
        fileName,
        routeName,
        path,
      });
    }
  }

  return { points, routes };
}

export async function GET() {
  try {
    const response = await db.query.simulationRawData.findMany({
      columns: {
        id: true,
        raw: true,
      },
    });
    const data = transformRawToPayload(response);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        error: 'No se pudieron leer los datos de simulación.',
        details: error instanceof Error ? error.message : 'unknown-error',
      },
      { status: 500 },
    );
  }
}
