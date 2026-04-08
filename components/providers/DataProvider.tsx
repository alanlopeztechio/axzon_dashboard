'use client';
import { SimulationPayload } from '@/types';
import { createContext, useContext } from 'react';

const DataContext = createContext<SimulationPayload | null>(null);

export function DataProvider({
  children,
  data,
}: {
  children: React.ReactNode;
  data: SimulationPayload;
}) {
  return <DataContext.Provider value={data}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
