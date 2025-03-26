import { Skeleton } from "@heroui/react";
import { StatsOverview as StatsOverviewType } from "./types";

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
          <div key={i} className="bg-black/30 rounded-lg p-4">
            <Skeleton className="h-7 w-3/4 rounded mb-2" />
            <Skeleton className="h-9 w-1/2 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/30 text-white rounded-lg p-4 text-center">
        <p>{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-gray-800/50 text-white rounded-lg p-4 text-center">
        <p>No stats data available</p>
      </div>
    );
  }

  const stats = [
    {
      title: "Saved Albums",
      value: data.totalSavedAlbums.toLocaleString(),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5zm0-5.5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"/>
        </svg>
      ),
      color: "from-emerald-900/60 to-emerald-800/40",
      bgColor: "bg-emerald-500/10",
      textColor: "text-emerald-300"
    },
    {
      title: "Followed Artists",
      value: data.totalFollowedArtists.toLocaleString(),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
      ),
      color: "from-indigo-900/60 to-indigo-800/40",
      bgColor: "bg-indigo-500/10",
      textColor: "text-indigo-300"
    },
    {
      title: "User Playlists",
      value: data.totalUserPlaylists.toLocaleString(),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 10H10V9h8v3zm0-5H10V4h8v3z"/>
        </svg>
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
              <h4 className="text-sm font-medium text-gray-400 mb-1">{stat.title}</h4>
              <p className={`text-3xl xl:text-4xl font-bold ${stat.textColor}`}>{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
