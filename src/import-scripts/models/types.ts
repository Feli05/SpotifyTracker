/**
 * Type definitions for the Spotify song import script
 */

// Spotify API response types
export interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: {
    id: string;
    name: string;
  }[];
  album: {
    id: string;
    name: string;
    release_date: string;
    images: {
      url: string;
      height: number;
      width: number;
    }[];
  };
  popularity: number;
}

// Audio features structure for our database
export interface AudioFeatures {
  danceability: number;
  energy: number;
  key: number;
  loudness: number;
  mode: number;
  speechiness: number;
  acousticness: number;
  instrumentalness: number;
  liveness: number;
  valence: number;
  tempo: number;
  duration_ms: number;
  time_signature: number;
}

// Document schema for songs collection
export interface SongDocument {
  spotifyId: string;
  name: string;
  artists: {
    id: string;
    name: string;
  }[];
  album: {
    id: string;
    name: string;
    releaseDate: string;
    images: {
      url: string;
      height: number;
      width: number;
    }[];
  };
  popularity: number;
  genre: string;
  audioFeatures: AudioFeatures;
  importDate: Date;
} 