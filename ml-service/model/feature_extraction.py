"""
Feature extraction and processing for song data.
"""
import numpy as np
from sklearn.preprocessing import MinMaxScaler

def extract_features(songs):
    """
    Extract relevant audio features from song data and prepare for processing.
    
    Args:
        songs (list): List of song documents from MongoDB
        
    Returns:
        tuple: (features_array, song_map) where:
            - features_array is a normalized numpy array of audio features
            - song_map is a dictionary mapping feature indices to song documents
    """
    features = []
    song_map = {}
    feature_names = ['danceability', 'energy', 'valence', 'acousticness', 
                     'instrumentalness', 'tempo', 'popularity']
    
    for song in songs:
        song_id = song.get('spotifyId')
        audio_feat = song.get('audioFeatures', {})
        
        # Extract relevant features for clustering
        if audio_feat:
            # Store mapping from features index to song
            song_map[len(features)] = song
            
            # Extract features with better defaults
            popularity = song.get('popularity', 50) / 100.0  # Normalize to 0-1 range
            
            # Handle missing audio features more gracefully
            feat_vector = [
                audio_feat.get('danceability', 0.5),
                audio_feat.get('energy', 0.5),
                audio_feat.get('valence', 0.5),  # Positivity/happiness
                audio_feat.get('acousticness', 0.5),
                audio_feat.get('instrumentalness', 0.5),
                audio_feat.get('tempo', 120) / 200.0,  # Normalize tempo
                popularity  # Include song popularity as a feature
            ]
            features.append(feat_vector)
    
    # Convert to numpy array for processing
    if not features:
        return None, {}
    
    features_array = np.array(features)
    
    # Check for NaN values and replace with column means
    col_means = np.nanmean(features_array, axis=0)
    for i in range(features_array.shape[1]):
        mask = np.isnan(features_array[:, i])
        features_array[mask, i] = col_means[i]
    
    # Normalize features
    features_array = MinMaxScaler().fit_transform(features_array)
    
    return features_array, song_map

def apply_preference_weights(features_array, mood, vibe):
    """
    Apply weights to features based on user's mood and vibe preferences.
    
    Args:
        features_array (np.array): Normalized feature array
        mood (str): User's mood preference
        vibe (str): User's vibe preference
        
    Returns:
        np.array: Weighted feature array
    """
    weighted_array = features_array.copy()
    
    # Default weights (no strong preference)
    weights = np.ones(features_array.shape[1])
    
    # Feature indices for reference:
    # 0: danceability, 1: energy, 2: valence, 3: acousticness, 
    # 4: instrumentalness, 5: tempo, 6: popularity
    
    # Weight features based on mood preference
    if mood == 'energetic':
        # Increase importance of energy and tempo
        weights[1] = 2.0  # energy
        weights[5] = 1.5  # tempo
        weights[3] = 0.7  # reduce acousticness
    elif mood == 'chill':
        # Increase importance of acousticness and decrease energy
        weights[3] = 2.0  # acousticness
        weights[1] = 0.7  # energy
        weights[5] = 0.7  # tempo
    elif mood == 'balanced':
        # Balanced mood - slight preference for moderate energy
        weights[1] = 1.3  # energy
    
    # Weight features based on vibe preference
    if vibe == 'happy':
        # Increase importance of valence (positivity)
        weights[2] = 2.0  # valence
        weights[0] = 1.3  # danceability
    elif vibe == 'sad':
        # Decrease importance of valence (positivity)
        weights[2] = 0.5  # valence
        weights[3] = 1.5  # acousticness
    elif vibe == 'balanced':
        # Slightly prefer more positive music
        weights[2] = 1.3  # valence
    
    # Apply the weights to each column
    for i in range(features_array.shape[1]):
        weighted_array[:, i] *= weights[i]
    
    return weighted_array 