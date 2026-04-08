import { db } from '@/lib/db';
import { ArrowLeft, Thermometer } from 'lucide-react';

interface ShipmentDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

const ShipmentDetailsPage = async ({ params }: ShipmentDetailsPageProps) => {
  const { id } = await params;
  const simulationRuns = await db.query.simulationRuns.findFirst({
    where: (runs, { eq }) => {
      return eq(runs.epc, id);
    },
  });
  return (
    <div>
      <div>
        <ArrowLeft className="h-5 w-5 hover:bg-gray-200 hover:text-black" />
        <h1 className="text-2xl font-bold">
          {simulationRuns?.epc} · {simulationRuns?.tid}
        </h1>
      </div>
      <div>
        <div>
          <Thermometer />
        </div>
      </div>
    </div>
  );
};

export default ShipmentDetailsPage;
