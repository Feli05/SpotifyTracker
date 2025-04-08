import { Card, CardBody } from "@heroui/react";
import { useEffect, useState } from "react";
import { UserInfo } from "./UserInfo";
import { TopItems } from "./TopItems";
import { UserPlaylists } from "./UserPlaylists";
import { SpotifyProfile, TopItemsData, UserPlaylist } from "./types";
import { HomeIcon, StarIcon, PlaylistMusicIcon, ChevronRightIcon } from "@/components/icons";

export const WelcomeCard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<SpotifyProfile | null>(null);
  const [topItems, setTopItems] = useState<TopItemsData | null>(null);
  const [playlists, setPlaylists] = useState<UserPlaylist[]>([]);
  const [loadingTopItems, setLoadingTopItems] = useState(false);
  const [loadingPlaylists, setLoadingPlaylists] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/spotify/profile');

        if (!response.ok) {
          setError('Failed to load profile data');
          return;
        }

        const data = await response.json();
        setProfile(data);

        // Also fetch top items and playlists after profile loads successfully
        fetchTopItems();
        fetchPlaylists();
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    const fetchTopItems = async () => {
      try {
        setLoadingTopItems(true);
        const response = await fetch('/api/spotify/top-items');

        if (response.ok) {
          const data = await response.json();
          setTopItems(data);
        }
      } catch (err) {
        console.error('Error fetching top items:', err);
      } finally {
        setLoadingTopItems(false);
      }
    };

    const fetchPlaylists = async () => {
      try {
        setLoadingPlaylists(true);
        const response = await fetch('/api/spotify/user-playlists');

        if (response.ok) {
          const data = await response.json();
          setPlaylists(data.playlists);
        }
      } catch (err) {
        console.error('Error fetching playlists:', err);
      } finally {
        setLoadingPlaylists(false);
      }
    };

    fetchProfile();
  }, []);

  return (
      <Card className="w-full h-full rounded-xl shadow-xl shadow-primary-subtle/20 hover:shadow-2xl transition-shadow duration-300 bg-primary text-text-primary border-2 border-primary-subtle/60">
        <CardBody className="p-6 flex flex-col h-full">
          <div className="flex flex-row justify-between items-center mb-4">
            <div className="flex items-center">
              <div className="bg-green-500/10 p-2 rounded-md mr-3">
                <div className="w-6 h-6 text-green-400">
                  <HomeIcon />
                </div>
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold text-text-primary">Welcome</h2>
            </div>
            <div className="bg-primary-subtle px-4 py-2 rounded-lg text-sm lg:text-base text-text-secondary">
              Spotify Dashboard
            </div>
          </div>

          {/* User Profile Information */}
          <UserInfo
              profile={profile}
              loading={loading}
              error={error}
          />

          {!loading && !error && profile && (
              <div className="mt-4 flex-grow flex flex-col">
                {/* Top Items Section */}
                <div className="mb-3 lg:mb-4 flex-grow">
                  <div className="flex items-center mb-2 lg:mb-3">
                    <div className="w-5 h-5 lg:w-6 lg:h-6 text-text-muted mr-2">
                      <StarIcon />
                    </div>
                    <h3 className="text-lg lg:text-xl font-semibold text-text-primary">Your Top Picks</h3>
                  </div>
                  <div className="lg:p-2">
                    <TopItems
                        topItems={topItems}
                        loading={loadingTopItems}
                    />
                  </div>
                </div>

                {/* Playlists Section */}
                <div className="flex-grow flex flex-col">
                  <div className="flex items-center mb-2 lg:mb-3">
                    <div className="w-5 h-5 lg:w-6 lg:h-6 text-text-muted mr-2">
                      <PlaylistMusicIcon />
                    </div>
                    <h3 className="text-lg lg:text-xl font-semibold text-text-primary">Your Playlists</h3>
                  </div>
                  <div className="bg-secondary rounded-xl p-4 lg:p-5 flex-grow">
                    <UserPlaylists
                        playlists={playlists}
                        loading={loadingPlaylists}
                    />
                  </div>
                </div>

                {/* Footer Link */}
                <div className="mt-3 flex justify-end">
                  <a
                      href={profile.external_urls?.spotify}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-accent hover:text-accent-hover flex items-center"
                  >
                    View your Spotify profile
                    <div className="w-3 h-3 ml-1">
                      <ChevronRightIcon />
                    </div>
                  </a>
                </div>
              </div>
          )}
        </CardBody>
      </Card>
  );
};