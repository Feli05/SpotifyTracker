import { Card, CardBody } from "@heroui/react";
import { useEffect, useState } from "react";
import { StatsOverview } from "./StatsOverview";
import { RecentlyPlayed } from "./RecentlyPlayed";
import { TopGenresChart } from "./TopGenresChart";
import { QuickStatsData } from "./types";
import { StatsIcon, RecentlyPlayedIcon, TopGenresIcon } from "@/components/icons";

export const QuickStatsCard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statsData, setStatsData] = useState<QuickStatsData | null>(null);

  useEffect(() => {
    const fetchQuickStats = async () => {
      try {
        setLoading(true);

        // Fetch stats overview data
        const statsResponse = await fetch('/api/spotify/stats-overview');
        if (!statsResponse.ok) {
          setError('Failed to load stats data');
          setLoading(false);
          return;
        }
        const statsOverview = await statsResponse.json();

        // Fetch recently played tracks
        const recentResponse = await fetch('/api/spotify/recently-played');
        if (!recentResponse.ok) {
          throw new Error('Failed to load data');
        }
        const recentlyPlayedData = await recentResponse.json();

        // Process recently played tracks into our format
        const recentlyPlayed = recentlyPlayedData.items.map((item: any) => ({
          id: item.track.id,
          title: item.track.name,
          artist: item.track.artists.map((artist: any) => artist.name).join(', '),
          albumCover: item.track.album.images[0]?.url,
          playedAt: item.played_at,
          url: item.track.external_urls.spotify
        })).slice(0, 3);

        // Fetch top genres
        const genresResponse = await fetch('/api/spotify/top-genres');
        if (!genresResponse.ok) {
          throw new Error('Failed to load data');
        }
        const topGenres = await genresResponse.json();

        setStatsData({
          statsOverview,
          recentlyPlayed,
          topGenres: topGenres.genres,
          loading: false,
          error: null
        });
      } catch (err) {
        console.error('Error fetching quick stats:', err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchQuickStats();
  }, []);

  return (
      <Card className="w-full h-full rounded-xl shadow-xl shadow-primary-subtle/20 hover:shadow-2xl transition-shadow duration-300 bg-primary text-text-primary border-2 border-primary-subtle/60">
        <CardBody className="p-6 flex flex-col h-full">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div className="flex items-center">
              <div className="bg-green-500/10 p-2 rounded-md mr-3">
                <div className="w-6 h-6 text-green-400">
                  <StatsIcon />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-text-primary">Quick Stats</h2>
            </div>
            <div className="mt-2 md:mt-0 bg-primary-subtle px-4 py-2 rounded-lg text-sm text-text-secondary">
              Here&#39;s a quick glance at your Spotify activity.
            </div>
          </div>

          {error ? (
              <div className="bg-red-900/20 text-text-primary rounded-lg p-5 text-center mb-4">
                <p>{error}</p>
              </div>
          ) : (
              <div className="flex flex-col flex-grow">
                {/* Stats Overview */}
                <div className="mb-8">
                  <StatsOverview
                      data={statsData?.statsOverview}
                      loading={loading}
                      error={error}
                  />
                </div>

                {/* Two Column Layout for Recently Played and Top Genres */}
                <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6 flex-grow">
                  {/* Recently Played Songs */}
                  <div className="flex flex-col">
                    <div className="flex items-center mb-4">
                      <div className="w-5 h-5 text-text-muted mr-2">
                        <RecentlyPlayedIcon />
                      </div>
                      <h3 className="text-lg font-semibold text-text-primary">Recently Played</h3>
                    </div>
                    <div className="flex-grow">
                      <RecentlyPlayed
                          songs={statsData?.recentlyPlayed || []}
                          loading={loading}
                          error={error}
                      />
                    </div>
                  </div>

                  {/* Top Genres */}
                  <div className="flex flex-col">
                    <div className="flex items-center mb-4">
                      <div className="w-5 h-5 text-text-muted mr-2">
                        <TopGenresIcon />
                      </div>
                      <h3 className="text-lg font-semibold text-text-primary">Top Genres</h3>
                    </div>
                    <div className="flex-grow">
                      <TopGenresChart
                          genres={statsData?.topGenres || []}
                          loading={loading}
                          error={error}
                      />
                    </div>
                  </div>
                </div>
              </div>
          )}
        </CardBody>
      </Card>
  );
};