export interface ProgressTrackerProps {
  currentCount: number;
  requiredCount: number;
  isLoading: boolean;
}

export interface RecommendationCardProps {
  href: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  statusTag: string;
  statusColor?: string;
  actionText: string;
  isDisabled?: boolean;
  isLocked?: boolean;
  badge?: React.ReactNode;
  requiredCount?: number;
}

export interface StepCardProps {
  step: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export interface HomePageData {
  preferenceCount: number;
  isQuestionnaireUnlocked: boolean;
  loading: boolean;
} 