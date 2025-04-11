import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getSupabaseUser } from "@/app/api/supabase/user";
import { ObjectId } from "mongodb";

// GET - Retrieve user recommendations
export async function GET(req: NextRequest) {
  try {
    // Get authenticated user
    const { user, error } = await getSupabaseUser(req);
    
    if (error || !user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }
    
    const userId = user.id;
    
    // Connect to MongoDB
    const mongo = await clientPromise;
    const db = mongo.db("spotify_tracker");
    
    // Get user's recommendations
    const recommendations = await db
      .collection("recommendations")
      .find({ userId })
      .sort({ timestamp: -1 }) // Most recent first
      .toArray();
    
    return NextResponse.json({ recommendations });
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return NextResponse.json(
      { error: "Failed to fetch recommendations" },
      { status: 500 }
    );
  }
}

// PUT - Update a recommendation's name
export async function PUT(req: NextRequest) {
  try {
    // Get authenticated user
    const { user, error } = await getSupabaseUser(req);
    
    if (error || !user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }
    
    const userId = user.id;
    
    // Parse request body
    const body = await req.json();
    const { recommendationId, playlistName } = body;
    
    if (!recommendationId || !playlistName || typeof playlistName !== 'string') {
      return NextResponse.json(
        { error: "Invalid parameters" },
        { status: 400 }
      );
    }
    
    // Connect to MongoDB
    const mongo = await clientPromise;
    const db = mongo.db("spotify_tracker");
    
    // Ensure the recommendation exists and belongs to the user
    const recommendation = await db
      .collection("recommendations")
      .findOne({ 
        _id: new ObjectId(recommendationId),
        userId
      });
    
    if (!recommendation) {
      return NextResponse.json(
        { error: "Recommendation not found" },
        { status: 404 }
      );
    }
    
    // Update the recommendation with playlist name
    const result = await db
      .collection("recommendations")
      .updateOne(
        { _id: new ObjectId(recommendationId) },
        { $set: { playlistName: playlistName } }
      );
    
    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: "Failed to update recommendation" },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ 
      success: true,
      message: "Playlist name updated successfully" 
    });
  } catch (error) {
    console.error("Error updating recommendation:", error);
    return NextResponse.json(
      { error: "Failed to update recommendation" },
      { status: 500 }
    );
  }
} 