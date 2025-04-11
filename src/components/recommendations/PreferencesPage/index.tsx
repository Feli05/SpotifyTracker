import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { SongCard } from "./SongCard";
import { RatingButtons } from "./RatingButtons";
import { HeaderSection } from "./HeaderSection";
import { BackgroundImage } from "./BackgroundImage";
import { Preference, PreferencesPageState, Song, ApiSong } from "./types";

export const PreferencesPage = () => {
  const requiredCount = 50;
  const prefetchThreshold = 3; // Start prefetching when this many songs left
  
  const [state, setState] = useState<PreferencesPageState>({
    mounted: false,
    songs: [],
    currentSongIndex: 0,
    direction: 0,
    preferenceCount: 0
  });
  
  const [isLoading, setIsLoading] = useState(false);
  
  const { mounted, songs, currentSongIndex, direction, preferenceCount } = state;
  const currentSong = songs[currentSongIndex];
  const songsRemaining = songs.length - currentSongIndex - 1;
  
  // Initial data load - get preference count and first batch of songs
  useEffect(() => {
    async function initialize() {
      try {
        // Get preference count
        const prefResponse = await fetch('/api/mongodb/preferences');
        const prefData = await prefResponse.json();
        
        // Get initial songs
        const songsResponse = await fetch('/api/mongodb/songs/random');
        const songsData = await songsResponse.json();
        
        // Format songs for the UI
        const formattedSongs = songsData.songs?.map((song: ApiSong) => ({
          id: song.id,
          name: song.name,
          artist: song.artists?.map((a: { name: string }) => a.name).join(', ') || 'Unknown Artist',
          album: song.album?.name || 'Unknown Album',
          coverUrl: song.album?.images?.[0]?.url,
          year: new Date(song.album?.releaseDate || '2020').getFullYear()
        })) || [];
        
        setState({
          mounted: true,
          preferenceCount: prefData.count || 0,
          songs: formattedSongs,
          currentSongIndex: 0,
          direction: 0
        });
      } catch (error) {
        console.error('Failed to load initial data', error);
        setState(prev => ({ ...prev, mounted: true }));
      }
    }
    
    initialize();
  }, []);
  
  // Load more songs when needed
  useEffect(() => {
    async function loadMoreSongs() {
      // Only prefetch when we're running low on songs and not already loading
      if (songsRemaining > prefetchThreshold || isLoading || !mounted) return;
      
      setIsLoading(true);
      
      try {
        // Fetch more songs
        const response = await fetch('/api/mongodb/songs/random');
        const data = await response.json();
        
        // Format songs for the UI
        const newSongs = data.songs?.map((song: ApiSong) => ({
          id: song.id,
          name: song.name,
          artist: song.artists?.map((a: { name: string }) => a.name).join(', ') || 'Unknown Artist',
          album: song.album?.name || 'Unknown Album',
          coverUrl: song.album?.images?.[0]?.url,
          year: new Date(song.album?.releaseDate || '2020').getFullYear()
        })) || [];
        
        // Add unique songs to our list
        if (newSongs.length > 0) {
          const existingIds = new Set(songs.map((song: Song) => song.id));
          const uniqueNewSongs = newSongs.filter((song: Song) => !existingIds.has(song.id));
          
          if (uniqueNewSongs.length > 0) {
            setState(prev => ({
              ...prev,
              songs: [...prev.songs, ...uniqueNewSongs]
            }));
          }
        }
      } catch (error) {
        console.error('Failed to load more songs', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadMoreSongs();
  }, [songsRemaining, isLoading, mounted, songs]);
  
  // Handle user swipe/rating
  function handleSwipe(dir: number) {
    // Update direction for animation
    setState(prev => ({ ...prev, direction: dir }));
    
    // Save preference if not just skipping
    if (dir !== 0 && currentSong) {
      // Create and send preference
      const preference: Preference = {
        songId: currentSong.id,
        liked: dir > 0,
        timestamp: new Date().toISOString()
      };
      
      // Save to API
      fetch('/api/mongodb/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preference)
      })
      .then(response => response.json())
      .then(data => {
        // Update preference count
        setState(prev => ({ 
          ...prev, 
          preferenceCount: data.count || prev.preferenceCount + 1 
        }));
      })
      .catch(error => {
        console.error('Failed to save preference', error);
      });
    }
    
    // Move to next song after a short delay for animation
    setTimeout(() => {
      setState(prev => ({ 
        ...prev, 
        currentSongIndex: prev.currentSongIndex + 1
      }));
    }, 200);
  }
  
  // Show loading state if not mounted or no current song
  if (!mounted || !currentSong) {
    return <div className="w-full h-full rounded-xl animate-pulse bg-primary-subtle"></div>;
  }

  return (
    <div className="min-h-screen relative">
      {/* Background image from current song */}
      <BackgroundImage 
        imageUrl={currentSong.coverUrl} 
        id={currentSong.id}
      />
      
      <div className="relative z-10">
        <HeaderSection 
          preferenceCount={preferenceCount}
          requiredCount={requiredCount}
        />
        
        <div className="flex-grow flex flex-col items-center justify-center p-6 relative">
          <AnimatePresence mode="wait">
            <SongCard 
              key={currentSong.id} 
              song={currentSong} 
              direction={direction}
              onSwipe={handleSwipe}
            />
          </AnimatePresence>
          
          <RatingButtons onRate={handleSwipe} />
          
          <div className="text-sm text-center mt-4 text-text-secondary">
            Swipe right to like, left to dislike, or tap the buttons
          </div>
        </div>
      </div>
    </div>
  );
}; 