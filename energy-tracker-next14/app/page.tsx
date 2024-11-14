"use client";

import DeviceTable from '../app/components/DeviceTable';
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <h1 className="text-2xl font-bold mb-4">The Cost Of Electricity In Your Home</h1>
      <DeviceTable /> 
      </main>
  );
}

