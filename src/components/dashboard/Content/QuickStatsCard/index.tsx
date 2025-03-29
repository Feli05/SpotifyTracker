import { Card, CardBody } from "@heroui/react";
import { useEffect, useState } from "react";
import { StatsOverview } from "./StatsOverview";
import { RecentlyPlayed } from "./RecentlyPlayed";
import { TopGenresChart } from "./TopGenresChart";
import { QuickStatsData } from "./types";
import { RecentlyPlayedData } from "./types";
import { useTheme } from "next-themes";

export const QuickStatsCard = () => {
  const [loading, setLoading] = useState(true);
  const { resolvedTheme } = useTheme();
  const [error, setError] = useState<string | null>(null);
  const [statsData, setStatsData] = useState<QuickStatsData | null>(null);

  useEffect(() => {
    const fetchQuickStats = async () => {
      try {
        setLoading(true);

        // Fetch stats overview data
        const statsResponse = await fetch('/api/spotify/stats-overview');
        if (!statsResponse.ok) {
          setError('Failed to load stats data. Please reconnect your Spotify account.');
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
        setError('Failed to load data. Please reconnect your Spotify account.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuickStats();
  }, []);

  return (
      <Card className="w-full h-full rounded-xl shadow-xl shadow-primary-subtle/20 hover:shadow-2xl transition-shadow duration-300 bg-primary text-text-primary border border-primary-subtle/40">
        <CardBody className="p-6 flex flex-col h-full">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div className="flex items-center">
              <div className="bg-green-500/10 p-2 rounded-md mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-green-400">
                  <path d="M11 7h2v10h-2V7zm4 4h2v6h-2v-6zm-8 2h2v4H7v-4zm-4 0h2v4H3v-4z"/>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-text-primary">Quick Stats</h2>
            </div>
            <div className="mt-2 md:mt-0 bg-primary-subtle px-4 py-2 rounded-lg text-sm text-text-secondary">
              Here&#39;s a quick glance at your Spotify activity.
            </div>
          </div>

          {error ? (
              <div className="bg-red-900/30 text-text-primary rounded-lg p-5 text-center mb-4">
                <p className="mb-3">{error}</p>
                <button
                    onClick={() => window.location.href = '/api/spotify/connect'}
                    className="px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  Reconnect to Spotify
                </button>
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
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-text-muted mr-2">
                        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                      </svg>
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
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-text-muted mr-2">
                        <path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 5h-3v5.5c0 1.38-1.12 2.5-2.5 2.5S10 13.88 10 12.5s1.12-2.5 2.5-2.5c.57 0 1.08.19 1.5.51V5h4v2zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6z"/>
                      </svg>
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