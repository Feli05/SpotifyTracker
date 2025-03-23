import Image from "next/image";
import { SpotifyProfile } from "./types";
import { Skeleton } from "@heroui/react";

interface UserInfoProps {
  profile: SpotifyProfile | null;
  loading: boolean;
  error: string | null;
}

export const UserInfo = ({ profile, loading, error }: UserInfoProps) => {
  // Format subscription type for display
  const formatSubscription = (product: string) => {
    if (!product) return 'Unknown';
    return product.charAt(0).toUpperCase() + product.slice(1);
  };

  if (loading) {
    return (
      <div className="flex gap-5">
        <Skeleton className="rounded-full w-40 h-40" />
        <div className="flex-1">
          <Skeleton className="h-9 w-3/4 rounded mb-3" />
          <Skeleton className="h-6 w-1/2 rounded mb-3" />
          <Skeleton className="h-6 w-2/3 rounded mb-3" />
          <Skeleton className="h-6 w-1/3 rounded" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-5 bg-red-900/50 text-white rounded-lg flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-semibold mb-2">Connection Required</p>
          <p>{error}</p>
          <button 
            onClick={() => window.location.href = '/api/spotify/connect'}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Connect to Spotify
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-5 bg-gray-700 text-white rounded-lg flex items-center justify-center">
        <p>No profile data available</p>
      </div>
    );
  }

  return (
    <div className="flex gap-5 items-center">
      {profile.images && profile.images[0] ? (
        <div className="relative w-40 h-40 rounded-full overflow-hidden flex-shrink-0">
          <Image 
            src={profile.images[0].url} 
            alt={profile.display_name || 'Spotify User'} 
            fill
            sizes="160px"
            className="object-cover"
          />
        </div>
      ) : (
        <div className="w-40 h-40 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
          <span className="text-4xl font-bold text-white">
            {profile.display_name?.charAt(0).toUpperCase() || 'S'}
          </span>
        </div>
      )}
      
      <div>
        <h3 className="text-3xl font-semibold mb-3 text-white">{profile.display_name || 'Spotify User'}</h3>
        <div className="space-y-2">
          <p className="text-xl text-gray-300">
            <span className="font-medium text-white">Country:</span> {profile.country || 'Unknown'}
          </p>
          <p className="text-xl text-gray-300">
            <span className="font-medium text-white">Followers:</span> {profile.followers?.total.toLocaleString() || '0'}
          </p>
          <p className="text-xl text-gray-300">
            <span className="font-medium text-white">Subscription:</span> {formatSubscription(profile.product)}
          </p>
        </div>
      </div>
    </div>
  );
}; 