import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { SongCard } from "./SongCard";
import { RatingButtons } from "./RatingButtons";
import { HeaderSection } from "./HeaderSection";
import { mockSongs } from "./mockData";
import { Preference, PreferencesPageState } from "./types";

export const PreferencesPage = () => {
  const router = useRouter();
  const requiredCount = 50;
  
  const [state, setState] = useState<PreferencesPageState>({
    mounted: false,
    songs: mockSongs,
    currentSongIndex: 0,
    direction: 0,
    preferenceCount: 0
  });
  
  const { mounted, songs, currentSongIndex, direction, preferenceCount } = state;
  const currentSong = songs[currentSongIndex];
  
  // Init and fetch data
  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        // API call to get preferences count
        const response = await fetch('/api/mongodb/preferences');
        const data = await response.json();
        
        setState(prev => ({
          ...prev,
          mounted: true,
          preferenceCount: data.count || 0
        }));
      } catch (error) {
        console.error('Error fetching preferences:', error);
        
        setState(prev => ({
          ...prev,
          mounted: true,
          preferenceCount: 0
        }));
      }
    };
    
    fetchPreferences();
  }, []);
  
  const handleSwipe = (dir: number) => {
    // Update direction for card animation
    setState(prev => ({ ...prev, direction: dir }));
    
    // Skip handling preferences if just skipping
    if (dir !== 0) {
      savePreference(dir > 0);
    }
    
    // Move to next song or redirect if done
    if (currentSongIndex < songs.length - 1) {
      setState(prev => ({ ...prev, currentSongIndex: prev.currentSongIndex + 1 }));
    } else {
      // Redirect when out of songs
      router.push('/recommendations');
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

  // Background style using album cover as gradient
  const backgroundStyle = {
    background: `linear-gradient(to bottom, ${currentSong.dominantColor}55, var(--color-bg-primary) 70%)`,
    transition: 'background 0.5s ease-in-out',
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