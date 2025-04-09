/**
 * Configuration settings for the Spotify song import script
 */

import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Validate required environment variables
if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET || !process.env.MONGODB_URI) {
  console.error('Error: Required environment variables are missing!');
  console.error('Make sure SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, and MONGODB_URI are defined in .env.local');
  process.exit(1);
}

// API endpoints
export const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';
export const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/api/token';

// Import settings
export const SONGS_PER_GENRE = 500;
export const BATCH_SIZE = 50;
export const DB_NAME = "spotify_tracker";

// List of genres to process
export const SUPPORTED_GENRES = [
  "acoustic",
  "afrobeat",
  "alt-rock",
  "alternative",
  "ambient",
  "blues",
  "classical",
  "country",
  "dance",
  "deep-house",
  "disco",
  "drum-and-bass",
  "dubstep",
  "edm",
  "electronic",
  "folk",
  "funk",
  "hip-hop",
  "house",
  "indie",
  "indie-pop",
  "jazz",
  "latin",
  "metal",
  "pop",
  "punk",
  "r-n-b",
  "reggae",
  "rock",
  "soul"
];

// API and process settings
export const RATE_LIMIT_DELAY = 1000; // Delay between API calls in ms
export const ERROR_RETRY_DELAY = 5000; // Delay when an error occurs

// Export environment variables for use in other modules
export const ENV = {
  MONGODB_URI: process.env.MONGODB_URI as string,
  SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID as string,
  SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET as string
}; 