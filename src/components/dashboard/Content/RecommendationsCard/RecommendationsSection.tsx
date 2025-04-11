import { useState, useEffect } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@/components/icons";
import { Recommendation, RecommendationsResponse } from "./types";
import Image from "next/image";

const RecommendationsSection: React.FC = () => {
  // State to track expanded recommendations
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});
  // State to track playlist names being entered
  const [playlistNames, setPlaylistNames] = useState<Record<string, string>>({});
  // State to track which recommendations are in editing mode
  const [editingIds, setEditingIds] = useState<Record<string, boolean>>({});
  // State to store recommendations
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  // Loading state
  const [loading, setLoading] = useState(true);
  
  // Fetch recommendations from API
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        // Simple GET request without any additional parameters
        const response = await fetch('/api/mongodb/recommendations');
        if (!response.ok) throw new Error('Failed to fetch recommendations');
        const data: RecommendationsResponse = await response.json();
        setRecommendations(data.recommendations || []);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecommendations();
  }, []);
  
  // Update a recommendation with playlist name (directly in MongoDB)
  const updateRecommendation = async (recommendationId: string, playlistName: string) => {
    try {
      // Update recommendation in the database
      const response = await fetch('/api/mongodb/recommendations', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          recommendationId, 
          playlistName 
        })
      });
      
      if (!response.ok) throw new Error('Failed to update recommendation');
      
      // Update local state to reflect changes
      setRecommendations(prevRecs => 
        prevRecs.map(rec => 
          rec._id === recommendationId ? { ...rec, playlistName } : rec
        )
      );
      
      return true;
    } catch (error) {
      console.error('Error updating recommendation:', error);
      return false;
    }
  };
  
  // Toggle expansion state for a recommendation
  const toggleExpanded = (id: string) => {
    setExpandedIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  // Get a default playlist name based on position in array
  const getDefaultPlaylistName = (index: number) => {
    return `Playlist #${index + 1}`;
  };
  
  // Start editing a playlist name
  const startEditing = (id: string, index: number, currentName?: string) => {
    setPlaylistNames(prev => ({
      ...prev,
      [id]: currentName || getDefaultPlaylistName(index)
    }));
    setEditingIds(prev => ({
      ...prev,
      [id]: true
    }));
  };
  
  // Save a playlist name
  const savePlaylistName = async (id: string) => {
    const name = playlistNames[id];
    if (!name) return;
    
    const success = await updateRecommendation(id, name);
    if (success) {
      setEditingIds(prev => ({
        ...prev,
        [id]: false
      }));
    }
  };
  
  // Handle input change for playlist name
  const handleNameChange = (id: string, value: string) => {
    setPlaylistNames(prev => ({
      ...prev,
      [id]: value
    }));
  };
  
  if (loading) {
    return <div className="w-full min-h-[200px] rounded-xl animate-pulse bg-primary-subtle"></div>;
  }
  
  return (
    <div className="relative pt-14 opacity-90 hover:opacity-100 transition-opacity">
      {/* Enhanced separator */}
      <div className="absolute top-0 left-0 right-0 flex flex-col items-center">
        <div className="w-full h-0.5 bg-secondary"></div>
        <div className="w-2/3 h-1 -mt-0.5 bg-gradient-to-r from-transparent via-accent to-transparent"></div>
        <div className="w-1/3 h-1 -mt-0.5 bg-gradient-to-r from-transparent via-accent/70 to-transparent"></div>
      </div>
      
      <div className="mb-6">
        <h2 className="text-lg text-text-secondary">Your Recommendations</h2>
      </div>
      
      {recommendations.length === 0 ? (
        <div className="text-text-muted text-center py-6">
          No recommendations yet. Start rating songs to get personalized recommendations!
        </div>
      ) : (
        <div className="space-y-6">
          {recommendations.map((recommendation, index) => {
            const isExpanded = !!expandedIds[recommendation._id];
            const isEditing = !!editingIds[recommendation._id];
            const defaultName = getDefaultPlaylistName(index);
            const playlistName = recommendation.playlistName || defaultName;
            const songCount = recommendation.recommendations.length;
            
            // Calculate styles based on expansion state of previous playlists
            const topMargin = index > 0 ? 
              (expandedIds[recommendations[index-1]._id] ? "mt-4" : "mt-0") : "";
            
            return (
              <div 
                key={recommendation._id}
                className={`border-l-2 border-secondary pl-3 hover:border-accent transition-colors ${topMargin}`}
                style={{ 
                  transition: "margin 0.3s ease",
                }}
              >
                <div className="flex justify-between items-start">
                  {isEditing ? (
                    <div className="flex-1 flex gap-2">
                      <input
                        type="text"
                        value={playlistNames[recommendation._id]}
                        onChange={(e) => handleNameChange(recommendation._id, e.target.value)}
                        className="flex-1 bg-background border border-secondary rounded px-2 py-1 text-sm"
                        placeholder="Enter playlist name"
                        autoFocus
                      />
                      <button
                        onClick={() => savePlaylistName(recommendation._id)}
                        className="bg-accent text-white text-sm px-2 py-1 rounded"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <h3 
                      className="font-medium text-text-primary mb-1 cursor-pointer flex items-center gap-1"
                      onClick={() => toggleExpanded(recommendation._id)}
                    >
                      {playlistName}
                      {isExpanded ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
                    </h3>
                  )}
                </div>
                
                <div className="flex justify-between items-center mb-2">
                  <span className="text-text-muted text-xs">{songCount} tracks</span>
                  
                  {!isEditing && (
                    <button 
                      onClick={() => startEditing(recommendation._id, index, recommendation.playlistName)}
                      className="text-accent hover:text-accent/80 text-sm transition-colors"
                    >
                      {recommendation.playlistName ? "Rename" : "Name this playlist"}
                    </button>
                  )}
                </div>
                
                {/* Song list dropdown */}
                {isExpanded && (
                  <div className="pl-2 mt-2 space-y-2 border-l border-secondary/50">
                    {recommendation.recommendations.map(song => (
                      <div key={song.songId} className="flex items-center gap-3 p-2 rounded bg-card-background hover:bg-card-hover transition-colors">
                        <div className="relative w-10 h-10 overflow-hidden rounded">
                          <Image
                            src={song.imageUrl}
                            alt={song.name}
                            fill
                            sizes="40px"
                            style={{ objectFit: 'cover' }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-text-primary truncate">{song.name}</p>
                          <p className="text-xs text-text-secondary truncate">{song.artists.join(', ')}</p>
                        </div>
                        <div className="text-xs text-text-muted">
                          Score: {Math.round(song.score)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecommendationsSection; 