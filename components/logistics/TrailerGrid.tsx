import { FC, useState } from 'react';
import { Button } from '../ui/button';
import { Plus, X } from 'lucide-react';
import { AnimatePresence, motion, LayoutGroup } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { cn } from '@/lib/utils';
import { Separator } from '../ui/separator';

interface Box {
  id: string;
  temperature: number;
}

interface Zone {
  name: string;
  temperature: number;
  boxes: Box[];
}

interface ContainerItem {
  id: number;
  label: string;
  value: string;
  route: string;
  status: string;
  zones: Zone[];
  empty?: boolean;
}

const ITEMS: ContainerItem[] = [
  {
    id: 0,
    label: 'B2R',
    value: '500 kg',
    route: '2-NYK-LDN',
    status: 'En tránsito',
    zones: [
      {
        name: 'Zone 1',
        temperature: 4,
        boxes: [
          { id: 'A1', temperature: 4.2 },
          { id: 'A2', temperature: 4.1 },
        ],
      },
      {
        name: 'Zone 2',
        temperature: 5,
        boxes: [{ id: 'B1', temperature: 5.3 }],
      },
    ],
  },
  {
    id: 1,
    label: 'B2R',
    value: '500 kg',
    route: '2-NYK-LDN',
    status: 'En tránsito',
    zones: [
      {
        name: 'Zone 1',
        temperature: 3,
        boxes: [{ id: 'C1', temperature: 3.5 }],
      },
    ],
  },
  {
    id: 2,
    label: 'B2R',
    value: '500 kg',
    route: '2-NYK-LDN',
    status: 'En tránsito',
    zones: [],
  },
  {
    id: 3,
    label: 'B2R',
    value: '500 kg',
    route: '2-NYK-LDN',
    status: 'En tránsito',
    zones: [
      {
        name: 'Zone 1',
        temperature: 6,
        boxes: [
          { id: 'D1', temperature: 6.2 },
          { id: 'D2', temperature: 6.1 },
        ],
      },
    ],
  },
  {
    id: 4,
    label: '',
    value: '',
    route: '',
    status: '',
    zones: [],
    empty: true,
  },
  {
    id: 5,
    label: 'B2R',
    value: '500 kg',
    route: '2-NYK-LDN',
    status: 'Pendiente',
    zones: [],
  },
  {
    id: 6,
    label: 'B2R',
    value: '500 kg',
    route: '2-NYK-LDN',
    status: 'En tránsito',
    zones: [
      {
        name: 'Zone 1',
        temperature: 2,
        boxes: [
          { id: 'E1', temperature: 2.2 },
          { id: 'E2', temperature: 2.1 },
          { id: 'E3', temperature: 2.3 },
        ],
      },
    ],
  },
  {
    id: 7,
    label: 'B2R',
    value: '400 kg',
    route: '2-NYK-LDN',
    status: 'Cargando',
    zones: [],
  },
  {
    id: 8,
    label: 'B2R',
    value: '500 kg',
    route: '2-NYK-LDN',
    status: 'En tránsito',
    zones: [],
  },
  {
    id: 9,
    label: '',
    value: '',
    route: '',
    status: '',
    zones: [],
    empty: true,
  },
  {
    id: 10,
    label: 'B2R',
    value: '600 kg',
    route: '2-NYK-LDN',
    status: 'En tránsito',
    zones: [
      {
        name: 'Zone 1',
        temperature: 5,
        boxes: [{ id: 'F1', temperature: 5.1 }],
      },
    ],
  },
  {
    id: 11,
    label: 'B2R',
    value: '500 kg',
    route: '2-NYK-LDN',
    status: 'En tránsito',
    zones: [],
  },
  {
    id: 12,
    label: 'B2R',
    value: '500 kg',
    route: '2-NYK-LDN',
    status: 'En tránsito',
    zones: [],
  },
  {
    id: 13,
    label: 'B2R',
    value: '500 kg',
    route: '2-NYK-LDN',
    status: 'En tránsito',
    zones: [],
  },
  {
    id: 14,
    label: 'B2R',
    value: '500 kg',
    route: '2-NYK-LDN',
    status: 'En tránsito',
    zones: [],
  },
  {
    id: 15,
    label: 'B2R',
    value: '500 kg',
    route: '2-NYK-LDN',
    status: 'Pendiente',
    zones: [],
  },
  {
    id: 16,
    label: 'B2R',
    value: '500 kg',
    route: '2-NYK-LDN',
    status: 'En tránsito',
    zones: [],
  },
  {
    id: 17,
    label: 'B2R',
    value: '500 kg',
    route: '2-NYK-LDN',
    status: 'En tránsito',
    zones: [],
  },
];

// Ease curve similar a Flutter/Apple
const HERO_EASE = [0.32, 0.72, 0, 1] as const;

const statusColor: Record<string, string> = {
  'En tránsito': 'bg-blue-100 text-blue-700',
  Pendiente: 'bg-amber-100 text-amber-700',
  Cargando: 'bg-emerald-100 text-emerald-700',
};

interface TrailerGridProps {
  className?: string;
}

const TrailerGrid: FC<TrailerGridProps> = ({ className }) => {
  const [expandedContainer, setExpandedContainer] =
    useState<ContainerItem | null>(null);

  const close = () => setExpandedContainer(null);

  return (
    <LayoutGroup>
      <div className={cn('relative w-full max-w-4xl', className)}>
        <img src="/flete.png" className="w-full" alt="Camión de carga" />

        <div
          className="absolute rounded-lg grid grid-cols-6 auto-rows-fr gap-2 px-2 py-3 overflow-hidden"
          style={{
            top: '33.5%',
            left: '28%',
            width: '68%',
            height: '25%',
          }}
        >
          {ITEMS.map((item, index) => {
            if (item.empty) {
              return (
                <motion.div
                  key={`empty-${index}`}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    type: 'spring',
                    damping: 15,
                    stiffness: 200,
                    delay: index * 0.04,
                  }}
                  className="flex h-full min-h-0 items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-white/30"
                >
                  <Button
                    variant="outline"
                    size="icon-xs"
                    className="rounded-full"
                  >
                    <Plus size={14} />
                  </Button>
                </motion.div>
              );
            }

            const isExpanded = expandedContainer?.id === item.id;

            return (
              <motion.button
                key={item.id}
                type="button"
                layoutId={`carrier-${item.id}`}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: isExpanded ? 0.95 : 1,
                  opacity: isExpanded ? 0 : 1,
                }}
                transition={{
                  opacity: isExpanded
                    ? { duration: 0.15 }
                    : { delay: index * 0.04 },
                  scale: isExpanded
                    ? { duration: 0.15 }
                    : { delay: index * 0.04 },
                  layout: { duration: 0.4, ease: HERO_EASE },
                }}
                whileHover={isExpanded ? {} : { scale: 1.05, zIndex: 50 }}
                whileTap={isExpanded ? {} : { scale: 0.97 }}
                onClick={() => !isExpanded && setExpandedContainer(item)}
                className={cn(
                  'relative flex h-full min-h-0 flex-col rounded-xl cursor-pointer',
                  'transition-shadow duration-300 overflow-hidden',
                  'border-transparent hover:border-blue-200',
                )}
              >
                <Card className="h-full gap-0 border border-slate-200 bg-white py-0 ring-0">
                  <CardContent className="flex h-full items-center justify-center p-0">
                    <p className="bg-[#c0392b]/10 px-2 py-0.5 text-[11px] font-semibold text-[#c0392b]">
                      {item.label}
                    </p>
                  </CardContent>
                </Card>
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence>
          {expandedContainer && (
            <>
              <motion.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm"
                onClick={close}
              />

              <motion.div
                key={`modal-${expandedContainer.id}`}
                layoutId={`carrier-${expandedContainer.id}`}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none"
                transition={{
                  layout: { duration: 0.4, ease: HERO_EASE },
                }}
              >
                <div
                  className="pointer-events-auto mx-auto w-full max-w-4xl h-full max-h-[85vh]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Card className="flex h-full w-full flex-col rounded-3xl py-0 shadow-2xl overflow-hidden">
                    <motion.div
                      className="flex flex-col h-full"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2, delay: 0.2 }}
                    >
                      <CardHeader className="px-5 pt-5 sm:px-7 sm:pt-7">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-xs font-semibold text-[#c0392b]">
                              {expandedContainer.label}-
                              {String(expandedContainer.id).padStart(3, '0')}
                            </p>
                            <CardTitle className="text-2xl font-bold">
                              Carrier Detail View
                            </CardTitle>
                            <p className="mt-1 text-sm text-slate-500">
                              Route: {expandedContainer.route}
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon-sm"
                            className="rounded-full"
                            onClick={close}
                          >
                            <X size={18} />
                          </Button>
                        </div>
                      </CardHeader>

                      <CardContent className="flex flex-1 flex-col px-5 pb-5 sm:px-7 sm:pb-7 overflow-hidden">
                        <Separator className="mb-4" />

                        {/* KPI Cards */}
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                          <Card className="border py-3 shadow-none">
                            <CardContent className="space-y-1">
                              <p className="text-xs text-slate-500">Weight</p>
                              <p className="text-base font-semibold">
                                {expandedContainer.value}
                              </p>
                            </CardContent>
                          </Card>
                          <Card className="border py-3 shadow-none">
                            <CardContent className="space-y-1">
                              <p className="text-xs text-slate-500">Status</p>
                              <p
                                className={cn(
                                  'inline-flex w-fit rounded-md px-2 py-0.5 text-xs font-semibold',
                                  statusColor[expandedContainer.status] ??
                                    'bg-slate-100 text-slate-600',
                                )}
                              >
                                {expandedContainer.status}
                              </p>
                            </CardContent>
                          </Card>
                          <Card className="border py-3 shadow-none">
                            <CardContent className="space-y-1">
                              <p className="text-xs text-slate-500">
                                Number of Zones
                              </p>
                              <p className="text-base font-semibold">
                                {expandedContainer.zones.length}
                              </p>
                            </CardContent>
                          </Card>
                        </div>

                        {/* Zones */}
                        <div className="mt-5 flex-1 overflow-y-auto pr-1">
                          {expandedContainer.zones.length === 0 ? (
                            <Card className="border border-dashed py-6 text-center shadow-none">
                              <CardContent className="text-slate-400">
                                No zones assigned to this carrier.
                              </CardContent>
                            </Card>
                          ) : (
                            <div className="space-y-4">
                              {expandedContainer.zones.map(
                                (zone, zoneIndex) => (
                                  <Card
                                    key={`${expandedContainer.id}-${zone.name}`}
                                    className="border py-4 shadow-none"
                                  >
                                    <CardContent>
                                      <div className="mb-3 flex items-center justify-between">
                                        <h4 className="text-lg font-semibold">
                                          Zone {zoneIndex + 1}
                                        </h4>
                                        <p className="text-sm font-medium text-blue-700">
                                          Nom Temp: {zone.temperature}°C
                                        </p>
                                      </div>
                                      <p className="mb-2 text-sm text-slate-500">
                                        Boxes in zone: {zone.boxes.length}
                                      </p>
                                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                        {zone.boxes.map((box) => (
                                          <Card
                                            key={`${zone.name}-${box.id}`}
                                            className="bg-slate-50 py-2 shadow-none ring-0"
                                          >
                                            <CardContent className="flex items-center justify-between">
                                              <span className="text-sm font-medium text-slate-700">
                                                Box {box.id}
                                              </span>
                                              <span className="text-sm text-slate-600">
                                                {box.temperature}°C
                                              </span>
                                            </CardContent>
                                          </Card>
                                        ))}
                                      </div>
                                    </CardContent>
                                  </Card>
                                ),
                              )}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </motion.div>
                  </Card>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </LayoutGroup>
  );
};

export default TrailerGrid;
