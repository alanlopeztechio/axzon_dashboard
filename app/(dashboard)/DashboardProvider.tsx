'use client';

import { AppSidebar } from '@/components/app-sidebar';
import { DataProvider } from '@/components/providers/DataProvider';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { SimulationPayload } from '@/types';

export function DashboardProvider({
  children,
  data,
  pathname,
}: {
  children: React.ReactNode;
  data: SimulationPayload;
  pathname: string;
}) {
  return (
    <DataProvider data={data}>
      <SidebarProvider>
        <AppSidebar pathname={pathname} />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
          </header>
          {children}
        </SidebarInset>
      </SidebarProvider>
    </DataProvider>
  );
}
