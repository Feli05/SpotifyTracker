import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getSession } from "@/lib/auth";

// Define types for clarity
type MoodType = 'energetic' | 'relaxed' | 'focused' | 'melancholic' | 'happy';
type ActivityType = 'working' | 'exercising' | 'relaxing' | 'commuting' | 'partying';
type TempoType = 'energetic' | 'moderate' | 'slow' | 'varied';
type DiscoveryType = 'familiar' | 'mix' | 'discover' | 'wildcard';

// GET - Retrieve recommendations for a user
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
    
    // Get all recommendations for the user, sorted by most recent first
    const recommendations = await db
      .collection("recommendations")
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray();
    
    return NextResponse.json(recommendations);
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return NextResponse.json(
      { error: "Failed to fetch recommendations" },
      { status: 500 }
    );
  }
}

// POST - Generate a new recommendation based on preferences and questionnaire
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
    const { 
      mood, 
      activity, 
      tempo, 
      discovery 
    }: { 
      mood: MoodType, 
      activity: ActivityType, 
      tempo: TempoType, 
      discovery: DiscoveryType 
    } = body;
    
    const userId = session.user.id;
    const mongo = await clientPromise;
    const db = mongo.db("spotify_tracker");
    
    // Get user preferences to use for recommendation
    const preferences = await db
      .collection("preferences")
      .find({ userId, liked: true })
      .toArray();
    
    if (preferences.length < 50) {
      return NextResponse.json(
        { error: "Not enough preferences for recommendation" },
        { status: 400 }
      );
    }
    
    // This would be where the machine learning model is called
    // const recommendedTracks = await generateRecommendation(preferences, mood, activity, tempo, discovery);
    
    // For now, we'll just mock a recommendation
    const mockRecommendation = {
      userId,
      name: getRecommendationName(mood, activity),
      description: getRecommendationDescription(mood, activity, tempo),
      createdAt: new Date(),
      tracks: [], // This would be populated by the ML model
      mood,
      activity,
      tempo,
      discovery
    };
    
    // Save the recommendation to the database
    const result = await db
      .collection("recommendations")
      .insertOne(mockRecommendation);
    
    return NextResponse.json({
      success: true,
      recommendationId: result.insertedId,
      recommendation: {
        ...mockRecommendation,
        _id: result.insertedId
      }
    });
  } catch (error) {
    console.error("Error generating recommendation:", error);
    return NextResponse.json(
      { error: "Failed to generate recommendation" },
      { status: 500 }
    );
  }
}

// Helper functions to generate names and descriptions
function getRecommendationName(mood: MoodType, activity: ActivityType): string {
  const moodNames: Record<MoodType, string> = {
    energetic: "Energizing",
    relaxed: "Chill",
    focused: "Focus",
    melancholic: "Reflective",
    happy: "Upbeat"
  };
  
  const activityNames: Record<ActivityType, string> = {
    working: "Work",
    exercising: "Workout",
    relaxing: "Relaxation",
    commuting: "Commute",
    partying: "Party"
  };
  
  return `${moodNames[mood] || "Custom"} ${activityNames[activity] || "Mix"}`;
}

function getRecommendationDescription(
  mood: MoodType, 
  activity: ActivityType, 
  tempo: TempoType
): string {
  const tempoDescriptions: Record<TempoType, string> = {
    energetic: "high-energy",
    moderate: "mid-tempo",
    slow: "downtempo",
    varied: "dynamic"
  };
  
  return `A ${tempoDescriptions[tempo] || "custom"} playlist designed for ${activity} when you're feeling ${mood}.`;
} 