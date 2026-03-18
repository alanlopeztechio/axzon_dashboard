'use client';
import {
  APIProvider,
  Map,
  useMap,
  useMapsLibrary,
} from '@vis.gl/react-google-maps';
import { MessageCircleIcon, Phone } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FaLocationDot } from 'react-icons/fa6';

type RouteOption = {
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

const MapPage = () => {
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
  const selectedRoute = ROUTE_OPTIONS[selectedRouteIndex] ?? ROUTE_OPTIONS[0];

  return (
    <div className="flex h-screen bg-slate-100">
      <div className="overflow-y-auto p-4 flex flex-col px-10 py-6">
        {ROUTE_OPTIONS.map((route, index) => {
          const isSelected = index === selectedRouteIndex;

          return (
            <button
              key={route.id}
              type="button"
              onClick={() => setSelectedRouteIndex(index)}
              className={`mb-4 rounded-3xl border-2 bg-white px-6 py-6 text-left shadow-[0_8px_20px_rgba(15,23,42,0.08)] transition-all last:mb-0 ${
                isSelected
                  ? 'border-blue-600'
                  : 'border-transparent hover:border-blue-200'
              }`}
            >
              <div className="flex flex-row items-center justify-between gap-40">
                <div className="space-y-2">
                  <p className="whitespace-nowrap text-gray-400 font-bold text-sm">
                    Shipment number
                  </p>
                  <h2 className="text-xl whitespace-nowrap text-black font-bold">
                    {route.shipmentNumber}
                  </h2>
                  <p className="text-black font-extralight text-sm">
                    {route.product}
                  </p>
                </div>

                <div className="relative h-40 w-40 overflow-hidden">
                  <Image
                    src="/flete.png"
                    alt="Shipment Image"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
              <hr className="my-5 border-t-2 border-gray-100 rounded-2xl w-full" />

              <div className="relative mt-6 space-y-5 pl-11">
                <span className="absolute left-4.25 top-8 h-11 w-px border-l border-dashed border-emerald-300" />

                <div className="relative">
                  <span className="absolute -left-11 top-0 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100">
                    <span className="h-3 w-3 rounded-full bg-emerald-500" />
                  </span>
                  <p className="text-lg font-semibold leading-6 text-slate-700">
                    {route.originAddress}
                  </p>
                  <p className="mt-1 text-sm text-slate-400">{route.origin}</p>
                </div>

                <div className="relative">
                  <span className="absolute -left-11 top-0 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                    <FaLocationDot className="text-blue-500" />
                  </span>
                  <p className="text-lg font-semibold leading-6 text-slate-700">
                    {route.destinationAddress}
                  </p>
                  <p className="mt-1 text-sm text-slate-400">
                    {route.destination}
                  </p>
                </div>
              </div>

              <hr className="my-6 border-t-2 border-gray-100 rounded-2xl w-full" />
              <div className="flex flex-row justify-between items-center">
                <div className="flex flex-row gap-4 justify-start items-center">
                  <div className="relative h-18 w-18 shrink-0 overflow-hidden rounded-full">
                    <Image
                      src="/avatar.png"
                      alt="Shipment Image"
                      fill
                      className="object-center object-cover"
                      sizes="100px"
                    />
                  </div>
                  <div>
                    <p className="whitespace-nowrap text-gray-400 font-bold text-sm">
                      Client
                    </p>
                    <h2 className="text-xl whitespace-nowrap text-black font-bold">
                      {route.clientName}
                    </h2>
                    <p className="text-black font-extralight text-sm">
                      {route.clientLocation}
                    </p>
                  </div>
                </div>
                <div className="flex flex-row gap-6">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Phone className="text-blue-600" />
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <MessageCircleIcon className="text-blue-600" />
                  </div>
                </div>
              </div>
            </button>
          );
        })}
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
