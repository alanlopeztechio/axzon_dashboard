'use client';

import { useState } from 'react';
import {
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Eye,
  EyeOff,
  Navigation,
  RefreshCw,
} from 'lucide-react';

interface MapControlsProps {
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onFitBounds?: () => void;
  onToggleRoutes?: (visible: boolean) => void;
  onTogglePoints?: (visible: boolean) => void;
  onToggleRadar?: (visible: boolean) => void;
  onRefresh?: () => void;
}

export function MapControls({
  onZoomIn,
  onZoomOut,
  onFitBounds,
  onToggleRoutes,
  onTogglePoints,
  onToggleRadar,
  onRefresh,
}: MapControlsProps) {
  const [showLayers, setShowLayers] = useState(false);
  const [layers, setLayers] = useState({
    routes: true,
    points: true,
    radar: true,
  });

  const toggleLayer = (layer: keyof typeof layers) => {
    const newState = !layers[layer];
    setLayers((prev) => ({ ...prev, [layer]: newState }));

    if (layer === 'routes') onToggleRoutes?.(newState);
    if (layer === 'points') onTogglePoints?.(newState);
    if (layer === 'radar') onToggleRadar?.(newState);
  };

  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-2">
      {/* Zoom Controls */}
      <div className="flex flex-col bg-zinc-900/90 backdrop-blur-sm rounded-xl border border-zinc-800 overflow-hidden">
        <button
          onClick={onZoomIn}
          className="p-3 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
        <div className="h-px bg-zinc-800" />
        <button
          onClick={onZoomOut}
          className="p-3 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-5 h-5" />
        </button>
      </div>

      {/* Fit Bounds */}
      <button
        onClick={onFitBounds}
        className="p-3 bg-zinc-900/90 backdrop-blur-sm rounded-xl border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
        title="Fit to View"
      >
        <Maximize2 className="w-5 h-5" />
      </button>

      {/* Layers Toggle */}
      <div className="relative">
        <button
          onClick={() => setShowLayers(!showLayers)}
          className={`p-3 bg-zinc-900/90 backdrop-blur-sm rounded-xl border transition-colors ${
            showLayers
              ? 'border-blue-500 text-blue-400'
              : 'border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800'
          }`}
          title="Layers"
        >
          <Layers className="w-5 h-5" />
        </button>

        {/* Layers Dropdown */}
        {showLayers && (
          <div className="absolute right-full mr-2 top-0 w-48 bg-zinc-900/95 backdrop-blur-sm rounded-xl border border-zinc-800 p-2">
            <p className="px-3 py-2 text-xs text-zinc-500 font-medium uppercase tracking-wider">
              Map Layers
            </p>
            {Object.entries(layers).map(([key, visible]) => (
              <button
                key={key}
                onClick={() => toggleLayer(key as keyof typeof layers)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-zinc-300 hover:bg-zinc-800 transition-colors"
              >
                {visible ? (
                  <Eye className="w-4 h-4 text-blue-400" />
                ) : (
                  <EyeOff className="w-4 h-4 text-zinc-500" />
                )}
                <span className="capitalize">{key}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Navigation */}
      <button
        className="p-3 bg-zinc-900/90 backdrop-blur-sm rounded-xl border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
        title="Center on Location"
      >
        <Navigation className="w-5 h-5" />
      </button>

      {/* Refresh */}
      <button
        onClick={onRefresh}
        className="p-3 bg-zinc-900/90 backdrop-blur-sm rounded-xl border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
        title="Refresh Data"
      >
        <RefreshCw className="w-5 h-5" />
      </button>
    </div>
  );
}
