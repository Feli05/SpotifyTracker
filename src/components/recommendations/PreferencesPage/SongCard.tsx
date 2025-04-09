import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { PlayIcon, PauseIcon } from '@/components/icons';
import { Song, SongCardProps } from './types';

export const SongCard = ({ 
  song, 
  direction: externalDirection, 
  onSwipe 
}: SongCardProps) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [direction, setDirection] = useState<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const dragStartX = useRef<number>(0);
  
  // Sync with external direction when it changes
  useEffect(() => {
    setDirection(externalDirection);
  }, [externalDirection]);
  
  const handleDragStart = (e: any) => {
    setIsDragging(true);
    dragStartX.current = e.clientX || e.touches[0].clientX;
  };
  
  const handleDragMove = (e: any) => {
    if (!isDragging) return;
    
    const clientX = e.clientX || e.touches[0].clientX;
    const deltaX = clientX - dragStartX.current;
    
    // Lower threshold for faster response
    if (deltaX > 30) {
      setDirection(1); // Like
    } else if (deltaX < -30) {
      setDirection(-1); // Dislike
    } else {
      setDirection(0);
    }
  };
  
  const handleDragEnd = () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
    // Only trigger swipe if there's a direction
    if (direction !== 0) {
      onSwipe(direction);
    }
  };
  
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  // Calculate dynamic border gradient
  const borderGradient = {
    background: `linear-gradient(45deg, ${song.dominantColor}99, var(--color-bg-primary-subtle))`,
    transition: 'background 0.3s ease',
  };
  
  return (
    <motion.div
      key={song.id}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        x: isDragging && direction === 1 ? 50 : isDragging && direction === -1 ? -50 : 0 
      }}
      exit={{ 
        opacity: 0, 
        scale: 0.8,
        x: direction === 1 ? 300 : direction === -1 ? -300 : 0,
        filter: direction !== 0 ? 'blur(10px)' : 'none',
      }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="w-full max-w-md relative"
      style={{ maxHeight: 'calc(100vh - 280px)' }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={1}
      onDragStart={handleDragStart}
      onDrag={handleDragMove}
      onDragEnd={handleDragEnd}
    >
      <div 
        className="w-full aspect-[3/4] rounded-2xl overflow-hidden p-0.5"
        style={borderGradient}
      >
        <div className="w-full h-full rounded-2xl overflow-hidden bg-secondary relative">
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
            <Image
              src={song.coverUrl}
              alt={`${song.name} album art`}
              fill
              sizes="(max-width: 768px) 100vw, 448px"
              className="object-cover opacity-40 blur-sm scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-secondary/70 to-secondary"></div>
          </div>
          
          <div className="absolute inset-0 p-6 flex flex-col">
            <div className="relative w-full aspect-square rounded-lg overflow-hidden shadow-xl mb-6">
              <Image
                src={song.coverUrl}
                alt={`${song.name} album art`}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 500px"
                className="object-cover"
              />
            </div>
            
            <div className="flex-grow flex flex-col justify-end">
              <h2 className="text-2xl font-bold mb-1">{song.name}</h2>
              <p className="text-lg text-text-secondary mb-1">{song.artist}</p>
              <p className="text-sm text-text-muted mb-4">{song.album} • {song.year}</p>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={togglePlay}
                  className="p-3 rounded-full bg-primary hover:bg-primary-subtle transition-colors"
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  <div className="w-6 h-6 text-accent flex items-center justify-center">
                    {isPlaying ? <PauseIcon /> : <PlayIcon />}
                  </div>
                </button>
                <div className="text-sm text-text-muted">
                  Tap to {isPlaying ? "pause" : "play"} preview
                </div>
              </div>
              
              {/* Audio element (hidden) */}
              <audio 
                ref={audioRef} 
                controls={false} 
                onEnded={() => setIsPlaying(false)}
                className="hidden"
              >
                <source src="/path/to/audio/snippet.mp3" type="audio/mpeg" />
              </audio>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}; 