"use client";

import { ConnectionCheck } from "@/components/dashboard/ConnectionCheck";

export default function Home() {
  return (
    <main className="flex flex-col p-4 h-full">
      <ConnectionCheck>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h1>Top Artists</h1>
          </div>
          <div>
            {/* Quick Stats will go here */}
          </div>
        </div>
      </ConnectionCheck>
    </main>
  );
}