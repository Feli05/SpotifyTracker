/**
 * Type definitions for recommendations and related data
 */

// Song in a recommendation
export interface RecommendationSong {
  songId: string;
  name: string;
  artists: string[];
  score: number;
  imageUrl: string;
}

// Recommendation document from MongoDB
export interface Recommendation {
  _id: string;
  userId: string;
  questionnaireId: string;
  timestamp: string;
  playlistName?: string;
  recommendations: RecommendationSong[];
}

// API response from the recommendations endpoint
export interface RecommendationsResponse {
  recommendations: Recommendation[];
} 