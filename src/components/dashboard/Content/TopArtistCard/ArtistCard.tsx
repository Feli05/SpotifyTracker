import Image from "next/image";
import { Artist } from "./types";

interface ArtistCardProps {
    artist: Artist;
    index: number;
}

export const ArtistCard = ({ artist, index }: ArtistCardProps) => {
    const formatNumber = (num: number) => {
        return num.toLocaleString();
    };

    return (
        <div className="col-span-1">
            <a
                href={artist.external_urls.spotify}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-6 rounded-xl transition-colors bg-secondary hover:bg-primary-subtle shadow-lg hover:shadow-xl"
            >
                <div className="flex gap-6">
                    <div className="relative flex-shrink-0">
                        <div className="relative w-16 h-16 rounded-full overflow-hidden">
                            {artist.images && artist.images[0] ? (
                                <Image
                                    src={artist.images[0].url}
                                    alt={artist.name}
                                    fill
                                    sizes="64px"
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-primary">
                                    <span className="text-2xl text-text-primary">{artist.name.charAt(0)}</span>
                                </div>
                            )}
                        </div>
                        <div className="absolute -top-2 -left-2 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold bg-green-600 text-white">
                            {index + 1}
                        </div>
                    </div>

                    <div className="flex-grow">
                        <h3 className="font-semibold text-lg text-text-primary">{artist.name}</h3>
                        <span className="text-sm text-text-muted">{formatNumber(artist.followers.total)} followers</span>
                    </div>
                </div>

                <div className="mt-4">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-text-muted">Popularity</span>
                        <span className="text-sm text-text-muted">{artist.popularity}%</span>
                    </div>
                    <div className="h-2 bg-primary rounded-full">
                        <div
                            className="bg-green-500 h-full rounded-full"
                            style={{ width: `${artist.popularity}%` }}
                        ></div>
                    </div>
                </div>
            </a>
        </div>
    );
};