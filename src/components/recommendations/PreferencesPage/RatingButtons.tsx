import { ThumbUpIcon, ThumbDownIcon, SkipIcon } from '@/components/icons';
import { RatingButtonsProps } from './types';

export const RatingButtons = ({ onRate }: RatingButtonsProps) => {
  return (
    <div className="flex justify-center space-x-6 mt-8">
      <button
        onClick={() => onRate(-1)}
        className="p-5 rounded-full bg-primary hover:bg-primary-subtle transition-colors shadow-lg"
        aria-label="Dislike song"
      >
        <div className="w-8 h-8 text-red-500 flex items-center justify-center">
          <ThumbDownIcon />
        </div>
      </button>
      
      <button
        onClick={() => onRate(0)}
        className="p-5 rounded-full bg-primary hover:bg-primary-subtle transition-colors shadow-lg"
        aria-label="Skip song"
      >
        <div className="w-8 h-8 text-yellow-500 flex items-center justify-center">
          <SkipIcon />
        </div>
      </button>
      
      <button
        onClick={() => onRate(1)}
        className="p-5 rounded-full bg-primary hover:bg-primary-subtle transition-colors shadow-lg"
        aria-label="Like song"
      >
        <div className="w-8 h-8 text-green-500 flex items-center justify-center">
          <ThumbUpIcon />
        </div>
      </button>
    </div>
  );
}; 