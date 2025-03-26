export interface RecentlyPlayedData {
    items: {
        track: {
            id: string;
            name: string;
            artists: { name: string }[];
            album: { images: { url: string }[] };
        },
        played_at: string;
    }[];
}

