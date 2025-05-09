import { Card, CardBody } from "@heroui/react";
import { useEffect, useState } from "react";
import { ArtistCard } from "./ArtistCard";
import { Artist } from "./types";
import { HomeIcon } from "@/components/icons";

export const TopArtistCard = () => {
    const [mounted, setMounted] = useState(false);
    const [topArtists, setTopArtists] = useState<Artist[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const fetchTopArtists = async () => {
            try {
                setLoading(true);
                // Just call the API once without time_range parameter
                const response = await fetch('/api/spotify/top-artists');

                if (!response.ok) {
                    console.error('Failed to fetch top artists:', response.status);
                    return;
                }

                const data = await response.json();
                setTopArtists(data.items || []);
            } catch (err) {
                console.error('Error fetching top artists:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchTopArtists();
    }, []);

    if (!mounted) {
        return <div className="w-full h-full rounded-xl animate-pulse bg-primary-subtle"></div>;
    }

    return (
        <Card className="w-full h-full rounded-xl shadow-xl shadow-primary-subtle/20 hover:shadow-2xl transition-shadow duration-300 bg-primary text-text-primary border-2 border-primary-subtle/60">
            <CardBody className="p-6 flex flex-col h-full">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
                    <div className="flex items-center">
                        <div className="bg-green-500/10 p-2 rounded-md mr-3">
                            <div className="w-6 h-6 text-green-400">
                                <HomeIcon />
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-text-primary">Top Artists</h2>
                    </div>
                </div>
                {loading ? (
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