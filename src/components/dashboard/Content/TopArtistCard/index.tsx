import { Card, CardBody } from "@heroui/react";
import { useEffect, useState } from "react";
import { Artist, TimeRange, timeRangeOptions } from "./types";
import { ArtistCard } from "./ArtistCard";

export const TopArtistCard = () => {
    const [mounted, setMounted] = useState(false);
    const [topArtists, setTopArtists] = useState<Artist[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [timeRange, setTimeRange] = useState<TimeRange>('medium_term');

    // After mounting, we have access to the theme
    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const fetchTopArtists = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/spotify/top-artists?time_range=${timeRange}&limit=10`);

                if (!response.ok) {
                    if (response.status === 401) {
                        setError('Please reconnect your Spotify account');
                    } else {
                        setError(`Failed to fetch top artists: ${response.status}`);
                    }
                    return;
                }

                const data = await response.json();
                setTopArtists(data.items || []);
            } catch (err) {
                console.error('Error fetching top artists:', err);
                setError('Failed to load top artists data');
            } finally {
                setLoading(false);
            }
        };

        fetchTopArtists();
    }, [timeRange]);

    // Don't render theme-specific UI until mounted to prevent flash
    if (!mounted) {
        return <div className="w-full h-full rounded-xl animate-pulse bg-primary-subtle"></div>;
    }

    return (
        <Card className="w-full h-full rounded-xl shadow-xl shadow-primary-subtle/20 hover:shadow-2xl transition-shadow duration-300 bg-primary text-text-primary border border-primary-subtle/40">
            <CardBody className="p-6 flex flex-col h-full">
                <div className="flex flex-row justify-between items-center mb-6">
                    <div className="flex items-center">
                        <div className="bg-green-500/10 p-2 rounded-md mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-green-400">
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-text-primary">Top Artists</h2>
                    </div>

                    <select
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value as TimeRange)}
                        className="px-4 py-2 rounded-lg bg-primary-subtle text-text-secondary border border-primary-subtle/70"
                    >
                        {timeRangeOptions.map(option => (
                            <option key={option.label} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                {error ? (
                    <div className="bg-red-900/30 text-text-primary rounded-lg p-5 text-center mb-4">
                        <p className="mb-3">{error}</p>
                        <button
                            onClick={() => window.location.href = '/api/spotify/connect'}
                            className="px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                        >
                            Reconnect to Spotify
                        </button>
                    </div>
                ) : loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-primary-subtle p-4 rounded-lg animate-pulse h-24"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {topArtists.map((artist, index) => (
                            <ArtistCard key={artist.id} artist={artist} index={index} />
                        ))}
                    </div>
                )}
            </CardBody>
        </Card>
    );
};