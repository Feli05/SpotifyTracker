import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getSupabaseUser } from "@/app/api/supabase/user";

// GET - Retrieve random songs from the database for rating
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
      .then(docs => docs.map(doc => doc.songId));
    
    // Fetch random songs
    // Using MongoDB aggregation pipeline with $sample to get random docs
    const randomSongs = await db
      .collection("songs")
      .aggregate([
        // Filter out songs already rated
        { $match: { spotifyId: { $nin: ratedSongIds } } },
        // Get random sample of songs
        { $sample: { size: limit } },
        // Project only the fields we need
        { $project: {
          id: "$spotifyId",
          name: 1,
          artists: 1,
          album: 1,
          popularity: 1,
          genre: 1
        }}
      ])
      .toArray();
    
    // Prepare songs for the UI
    const songsForUI = randomSongs.map(song => ({
      ...song,
      // Ensure proper image structure for the UI
      album: {
        ...song.album,
        images: song.album.images || [{ url: "https://via.placeholder.com/300" }]
      }
    }));
    
    return NextResponse.json({ songs: songsForUI });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch random songs" },
      { status: 500 }
    );
  }
} 