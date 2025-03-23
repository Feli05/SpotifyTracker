import { Card, CardBody } from "@heroui/react";
import { useEffect, useState } from "react";
import { UserInfo } from "./UserInfo";
import { TopItems } from "./TopItems";
import { UserPlaylists } from "./UserPlaylists";
import { SpotifyProfile, TopItemsData, UserPlaylist } from "./types";

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
    <Card className="w-full rounded-xl shadow-md bg-[#18181B] text-white">
      <CardBody className="p-4">
        <h2 className="text-2xl font-bold mb-4 text-white">Welcome to your Spotify Dashboard!</h2>
        
        {/* User Profile Information */}
        <UserInfo 
          profile={profile} 
          loading={loading} 
          error={error} 
        />
        
        {!loading && !error && profile && (
          <div className="mt-6">
            {/* Top Items Section */}
            <div className="p-4 bg-black rounded-lg text-white">
              <h4 className="font-semibold mb-4 text-xl">Your Top Picks</h4>
              <TopItems 
                topItems={topItems} 
                loading={loadingTopItems} 
              />
            </div>
            
            {/* Playlists Section */}
            <div className="mt-5">
              <h4 className="font-semibold mb-4 text-xl">Your Playlists</h4>
              <UserPlaylists 
                playlists={playlists} 
                loading={loadingPlaylists} 
              />
            </div>
            
            {/* Footer Link */}
            <a 
              href={profile.external_urls?.spotify} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block mt-3 mb-2 text-sm text-green-400 hover:text-green-300 font-medium"
            >
              View your Spotify profile →
            </a>
          </div>
        )}
      </CardBody>
    </Card>
  );
}; 