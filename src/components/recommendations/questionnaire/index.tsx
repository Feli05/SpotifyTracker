import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { QuestionCard } from "./QuestionCard";
import { ProgressBar } from "./ProgressBar";
import { LoadingScreen } from "./LoadingScreen";
import { Particles } from "./Particles";
import { questions, loadingMessages } from "./questionData";
import { QuestionnaireAnswer, QuestionnaireState } from "./types";

export const QuestionnairePage = () => {
  const router = useRouter();
  
  const [state, setState] = useState<QuestionnaireState>({
    currentQuestionIndex: 0,
    answers: [],
    isSubmitting: false,
    loadingMessages,
    currentLoadingMessageIndex: 0
  });
  
  const {
    currentQuestionIndex,
    answers,
    isSubmitting,
    loadingMessages: messages,
    currentLoadingMessageIndex
  } = state;
  
  const [direction, setDirection] = useState(0);
  
  const currentQuestion = questions[currentQuestionIndex];
  
  // Function to handle user selecting an answer
  const handleAnswer = (answer: QuestionnaireAnswer) => {
    setDirection(1); // Set animation direction (1 = forward)
    
    // Update state with the new answer
    setState(prev => {
      const newAnswers = [...prev.answers];
      const existingIndex = newAnswers.findIndex(a => a.questionId === answer.questionId);
      
      if (existingIndex !== -1) {
        newAnswers[existingIndex] = answer;
      } else {
        newAnswers.push(answer);
      }
      
      // Move to next question or submit if on last question
      const isLastQuestion = currentQuestionIndex === questions.length - 1;
      if (isLastQuestion) {
        return {
          ...prev,
          answers: newAnswers,
          isSubmitting: true
        };
      }
      
      return {
        ...prev,
        answers: newAnswers,
        currentQuestionIndex: prev.currentQuestionIndex + 1
      };
    });
  };
  
  // Submit answers when all questions are answered
  useEffect(() => {
    if (isSubmitting) {
      // Submit answers to API
      const submitAnswers = async () => {
        try {
          // Use the main questionnaires endpoint which now handles both saving and ML processing
          const response = await fetch('/api/mongodb/questionnaires', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              answers
            })
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error('Failed to submit questionnaire');
          }
          
          const data = await response.json();
          
          if (!data.success) {
            throw new Error('Questionnaire submission failed');
          }
          
          // Show loading UI for a bit to simulate ML processing
          await new Promise(resolve => setTimeout(resolve, 10000));
          
          // Redirect to dashboard
          router.push('/dashboard');
        } catch (error) {
          alert('There was an error submitting your answers. Please try again.');
          setState(prev => ({ ...prev, isSubmitting: false }));
        }
      };
      
      submitAnswers();
    }
  }, [isSubmitting, answers, router]);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Add particles using the reusable component */}
      <Particles count={15} />
      
      {/* Loading screen */}
      {isSubmitting && (
        <LoadingScreen
          messages={messages}
          currentMessageIndex={currentLoadingMessageIndex}
          setCurrentMessageIndex={(index) => 
            setState(prev => ({ ...prev, currentLoadingMessageIndex: index }))
          }
        />
      )}
      
      {/* Questionnaire content */}
      {!isSubmitting && (
        <div className="flex-grow flex flex-col items-center justify-center p-6 relative z-10">
          <div className="flex-grow"></div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-16 text-center">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-purple-400">Personalize</span> Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-purple-400">Recommendations</span>
          </h1>
          
          <ProgressBar 
            current={currentQuestionIndex} 
            total={questions.length} 
          />
          
          <div className="flex-grow flex items-center justify-center w-full max-w-4xl mx-auto mb-8">
            <AnimatePresence mode="wait" custom={direction}>
              <QuestionCard
                key={currentQuestion.id}
                question={currentQuestion}
                onAnswer={handleAnswer}
                direction={direction}
              />
            </AnimatePresence>
          </div>
          
          <div className="flex-grow"></div>
        </div>
      )}
    </div>
  );
}; 