export interface QuestionOption {
  id: string;
  text: string;
  value: string;
}

export interface Question {
  id: string;
  text: string;
  options: QuestionOption[];
}

export interface QuestionnaireAnswer {
  questionId: string;
  selectedOptionId: string;
}

export interface QuestionnaireState {
  currentQuestionIndex: number;
  answers: QuestionnaireAnswer[];
  isSubmitting: boolean;
  loadingMessages: string[];
  currentLoadingMessageIndex: number;
}

export interface QuestionnaireData {
  userId: string;
  answers: QuestionnaireAnswer[];
  timestamp: string;
}

/**
 * Particle animation types
 */
export interface Particle {
  width: string;
  height: string;
  left: string;
  top: string;
  opacity: number;
  animationDuration: string;
  animationDelay: string;
}

export interface ParticlesProps {
  count?: number;
} 