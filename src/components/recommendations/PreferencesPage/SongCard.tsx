import { useState, useRef, useCallback, memo } from 'react';
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
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const x = useMotionValue(0);
  
  // Handle audio playback
  const togglePlay = useCallback(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.load();
        audioRef.current.play().catch(() => {
          setIsPlaying(false);
        });
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying]);
  
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
          // Let the card continue in the direction it was moving
          // We don't need to animate x back to center
          onSwipe(direction); 
        } else {
          // If below threshold, animate back to center
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
                preload="none"
              >
                <source src="/path/to/audio/snippet.mp3" type="audio/mpeg" />
              </audio>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

SongCardComponent.displayName = 'SongCard';

export const SongCard = SongCardComponent; 