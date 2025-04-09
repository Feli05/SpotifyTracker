import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { SongCard } from "./SongCard";
import { RatingButtons } from "./RatingButtons";
import { HeaderSection } from "./HeaderSection";
import { Preference, PreferencesPageState, Song } from "./types";
import { getColorsForGenre, generateGradient } from "./colorExtractor";

export const PreferencesPage = () => {
  const router = useRouter();
  const requiredCount = 50;
  
  const [state, setState] = useState<PreferencesPageState>({
    mounted: false,
    songs: [],
    currentSongIndex: 0,
    direction: 0,
    preferenceCount: 0
  });
  
  const { mounted, songs, currentSongIndex, direction, preferenceCount } = state;
  const currentSong = songs[currentSongIndex];
  
  // Shared function to fetch and format songs
  const fetchSongs = async (): Promise<Song[]> => {
    try {
      const songsResponse = await fetch('/api/mongodb/songs/random');
      const songsData = await songsResponse.json();
      
      // Transform MongoDB songs to match the Song interface and assign colors
      const formattedSongs: Song[] = songsData.songs?.map((song: any, index: number) => {
        // Get colors based on the song's genre
        const colors = getColorsForGenre(song.genre, index);
        
        return {
          id: song.id,
          name: song.name,
          artist: song.artists?.map((a: any) => a.name).join(', ') || 'Unknown Artist',
          album: song.album?.name || 'Unknown Album',
          coverUrl: song.album?.images?.[0]?.url || 'https://via.placeholder.com/300',
          dominantColor: colors.dominantColor,
          secondaryColor: colors.secondaryColor,
          year: new Date(song.album?.releaseDate || '2020').getFullYear()
        };
      }) || [];
      
      return formattedSongs;
    } catch (error) {
      console.error('Error fetching songs:', error);
      return [];
    }
  };
  
  // Init and fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
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
      } catch (error) {
        console.error('Error fetching data:', error);
        setState(prev => ({
          ...prev,
          mounted: true
        }));
      }
    };
    
    fetchData();
  }, []);
  
  const handleSwipe = (dir: number) => {
    // Update direction for card animation
    setState(prev => ({ ...prev, direction: dir }));
    
    // Skip handling preferences if just skipping
    if (dir !== 0) {
      savePreference(dir > 0);
    }
    
    // Move to next song or fetch more if needed
    if (currentSongIndex < songs.length - 1) {
      setState(prev => ({ ...prev, currentSongIndex: prev.currentSongIndex + 1 }));
    } else {
      // Fetch more songs instead of redirecting
      fetchMoreSongs();
    }
  };
  
  const fetchMoreSongs = async () => {
    try {
      // Show loading state
      setState(prev => ({ ...prev, mounted: false }));
      
      // Fetch songs using the shared function
      const formattedSongs = await fetchSongs();
      
      setState(prev => ({
        ...prev,
        mounted: true,
        songs: [...formattedSongs],
        currentSongIndex: 0
      }));
    } catch (error) {
      console.error('Error fetching more songs:', error);
      setState(prev => ({
        ...prev,
        mounted: true
      }));
    }
  };
  
  const savePreference = (liked: boolean) => {
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
    })
    .catch(error => {
      console.error("Error saving preference:", error);
      // Just increment locally if MongoDB update fails
      const newCount = preferenceCount + 1;
      setState(prev => ({ ...prev, preferenceCount: newCount }));
    });
  };
  
  if (!mounted || !currentSong) {
    return <div className="w-full h-full rounded-xl animate-pulse bg-primary-subtle"></div>;
  }

  // Create background gradient style
  const backgroundStyle = {
    background: generateGradient({
      dominantColor: currentSong.dominantColor,
      secondaryColor: currentSong.secondaryColor || currentSong.dominantColor
    }),
    transition: 'background 0.8s ease-in-out'
  };

  return (
    <div className="min-h-screen relative" style={backgroundStyle}>
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
  );
}; 