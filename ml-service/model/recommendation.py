"""
Main recommendation generation process.
"""
from . import feature_extraction
from . import clustering
from . import scoring
from . import utils

def generate_recommendations(db, user_id, questionnaire_id, preferences=None, current_questionnaire=None):
    """
    Generate song recommendations for a user based on their preferences and listening history.
    
    Args:
        db: Database connection
        user_id: User ID
        questionnaire_id: Questionnaire ID
        preferences: User preferences (optional)
        current_questionnaire: Current questionnaire data (optional)
        
    Returns:
        dict: Status of recommendation generation
    """
    try:
        # Extract questionnaire answers
        answers = current_questionnaire.get('answers', [])
        
        # Extract user preferences
        mood, vibe, discovery = utils.extract_questionnaire_preferences(answers)
        
        # Extract liked and disliked song IDs
        liked_song_ids, disliked_song_ids = utils.extract_song_preferences(preferences)
        
        # Fetch all songs from database
        all_songs = list(db.songs.find({}))
        song_count = len(all_songs)
        
        if song_count == 0:
            return False
        
        # Extract features from songs
        features_array, song_map = feature_extraction.extract_features(all_songs)
        
        if features_array is None:
            return False
        
        # Apply preference weights to features
        weighted_features = feature_extraction.apply_preference_weights(features_array, mood, vibe)
        
        # Cluster the songs
        clusters, kmeans_model = clustering.cluster_songs(weighted_features, song_count)
        
        # Score songs based on user preferences
        song_scores = scoring.score_songs(
            weighted_features, clusters, kmeans_model, song_map,
            liked_song_ids, disliked_song_ids, discovery
        )
        
        # Rank and select top recommendations
        top_recommendations = scoring.rank_recommendations(song_scores, limit=15)
        
        # Format recommendations for storage
        formatted_recommendations = scoring.format_recommendations(top_recommendations)
        
        # Create recommendation document
        recommendation_doc = scoring.create_recommendation_document(
            user_id, questionnaire_id, formatted_recommendations
        )
        
        # Save recommendations to database
        db.recommendations.insert_one(recommendation_doc)
        
        return True
    except Exception as e:
        return False 