/**
 * Genre processing service for the song import script
 */

import { Collection, Db } from 'mongodb';
import { SongDocument, SpotifyTrack } from '../models/types';
import { getTracksForGenre } from '../api/spotify';
import { getGenreAudioFeatures } from './audio-features';
import { getExistingSongCount, insertSongs } from '../db/mongodb';
import { 
  SONGS_PER_GENRE, 
  BATCH_SIZE, 
  RATE_LIMIT_DELAY,
  ERROR_RETRY_DELAY
} from './config';

// Maximum number of consecutive batches where all tracks already exist
const MAX_CONSECUTIVE_DUPES = 5;

/**
 * Format a time duration in milliseconds to a human-readable string
 */
function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
}

/**
 * Process songs for a specific genre and store them in MongoDB
 */
export async function processSongsForGenre(token: string, genre: string, db: Db): Promise<void> {
  const startTime = Date.now();
  console.log(`[GENRE] [${genre}] Starting processing`);
  
  const collection = db.collection('songs');
  const processedIds = new Set<string>();
  
  // Check existing song count
  const existingCount = await getExistingSongCount(collection, genre);
  console.log(`[GENRE] [${genre}] Found ${existingCount}/${SONGS_PER_GENRE} existing songs`);
  
  if (existingCount >= SONGS_PER_GENRE) {
    console.log(`[GENRE] [${genre}] Quota reached, skipping`);
    return;
  }
  
  let songsToProcess = SONGS_PER_GENRE - existingCount;
  let offset = 0;
  let consecutiveDuplicateBatches = 0;
  let totalNewSongs = 0;
  
  while (songsToProcess > 0) {
    const batchSize = Math.min(BATCH_SIZE, songsToProcess);
    
    try {
      console.log(`[GENRE] [${genre}] Fetching tracks (offset: ${offset}, limit: ${batchSize})`);
      const tracks = await getTracksForGenre(token, genre, batchSize, offset);
      
      if (tracks.length === 0) {
        offset += batchSize;
        await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY));
        continue;
      }
      
      // Filter out tracks we've already processed in this run
      const newTracks = tracks.filter(track => !processedIds.has(track.id));
      if (newTracks.length === 0) {
        offset += batchSize;
        continue;
      }
      
      // Filter out tracks that already exist in the database
      const actualNewTracks = await filterExistingTracks(collection, newTracks);
      
      if (actualNewTracks.length === 0) {
        consecutiveDuplicateBatches++;
        
        if (consecutiveDuplicateBatches >= MAX_CONSECUTIVE_DUPES) {
          console.log(`[GENRE] [${genre}] ${MAX_CONSECUTIVE_DUPES} consecutive batches with all duplicates, stopping`);
          break;
        }
        
        offset += batchSize;
        continue;
      }
      
      // Reset duplicate counter when we find new tracks
      consecutiveDuplicateBatches = 0;
      
      // Prepare and insert documents
      const genreAudioFeatures = getGenreAudioFeatures(genre);
      const documents = createSongDocuments(actualNewTracks, genre, genreAudioFeatures, processedIds);
      
      if (documents.length > 0) {
        const insertedCount = await insertDocuments(collection, documents, genre);
        totalNewSongs += insertedCount;
        songsToProcess -= insertedCount;
        console.log(`[GENRE] [${genre}] Inserted ${insertedCount} songs (${totalNewSongs} total, ${songsToProcess} remaining)`);
      }
      
      await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY));
      offset += batchSize;
    } catch (error: any) {
      // Check if error is a 4xx Bad Request error
      if (error.response && error.response.status >= 400 && error.response.status < 500) {
        console.log(`[GENRE] [${genre}] Bad request received, skipping genre`);
        break; // Skip this genre entirely
      } else {
        console.error(`[GENRE] [${genre}] Error: ${error.message || 'Unknown error'}`);
        await new Promise(resolve => setTimeout(resolve, ERROR_RETRY_DELAY));
        offset += batchSize;
      }
    }
  }
  
  const elapsedTime = Date.now() - startTime;
  const totalCount = await getExistingSongCount(collection, genre);
  
  console.log(`[GENRE] [${genre}] Completed in ${formatDuration(elapsedTime)}`);
  console.log(`[GENRE] [${genre}] Total songs: ${totalCount}/${SONGS_PER_GENRE} (${totalNewSongs} added in this run)`);
}

/**
 * Filter out tracks that already exist in the database
 */
async function filterExistingTracks(
  collection: Collection, 
  tracks: SpotifyTrack[]
): Promise<SpotifyTrack[]> {
  // Check if tracks already exist in the database (across all genres)
  const trackIds = tracks.map(track => track.id);
  const existingTracks = await collection.find({ spotifyId: { $in: trackIds } })
    .project({ spotifyId: 1 })
    .toArray();
  const existingTrackIds = new Set(existingTracks.map(doc => doc.spotifyId));
  
  // Filter out tracks that already exist in the database
  return tracks.filter(track => !existingTrackIds.has(track.id));
}

/**
 * Insert documents into MongoDB
 */
async function insertDocuments(
  collection: Collection,
  documents: SongDocument[],
  genre: string
): Promise<number> {
  const insertedCount = await insertSongs(collection, documents);
  return insertedCount;
}

/**
 * Create song documents from Spotify tracks
 */
function createSongDocuments(
  tracks: SpotifyTrack[], 
  genre: string, 
  audioFeatures: any, 
  processedIds: Set<string>
): SongDocument[] {
  return tracks.map(track => {
    processedIds.add(track.id);
    
    return {
      spotifyId: track.id,
      name: track.name,
      artists: track.artists.map(artist => ({
        id: artist.id,
        name: artist.name
      })),
      album: {
        id: track.album.id,
        name: track.album.name,
        releaseDate: track.album.release_date,
        images: track.album.images
      },
      popularity: track.popularity,
      genre: genre,
      audioFeatures: audioFeatures,
      importDate: new Date()
    };
  });
} 