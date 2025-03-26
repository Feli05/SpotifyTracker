export interface StatsOverview {
  totalSavedAlbums: number;
  totalFollowedArtists: number;
  totalUserPlaylists: number;
}

export interface RecentlyPlayedSong {
  id: string;
  title: string;
  artist: string;
  albumCover?: string;
  playedAt: string;
  url: string;
}

export interface TopGenre {
  name: string;
  count: number;
  percentage: number;
}

export interface QuickStatsData {
  statsOverview: StatsOverview;
  recentlyPlayed: RecentlyPlayedSong[];
  topGenres: TopGenre[];
  loading: boolean;
  error: string | null;
}

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

