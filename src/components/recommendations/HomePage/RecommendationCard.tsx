import { motion } from 'framer-motion';
import Link from 'next/link';
import { ChevronRightIcon, LockIcon } from '@/components/icons';
import { RecommendationCardProps } from './types';

export const RecommendationCard = ({
  href,
  title,
  description,
  icon,
  statusTag,
  statusColor = 'bg-accent',
  actionText,
  isDisabled = false,
  isLocked = false,
  badge,
  requiredCount
}: RecommendationCardProps) => {
  // Dynamic description for locked items
  const displayDescription = isLocked && requiredCount 
    ? `Rate ${requiredCount} songs to unlock the ${title.toLowerCase()}`
    : description;

  // Prepare card content regardless of disabled state
  const CardContent = (
    <motion.div 
      className={`bg-secondary rounded-xl p-6 flex flex-col border border-transparent ${!isDisabled ? 'group-hover:border-accent' : ''} relative h-full`}
      whileHover={!isDisabled ? { y: -5 } : undefined}
    >
      {badge}
      
      <div className="h-48 bg-primary-subtle rounded-lg mb-6 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          {isLocked ? (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <div className="w-24 h-24 text-white opacity-70">
                <LockIcon />
              </div>
            </div>
          ) : (
            <div className="w-24 h-24 text-text-muted opacity-70 flex items-center justify-center">
              {icon}
            </div>
          )}
        </div>
        
        <div className={`absolute top-2 right-2 ${statusColor} text-xs font-bold px-2 py-1 rounded-full`}>
          {statusTag}
        </div>
      </div>
      
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <p className="text-text-secondary mb-4 flex-grow">{displayDescription}</p>
      
      <div className="flex justify-between items-center mt-auto">
        <span className="text-sm text-text-muted">{actionText}</span>
        {!isDisabled && (
          <div className="h-6 w-6 text-accent transition-transform duration-300 group-hover:translate-x-1">
            <ChevronRightIcon />
          </div>
        )}
      </div>
    </motion.div>
  );

  // Wrap in the appropriate container based on disabled state
  return (
    <div className={`${isDisabled ? 'opacity-70' : ''} h-full`}>
      {isDisabled ? (
        <div className="h-full">{CardContent}</div>
      ) : (
        <Link href={href} className="group block h-full">{CardContent}</Link>
      )}
    </div>
  );
}; 