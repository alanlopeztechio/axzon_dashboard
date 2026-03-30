'use client';

import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// CardRoute Skeleton - Para la lista de rutas
export const CardRouteSkeleton = () => (
  <SkeletonTheme baseColor="#f0f0f0" highlightColor="#e0e0e0">
    <div className="border rounded-lg p-4 space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <Skeleton width={100} height={20} className="mb-2" />
          <Skeleton width={150} height={16} />
        </div>
        <Skeleton width={60} height={60} circle />
      </div>
      <Skeleton count={2} height={12} />
      <div className="flex gap-2">
        <Skeleton width={30} height={30} />
        <Skeleton width={30} height={30} />
      </div>
    </div>
  </SkeletonTheme>
);

// Stats Panel Skeleton - Para los paneles de estadísticas
export const StatsPanelSkeleton = () => (
  <SkeletonTheme baseColor="#f0f0f0" highlightColor="#e0e0e0">
    <div className="border rounded-lg p-4 flex gap-4 items-center">
      <Skeleton width={60} height={60} borderRadius={8} />
      <div className="flex-1">
        <Skeleton width={120} height={20} className="mb-2" />
        <Skeleton width={200} height={16} />
      </div>
    </div>
  </SkeletonTheme>
);

// Table Row Skeleton - Para filas de tabla
export const TableRowSkeleton = () => (
  <SkeletonTheme baseColor="#f0f0f0" highlightColor="#e0e0e0">
    <div className="border rounded-lg p-4 flex justify-between items-center">
      <div className="flex gap-4 flex-1">
        <Skeleton width={40} height={40} />
        <div className="flex-1">
          <Skeleton width={150} height={16} className="mb-2" />
          <Skeleton width={100} height={14} />
        </div>
      </div>
      <Skeleton width={100} height={16} />
    </div>
  </SkeletonTheme>
);

// List Skeleton - Para listas completas
export const ListSkeleton = ({ count = 3 }: { count?: number }) => (
  <div className="space-y-3">
    {Array.from({ length: count }).map((_, i) => (
      <CardRouteSkeleton key={i} />
    ))}
  </div>
);

// Grid Skeleton - Para grillas de estadísticas
export const GridSkeleton = ({
  cols = 2,
  count = 4,
}: {
  cols?: number;
  count?: number;
}) => (
  <div className={`grid grid-cols-1 md:grid-cols-${cols} gap-4`}>
    {Array.from({ length: count }).map((_, i) => (
      <StatsPanelSkeleton key={i} />
    ))}
  </div>
);

// Deprecated - kept for backward compatibility
export const Wrapped2 = () => <CardRouteSkeleton />;
