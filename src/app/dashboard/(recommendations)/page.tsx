"use client";

import WelcomeSection from "@/components/dashboard/Content/RecommendationsCard/WelcomeSection";
import RecommendationsSection from "@/components/dashboard/Content/RecommendationsCard/RecommendationsSection";

export default function Dashboard() {  
  return (
    <main className="flex flex-col space-y-8 p-4">
      <WelcomeSection />
      <RecommendationsSection />
    </main>
  );
}
