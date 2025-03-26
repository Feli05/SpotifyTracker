import Image from "next/image";
import { TopItemsData } from "./types";
import { Skeleton } from "@heroui/react";
import { useTheme } from "next-themes";

interface TopItemsProps {
    topItems: TopItemsData | null;
    loading: boolean;
}

export const TopItems = ({ topItems, loading }: TopItemsProps) => {
    const { resolvedTheme } = useTheme();

    // Format large numbers with commas
    const formatNumber = (num: number) => {
        return num.toLocaleString();
    };

    if (loading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-8 w-3/4 rounded" />
                <Skeleton className="h-8 w-1/2 rounded" />
            </div>
        );
    }

    if (!topItems) {
        return (
            <p className={`${
                resolvedTheme === 'dark'
                    ? 'text-white/80'
                    : 'text-gray-600'
            }`}>No top items available yet. Keep listening to music to see your top picks!</p>
        );
    }

    return (
        <div className="space-y-6">
            {topItems.topArtist && (
                <div className={`${
                    resolvedTheme === 'dark'
                        ? 'bg-zinc-900'
                        : 'bg-white'
                } rounded-lg p-4 md:p-6 shadow-sm`}>
                    <div className="flex items-center gap-4 md:gap-6 mb-3">
                        <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden flex-shrink-0">
                            {topItems.topArtist.image ? (
                                <Image
                                    src={topItems.topArtist.image}
                                    alt={topItems.topArtist.name}
                                    fill
                                    sizes="(max-width: 768px) 80px, 96px"
                                    className="object-cover"
                                />
                            ) : (
                                <div className={`w-full h-full ${
                                    resolvedTheme === 'dark'
                                        ? 'bg-gray-700'
                                        : 'bg-gray-300'
                                } flex items-center justify-center`}>
                  <span className={`text-xl md:text-2xl font-bold ${
                      resolvedTheme === 'dark'
                          ? 'text-white'
                          : 'text-gray-800'
                  }`}>
                    {topItems.topArtist.name.charAt(0).toUpperCase()}
                  </span>
                                </div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className={`text-base md:text-lg ${
                                resolvedTheme === 'dark'
                                    ? 'text-white/80'
                                    : 'text-gray-600'
                            }`}>Top Artist</p>
                            <h5 className={`font-semibold text-2xl md:text-4xl mb-1 md:mb-3 truncate ${
                                resolvedTheme === 'dark'
                                    ? 'text-white'
                                    : 'text-gray-800'
                            }`}>{topItems.topArtist.name}</h5>
                            <div className="flex items-center gap-2 md:gap-3">
                                <div className="bg-green-600 h-2 md:h-3 w-16 md:w-32 max-w-full rounded-full overflow-hidden">
                                    <div
                                        className="bg-green-400 h-full"
                                        style={{ width: `${topItems.topArtist.popularity}%` }}
                                    />
                                </div>
                                <span className={`text-sm md:text-base ${
                                    resolvedTheme === 'dark'
                                        ? 'text-white/80'
                                        : 'text-gray-600'
                                }`}>{topItems.topArtist.popularity}% popularity</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-2 md:mt-3 text-sm md:text-base">
                        <p className={`mb-1 ${
                            resolvedTheme === 'dark'
                                ? 'text-white/60'
                                : 'text-gray-500'
                        }`}>Followers</p>
                        <p className={`font-medium ${
                            resolvedTheme === 'dark'
                                ? 'text-white'
                                : 'text-gray-800'
                        }`}>{formatNumber(topItems.topArtist.followers)}</p>
                    </div>

                    <a
                        href={topItems.topArtist.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`mt-3 inline-flex items-center text-xs md:text-sm ${
                            resolvedTheme === 'dark'
                                ? 'text-green-400 hover:text-green-300'
                                : 'text-green-600 hover:text-green-700'
                        }`}
                    >
                        Open in Spotify
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 md:w-4 md:h-4 ml-1">
                            <path fillRule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clipRule="evenodd" />
                        </svg>
                    </a>
                </div>
            )}

            {topItems.topTrack && (
                <div className={`${
                    resolvedTheme === 'dark'
                        ? 'bg-zinc-900'
                        : 'bg-white'
                } rounded-lg p-4 md:p-10 shadow-sm`}>
                    <div className="flex items-center gap-4 md:gap-6 mb-3">
                        <div className="relative w-20 h-20 md:w-24 md:h-24 rounded overflow-hidden flex-shrink-0">
                            {topItems.topTrack.image ? (
                                <Image
                                    src={topItems.topTrack.image}
                                    alt={topItems.topTrack.name}
                                    fill
                                    sizes="(max-width: 768px) 80px, 96px"
                                    className="object-cover"
                                />
                            ) : (
                                <div className={`w-full h-full ${
                                    resolvedTheme === 'dark'
                                        ? 'bg-gray-700'
                                        : 'bg-gray-300'
                                } flex items-center justify-center`}>
                  <span className={`text-xl md:text-2xl font-bold ${
                      resolvedTheme === 'dark'
                          ? 'text-white'
                          : 'text-gray-800'
                  }`}>♫</span>
                                </div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className={`text-base md:text-lg ${
                                resolvedTheme === 'dark'
                                    ? 'text-white/80'
                                    : 'text-gray-600'
                            }`}>Top Track</p>
                            <h5 className={`font-semibold text-2xl md:text-4xl mb-1 md:mb-2 truncate ${
                                resolvedTheme === 'dark'
                                    ? 'text-white'
                                    : 'text-gray-800'
                            }`}>{topItems.topTrack.name}</h5>
                            <p className={`text-base md:text-xl ${
                                resolvedTheme === 'dark'
                                    ? 'text-white/80'
                                    : 'text-gray-600'
                            } mb-1 md:mb-3 truncate`}>by {topItems.topTrack.artist}</p>
                            <div className="flex items-center gap-2 md:gap-3">
                                <div className="bg-green-600 h-2 md:h-3 w-16 md:w-32 max-w-full rounded-full overflow-hidden">
                                    <div
                                        className="bg-green-400 h-full"
                                        style={{ width: `${topItems.topTrack.popularity}%` }}
                                    />
                                </div>
                                <span className={`text-sm md:text-base ${
                                    resolvedTheme === 'dark'
                                        ? 'text-white/80'
                                        : 'text-gray-600'
                                }`}>{topItems.topTrack.popularity}% popularity</span>
                            </div>
                        </div>
                    </div>

                    <a
                        href={topItems.topTrack.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`mt-3 md:mt-4 inline-flex items-center text-xs md:text-sm ${
                            resolvedTheme === 'dark'
                                ? 'text-green-400 hover:text-green-300'
                                : 'text-green-600 hover:text-green-700'
                        }`}
                    >
                        Open in Spotify
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 md:w-4 md:h-4 ml-1">
                            <path fillRule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clipRule="evenodd" />
                        </svg>
                    </a>
                </div>
            )}
        </div>
    );
};