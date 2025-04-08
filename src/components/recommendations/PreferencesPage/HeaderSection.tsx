import Link from "next/link";
import { HomeIcon } from "@/components/icons";
import { HeaderProps } from "./types";

export const HeaderSection = ({ preferenceCount, requiredCount }: HeaderProps) => {
  const isQuestUnlocked = preferenceCount >= requiredCount;
  
  return (
    <div className="z-20 relative">
      <div className="flex items-center justify-between p-6">
        <Link 
          href="/recommendations"
          className="flex items-center text-text-primary hover:text-text-muted transition-colors"
        >
          <div className="w-5 h-5 mr-2 flex items-center justify-center">
            <HomeIcon />
          </div>
          <span>Back</span>
        </Link>
        
        <div className="bg-primary/80 backdrop-blur-sm text-text-secondary rounded-full px-4 py-1.5 text-sm">
          <span className="font-medium">{preferenceCount}</span>/{requiredCount} songs rated
          {isQuestUnlocked ? (
            <span className="ml-2 text-green-400">✓ Questionnaire Unlocked</span>
          ) : (
            <span className="ml-2 text-amber-400">{requiredCount - preferenceCount} more needed</span>
          )}
        </div>
      </div>
      
      {preferenceCount < requiredCount && (
        <div className="bg-secondary/60 mx-6 px-4 py-3 rounded-lg mb-4 text-sm text-text-secondary">
          <strong className="text-accent">Important:</strong> You need to rate at least {requiredCount} songs to unlock the questionnaire and get personalized recommendations.
        </div>
      )}
    </div>
  );
}; 