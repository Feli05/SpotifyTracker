import Image from "next/image";
import { UserPlaylist } from "./types";
import { Skeleton } from "@heroui/react";

interface UserPlaylistsProps {
  playlists: UserPlaylist[];
  loading: boolean;
}

export const UserPlaylists = ({ playlists, loading }: UserPlaylistsProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Skeleton className="h-14 w-full rounded" />
        <Skeleton className="h-14 w-full rounded" />
        <Skeleton className="h-14 w-full rounded" />
      </div>
    );
  }

  if (playlists.length === 0) {
    return (
      <p className="text-white/80 bg-zinc-900 p-3 rounded-lg text-sm">No playlists found.</p>
    );
  }

  // Only show 6 playlists maximum to keep the card compact
  const displayPlaylists = playlists.slice(0, 6);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {displayPlaylists.map(playlist => (
        <a 
          key={playlist.id}
          href={playlist.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 p-3 bg-zinc-900 rounded-lg hover:bg-zinc-800 transition-colors border border-gray-800/40"
        >
          <div className="relative w-12 h-12 rounded overflow-hidden flex-shrink-0">
            {playlist.image ? (
              <Image
                src={playlist.image}
                alt={playlist.name}
                fill
                sizes="48px"
                priority
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                <span className="text-sm font-bold text-white">
                  {playlist.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          <div className="overflow-hidden">
            <p className="font-medium text-sm truncate">{playlist.name}</p>
            <p className="text-xs text-white/60">{playlist.tracks} tracks</p>
          </div>
        </a>
      ))}
    </div>
  );
}; 