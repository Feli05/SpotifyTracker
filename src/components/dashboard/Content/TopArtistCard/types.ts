export interface Artist {
    id: string;
    name: string;
    images: Array<{url: string; height: number; width: number}>;
    followers: {total: number};
    popularity: number;
    external_urls: {spotify: string};
} 