"""
Song scoring and recommendation generation.
"""
from datetime import datetime
import numpy as np

def score_songs(features_array, clusters, kmeans_model, song_map, 
                liked_song_ids, disliked_song_ids, discovery):
    """
    Score each song based on liked/disliked songs in its cluster and user preferences.
    
    Args:
        features_array (np.array): Normalized and weighted feature array
        clusters (np.array): Array of cluster assignments
        kmeans_model (KMeans): Fitted KMeans model
        song_map (dict): Mapping from feature indices to song documents
        liked_song_ids (list): List of liked song IDs
        disliked_song_ids (list): List of disliked song IDs
        discovery (str): User's discovery preference
        
    Returns:
        dict: Dictionary mapping song IDs to score data
    """
    # Create sets for liked and disliked songs for quick lookup
    liked_songs_set = set(liked_song_ids)
    disliked_songs_set = set(disliked_song_ids)
    
    # Get cluster statistics
    cluster_counts = {}
    cluster_liked_counts = {}
    cluster_liked_songs = {}
    
    # Calculate base statistics per cluster
    for idx, song_idx in enumerate(song_map.keys()):
        song = song_map[song_idx]
        song_id = song.get('spotifyId')
        cluster_id = clusters[idx]
        
        # Skip if this isn't a valid song
        if not song_id:
            continue
            
        # Initialize cluster counts if needed
        if cluster_id not in cluster_counts:
            cluster_counts[cluster_id] = 0
            cluster_liked_counts[cluster_id] = 0
            cluster_liked_songs[cluster_id] = []
            
        # Count interactions
        cluster_counts[cluster_id] += 1
        
        # Count liked songs in this cluster
        if song_id in liked_songs_set:
            cluster_liked_counts[cluster_id] += 1
            cluster_liked_songs[cluster_id].append(song_idx)
    
    # Score each song
    song_scores = {}
    
    # For each song in the dataset
    for idx, song_idx in enumerate(song_map.keys()):
        song = song_map[song_idx]
        song_id = song.get('spotifyId')
        
        # Skip if this isn't a valid song
        if not song_id:
            continue
            
        # Skip songs the user has already interacted with
        if song_id in liked_songs_set or song_id in disliked_songs_set:
            continue
            
        cluster_id = clusters[idx]
        
        # Base score is initially from popularity and recency
        base_score = song.get('popularity', 50) / 100.0  # Normalize to 0-1
        
        # Adjust for song release date if available
        if 'album' in song and 'releaseDate' in song['album']:
            try:
                release_date = datetime.fromisoformat(song['album']['releaseDate'].replace('Z', '+00:00'))
                # Calculate recency score (1.0 for current year, decreasing for older)
                current_year = datetime.now().year
                years_old = max(0, current_year - release_date.year)
                recency_factor = 1.0 / (1.0 + (years_old / 10.0))  # Decay factor
                base_score = 0.7 * base_score + 0.3 * recency_factor
            except (ValueError, TypeError):
                # If date parsing fails, don't adjust
                pass
        
        # Initialize score with base
        score = base_score * 40  # Scale to make it significant
        
        # Factor 1: Cluster affinity
        # Calculate affinity based on ratio of liked songs in this cluster
        cluster_liked_ratio = 0
        if cluster_counts.get(cluster_id, 0) > 0:
            liked_count = cluster_liked_counts.get(cluster_id, 0)
            total_count = cluster_counts.get(cluster_id, 0)
            
            # Use a weighted ratio that considers the amount of data
            # This is to avoid overfitting on clusters with few samples
            if total_count > 0:
                confidence = min(1.0, total_count / 5.0)  # More ratings = more confidence
                # Weighted average between observed ratio and neutral prior
                cluster_liked_ratio = (confidence * liked_count / total_count) + (1 - confidence) * 0.5
                
                # Scale up the score based on this ratio (higher for clusters with more liked songs)
                score += cluster_liked_ratio * 50  # Major factor
        
        # Factor 2: Feature similarity
        # Find similar songs among those the user liked
        if liked_song_ids:
            # Calculate average distance to liked songs in same cluster
            avg_distance = 100  # Start with large value
            
            # If there are liked songs in this cluster, compare to them
            if cluster_id in cluster_liked_songs and cluster_liked_songs[cluster_id]:
                distances = []
                for liked_idx in cluster_liked_songs[cluster_id]:
                    # Calculate Euclidean distance in feature space
                    dist = np.linalg.norm(features_array[idx] - features_array[liked_idx])
                    distances.append(dist)
                
                # Use smaller distances (more similar = better)
                if distances:
                    # Take average of top 3 closest songs or fewer
                    distances.sort()
                    avg_distance = np.mean(distances[:min(3, len(distances))])
            
            # Convert distance to similarity score (smaller distance = higher score)
            similarity_score = max(0, 30 - (avg_distance * 60))  # Scale and invert
            score += similarity_score
        
        # Factor 3: Discovery preference adjustment
        if discovery == 'similar':
            # For users who want similar music, boost songs in clusters with liked songs
            if cluster_liked_counts.get(cluster_id, 0) > 0:
                score *= 1.3
        elif discovery == 'explore':
            # For users who want to explore, boost songs in clusters with fewer interactions
            # but still prefer clusters with some likes over those with only dislikes
            total_interactions = cluster_counts.get(cluster_id, 0)
            if total_interactions == 0:
                # Unexplored cluster
                score *= 1.3
            elif total_interactions < 3 and cluster_liked_counts.get(cluster_id, 0) > 0:
                # Lightly explored with at least one like
                score *= 1.2
        
        # Store the final score
        song_scores[song_id] = {
            'score': max(0, score),  # Ensure non-negative score
            'song': song
        }
    
    return song_scores

def rank_recommendations(song_scores, limit=50):
    """
    Rank and select top recommendations based on scores with artist diversity.
    
    Args:
        song_scores (dict): Dictionary mapping song IDs to score data
        limit (int): Maximum number of recommendations to return
        
    Returns:
        list: List of (song_id, data) tuples for top recommendations
    """
    # Sort songs by score (descending)
    sorted_scores = sorted(
        song_scores.items(), 
        key=lambda x: x[1]['score'], 
        reverse=True
    )
    
    # Apply artist diversity filter
    top_recommendations = []
    artists_included = set()  # Track artists we've already included
    artist_max_songs = 2      # Maximum songs per artist
    artist_count = {}         # Count songs per artist
    
    # First pass: add top recommendations with artist diversity constraint
    for song_id, data in sorted_scores:
        if len(top_recommendations) >= limit:
            break
            
        song = data['song']
        # Get all artist IDs for this song
        artist_ids = [artist.get('id') for artist in song.get('artists', []) if artist.get('id')]
        
        # Skip if we already have max songs from this artist
        should_skip = False
        for artist_id in artist_ids:
            if artist_count.get(artist_id, 0) >= artist_max_songs:
                should_skip = True
                break
                
        if should_skip:
            continue
            
        # Add the song and update artist counts
        top_recommendations.append((song_id, data))
        for artist_id in artist_ids:
            artists_included.add(artist_id)
            artist_count[artist_id] = artist_count.get(artist_id, 0) + 1
    
    # If we don't have enough songs yet, add more without the artist constraint
    if len(top_recommendations) < limit:
        for song_id, data in sorted_scores:
            if song_id not in [rec[0] for rec in top_recommendations] and len(top_recommendations) < limit:
                top_recommendations.append((song_id, data))
    
    return top_recommendations

def format_recommendations(top_recommendations):
    """
    Format recommendations for storage in the database.
    
    Args:
        top_recommendations (list): List of (song_id, data) tuples
        
    Returns:
        list: Formatted recommendations ready for storage
    """
    formatted_recommendations = []
    
    for song_id, data in top_recommendations:
        song = data['song']
        
        recommendation = {
            'songId': song_id,
            'name': song.get('name', ''),
            'artists': [a.get('name', '') for a in song.get('artists', [])],
            'score': data['score'],
            'imageUrl': song.get('album', {}).get('images', [{}])[0].get('url', '') 
                if song.get('album', {}).get('images') else ''
        }
        
        formatted_recommendations.append(recommendation)
    
    return formatted_recommendations

def create_recommendation_document(user_id, questionnaire_id, recommendations):
    """
    Create a recommendation document for storage in the database.
    
    Args:
        user_id (str): User ID
        questionnaire_id (str): Questionnaire ID
        recommendations (list): Formatted recommendations
        
    Returns:
        dict: Recommendation document
    """
    return {
        'userId': user_id,
        'questionnaireId': questionnaire_id,
        'timestamp': datetime.utcnow(),
        'recommendations': recommendations
    } 