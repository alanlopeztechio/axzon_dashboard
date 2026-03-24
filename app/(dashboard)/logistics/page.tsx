import { ChartBar, ChartBarBig, RouteIcon, Truck } from 'lucide-react';
import React from 'react';

const page = () => {
  return (
    <div className="p-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-white">Logistics Overview</h1>
        <p>Transport modes, fleet map, and links to carriers and routes</p>
      </div>
      <div className="mt-6 grid w-full grid-cols-1 gap-4 md:grid-cols-2">
        <div className="p-4 flex flex-row gap-4 border rounded-2xl items-center ">
          <div className="p-4 bg-[#103742] rounded-2xl">
            <ChartBarBig />
          </div>
          <div>
            <p className="text-xl font-bold">Carriers</p>
            <p className="text-sm ">
              Excursion frequency and vendor accoutability
            </p>
          </div>
        </div>
        <div className="border p-4 flex flex-row gap-4 rounded-2xl items-center">
          <div className="p-4 bg-[#103742] rounded-2xl">
            <RouteIcon />
          </div>
          <div>
            <p>Route & Lanes</p>
            <p>Top origin-destinations pairs by volume</p>
          </div>
        </div>
        <div className="border px-4 py-5 flex flex-col gap-4 rounded-2xl items-start md:col-span-2">
          <div className="space-y-4">
            <p className="text-xl font-bold">Transport Mode</p>
            <p>Shipments by mode (air, ocean, road)</p>
          </div>
          <div className="flex flex-col justify-start w-full gap-4">
            <div className="flex flex-row justify-between border rounded-2xl p-4">
              <div className="flex flex-row gap-4">
                <Truck />
                <p>Driving-Car</p>
              </div>
              <p>
                <span>20001 shipments</span>
                <span className="ml-4 text-green-900 font-bold">94.0% avg</span>
              </p>
            </div>
            <div className="flex flex-row justify-between border rounded-2xl p-4">
              <div className="flex flex-row gap-4">
                <Truck />
                <p>Driving-Car</p>
              </div>
              <p>
                <span>20001 shipments</span>
                <span className="ml-4 text-green-900 font-bold">94.0% avg</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
