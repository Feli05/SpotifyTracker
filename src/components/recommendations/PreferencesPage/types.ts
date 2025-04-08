export interface Song {
  id: string;
  name: string;
  artist: string;
  album: string;
  coverUrl: string;
  dominantColor: string;
  year: number;
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