import { Skeleton } from "@heroui/react";
import { RecentlyPlayedData } from "./types";

interface RecentlyPlayedProps {
    recentlyPlayed: RecentlyPlayedData | null;
    loading: boolean;
}

export const RecentlyPlayed = ({ recentlyPlayed, loading }: RecentlyPlayedProps) => {
    if (loading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-8 w-3/4 rounded" />
                <Skeleton className="h-8 w-1/2 rounded" />
            </div>
        )
    }

    if (!recentlyPlayed) {
        return (
            <p className="text-white/80">No recently played tracks available.</p>
        )
    }

    return (
        <div className="space-y-4">
            {recentlyPlayed.items.map((item) => (
                <div key={item.track.id}>
                    <h2>{item.track.name}</h2>
                    <p>{item.track.artists.map((artist) => artist.name).join(', ')}</p>
                </div>
            ))}
        </div>
    )
};
