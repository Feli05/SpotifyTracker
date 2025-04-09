import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getSession } from "@/lib/auth";

// GET - Retrieve questionnaire history for a user
export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }
    
    const userId = session.user.id;
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
    console.error("Error fetching questionnaires:", error);
    return NextResponse.json(
      { error: "Failed to fetch questionnaires" },
      { status: 500 }
    );
  }
}

// POST - Save a new questionnaire submission
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session?.user) {
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
    
    const userId = session.user.id;
    const mongo = await clientPromise;
    const db = mongo.db("spotify_tracker");
    
    // Insert the questionnaire
    const result = await db.collection("questionnaires").insertOne({
      userId,
      answers,
      timestamp: new Date()
    });
    
    // Get previous questionnaires for the ML model
    const previousQuestionnaires = await db
      .collection("questionnaires")
      .find({ userId, _id: { $ne: result.insertedId } })
      .sort({ timestamp: -1 })
      .limit(5)
      .toArray();
    
    return NextResponse.json({
      success: true,
      questionnaireId: result.insertedId,
      previousQuestionnaires: previousQuestionnaires
    });
  } catch (error) {
    console.error("Error saving questionnaire:", error);
    return NextResponse.json(
      { error: "Failed to save questionnaire" },
      { status: 500 }
    );
  }
} 