import { useState, useEffect, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { SongCard } from "./SongCard";
import { RatingButtons } from "./RatingButtons";
import { HeaderSection } from "./HeaderSection";
import { BackgroundImage } from "./BackgroundImage";
import { Preference, PreferencesPageState, Song } from "./types";

export const PreferencesPage = () => {
  const requiredCount = 50;
  const prefetchThreshold = 3; // Start prefetching when this many songs left
  const batchSize = 10; // How many songs to fetch in each batch
  
  const [state, setState] = useState<PreferencesPageState>({
    mounted: false,
    songs: [],
    currentSongIndex: 0,
    direction: 0,
    preferenceCount: 0
  });
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const { mounted, songs, currentSongIndex, direction, preferenceCount } = state;
  const currentSong = songs[currentSongIndex];
  const songsRemaining = songs.length - currentSongIndex - 1;
  
  // Shared function to fetch and format songs
  const fetchSongs = useCallback(async (): Promise<Song[]> => {
    const songsResponse = await fetch(`/api/mongodb/songs/random?limit=${batchSize}`);
    const songsData = await songsResponse.json();
    
    // Transform MongoDB songs to match the Song interface
    const formattedSongs: Song[] = songsData.songs?.map((song: any) => {
      return {
        id: song.id,
        name: song.name,
        artist: song.artists?.map((a: any) => a.name).join(', ') || 'Unknown Artist',
        album: song.album?.name || 'Unknown Album',
        coverUrl: song.album?.images?.[0]?.url || 'https://via.placeholder.com/300',
        year: new Date(song.album?.releaseDate || '2020').getFullYear()
      };
    }) || [];
    
    return formattedSongs;
  }, [batchSize]);
  
  // Initial data load
  useEffect(() => {
    const fetchInitialData = async () => {
      // Fetch preference count
      const prefResponse = await fetch('/api/mongodb/preferences');
      const prefData = await prefResponse.json();
      
      // Fetch songs using the shared function
      const formattedSongs = await fetchSongs();
      
      setState(prev => ({
        ...prev,
        mounted: true,
        preferenceCount: prefData.count || 0,
        songs: formattedSongs
      }));
    };
    
    fetchInitialData();
  }, [fetchSongs]);
  
  // Prefetch more songs when running low
  useEffect(() => {
    const prefetchMoreSongs = async () => {
      if (songsRemaining <= prefetchThreshold && !isLoading && songs.length > 0) {
        setIsLoading(true);
        
        const newSongs = await fetchSongs();
        
        // Add new songs to the existing list
        if (newSongs.length > 0) {
          const existingIds = new Set(songs.map(song => song.id));
          const uniqueNewSongs = newSongs.filter(song => !existingIds.has(song.id));
          
          if (uniqueNewSongs.length > 0) {
            setState(prev => ({
              ...prev,
              songs: [...prev.songs, ...uniqueNewSongs]
            }));
          }
        }
        
        setIsLoading(false);
      }
    };
    
    prefetchMoreSongs();
  }, [songsRemaining, isLoading, songs, fetchSongs]);
  
  const handleSwipe = (dir: number) => {
    // Update direction for card animation
    setState(prev => ({ ...prev, direction: dir }));
    
    // Skip handling preferences if just skipping
    if (dir !== 0) {
      savePreference(dir > 0);
    }
    
    // Move to next song with a slight delay for animation
    setTimeout(() => {
      setState(prev => ({ 
        ...prev, 
        currentSongIndex: prev.currentSongIndex + 1
      }));
    }, 200);
  };
  
  const savePreference = (liked: boolean) => {
    if (!currentSong) return;
    
    const preference: Preference = {
      songId: currentSong.id,
      liked,
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
      const newCount = data.count || preferenceCount + 1;
      setState(prev => ({ ...prev, preferenceCount: newCount }));
    });
  };
  
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