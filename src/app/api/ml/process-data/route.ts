import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

/**
 * Send all required data to the ML service.
 * This includes:
 * - User preferences
 * - Questionnaires (current + history)
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { questionnaireId } = body;
    
    if (!questionnaireId) {
      return NextResponse.json(
        { error: "Missing required questionnaireId" },
        { status: 400 }
      );
    }
    
    const mongo = await clientPromise;
    const db = mongo.db("spotify_tracker");
    
    // 1. Get the questionnaire to determine user ID
    const questionnaire = await db
      .collection("questionnaires")
      .findOne({ _id: new ObjectId(questionnaireId) });
    
    if (!questionnaire) {
      return NextResponse.json(
        { error: "Questionnaire not found" },
        { status: 404 }
      );
    }
    
    // Extract user ID from the questionnaire
    const userId = questionnaire.userId;
    
    // 2. Get all previous questionnaires
    const previousQuestionnaires = await db
      .collection("questionnaires")
      .find({ userId, _id: { $ne: new ObjectId(questionnaireId) } })
      .sort({ timestamp: -1 })
      .toArray();
    
    // 3. Get all user preferences
    const preferences = await db
      .collection("preferences")
      .find({ userId })
      .toArray();
    
    // ML service will fetch songs directly from database
    
    // 4. Send data to ML service
    const mlServiceUrl = process.env.ML_SERVICE_URL;
    
    try {
      const mlResponse = await fetch(`${mlServiceUrl}/api/process-data`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId,
          currentQuestionnaire: questionnaire,
          previousQuestionnaires,
          preferences
        })
      });
      
      if (!mlResponse.ok) {
        return NextResponse.json({
          success: false
        }, { status: 502 });
      }
      
      const result = await mlResponse.json();
      
      return NextResponse.json({
        success: true
      });
    } catch (error) {
      return NextResponse.json({
        success: false
      }, { status: 503 });
    }
  } catch (error) {
    return NextResponse.json({
      success: false
    }, { status: 500 });
  }
} 