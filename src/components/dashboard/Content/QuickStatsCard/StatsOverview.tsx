import { Skeleton } from "@heroui/react";
import { StatsOverview as StatsOverviewType } from "./types";
import { AlbumIcon, HomeIcon, UserPlaylistsIcon } from "@/components/icons";

interface StatsOverviewProps {
  data: StatsOverviewType | undefined;
  loading: boolean;
  error: string | null;
}

export const StatsOverview = ({ data, loading, error }: StatsOverviewProps) => {
  if (loading) {
    return (
        <div className="grid grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-primary-subtle rounded-lg p-4">
                <Skeleton className="h-7 w-3/4 rounded mb-2" />
                <Skeleton className="h-9 w-1/2 rounded" />
              </div>
          ))}
        </div>
    );
  }

  if (error) {
    return (
        <div className="bg-red-900/30 text-text-primary rounded-lg p-4 text-center">
          <p>{error}</p>
        </div>
    );
  }

  if (!data) {
    return (
        <div className="bg-primary-subtle text-text-primary rounded-lg p-4 text-center">
          <p>No stats data available</p>
        </div>
    );
  }

  const stats = [
    {
      title: "Saved Albums",
      value: data.totalSavedAlbums.toLocaleString(),
      icon: (
        <div className="w-6 h-6">
          <AlbumIcon />
        </div>
      ),
      color: "from-emerald-900/60 to-emerald-800/40",
      bgColor: "bg-emerald-500/10",
      textColor: "text-emerald-300"
    },
    {
      title: "Followed Artists",
      value: data.totalFollowedArtists.toLocaleString(),
      icon: (
        <div className="w-6 h-6">
          <HomeIcon />
        </div>
      ),
      color: "from-indigo-900/60 to-indigo-800/40",
      bgColor: "bg-indigo-500/10",
      textColor: "text-indigo-300"
    },
    {
      title: "User Playlists",
      value: data.totalUserPlaylists.toLocaleString(),
      icon: (
        <div className="w-6 h-6">
          <UserPlaylistsIcon />
        </div>
      ),
      color: "from-purple-900/60 to-purple-800/40",
      bgColor: "bg-purple-500/10",
      textColor: "text-purple-300"
    }
  ];

  return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {stats.map((stat, index) => (
            <div
                key={index}
                className={`bg-gradient-to-br ${stat.color} rounded-xl p-6 border border-gray-800/50 shadow-lg hover:shadow-xl transition-all duration-200 h-full`}
            >
              <div className="flex flex-col space-y-4">
                <div className={`${stat.bgColor} p-3 rounded-lg w-fit`}>
                  <div className={`${stat.textColor}`}>
                    {stat.icon}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-text-muted mb-1">{stat.title}</h4>
                  <p className={`text-3xl xl:text-4xl font-bold ${stat.textColor}`}>{stat.value}</p>
                </div>
              </div>
            </div>
        ))}
      </div>
  );
};