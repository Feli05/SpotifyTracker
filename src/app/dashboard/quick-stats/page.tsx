"use client";
import { WelcomeCard } from "@/components/dashboard/Content/WelcomeCard";
import { QuickStatsCard } from "@/components/dashboard/Content/QuickStatsCard";
import { ConnectionCheck } from "@/components/dashboard/ConnectionCheck";

export default function Home() {
  return (
    <main className="flex flex-col p-4 h-full">
      <ConnectionCheck>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
          <div className="h-full">
            <WelcomeCard />
          </div>
          <div className="h-full">
            <QuickStatsCard />
          </div>
        </div>
      </ConnectionCheck>
    </main>
  );
}