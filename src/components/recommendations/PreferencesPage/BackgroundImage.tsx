import { memo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface BackgroundImageProps {
  imageUrl: string;
  id: string;
}

const BackgroundImageComponent = memo(({ imageUrl, id }: BackgroundImageProps) => {
  return (
    <AnimatePresence mode="sync">
      <motion.div
        key={id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed inset-0 w-full h-full z-0 overflow-hidden"
      >
        <div className="absolute inset-0 bg-black/30 z-10" />
        <Image
          src={imageUrl}
          alt=""
          fill
          quality={60}
          className="object-cover scale-110 blur-xl brightness-50"
          priority={false}
          sizes="100vw"
        />
      </motion.div>
    </AnimatePresence>
  );
});

BackgroundImageComponent.displayName = 'BackgroundImage';

export const BackgroundImage = BackgroundImageComponent; 