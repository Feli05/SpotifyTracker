"use client";
import { WelcomeCard } from "@/components/dashboard/Content/WelcomeCard";

export default function Home() {
  return (
    <main className="flex flex-col px-4 py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <WelcomeCard />
        </div>
        <div>
          {/* Quick Stats will go here */}
        </div>
      </div>
    </main>
  );
}