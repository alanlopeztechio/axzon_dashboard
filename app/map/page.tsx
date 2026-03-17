'use client';
import {
  APIProvider,
  Map,
  useMap,
  useMapsLibrary,
} from '@vis.gl/react-google-maps';
import { MessageCircleIcon, Phone } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useMemo } from 'react';
import { FaLocationDot } from 'react-icons/fa6';

const MapDirections = () => {
  const map = useMap('main-map');
  const routeLibary = useMapsLibrary('routes');
  const markerLibrary = useMapsLibrary('marker');

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
        origin: 'Paseo Durango ',
        destination: 'Flor de Azahar 208, Durango, Mexico',
        travelMode: google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: true,
      })
      .then((response) => {
        directionRenderer.setDirections(response);
        const routeLeg = response.routes[0]?.legs[0];

        if (!routeLeg) return;

        new markerLibrary.AdvancedMarkerElement({
          map: map,
          position: routeLeg.start_location,
          content: createStartMarker(),
          zIndex: 2000,
          gmpClickable: false,
        });

        new markerLibrary.AdvancedMarkerElement({
          map: map,
          position: routeLeg.end_location,
          content: createEndMarker(),
        });
      });
  }, [directionsService, directionRenderer, markerLibrary]);

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
  const div = document.createElement('div');
  div.innerHTML = `
    <div style="
      width: 40px;
      height: 40px;
      background: #0b63b5;
      border-radius: 7px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 3px 8px rgba(11, 99, 181, 0.35);
    ">
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
    </div>
  `;
  return div;
}

const MapPage = () => {
  return (
    <div className="flex flex-row bg-white">
      <div className="flex flex-col">
        <div className="px-10 py-10 shadow-[0_0px_15px_-3px_rgba(0,0,0,0.2)] m-10 rounded-3xl">
          <div className="flex flex-row items-start justify-between gap-8">
            <div className="space-y-2">
              <p className="whitespace-nowrap text-gray-400 font-bold text-sm">
                Shipment number
              </p>
              <h2 className="text-xl whitespace-nowrap text-black font-bold">
                EF-0097001346
              </h2>
              <p className="text-black font-extralight text-sm">Forniture</p>
            </div>

            <div className="relative h-25 w-25 shrink-0 overflow-hidden">
              <Image
                src="/flete.png"
                alt="Shipment Image"
                fill
                className="object-contain"
                sizes="100px"
              />
            </div>
          </div>
          <hr className="border-t-2 border-gray-100 rounded-2xl w-full" />

          <div className="relative mt-6 space-y-5 pl-11">
            <span className="absolute left-4.25 top-8 h-11 w-px border-l border-dashed border-emerald-300" />

            <div className="relative">
              <span className="absolute -left-11 top-0 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100">
                <span className="h-3 w-3 rounded-full bg-emerald-500" />
              </span>
              <p className="text-lg font-semibold leading-6 text-slate-700">
                1234 Market St
              </p>
              <p className="mt-1 text-sm text-slate-400">
                San Francisco, CA 94103
              </p>
            </div>

            <div className="relative">
              <span className="absolute -left-11 top-0 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                <FaLocationDot className="text-blue-500" />
              </span>
              <p className="text-lg font-semibold leading-6 text-slate-700">
                5678 Sunset Blvd
              </p>
              <p className="mt-1 text-sm text-slate-400">
                Los Angeles, CA 90028
              </p>
            </div>
          </div>

          <hr className="my-8 border-t-2 border-gray-100 rounded-2xl w-full" />
          <div className="flex flex-row justify-between gap-15 items-center">
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
                  Emily Jhonson
                </h2>
                <p className="text-black font-extralight text-sm">
                  Los Angeles, CA
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
        </div>
      </div>
      <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
        <Map
          id="main-map"
          className="h-screen w-screen"
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
        <MapDirections />
      </APIProvider>
    </div>
  );
};

export default MapPage;
