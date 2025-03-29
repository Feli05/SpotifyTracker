import { Skeleton } from "@heroui/react";
import { RecentlyPlayedSong } from "./types";
import Image from "next/image";

interface RecentlyPlayedProps {
  songs: RecentlyPlayedSong[];
  loading: boolean;
  error: string | null;
}

export const RecentlyPlayed = ({ songs, loading, error }: RecentlyPlayedProps) => {
  if (loading) {
    return (
        <div className="bg-primary rounded-xl p-5 flex-grow">
          <div className="space-y-5">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 bg-primary-subtle rounded-lg p-4">
                  <Skeleton className="w-16 h-16 rounded-md flex-shrink-0" />
                  <div className="flex-1">
                    <Skeleton className="h-5 w-3/4 rounded mb-2" />
                    <Skeleton className="h-4 w-1/2 rounded mb-2" />
                    <Skeleton className="h-3 w-1/3 rounded" />
                  </div>
                </div>
            ))}
          </div>
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

  if (!songs || songs.length === 0) {
    return (
        <div className="bg-primary-subtle text-text-primary rounded-lg p-4 text-center">
          <p>No recently played tracks available</p>
        </div>
    );
  }

  const formatPlayedAt = (playedAt: string) => {
    const date = new Date(playedAt);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 60) {
      return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffMins < 1440) {
      const hours = Math.floor(diffMins / 60);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
      <div className="bg-secondary rounded-xl p-5 flex-grow">
        <div className="space-y-5">
          {songs.map((song) => (
              <a
                  href={song.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={song.id}
                  className="flex items-stretch bg-primary-subtle hover:bg-secondary rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-200 border border-gray-800/40"
              >
                {song.albumCover ? (
                    <div className="relative w-24 h-24 overflow-hidden flex-shrink-0">
                      <Image
                          src={song.albumCover}
                          alt={`${song.title} cover`}
                          fill
                          sizes="96px"
                          priority
                          className="object-cover"
                      />
                    </div>
                ) : (
                    <div className="w-24 h-24 bg-secondary flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-text-muted">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5zm0-5.5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"/>
                      </svg>
                    </div>
                )}

                <div className="flex-1 p-4 flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold text-text-primary text-base lg:text-sm truncate">
                      {song.title}
                    </h3>
                    <p className="text-text-muted text-sm truncate">
                      {song.artist}
                    </p>
                  </div>

                  <div className="mt-2">
                    <span className="bg-primary px-3 py-1 rounded-full text-xs font-medium text-text-secondary inline-block">
                      {formatPlayedAt(song.playedAt)}
                    </span>
                  </div>
                </div>
              </a>
          ))}
        </div>
      </div>
  );
};