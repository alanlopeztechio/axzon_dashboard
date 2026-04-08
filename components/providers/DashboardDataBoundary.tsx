import { DataProvider } from '@/components/providers/DataProvider';
import { getData } from '@/lib/data/simulation';

export async function DashboardDataBoundary({
  children,
}: {
  children: React.ReactNode;
}) {
  const payload = await getData();

  return <DataProvider data={payload!}>{children}</DataProvider>;
}
