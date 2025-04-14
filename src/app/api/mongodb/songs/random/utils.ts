import { Db } from "mongodb";
import { Song } from "./types";

// Constants
const SONGS_LIMIT = 10;  // Fetch limit per query

/**
 * Get popular songs across different genres
 * Simplified to focus on popularity with minimal DB queries
 */
export async function getPopularSongsByGenre(
  db: Db, 
  excludedSongIds: string[], 
  limit: number = SONGS_LIMIT
): Promise<Song[]> {
  const genresAggregation = await db
    .collection("songs")
    .aggregate([
      // Group by genre
      { $group: { _id: "$genre" } },
      // Filter out null/empty genres
      { $match: { _id: { $ne: null } } },
      // Sort alphabetically
      { $sort: { _id: 1 } },
      // Project to get a cleaner result
      { $project: { genre: "$_id", _id: 0 } }
    ])
    .toArray();
  
  // Extract genres from aggregation result
  const genres = genresAggregation.map(doc => doc.genre);

  // Use 5 top genres or fewer if there aren't 5 genres
  const topGenreCount = Math.min(5, genres.length);
  const songsPerGenre = Math.ceil(limit / topGenreCount);
  
  let allSongs: Song[] = [];
  
  // For each of the top genres, get the most popular songs
  for (let i = 0; i < topGenreCount; i++) {
    const genre = genres[i];
    
    // Skip null or undefined genres
    if (!genre) continue;
    
    // Get top popular songs for this genre that user hasn't rated
    const genreSongs = await db
      .collection("songs")
      .find({ 
        genre,
        spotifyId: { $nin: excludedSongIds }
      })
      .sort({ popularity: -1 })  // Sort by popularity (highest first)
      .limit(songsPerGenre)      // Take only what we need
      .project({
        id: "$spotifyId",
        name: 1,
        artists: 1,
        album: 1,
        popularity: 1,
        genre: 1
      })
      .toArray() as unknown as Song[];
    
    allSongs.push(...genreSongs);
  }
  
  // If we don't have enough songs, get more popular songs across all genres
  if (allSongs.length < limit) {
    const existingIds = allSongs.map(song => song.id);
    const combinedExcludedIds = [...excludedSongIds, ...existingIds];
    const remainingCount = limit - allSongs.length;
    
    // Get most popular songs across all genres
    const moreSongs = await db
      .collection("songs")
      .find({ 
        spotifyId: { $nin: combinedExcludedIds }
      })
      .sort({ popularity: -1 })
      .limit(remainingCount)
      .project({
        id: "$spotifyId",
        name: 1,
        artists: 1,
        album: 1,
        popularity: 1,
        genre: 1
      })
      .toArray() as unknown as Song[];
    
    allSongs.push(...moreSongs);
  }
  
  return allSongs;
}

/**
 * Get songs based on user's preferences (liked genres and artists)
 * Simplified to focus on genres and artists the user likes
 */
export async function getPreferenceBasedSongs(
  db: Db, 
  userId: string, 
  excludedSongIds: string[], 
  limit: number = SONGS_LIMIT
): Promise<Song[]> {
  // 1. Get genres and artists the user likes
  
  // Get songs the user has liked
  const likedSongs = await db
    .collection("preferences")
    .find({ userId, liked: true })
    .toArray();
  
  // If user hasn't liked any songs, return popular songs
  if (likedSongs.length === 0) {
    return getPopularSongsByGenre(db, excludedSongIds, limit);
  }
  
  // Get the song details for the liked songs
  const likedSongIds = likedSongs.map(pref => pref.songId);
  const likedSongDetails = await db
    .collection("songs")
    .find({ spotifyId: { $in: likedSongIds } })
    .toArray();
  
  // Extract genres and artists from liked songs
  const likedGenres = [...new Set(likedSongDetails.map(song => song.genre).filter(Boolean))];
  const likedArtistIds = [...new Set(
    likedSongDetails.flatMap(song => 
      song.artists?.map((artist: { id?: string }) => artist.id) || []
    ).filter(Boolean)
  )];
  
  // 2. Find songs that match these genres or artists
  let query: any = { spotifyId: { $nin: excludedSongIds } };
  
  // Add genre and artist filters if we have them
  if (likedGenres.length > 0 || likedArtistIds.length > 0) {
    query.$or = [];
    
    if (likedGenres.length > 0) {
      query.$or.push({ genre: { $in: likedGenres } });
    }
    
    if (likedArtistIds.length > 0) {
      query.$or.push({ "artists.id": { $in: likedArtistIds } });
    }
  }
  
  // Get songs matching user preferences, sorted by popularity
  const recommendedSongs = await db
    .collection("songs")
    .find(query)
    .sort({ popularity: -1 })
    .limit(limit)
    .project({
      id: "$spotifyId",
      name: 1,
      artists: 1,
      album: 1,
      popularity: 1,
      genre: 1
    })
    .toArray() as unknown as Song[];
  
  // If we don't have enough songs, get popular songs to fill the gap
  if (recommendedSongs.length < limit) {
    const existingIds = recommendedSongs.map(song => song.id);
    const combinedExcludedIds = [...excludedSongIds, ...existingIds];
    const remainingCount = limit - recommendedSongs.length;
    
    const popularSongs = await db
      .collection("songs")
      .find({ spotifyId: { $nin: combinedExcludedIds } })
      .sort({ popularity: -1 })
      .limit(remainingCount)
      .project({
        id: "$spotifyId",
        name: 1,
        artists: 1,
        album: 1,
        popularity: 1,
        genre: 1
      })
      .toArray() as unknown as Song[];
    
    return [...recommendedSongs, ...popularSongs];
  }
  
  return recommendedSongs;
}

/**
 * Get songs for genre exploration (genres the user hasn't been exposed to)
 * Simplified to focus on popularity with unexplored genres
 */
export async function getGenreExplorationSongs(
  db: Db, 
  userId: string, 
  excludedSongIds: string[], 
  limit: number = SONGS_LIMIT
): Promise<Song[]> {
  // 1. Find genres the user has already rated songs from
  
  // Get all songs the user has rated
  const userRatings = await db
    .collection("preferences")
    .find({ userId })
    .toArray();
  
  // If user hasn't rated any songs, return popular songs
  if (userRatings.length === 0) {
    return getPopularSongsByGenre(db, excludedSongIds, limit);
  }
  
  // Get details of all rated songs
  const ratedSongIds = userRatings.map(rating => rating.songId);
  const ratedSongs = await db
    .collection("songs")
    .find({ spotifyId: { $in: ratedSongIds } })
    .toArray();
  
  // Get genres the user has already been exposed to
  const ratedGenres = [...new Set(ratedSongs.map(song => song.genre).filter(Boolean))];
  
  // 2. Get all available genres
  const genresAggregation = await db
    .collection("songs")
    .aggregate([
      // Group by genre
      { $group: { _id: "$genre" } },
      // Filter out null/empty genres
      { $match: { _id: { $ne: null } } },
      // Project to get a cleaner result
      { $project: { genre: "$_id", _id: 0 } }
    ])
    .toArray();
  
  // Extract genres from aggregation result
  const allGenres = genresAggregation.map(doc => doc.genre);
  
  // 3. Find genres the user hasn't been exposed to
  const newGenres = allGenres.filter(genre => genre && !ratedGenres.includes(genre));
  
  // If user has explored all genres, return popular songs
  if (newGenres.length === 0) {
    return getPopularSongsByGenre(db, excludedSongIds, limit);
  }
  
  // 4. Get popular songs from unexplored genres
  const exploreSongs = await db
    .collection("songs")
    .find({
      spotifyId: { $nin: excludedSongIds },
      genre: { $in: newGenres }
    })
    .sort({ popularity: -1 })
    .limit(limit)
    .project({
      id: "$spotifyId",
      name: 1,
      artists: 1,
      album: 1,
      popularity: 1,
      genre: 1
    })
    .toArray() as unknown as Song[];
  
  // If we don't have enough songs, get popular songs to fill the gap
  if (exploreSongs.length < limit) {
    const existingIds = exploreSongs.map(song => song.id);
    const combinedExcludedIds = [...excludedSongIds, ...existingIds];
    const remainingCount = limit - exploreSongs.length;
    
    const popularSongs = await db
      .collection("songs")
      .find({ spotifyId: { $nin: combinedExcludedIds } })
      .sort({ popularity: -1 })
      .limit(remainingCount)
      .project({
        id: "$spotifyId",
        name: 1,
        artists: 1,
        album: 1,
        popularity: 1,
        genre: 1
      })
      .toArray() as unknown as Song[];
    
    return [...exploreSongs, ...popularSongs];
  }
  
  return exploreSongs;
}
