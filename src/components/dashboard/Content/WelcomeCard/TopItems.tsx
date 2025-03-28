import Image from "next/image";
import { TopItemsData } from "./types";
import { Skeleton } from "@heroui/react";

interface TopItemsProps {
    topItems: TopItemsData | null;
    loading: boolean;
}

export const TopItems = ({ topItems, loading }: TopItemsProps) => {
    // Format large numbers with commas
    const formatNumber = (num: number) => {
        return num.toLocaleString();
    };

    if (loading) {
        return (
            <div className="space-y-3">
                <Skeleton className="h-7 w-3/4 rounded" />
                <Skeleton className="h-7 w-1/2 rounded" />
            </div>
        );
    }

    if (!topItems) {
        return (
            <p className="text-text-secondary text-sm">No top items available yet. Keep listening to music to see your top picks!</p>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-3">
            {topItems.topArtist && (
                <div className="bg-primary rounded-lg p-3 lg:p-4 border border-gray-800/40">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="relative w-16 h-16 lg:w-20 lg:h-20 rounded-full overflow-hidden flex-shrink-0">
                            {topItems.topArtist.image ? (
                                <Image
                                    src={topItems.topArtist.image}
                                    alt={topItems.topArtist.name}
                                    fill
                                    sizes="(min-width: 1024px) 80px, 64px"
                                    priority
                                    className="object-cover"
                                />
                            ) : (
                                <div className="bg-primary-subtle w-full h-full flex items-center justify-center">
                                  <span className="text-text-primary text-lg lg:text-xl font-bold">
                                    {topItems.topArtist.name.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-text-muted text-sm lg:text-base">Top Artist</p>
                            <h5 className="text-text-primary font-semibold text-xl lg:text-2xl mb-1 truncate">{topItems.topArtist.name}</h5>
                            <div className="flex items-center gap-2">
                                <div className="bg-green-600 h-2 w-20 max-w-full rounded-full overflow-hidden">
                                    <div
                                        className="bg-green-400 h-full"
                                        style={{ width: `${topItems.topArtist.popularity}%` }}
                                    />
                                </div>
                                <span className="text-text-secondary text-sm">{topItems.topArtist.popularity}% popularity</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between items-center mt-2">
                        <div className="text-sm">
                            <span className="text-text-muted mr-1 mb-1">Followers</span>
                            <span className="text-text-primary font-medium">{formatNumber(topItems.topArtist.followers)}</span>
                        </div>

                        <a
                            href={topItems.topArtist.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-accent hover:text-accent-hover mt-3 inline-flex items-center text-xs md:text-sm"
                        >
                            Open in Spotify
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 ml-1">
                                <path fillRule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clipRule="evenodd" />
                            </svg>
                        </a>
                    </div>
                </div>
            )}

            {topItems.topTrack && (
                <div className="bg-primary rounded-lg p-3 lg:p-4 border border-gray-800/40">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="relative w-16 h-16 lg:w-20 lg:h-20 rounded overflow-hidden flex-shrink-0">
                            {topItems.topTrack.image ? (
                                <Image
                                    src={topItems.topTrack.image}
                                    alt={topItems.topTrack.name}
                                    fill
                                    sizes="(min-width: 1024px) 80px, 64px"
                                    priority
                                    className="object-cover"
                                />
                            ) : (
                                <div className="bg-primary-subtle w-full h-full flex items-center justify-center">
                                    <span className="text-text-primary text-lg lg:text-xl font-bold">♫</span>
                                </div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-text-muted text-sm lg:text-base">Top Track</p>
                            <h5 className="text-text-primary font-semibold text-xl lg:text-2xl mb-0.5 truncate">{topItems.topTrack.name}</h5>
                            <p className="text-text-secondary text-sm lg:text-base mb-1 truncate">by {topItems.topTrack.artist}</p>
                            <div className="flex items-center gap-2">
                                <div className="bg-green-600 h-2 w-20 max-w-full rounded-full overflow-hidden">
                                    <div
                                        className="bg-green-400 h-full"
                                        style={{ width: `${topItems.topTrack.popularity}%` }}
                                    />
                                </div>
                                <span className="text-text-secondary text-sm md:text-base">{topItems.topTrack.popularity}% popularity</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end mt-2">
                        <a
                            href={topItems.topTrack.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-accent hover:text-accent-hover mt-3 md:mt-4 inline-flex items-center text-xs md:text-sm"
                        >
                            Open in Spotify
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 md:w-4 md:h-4 ml-1">
                                <path fillRule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clipRule="evenodd" />
                            </svg>
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
};