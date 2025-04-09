/**
 * Spotify API service for the song import script
 */

import { SpotifyTokenResponse, SpotifyTrack } from '../models/types';
import { SPOTIFY_API_BASE, SPOTIFY_AUTH_URL, ENV } from '../utils/config';

/**
 * Get a client credentials token from Spotify
 */
export async function getSpotifyToken(): Promise<string> {
  try {
    const response = await fetch(SPOTIFY_AUTH_URL, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(
          ENV.SPOTIFY_CLIENT_ID + ':' + ENV.SPOTIFY_CLIENT_SECRET
        ).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials'
      }).toString()
    });

    if (!response.ok) {
      throw new Error(`Failed to get token: ${response.statusText}`);
    }

    const data = await response.json() as SpotifyTokenResponse;
    return data.access_token;
  } catch (error) {
    console.error('Error getting Spotify token:', error);
    throw error;
  }
}

/**
 * Get tracks for a specific genre using search API
 */
export async function getTracksForGenre(
  token: string, 
  genre: string, 
  limit: number, 
  offset: number = 0
): Promise<SpotifyTrack[]> {
  const url = `${SPOTIFY_API_BASE}/search?q=genre:${encodeURIComponent(genre)}&type=track&limit=${limit}&offset=${offset}&market=US`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    // Handle 4xx errors
    if (response.status >= 400 && response.status < 500) {
      const error: any = new Error(`Bad request received for genre "${genre}"`);
      error.response = response;
      throw error;
    }

    if (!response.ok) {
      throw new Error(`Failed to search tracks: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.tracks || !data.tracks.items) {
      throw new Error('Unexpected response format from search API');
    }
    
    return data.tracks.items as SpotifyTrack[];
  } catch (error: any) {
    // If it's already formatted with a response, just rethrow
    if (error.response) {
      throw error;
    }
    
    // Format other errors
    console.error(`Error searching for genre ${genre}: ${error.message || 'Unknown error'}`);
    throw error;
  }
} 