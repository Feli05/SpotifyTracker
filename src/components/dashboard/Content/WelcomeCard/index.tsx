import { Card, CardBody } from "@heroui/react";
import { useEffect, useState } from "react";
import { UserInfo } from "./UserInfo";
import { TopItems } from "./TopItems";
import { UserPlaylists } from "./UserPlaylists";
import { SpotifyProfile, TopItemsData, UserPlaylist } from "./types";
import { useTheme } from "next-themes";

export const WelcomeCard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<SpotifyProfile | null>(null);
  const [topItems, setTopItems] = useState<TopItemsData | null>(null);
  const [playlists, setPlaylists] = useState<UserPlaylist[]>([]);
  const [loadingTopItems, setLoadingTopItems] = useState(false);
  const [loadingPlaylists, setLoadingPlaylists] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/spotify/profile');

        if (!response.ok) {
          if (response.status === 400) {
            setError('Please connect your Spotify account first');
          } else {
            setError('Failed to load profile data');
          }
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
      <Card className="w-full h-full rounded-xl shadow-xl shadow-primary-subtle/20 hover:shadow-2xl transition-shadow duration-300 bg-primary text-text-primary border border-primary-subtle/40">
        <CardBody className="p-6 flex flex-col h-full">
          <div className="flex flex-row justify-between items-center mb-4">
            <div className="flex items-center">
              <div className="bg-green-500/10 p-2 rounded-md mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-green-400">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
                </svg>
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
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 lg:w-6 lg:h-6 text-text-muted mr-2">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                    </svg>
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
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 lg:w-6 lg:h-6 text-text-muted mr-2">
                      <path d="M15 6H3v2h12V6zm0 4H3v2h12v-2zM3 16h8v-2H3v2zM17 6v8.18c-.31-.11-.65-.18-1-.18-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3V8h3V6h-5z"/>
                    </svg>
                    <h3 className="text-lg lg:text-xl font-semibold text-text-primary">Your Playlists</h3>
                  </div>
                  <div className="bg-primary-subtle rounded-xl p-4 lg:p-5 flex-grow">
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
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 ml-1">
                      <path fillRule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clipRule="evenodd" />
                    </svg>
                  </a>
                </div>
              </div>
          )}
        </CardBody>
      </Card>
  );
};