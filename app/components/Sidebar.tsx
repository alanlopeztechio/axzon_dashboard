'use client';

import { useState } from 'react';
import {
  LayoutDashboard,
  Map,
  Truck,
  AlertTriangle,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Thermometer,
  Radio,
  Route,
} from 'lucide-react';

interface SidebarProps {
  onRouteSelect?: (routeName: string | null) => void;
}

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '#', active: true },
  { icon: Map, label: 'Fleet Map', href: '#' },
  { icon: Truck, label: 'Shipments', href: '#' },
  { icon: Route, label: 'Routes', href: '#' },
  { icon: AlertTriangle, label: 'Alerts', href: '#', badge: 25 },
  { icon: Thermometer, label: 'Temperature', href: '#' },
  { icon: Radio, label: 'Sensors', href: '#' },
  { icon: BarChart3, label: 'Analytics', href: '#' },
  { icon: Settings, label: 'Settings', href: '#' },
];

export function Sidebar({ onRouteSelect }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`fixed left-0 top-0 z-40 h-screen bg-zinc-900/95 backdrop-blur-sm border-r border-zinc-800 transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-zinc-800">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <Truck className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-white">AXZON</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-3 space-y-1">
        {menuItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
              item.active
                ? 'bg-blue-500/20 text-blue-400'
                : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
            }`}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && (
              <>
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="px-2 py-0.5 text-xs bg-red-500/20 text-red-400 rounded-full">
                    {item.badge}
                  </span>
                )}
              </>
            )}
          </a>
        ))}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-zinc-800">
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>System Online</span>
          </div>
        </div>
      )}
    </aside>
  );
}
