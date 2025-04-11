"""
Song clustering using KMeans algorithm.
"""
from sklearn.cluster import KMeans
import numpy as np
from sklearn.decomposition import PCA
from sklearn.metrics import silhouette_score
from . import utils

def cluster_songs(features_array, song_count):
    """
    Cluster songs based on their audio features using KMeans with adaptive cluster count.
    
    Args:
        features_array (np.array): Normalized and weighted feature array
        song_count (int): Total number of songs
        
    Returns:
        tuple: (clusters, kmeans_model) where:
            - clusters is a numpy array of cluster assignments
            - kmeans_model is the fitted KMeans model
    """
    # Determine optimal cluster count based on dataset size
    # Using min_clusters to avoid warnings about too many clusters
    min_clusters = 3
    max_clusters = min(max(5, song_count // 100), 10)  # Reduced from 15 to 10 max
    
    # Handle case where we don't have enough data points for multiple clusters
    if features_array.shape[0] < max_clusters:
        max_clusters = max(min_clusters, features_array.shape[0] // 5)
    
    # Apply dimensionality reduction if needed
    # This helps with high-dimensional feature spaces
    if features_array.shape[1] > 3 and features_array.shape[0] > 10:
        pca = PCA(n_components=min(features_array.shape[0]-1, features_array.shape[1], 10))
        reduced_features = pca.fit_transform(features_array)
    else:
        reduced_features = features_array
    
    # Find optimal number of clusters using silhouette score
    best_score = -1
    best_n_clusters = max(min_clusters, min(5, max_clusters))  # Default if we can't find better
    
    # Only try to find optimal clusters if we have enough data points
    if reduced_features.shape[0] >= 20:
        for n_clusters in range(min_clusters, max_clusters + 1):
            # Skip if we have too few samples for the number of clusters
            if reduced_features.shape[0] <= n_clusters + 1:
                continue
                
            kmeans = KMeans(
                n_clusters=n_clusters, 
                random_state=42, 
                n_init=10,  # Explicit to avoid warnings
                init='k-means++'
            )
            cluster_labels = kmeans.fit_predict(reduced_features)
            
            # Skip silhouette calculation if only one cluster or if all points in one cluster
            if n_clusters <= 1 or len(np.unique(cluster_labels)) <= 1:
                continue
                
            try:
                score = silhouette_score(reduced_features, cluster_labels)
                if score > best_score:
                    best_score = score
                    best_n_clusters = n_clusters
            except Exception as e:
                # Silhouette score can fail in some cases
                continue
    
    # Use the optimal number of clusters
    kmeans = KMeans(
        n_clusters=best_n_clusters, 
        random_state=42, 
        n_init=10,  # Explicit to avoid warnings
        init='k-means++'
    )
    
    # Run on original feature space for final clustering
    clusters = kmeans.fit_predict(features_array)
    
    return clusters, kmeans

def get_cluster_members(clusters, cluster_id):
    """
    Get indices of all songs in a specific cluster.
    
    Args:
        clusters (np.array): Array of cluster assignments
        cluster_id (int): Cluster ID to find members for
        
    Returns:
        np.array: Indices of songs in the specified cluster
    """
    return np.where(clusters == cluster_id)[0]

def calculate_distance_to_center(features_array, kmeans_model, song_idx, cluster_id):
    """
    Calculate the distance from a song to its cluster center.
    
    Args:
        features_array (np.array): Normalized feature array
        kmeans_model (KMeans): Fitted KMeans model
        song_idx (int): Index of the song in the feature array
        cluster_id (int): Cluster ID of the song
        
    Returns:
        float: Distance to the cluster center
    """
    return np.linalg.norm(features_array[song_idx] - kmeans_model.cluster_centers_[cluster_id]) 