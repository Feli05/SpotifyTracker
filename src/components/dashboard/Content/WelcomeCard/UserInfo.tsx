import Image from "next/image";
import { SpotifyProfile } from "./types";
import { Skeleton } from "@heroui/react";
import { useTheme } from "next-themes";

interface UserInfoProps {
  profile: SpotifyProfile | null;
  loading: boolean;
  error: string | null;
}

export const UserInfo = ({ profile, loading, error }: UserInfoProps) => {
  const { resolvedTheme } = useTheme();

  // Format subscription type for display
  const formatSubscription = (product: string) => {
    if (!product) return 'Unknown';
    return product.charAt(0).toUpperCase() + product.slice(1);
  };

  if (loading) {
    return (
      <div className="flex gap-4">
        <Skeleton className="rounded-full w-24 h-24" />
        <div className="flex-1">
          <Skeleton className="h-7 w-3/4 rounded mb-3" />
          <Skeleton className="h-5 w-1/2 rounded mb-3" />
          <Skeleton className="h-5 w-2/3 rounded" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
        <div className={`p-5 ${
            resolvedTheme === 'dark'
                ? 'bg-red-900/50 text-white'
                : 'bg-red-100 text-red-800'
        } rounded-lg flex items-center justify-center`}>
          <div className="text-center">
            <p className="text-lg font-semibold mb-2">Connection Required</p>
            <p className="text-sm">{error}</p>
            <button
                onClick={() => window.location.href = '/api/spotify/connect'}
                className="mt-3 px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
            >
              Connect to Spotify
            </button>
          </div>
        </div>
    );
  }

  if (!profile) {
    return (
        <div className={`p-5 ${
            resolvedTheme === 'dark'
                ? 'bg-gray-700 text-white'
                : 'bg-gray-200 text-gray-800'
        } rounded-lg flex items-center justify-center`}>
          <p className="text-sm">No profile data available</p>
        </div>
    );
  }

  return (
      <div className="flex gap-5 lg:gap-6 items-center">
        {profile.images && profile.images[0] ? (
            <div className="relative w-24 h-24 lg:w-30 lg:h-30 rounded-full overflow-hidden flex-shrink-0 border-2 border-zinc-700">
              <Image
                  src={profile.images[0].url}
                  alt={profile.display_name || 'Spotify User'}
                  fill
                  sizes="(min-width: 1024px) 112px, 96px"
                  priority
                  className="object-cover"
              />
            </div>
        ) : (
            <div className={`w-24 h-24 lg:w-28 lg:h-28 rounded-full ${
                resolvedTheme === 'dark'
                    ? 'bg-gray-700'
                    : 'bg-gray-300'
            } flex items-center justify-center flex-shrink-0`}>
          <span className={`text-2xl lg:text-3xl font-bold ${
              resolvedTheme === 'dark' ? 'text-white' : 'text-gray-700'
          }`}>
            {profile.display_name?.charAt(0).toUpperCase() || 'S'}
          </span>
            </div>
        )}

        <div>
          <h3 className={`text-2xl lg:text-3xl font-semibold mb-3 lg:mb-4 ${
              resolvedTheme === 'dark' ? 'text-white' : 'text-gray-800'
          }`}>{profile.display_name || 'Spotify User'}</h3>
          <div className="space-y-2 lg:space-y-3">
            <p className={`text-sm lg:text-base ${
                resolvedTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
            <span className={`font-medium ${
                resolvedTheme === 'dark' ? 'text-white' : 'text-gray-800'
            }`}>Country:</span> {profile.country || 'Unknown'}
            </p>
            <p className={`text-sm lg:text-base ${
                resolvedTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
            <span className={`font-medium ${
                resolvedTheme === 'dark' ? 'text-white' : 'text-gray-800'
            }`}>Followers:</span> {profile.followers?.total.toLocaleString() || '0'}
            </p>
            <p className={`text-sm lg:text-base ${
                resolvedTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
            <span className={`font-medium ${
                resolvedTheme === 'dark' ? 'text-white' : 'text-gray-800'
            }`}>Subscription:</span> {formatSubscription(profile.product)}
            </p>
          </div>
        </div>
      </div>
  );
};