// Define types for song and preference
export interface Song {
    id: string;
    name: string;
    artists: Array<{
      id?: string;
      name: string;
    }>;
    album: {
      name: string;
      images?: Array<{url: string}>;
    };
    popularity: number;
    genre?: string;
    spotifyId?: string;
}
  
export interface Preference {
    userId: string;
    songId: string;
    liked: boolean;
    timestamp?: string;
}