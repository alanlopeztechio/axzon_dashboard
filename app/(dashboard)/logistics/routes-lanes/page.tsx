import { RouteIcon, TrendingUp, ArrowRightLeft } from 'lucide-react';

export default function RoutesAndLanesPage() {
  return (
    <div className="p-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Routes & Lanes</h1>
        <p className="text-muted-foreground">
          Top origin-destination corridors and shipment flow performance.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-2xl border p-5">
          <div className="mb-3 flex items-center gap-3">
            <div className="rounded-xl bg-[#103742] p-3">
              <RouteIcon className="text-chart-1" />
            </div>
            <h2 className="text-lg font-semibold">Top Lane</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Monterrey -&gt; Dallas
          </p>
          <p className="mt-2 text-3xl font-bold">8,420</p>
          <p className="text-sm text-emerald-500">+6.3% vs last month</p>
        </div>

        <div className="rounded-2xl border p-5">
          <div className="mb-3 flex items-center gap-3">
            <div className="rounded-xl bg-[#103742] p-3">
              <ArrowRightLeft className="text-chart-1" />
            </div>
            <h2 className="text-lg font-semibold">Average Transit Time</h2>
          </div>
          <p className="text-sm text-muted-foreground">Across active lanes</p>
          <p className="mt-2 text-3xl font-bold">2.8 days</p>
          <p className="text-sm text-amber-500">+0.2 days vs target</p>
        </div>

        <div className="rounded-2xl border p-5 md:col-span-2">
          <div className="mb-3 flex items-center gap-3">
            <div className="rounded-xl bg-[#103742] p-3">
              <TrendingUp className="text-chart-1" />
            </div>
            <h2 className="text-lg font-semibold">Lane Efficiency Summary</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            71% of lanes are in stable performance range, 19% require review and
            10% are under optimization actions.
          </p>
        </div>
      </div>
    </div>
  );
}
