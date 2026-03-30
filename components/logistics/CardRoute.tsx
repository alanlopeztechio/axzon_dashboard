import { RouteOption } from '@/app/(dashboard)/logistics/map-fleet/page';
import React, { FC } from 'react';
import Image from 'next/image';
import { MapPin, MessageCircleIcon, Phone } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import TimeLine from './TimeLine';
import RouteIndicator from './TimeLine';
import TrailerGrid from './TrailerGrid';

interface CardRouteProps {
  route: RouteOption;
  onSelect: () => void;
  isSelected: boolean;
}

const CardRoute: FC<CardRouteProps> = ({ route, onSelect, isSelected }) => {
  return (
    <Card
      key={route.id}
      onClick={() => onSelect()}
      className={`mb-4 rounded-3xl border px-2 py-6 text-left transition-all last:mb-0 ${
        isSelected
          ? 'border-red-950 hover:border-red-950'
          : 'hover:border-red-950/50'
      }`}
    >
      <CardHeader>
        <div className="flex flex-row items-center justify-between gap-10">
          <div className="space-y-2">
            <p className="whitespace-nowrap font-bold">Shipment number</p>
            <h2 className="text-lg whitespace-nowrap  font-bold">
              {route.shipmentNumber}
            </h2>
            <p className="font-extralight text-sm">{route.product}</p>
          </div>

          {/* <div className="relative h-20 w-20 overflow-hidden">
            <Image
              src="/flete.png"
              alt="Shipment Image"
              fill
              className="object-contain"
            />
          </div> */}
        </div>
      </CardHeader>

      <CardContent>
        <RouteIndicator />
        {/* <div className="relative mt-6 space-y-5 pl-11">
          <span className="absolute left-4.25 top-8 h-11 w-px border-l border-dashed border-emerald-300" />

          <div className="relative">
            <span className="absolute -left-11 top-0 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100">
              <span className="h-3 w-3 rounded-full bg-emerald-500" />
            </span>
            <p className="text-lg font-semibold leading-6">
              {route.originAddress}
            </p>
            <p className="mt-1 text-sm text-slate-400">{route.origin}</p>
          </div>

          <div className="relative">
            <span className="absolute -left-11 top-0 flex h-8 w-8 items-center justify-center rounded-full bg-orange-100/80">
              <span className="h-3 w-3 rounded-full bg-orange-400" />
            </span>
            <p>Hola Mundo</p>
          </div>

          <div className="relative">
            <span className="absolute -left-11 top-0 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
              <MapPin className="text-blue-500" />
            </span>
            <p className="text-lg font-semibold leading-6 ">
              {route.destinationAddress}
            </p>
            <p className="mt-1 text-sm text-slate-400">{route.destination}</p>
          </div>
        </div> */}
      </CardContent>

      <CardFooter className="bg-transparent border-transparent mb-2">
        {/* <div className="flex flex-row justify-between items-center w-full">
          <div className="flex flex-row gap-4 justify-start items-center">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full">
              <Avatar className="h-full w-full">
                <AvatarImage src="/avatar.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
            <div>
              <p className="whitespace-nowrap font-light">Client</p>
              <h2 className="text-sm whitespace-nowrap font-bold">
                {route.clientName}
              </h2>
              <p className="font-extralight text-sm">{route.clientLocation}</p>
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
        </div> */}
        <TrailerGrid className="mx-auto w-full max-w-4xl" />
      </CardFooter>
    </Card>
  );
};

export default CardRoute;
