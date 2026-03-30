'use client';
import {
  APIProvider,
  Map,
  useMap,
  useMapsLibrary,
} from '@vis.gl/react-google-maps';
import { MapPin, MessageCircleIcon, Phone, Plus, X } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import CardRoute from '@/components/logistics/CardRoute';
import SeachForm from '@/components/logistics/SeachForm';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export type RouteOption = {
  id: string;
  shipmentNumber: string;
  product: string;
  origin: string;
  destination: string;
  originAddress: string;
  destinationAddress: string;
  clientName: string;
  clientLocation: string;
};

const ROUTE_OPTIONS: RouteOption[] = [
  {
    id: 'ruta-1',
    shipmentNumber: 'EF-0097001346',
    product: 'Furniture',
    origin: 'Paseo Durango, Durango, Mexico',
    destination: 'Flor de Azahar 208, Durango, Mexico',
    originAddress: 'Paseo Durango',
    destinationAddress: 'Flor de Azahar 208',
    clientName: 'Emily Johnson',
    clientLocation: 'Durango, MX',
  },
  {
    id: 'ruta-2',
    shipmentNumber: 'EF-0097001347',
    product: 'Electronics',
    origin: 'C. Negrete 1200, Durango, Mexico',
    destination: 'Blvd. Domingo Arrieta 300, Durango, Mexico',
    originAddress: 'C. Negrete 1200',
    destinationAddress: 'Blvd. Domingo Arrieta 300',
    clientName: 'Carlos Rivera',
    clientLocation: 'Durango, MX',
  },
  {
    id: 'ruta-3',
    shipmentNumber: 'EF-0097001348',
    product: 'Pharmacy',
    origin: 'Av. 20 de Noviembre 905, Durango, Mexico',
    destination: 'C. Constitución 410, Durango, Mexico',
    originAddress: 'Av. 20 de Noviembre 905',
    destinationAddress: 'C. Constitución 410',
    clientName: 'Andrea Morales',
    clientLocation: 'Durango, MX',
  },
];

const MapDirections = ({ selectedRoute }: { selectedRoute: RouteOption }) => {
  const map = useMap('main-map');
  const routeLibary = useMapsLibrary('routes');
  const markerLibrary = useMapsLibrary('marker');
  const startMarkerRef =
    useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
  const endMarkerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(
    null,
  );

  const directionsService = useMemo(() => {
    if (!routeLibary || !map) return;

    return new routeLibary.DirectionsService();
  }, [routeLibary, map]);

  const directionRenderer = useMemo(() => {
    if (!routeLibary || !map) return;

    const renderer = new routeLibary.DirectionsRenderer({
      map,
      suppressInfoWindows: true,
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: '#3B82F6',
        strokeWeight: 5,
      },
    });

    return renderer;
  }, [routeLibary, map]);

  useEffect(() => {
    if (!directionsService || !directionRenderer || !markerLibrary) return;

    directionsService
      .route({
        origin: selectedRoute.origin,
        destination: selectedRoute.destination,
        travelMode: google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: true,
      })
      .then((response) => {
        directionRenderer.setDirections(response);
        const routeLeg = response.routes[0]?.legs[0];

        if (!routeLeg) return;

        if (startMarkerRef.current) {
          startMarkerRef.current.map = null;
        }

        if (endMarkerRef.current) {
          endMarkerRef.current.map = null;
        }

        startMarkerRef.current = new markerLibrary.AdvancedMarkerElement({
          map: map,
          position: routeLeg.start_location,
          content: createStartMarker(),
          zIndex: 2000,
          gmpClickable: false,
        });

        endMarkerRef.current = new markerLibrary.AdvancedMarkerElement({
          map: map,
          position: routeLeg.end_location,
          content: createEndMarker(),
        });
      });
  }, [
    directionsService,
    directionRenderer,
    markerLibrary,
    selectedRoute.destination,
    selectedRoute.origin,
  ]);

  return null;
};

function createStartMarker() {
  const div = document.createElement('div');
  div.innerHTML = `
    <div style="
      width: 40px;
      height: 40px;
      background: rgba(66, 165, 245, 0.35);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transform: translateY(50%);
    ">
      <span style="
        width: 8px;
        height: 8px;
        background: #0a5ea8;
        border-radius: 50%;
        display: block;
      "></span>
    </div>
  `;
  return div;
}

function createEndMarker() {
  const marker = document.createElement('div');
  marker.style.width = '40px';
  marker.style.height = '40px';
  marker.style.background = '#0b63b5';
  marker.style.borderRadius = '7px';
  marker.style.display = 'flex';
  marker.style.alignItems = 'center';
  marker.style.justifyContent = 'center';
  marker.style.boxShadow = '0 3px 8px rgba(11, 99, 181, 0.35)';
  marker.style.cursor = 'pointer';
  marker.style.transform = 'translateY(0) scale(1)';
  marker.style.transformOrigin = 'center bottom';
  marker.style.transition =
    'transform 220ms cubic-bezier(0.2, 0.9, 0.2, 1.2), box-shadow 220ms ease';

  marker.innerHTML = `
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      style="display: block; color: #ffffff;"
    >
      <path
        d="M12.54,10.67l-.54.27-.54-.27-8-4s0,0,0,0h0l8-4.5a1,1,0,0,1,1,0l8,4.5h0s0,0,0,0l-4,2a.24.24,0,0,0-.09-.06l-4-2a1,1,0,0,0-.9,1.78l2.77,1.39ZM3,7.56a.06.06,0,0,1,0,0v9a1,1,0,0,0,.51.87l8,4.49v-10l-.5-.25Zm18,0-4,2V14a1,1,0,0,1-2,0V10.56l-2.5,1.25v10l8-4.49A1,1,0,0,0,21,16.5v-9A.06.06,0,0,1,21,7.56Z"
        fill="currentColor"
      />
    </svg>
  `;

  marker.addEventListener('mouseenter', () => {
    marker.style.transform = 'translateY(-8px) scale(1.2)';
    marker.style.boxShadow = '0 10px 20px rgba(11, 99, 181, 0.45)';
  });

  marker.addEventListener('mouseleave', () => {
    marker.style.transform = 'translateY(0) scale(1)';
    marker.style.boxShadow = '0 3px 8px rgba(11, 99, 181, 0.35)';
  });

  return marker;
}

const items = [
  { id: '1', label: 'Laptops', value: '304 items', x: 60, y: 30 },
  { id: '2', label: 'Phones', value: '146 items', x: 70, y: 60 },
];

const MapPage = () => {
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
  const selectedRoute = ROUTE_OPTIONS[selectedRouteIndex] ?? ROUTE_OPTIONS[0];

  return (
    <div className="flex h-[calc(100dvh-64px)] overflow-hidden bg-background">
      <div className="flex h-full min-h-0 w-full max-w-140 flex-col px-4 py-6 sm:px-6 lg:px-8">
        <div className="shrink-0 px-3 py-3">
          <SeachForm />
          <Tabs defaultValue="overview" className="pt-4">
            <TabsList
              variant="line"
              className="grid w-full grid-cols-4 bg-transparent border-b rounded-none h-auto"
            >
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="transit">In Transit</TabsTrigger>
              <TabsTrigger value="idle">Idle</TabsTrigger>
              <TabsTrigger value="reports">Delivered</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <ScrollArea className="route-scrollbar min-h-0 flex-1 px-4">
          {ROUTE_OPTIONS.map((route, index) => {
            const isSelected = index === selectedRouteIndex;

            return (
              <CardRoute
                key={route.id}
                route={route}
                isSelected={isSelected}
                onSelect={() => setSelectedRouteIndex(index)}
              />
            );
          })}
        </ScrollArea>
      </div>
      <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
        <Map
          id="main-map"
          className="h-full min-w-0 flex-1"
          defaultCenter={{
            lat: 24.022008,
            lng: -104.6547415,
          }}
          defaultZoom={14}
          colorScheme="LIGHT"
          mapId={process.env.NEXT_PUBLIC_MAP_ID_VECTOR}
          disableDefaultUI={true}
          clickableIcons={false}
          gestureHandling="greedy"
        ></Map>
        <MapDirections selectedRoute={selectedRoute} />
      </APIProvider>
    </div>
  );
};

export default MapPage;
