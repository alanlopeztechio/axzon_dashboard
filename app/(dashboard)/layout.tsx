import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();

  if (!claims) {
    redirect('/login');
  }

  return <>{children}</>;
}
