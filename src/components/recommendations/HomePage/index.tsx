import { useState, useEffect } from "react";
import Link from "next/link";
import { MusicNoteIcon, QuestionnaireIcon, ThumbUpIcon, SpinnerIcon, HomeIcon } from "@/components/icons";
import { ProgressTracker } from "./ProgressTracker";
import { RecommendationCard } from "./RecommendationCard";
import { StepCard } from "./StepCard";
import { usePreferenceCount } from "./usePreferenceCount";

export const HomePage = () => {
  const [mounted, setMounted] = useState(false);
  const { preferenceCount, loading, isQuestionnaireUnlocked } = usePreferenceCount();
  const requiredCount = 50; // Required count for questionnaire access
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return <div className="w-full h-full rounded-xl animate-pulse bg-primary-subtle"></div>;
  }
  
  return (
    <div className="max-w-4xl mx-auto w-full">
      <div className="flex items-center justify-between mb-8">
        <Link 
          href="/dashboard"
          className="flex items-center text-text-primary hover:text-text-muted transition-colors"
        >
          <div className="w-5 h-5 mr-2">
            <HomeIcon />
          </div>
          Back to Dashboard
        </Link>
      </div>
      
      <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-2">Music Recommendations</h1>
      <p className="text-text-secondary mb-4">Get personalized music recommendations based on your preferences and mood</p>
      
      {loading ? (
        <div className="flex justify-center my-6">
          <div className="w-8 h-8 text-accent animate-spin">
            <SpinnerIcon />
          </div>
        </div>
      ) : (
        <ProgressTracker 
          currentCount={preferenceCount}
          requiredCount={requiredCount}
          isLoading={loading}
        />
      )}
      
      <div className="grid md:grid-cols-2 gap-6 h-auto">
        <div className="h-full">
          <RecommendationCard
            href={isQuestionnaireUnlocked ? "/recommendations/questionnaire" : ""}
            title="Quick Questionnaire"
            description="Answer a few quick questions about your current mood and activity to get instant recommendations"
            icon={<QuestionnaireIcon />}
            statusTag={isQuestionnaireUnlocked ? "Unlocked" : "Locked"}
            statusColor={isQuestionnaireUnlocked ? "bg-accent" : "bg-red-500"}
            actionText={isQuestionnaireUnlocked ? "Takes ~1 minute" : `Available after rating ${requiredCount} songs`}
            isDisabled={!isQuestionnaireUnlocked}
            isLocked={!isQuestionnaireUnlocked}
            requiredCount={requiredCount}
          />
        </div>
        
        <div className="h-full">
          <RecommendationCard
            href="/recommendations/preferences"
            title="Song Preferences"
            description={`Rate at least ${requiredCount} songs to unlock the questionnaire. Continue rating more songs to improve your recommendations.`}
            icon={<ThumbUpIcon />}
            statusTag={isQuestionnaireUnlocked ? 'Continue' : 'Required'}
            actionText={preferenceCount > 0 ? `${preferenceCount} songs rated` : 'Start rating songs'}
            badge={!isQuestionnaireUnlocked ? (
              <div className="absolute -top-2 -right-2 w-auto px-3 py-1.5 bg-accent text-text-primary text-xs font-bold rounded-full z-10 shadow-lg">
                Start Here! Required
              </div>
            ) : undefined}
          />
        </div>
      </div>
      
      <div className="mt-12 bg-secondary/50 rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4">How Recommendations Work</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <StepCard
            step={1}
            title="Rate Songs"
            description={`Rate at least ${requiredCount} songs to build your taste profile. More ratings lead to better recommendations.`}
            icon={<ThumbUpIcon />}
          />
          
          <StepCard
            step={2}
            title="Complete Questionnaire"
            description="After rating songs, answer the questionnaire about your current mood and activity preferences"
            icon={<QuestionnaireIcon />}
          />
          
          <StepCard
            step={3}
            title="Get Recommendations"
            description="Receive personalized music recommendations that match your taste profile and current mood"
            icon={<MusicNoteIcon />}
          />
        </div>
      </div>
    </div>
  );
}; 