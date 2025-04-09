import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Particles } from './Particles';

interface LoadingScreenProps {
  messages: string[];
  currentMessageIndex: number;
  setCurrentMessageIndex: (index: number) => void;
}

export const LoadingScreen = ({
  messages,
  currentMessageIndex,
  setCurrentMessageIndex
}: LoadingScreenProps) => {
  useEffect(() => {
    // Rotate through messages
    const interval = setInterval(() => {
      setCurrentMessageIndex((currentMessageIndex + 1) % messages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [currentMessageIndex, messages.length, setCurrentMessageIndex]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 overflow-hidden">
      {/* Use the reusable Particles component */}
      <Particles count={15} />

      {/* Loading content in fixed height container */}
      <div className="text-center px-4 max-w-lg flex flex-col items-center h-48">
        {/* Fixed position spinner */}
        <div className="mb-10 w-20 h-20">
          <div className="w-full h-full rounded-full border-4 border-t-transparent animate-spin bg-gradient-to-r from-accent to-purple-400 opacity-25" />
        </div>

        {/* Message container with fixed height */}
        <div className="h-20 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentMessageIndex}
              className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-accent to-purple-400"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ 
                duration: 0.3,
                ease: "easeInOut"
              }}
            >
              {messages[currentMessageIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}; 