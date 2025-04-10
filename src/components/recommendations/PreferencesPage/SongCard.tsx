import { useState, useRef, useCallback, memo, useEffect } from 'react';
import Image from 'next/image';
import { motion, useMotionValue } from 'framer-motion';
import { PlayIcon, PauseIcon } from '@/components/icons';
import { SongCardProps } from './types';

const SongCardComponent = memo(({ 
  song, 
  direction: externalDirection, 
  onSwipe 
}: SongCardProps) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const x = useMotionValue(0);
  
  // Fetch preview URL when song changes
  useEffect(() => {
    const fetchPreview = async () => {
      if (!song.name) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Directly call the API endpoint
        const url = `/api/spotify-preview?song=${encodeURIComponent(song.name)}${
          song.artist ? `&artist=${encodeURIComponent(song.artist)}` : ''
        }`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Preview API error: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success && result.previews && result.previews.length > 0) {
          setPreviewUrl(result.previews[0].previewUrl);
        } else {
          setError('No preview available');
          setPreviewUrl(null);
        }
      } catch (err) {
        setError('Failed to load preview');
        setPreviewUrl(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPreview();
    
    // Cleanup
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    };
  }, [song.name, song.artist]);
  
  // Handle audio playback
  const togglePlay = useCallback(() => {
    if (!previewUrl || !audioRef.current) return;
    
    try {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        // Ensure the audio element has the current URL
        audioRef.current.src = previewUrl;
        audioRef.current.load();
        audioRef.current.play().catch(() => {
          setIsPlaying(false);
          setError('Failed to play audio');
        });
      }
      setIsPlaying(!isPlaying);
    } catch (err) {
      setIsPlaying(false);
    }
  }, [isPlaying, previewUrl]);
  
  // Define animation variants
  const cardVariants = {
    initial: { opacity: 0, scale: 0.8 },
    center: { 
      opacity: 1, 
      scale: 1, 
      x: 0,
      transition: { duration: 0.2 }
    },
    exit: (direction: number) => ({
      x: direction > 0 ? 300 : direction < 0 ? -300 : 0,
      opacity: direction !== 0 ? 0 : 1,
      scale: direction !== 0 ? 0.8 : 1,
      transition: { duration: 0.2 }
    })
  };
  
  return (
    <motion.div
      key={song.id}
      custom={externalDirection}
      variants={cardVariants}
      initial="initial"
      animate="center"
      exit="exit"
      style={{ x }}
      className="w-full max-w-md relative mb-8 will-change-transform"
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={(_, info) => {
        const threshold = 100;
        
        if (Math.abs(info.offset.x) > threshold) {
          const direction = info.offset.x > 0 ? 1 : -1;
          onSwipe(direction); 
        } else {
          x.set(0);
        }
      }}
    >
      <div 
        className="w-full aspect-[3/4] rounded-2xl overflow-hidden p-0.5 bg-black/30 backdrop-blur-sm will-change-transform"
        style={{
          maxHeight: 'min(calc(100vh - 340px), 550px)',
          height: 'auto',
        }}
      >
        <div className="w-full h-full rounded-2xl overflow-hidden bg-secondary/80 backdrop-blur-sm relative">
          <div className="absolute inset-0 p-6 flex flex-col">
            {/* Main album image */}
            <div className="relative w-full aspect-square rounded-lg overflow-hidden shadow-xl mb-6 will-change-transform">
              <Image
                src={song.coverUrl}
                alt={`${song.name} album art`}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 500px"
                className="object-cover"
                tabIndex={-1}
                quality={90}
              />
            </div>
            
            <div className="flex-grow flex flex-col justify-end">
              <h2 className="text-2xl font-bold mb-1 line-clamp-1">{song.name}</h2>
              <p className="text-lg text-text-secondary mb-1 line-clamp-1">{song.artist}</p>
              <p className="text-sm text-text-muted mb-4 line-clamp-1">{song.album} • {song.year}</p>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={togglePlay}
                  disabled={!previewUrl || isLoading}
                  className={`p-3 rounded-full transition-colors ${
                    previewUrl ? 'bg-primary hover:bg-primary-subtle' : 'bg-gray-500 cursor-not-allowed'
                  }`}
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  <div className="w-6 h-6 text-accent flex items-center justify-center">
                    {isLoading ? (
                      <span className="animate-pulse">...</span>
                    ) : isPlaying ? (
                      <PauseIcon />
                    ) : (
                      <PlayIcon />
                    )}
                  </div>
                </button>
                <div className="text-sm text-text-muted">
                  {isLoading ? 'Loading preview...' : 
                   error ? error : 
                   !previewUrl ? 'No preview available' : 
                   `Tap to ${isPlaying ? "pause" : "play"} preview`}
                </div>
              </div>
              
              {/* Audio element (hidden) */}
              <audio 
                ref={audioRef} 
                onEnded={() => setIsPlaying(false)}
                className="hidden"
                preload="none"
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

SongCardComponent.displayName = 'SongCard';

export const SongCard = SongCardComponent; 