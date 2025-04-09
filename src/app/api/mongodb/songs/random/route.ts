import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getSupabaseUser } from "@/app/api/supabase/user";

// GET - Retrieve random songs from the database for rating
export async function GET(req: NextRequest) {
  try {
    // Get authenticated user from Supabase
    const { user, error, response } = await getSupabaseUser(req);
    
    if (error || !user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }
    
    const userId = user.id;
    
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
        { $sample: { size: 30 } },
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
    
    // Add dominant color and preview URL (mock data since actual implementation is missing)
    const songsWithUI = randomSongs.map(song => ({
      ...song,
      dominantColor: getRandomColor(),
      previewUrl: null, // Keep as mock value
      // Simulate the structure needed by the UI
      album: {
        ...song.album,
        images: song.album.images || [{ url: "https://via.placeholder.com/300" }]
      }
    }));
    
    return NextResponse.json({ songs: songsWithUI });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch random songs" },
      { status: 500 }
    );
  }
}

// Helper function to generate random colors similar to album artwork
function getRandomColor() {
  const colors = [
    "#3b82f6", // blue
    "#8b5cf6", // purple
    "#ec4899", // pink
    "#f97316", // orange
    "#10b981", // green
    "#6366f1", // indigo
    "#be123c", // rose
    "#0ea5e9"  // sky
  ];
  return colors[Math.floor(Math.random() * colors.length)];
} 