import Image from "next/image";
import { UserPlaylist } from "./types";
import { Skeleton } from "@heroui/react";
import { useTheme } from "next-themes";

interface UserPlaylistsProps {
  playlists: UserPlaylist[];
  loading: boolean;
}

export const UserPlaylists = ({ playlists, loading }: UserPlaylistsProps) => {
  const { resolvedTheme } = useTheme();

  if (loading) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Skeleton className="h-16 w-full rounded" />
          <Skeleton className="h-16 w-full rounded" />
          <Skeleton className="h-16 w-full rounded" />
        </div>
    );
  }

  if (playlists.length === 0) {
    return (
        <p className={`${
            resolvedTheme === 'dark'
                ? 'text-white/80 bg-zinc-900'
                : 'text-gray-600 bg-gray-100'
        } p-4 rounded-lg`}>No playlists found.</p>
    );
  }

  return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {playlists.map(playlist => (
            <a
                key={playlist.id}
                href={playlist.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-3 p-3 ${
                    resolvedTheme === 'dark'
                        ? 'bg-zinc-900 hover:bg-zinc-800'
                        : 'bg-gray-100 hover:bg-gray-200'
                } rounded-lg transition-colors`}
            >
              <div className="relative w-10 h-10 rounded overflow-hidden flex-shrink-0">
                {playlist.image ? (
                    <Image
                        src={playlist.image}
                        alt={playlist.name}
                        fill
                        sizes="40px"
                        className="object-cover"
                    />
                ) : (
                    <div className={`w-full h-full ${
                        resolvedTheme === 'dark'
                            ? 'bg-gray-700'
                            : 'bg-gray-300'
                    } flex items-center justify-center`}>
                <span className={`text-sm font-bold ${
                    resolvedTheme === 'dark' ? 'text-white' : 'text-gray-700'
                }`}>
                  {playlist.name.charAt(0).toUpperCase()}
                </span>
                    </div>
                )}
              </div>
              <div className="overflow-hidden">
                <p className={`font-medium text-sm truncate ${
                    resolvedTheme === 'dark' ? 'text-white' : 'text-gray-800'
                }`}>{playlist.name}</p>
                <p className={`text-xs ${
                    resolvedTheme === 'dark' ? 'text-white/60' : 'text-gray-600'
                }`}>{playlist.tracks} tracks</p>
              </div>
            </a>
        ))}
      </div>
  );
};