"use client";

import { ConnectionCheck } from "@/components/dashboard/ConnectionCheck";

export default function Home() {
  return (
    <main className="flex flex-col p-4 h-full">
      <ConnectionCheck>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h1>Monthly Recap</h1>
        </div>
      </div>
    </ConnectionCheck>
    </main>
  );
}