import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getSupabaseUser } from "@/app/api/supabase/user";

// GET - Retrieve preference count for a user
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
    
    // Count the preferences for this user
    const preferenceCount = await db
      .collection("preferences")
      .countDocuments({ userId });
    
    return NextResponse.json({ count: preferenceCount });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch preferences count" },
      { status: 500 }
    );
  }
}

// POST - Save a new song preference
export async function POST(req: NextRequest) {
  try {
    // Get authenticated user from Supabase
    const { user, error, response } = await getSupabaseUser(req);
    
    if (error || !user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }
    
    const body = await req.json();
    const { songId, liked } = body;
    
    if (!songId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    const userId = user.id;
    
    const mongo = await clientPromise;
    const db = mongo.db("spotify_tracker");
    
    // Insert the preference
    const preference = {
      userId,
      songId,
      liked,
      timestamp: new Date()
    };
    
    const result = await db.collection("preferences").insertOne(preference);
    
    // Get the total count
    const preferenceCount = await db
      .collection("preferences")
      .countDocuments({ userId });
    
    return NextResponse.json({
      success: true,
      count: preferenceCount,
      preferenceId: result.insertedId
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to save preference" },
      { status: 500 }
    );
  }
} 