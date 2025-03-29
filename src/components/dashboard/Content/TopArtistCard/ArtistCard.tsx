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
                className="flex gap-4 p-3 rounded-lg transition-colors bg-primary-subtle hover:bg-secondary shadow-md hover:shadow-lg"
            >
                <div className="relative flex-shrink-0">
                    <div className="relative w-16 h-16 rounded overflow-hidden">
                        {artist.images && artist.images[0] ? (
                            <Image
                                src={artist.images[0].url}
                                alt={artist.name}
                                fill
                                sizes="64px"
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-secondary">
                                <span className="text-2xl text-text-primary">{artist.name.charAt(0)}</span>
                            </div>
                        )}
                    </div>
                    <div className="absolute -top-2 -left-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-green-600 text-white">
                        {index + 1}
                    </div>
                </div>

                <div className="flex-grow">
                    <h3 className="font-medium text-base truncate text-text-primary">{artist.name}</h3>

                    <div className="mt-1.5 flex items-center">
                        <div className="flex-grow h-1.5 bg-primary rounded-full">
                            <div
                                className="bg-green-500 h-full rounded-full"
                                style={{ width: `${artist.popularity}%` }}
                            ></div>
                        </div>
                        <span className="ml-2 text-xs text-text-muted">{artist.popularity}%</span>
                    </div>

                    <div className="flex justify-between items-center mt-1.5">
                        <span className="text-xs text-text-muted">
                            {formatNumber(artist.followers.total)} followers
                        </span>

                        {artist.genres && artist.genres.length > 0 && (
                            <span className="text-xs px-2 py-0.5 rounded bg-primary text-text-secondary">
                                {artist.genres[0]}
                            </span>
                        )}
                    </div>
                </div>
            </a>
        </div>
    );
};