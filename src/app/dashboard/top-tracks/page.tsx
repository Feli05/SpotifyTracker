"use client";

import { TopSongsTable } from "@/components/dashboard/Content/TopSongsTable";
import { ConnectionCheck } from "@/components/dashboard/ConnectionCheck";

export default function Home() {
  return (
    <main className="flex flex-col p-4 h-full">
      <ConnectionCheck>
        <div className="grid grid-cols-1 gap-4">
          <div className="col-span-1">
            <TopSongsTable />
          </div>
        </div>
      </ConnectionCheck>
    </main>
  );
}