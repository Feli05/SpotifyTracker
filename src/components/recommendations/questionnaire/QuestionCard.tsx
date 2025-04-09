import { motion } from "framer-motion";
import { Question, QuestionnaireAnswer } from "./types";

interface QuestionCardProps {
  question: Question;
  onAnswer: (answer: QuestionnaireAnswer) => void;
  direction: number;
}

export const QuestionCard = ({ question, onAnswer, direction }: QuestionCardProps) => {
  const handleOptionClick = (optionId: string) => {
    onAnswer({
      questionId: question.id,
      selectedOptionId: optionId
    });
  };

  const variants = {
    enter: (direction: number) => ({
      y: direction > 0 ? 100 : -100,
      opacity: 0
    }),
    center: {
      y: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      y: direction < 0 ? 100 : -100,
      opacity: 0
    })
  };

  return (
    <motion.div
      className="w-full max-w-xl p-8 rounded-2xl shadow-lg relative border border-gray-800 bg-black/30"
      custom={direction}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{
        y: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.5 }
      }}
    >
      <motion.h2 
        className="text-2xl md:text-3xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-accent to-purple-400"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {question.text}
      </motion.h2>

      <div className="space-y-3">
        {question.options.map((option, index) => (
          <motion.button
            key={option.id}
            className="w-full p-4 rounded-xl text-left flex items-center group text-text-primary border border-gray-800 bg-black/20 option-button"
            onClick={() => handleOptionClick(option.id)}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-6 h-6 rounded-full border-2 border-text-muted group-hover:border-accent mr-4 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-accent to-purple-400 scale-0 group-hover:scale-100 transition-transform" />
            </div>
            <span className="text-lg">{option.text}</span>
          </motion.button>
        ))}
      </div>

      {/* Add CSS for gradient border on hover */}
      <style jsx global>{`
        .option-button {
          position: relative;
          z-index: 1;
        }
        
        .option-button::before {
          content: '';
          position: absolute;
          top: -1px;
          left: -1px;
          right: -1px;
          bottom: -1px;
          border-radius: 0.75rem;
          padding: 1px;
          background: linear-gradient(to right, var(--color-accent), rgb(192, 132, 252));
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0;
          transition: opacity 0.2s ease;
        }
        
        .option-button:hover::before {
          opacity: 1;
        }
      `}</style>
    </motion.div>
  );
}; 