import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getSupabaseUser } from "@/app/api/supabase/user";

// GET - Retrieve questionnaire history for a user
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
    
    // Get questionnaires for this user, sorted by timestamp descending
    const questionnaires = await db
      .collection("questionnaires")
      .find({ userId })
      .sort({ timestamp: -1 })
      .toArray();
    
    return NextResponse.json({ questionnaires });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch questionnaires" },
      { status: 500 }
    );
  }
}

// POST - Save a new questionnaire submission and process with ML service
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
    const { answers } = body;
    
    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return NextResponse.json(
        { error: "Missing or invalid answers" },
        { status: 400 }
      );
    }
    
    const userId = user.id;
    const mongo = await clientPromise;
    const db = mongo.db("spotify_tracker");
    
    // 1. Insert the questionnaire
    const result = await db.collection("questionnaires").insertOne({
      userId,
      answers,
      timestamp: new Date()
    });
    
    const questionnaireId = result.insertedId;
    
    // 2. Call the ML service through our internal API
    try {
      // For server-side API routes, we need an absolute URL
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      
      await fetch(`${baseUrl}/api/ml/process-data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          questionnaireId: questionnaireId.toString()
        })
      });
      
    } catch (error) {
      // Silently handle errors - the questionnaire was still saved successfully
    }
    
    return NextResponse.json({
      success: true,
      questionnaireId
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
} 