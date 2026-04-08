import { db } from '@/lib/db';
import { ShipmentsGrid } from './ShipmentsGrid';

export default async function ShipmentsPage() {
  const simulationRuns = await db.query.simulationRuns.findMany({
    with: {
      routeMetadata: true,
    },
    orderBy: (runs, { desc }) => [desc(runs.createdAt)],
  });

  return (
    <div className="w-full h-full px-10 py-6">
      <div>
        <h1 className="text-2xl font-bold mb-4">Shipments</h1>
        <h2 className="text-lg font-semibold mb-2">Manage Your Shipments</h2>
        <p className="text-muted-foreground mb-6">
          View and manage all your shipments in one place. Use the tools below
          to filter, sort, and analyze your shipment data.
        </p>
      </div>
      <ShipmentsGrid data={simulationRuns} />
    </div>
  );
}
