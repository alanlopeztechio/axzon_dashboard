'use client';
import { AgGridProvider, AgGridReact } from 'ag-grid-react';
import {
  AllCommunityModule,
  ColDef,
  ClientSideRowModelModule,
  NumberFilterModule,
  TextFilterModule,
  ValidationModule,
  themeQuartz,
} from 'ag-grid-community';
import { useState } from 'react';
import Link from 'next/link';

const myTheme = themeQuartz.withParams({
  backgroundColor: 'var(--background)',
  foregroundColor: 'var(--foreground)',
  borderColor: 'var(--sidebar-border)',
  accentColor: 'var(--sidebar-accent-foreground)',
  headerTextColor: 'var(--muted-foreground)',
  fontFamily: 'var(--font-sans)',
  rowVerticalPaddingScale: 1.5,
});

const StatusBadge = (params: any) => (
  <Link href={`/logistics/shipments/${params.value}`}>
    <p className="font-bold text-[#F59F0A] cursor-pointer hover:underline">
      {params.value}
    </p>
  </Link>
);

export function ShipmentsGrid({ data }: { data: any[] }) {
  const [rowData] = useState(data);

  const [colDefs] = useState<ColDef[]>([
    {
      field: 'epc',
      headerName: 'Sensor ID (EPC)',
      cellRenderer: StatusBadge,
      filter: true,
    },
    {
      field: 'routeMetadata.routeName',
      headerName: 'Route Name',
    },
    {
      field: 'version',
      headerName: 'Version',
    },
    {
      field: 'createdAt',
      headerName: 'Date Created',
      valueFormatter: (params) =>
        params.value ? new Date(params.value).toLocaleDateString() : 'N/A',
    },
  ]);

  return (
    <AgGridProvider
      modules={[
        AllCommunityModule,
        ClientSideRowModelModule,
        NumberFilterModule,
        TextFilterModule,
        ValidationModule,
      ]}
    >
      <div className="w-full h-full">
        <div className="w-full h-full pb-10">
          <AgGridReact
            gridOptions={{
              columnDefs: colDefs,
              pagination: true,
              paginationPageSize: 50,
              paginationPageSizeSelector: [10, 20, 50, 100],
              defaultColDef: {
                flex: 1,
                minWidth: 190,
              },
            }}
            theme={myTheme}
            className="ag-theme-quartz-dark"
            rowData={rowData}
            autoGroupColumnDef={{
              minWidth: 200,
            }}
          />
        </div>
      </div>
    </AgGridProvider>
  );
}
