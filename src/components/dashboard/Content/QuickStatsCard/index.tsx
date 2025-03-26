import { Card, CardBody } from "@heroui/react";
import { useEffect, useState } from "react";
import { RecentlyPlayed } from "./RecentlyPlayed";
import { RecentlyPlayedData } from "./types";

export const QuickStatsCard = () => {
  const [recentlyPlayed, setRecentlyPlayed] = useState<RecentlyPlayedData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentlyPlayed = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/spotify/recently-played');

        if (!response.ok) {
          throw new Error('Failed to fetch recently played tracks');
        }

        const data: RecentlyPlayedData = await response.json();
        setRecentlyPlayed(data);
      } catch (error) {
        console.error('Error fetching recently played tracks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentlyPlayed();
  }, []);

  return (
    <Card className="w-full h-full rounded-xl shadow-md bg-[#18181B] text-white">
      <CardBody className="p-5">
        <h2 className="text-xl font-bold mb-4">Quick Stats</h2>
        <RecentlyPlayed recentlyPlayed={recentlyPlayed} loading={loading} />
      </CardBody>
    </Card>
  );
}; 