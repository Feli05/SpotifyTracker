"use client";

import { useState, useEffect } from "react";
import WelcomeSection from "@/components/dashboard/Content/RecommendationsCard/WelcomeSection";
import RecommendationsSection from "@/components/dashboard/Content/RecommendationsCard/RecommendationsSection";

// Define type for recommendations
interface Recommendation {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
}

// Mock data for recommendations
const mockRecentRecommendations: Recommendation[] = [
  {
    _id: "rec1",
    name: "Your Morning Boost",
    description: "Energetic tracks to start your day",
    createdAt: "3 days ago"
  },
  {
    _id: "rec2",
    name: "Evening Chill",
    description: "Relaxing tunes for your evening",
    createdAt: "1 week ago"
  },
  {
    _id: "rec3",
    name: "Focus Mode",
    description: "Instrumental tracks to help you concentrate",
    createdAt: "2 weeks ago"
  }
];

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return <div className="w-full h-full rounded-xl animate-pulse bg-primary-subtle"></div>;
  }
  
  return (
    <main className="flex flex-col space-y-8 p-4">
      <WelcomeSection />
      <RecommendationsSection recommendations={mockRecentRecommendations} />
    </main>
  );
}
