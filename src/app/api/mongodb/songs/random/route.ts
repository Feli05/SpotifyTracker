import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getSupabaseUser } from "@/app/api/supabase/user";
import { Document } from "mongodb";
import { Song } from "./types";
import { getPopularSongsByGenre, getPreferenceBasedSongs, getGenreExplorationSongs } from "./utils";

// GET - Retrieve smart song recommendations
export async function GET(req: NextRequest) {
  try {
    // Get authenticated user from Supabase
    const { user, error } = await getSupabaseUser(req);
    
    if (error || !user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }
    
    const userId = user.id;
    
    // Get the limit parameter from the URL or default to 10
    const searchParams = req.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    
    const mongo = await clientPromise;
    const db = mongo.db("spotify_tracker");
    
    // Get IDs of songs that user has already rated to exclude them
    const ratedSongIds = await db
      .collection("preferences")
      .find({ userId })
      .project({ songId: 1, _id: 0 })
      .toArray()
      .then((docs: Document[]) => docs.map(doc => doc.songId as string));
  
    // Determine selection strategy based on user's rating count
    const ratingCount = ratedSongIds.length;
    let songs: Song[] = [];
    
    if (ratingCount < 10) {
      // Cold start: Get popular songs across different genres
      songs = await getPopularSongsByGenre(db, ratedSongIds, limit);
    } else if (ratingCount < 30) {
      // Early stage: Mix popular songs (70%) with some preference-based songs (30%)
      const popularLimit = Math.ceil(limit * 0.7);
      const preferenceLimit = limit - popularLimit;
      
      const popularSongs = await getPopularSongsByGenre(db, ratedSongIds, popularLimit);
      const preferenceSongs = await getPreferenceBasedSongs(db, userId, ratedSongIds, preferenceLimit);
      
      songs = [...popularSongs, ...preferenceSongs];
    } else {
      // Mature stage: Use preference-based recommendations and genre exploration
      const preferenceLimit = Math.ceil(limit * 0.6);
      const explorationLimit = limit - preferenceLimit;
      
      const preferenceSongs = await getPreferenceBasedSongs(db, userId, ratedSongIds, preferenceLimit);
      const exploreSongs = await getGenreExplorationSongs(db, userId, ratedSongIds, explorationLimit);
      
      songs = [...preferenceSongs, ...exploreSongs];
    }
    
    // Prepare songs for the UI
    const songsForUI = songs.map(song => ({
      ...song,
      // Ensure proper image structure for the UI
      album: {
        ...song.album,
        images: song.album.images
      }
    }));
    
    return NextResponse.json({ songs: songsForUI });
  } catch (error) {
    console.error("Error fetching songs:", error);
    return NextResponse.json(
      { error: "Failed to fetch songs" },
      { status: 500 }
    );
  }
} 