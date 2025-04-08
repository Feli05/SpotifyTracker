import { ProgressTrackerProps } from './types';

export const ProgressTracker = ({ 
  currentCount, 
  requiredCount, 
  isLoading 
}: ProgressTrackerProps) => {
  const isComplete = currentCount >= requiredCount;
  const progressPercentage = Math.min((currentCount / requiredCount) * 100, 100);
  
  return (
    <div className="bg-secondary/50 rounded-lg p-4 mb-8">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Song Rating Progress</h3>
        <span className="text-accent font-semibold">{currentCount}/{requiredCount}</span>
      </div>
      
      <div className="mt-2 h-2 bg-primary-subtle rounded-full overflow-hidden">
        <div 
          className="h-full bg-accent transition-all duration-500"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      
      <p className="mt-2 text-sm text-text-secondary">
        {isComplete 
          ? "Great job! You've rated enough songs to unlock the questionnaire." 
          : `Rate ${requiredCount - currentCount} more songs to unlock the questionnaire.`}
      </p>
    </div>
  );
}; 