/**
 * Spotify Song Import Script - Main Entry Point
 * 
 * This script imports the top 500 songs from each major Spotify genre
 * into the MongoDB database for use in the recommendation system.
 * 
 * Usage: npm run import-songs
 */

import { connectToMongoDB, initDatabase, closeMongoDBConnection } from './db/mongodb';
import { getSpotifyToken } from './api/spotify';
import { processSongsForGenre } from './utils/genre-processor';
import { SUPPORTED_GENRES } from './utils/config';

/**
 * Format a time duration in milliseconds to a human-readable string
 */
function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  const remainingSeconds = seconds % 60;
  
  if (hours > 0) {
    return `${hours}h ${remainingMinutes}m ${remainingSeconds}s`;
  }
  return `${minutes}m ${remainingSeconds}s`;
}

/**
 * Main function to run the import process
 */
async function importSongs(): Promise<void> {
  const startTime = Date.now();
  console.log('[IMPORT] Starting song import process');
  
  try {
    // Connect to MongoDB
    const client = await connectToMongoDB();
    
    // Initialize database and collections
    const db = await initDatabase(client);
    
    // Get Spotify access token
    const token = await getSpotifyToken();
    console.log('[IMPORT] Obtained Spotify access token');
    
    // Get available genres
    let genres = SUPPORTED_GENRES;
    
    // Sort genres alphabetically
    genres = genres.sort();
    
    console.log(`[IMPORT] Processing ${genres.length} genres: ${genres.join(', ')}`);
    
    // Process each genre
    let completedGenres = 0;
    for (const genre of genres) {
      try {
        await processSongsForGenre(token, genre, db);
        completedGenres++;
        
        const currentDuration = Date.now() - startTime;
        const avgTimePerGenre = currentDuration / completedGenres;
        const remainingGenres = genres.length - completedGenres;
        const estimatedRemaining = remainingGenres * avgTimePerGenre;
        
        console.log(`[IMPORT] Progress: ${completedGenres}/${genres.length} genres completed`);
        console.log(`[IMPORT] Estimated time remaining: ${formatDuration(estimatedRemaining)}`);
      } catch (genreError: any) {
        console.error(`[IMPORT] Error processing genre ${genre}: ${genreError.message || 'Unknown error'}`);
      }
    }
    
    const totalDuration = Date.now() - startTime;
    console.log(`[IMPORT] Import process completed in ${formatDuration(totalDuration)}`);
    console.log(`[IMPORT] Processed ${completedGenres}/${genres.length} genres successfully`);
  } catch (error: any) {
    const duration = Date.now() - startTime;
    console.error(`[IMPORT] Fatal error after ${formatDuration(duration)}: ${error.message || 'Unknown error'}`);
  } finally {
    await closeMongoDBConnection();
  }
}

// Run the import
importSongs()
  .catch((error: any) => console.error(`[IMPORT] Unhandled error: ${error.message || 'Unknown error'}`))
  .finally(() => process.exit()); 