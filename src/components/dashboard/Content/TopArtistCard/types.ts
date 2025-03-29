export interface Artist {
    id: string;
    name: string;
    images: Array<{url: string; height: number; width: number}>;
    followers: {total: number};
    popularity: number;
    genres: string[];
    external_urls: {spotify: string};
}

export type TimeRange = 'short_term' | 'medium_term' | 'long_term';

export interface TimeRangeOption {
    label: string;
    value: TimeRange;
}

export const timeRangeOptions: TimeRangeOption[] = [
    { label: "Today", value: "short_term" },
    { label: "This Year", value: "medium_term" },
    { label: "All Time", value: "long_term" }
];

export interface TopArtistsData {
    items: Artist[];
    loading: boolean;
    error: string | null;
    timeRange: TimeRange;
    setTimeRange: (range: TimeRange) => void;
}