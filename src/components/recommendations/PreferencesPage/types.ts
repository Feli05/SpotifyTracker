export interface Song {
  id: string;
  name: string;
  artist: string;
  album: string;
  coverUrl: string;
  year: number;
}

/**
 * API response format for a song from the MongoDB API
 */
export interface ApiSong {
  id: string;
  name: string;
  artists: Array<{ name: string }>;
  album: {
    name: string;
    images?: Array<{ url: string }>;
    releaseDate?: string;
  };
}

export interface Preference {
  songId: string;
  liked: boolean;
  timestamp: string;
}

export interface SongCardProps {
  song: Song;
  direction: number;
  onSwipe: (direction: number) => void;
}

export interface RatingButtonsProps {
  onRate: (direction: number) => void;
}

export interface HeaderProps {
  preferenceCount: number;
  requiredCount: number;
}

export interface PreferencesPageState {
  songs: Song[];
  currentSongIndex: number;
  direction: number;
  preferenceCount: number;
  mounted: boolean;
} 