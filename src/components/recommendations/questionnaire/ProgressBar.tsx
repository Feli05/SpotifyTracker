import { motion } from "framer-motion";

interface ProgressBarProps {
  current: number;
  total: number;
}

export const ProgressBar = ({ current, total }: ProgressBarProps) => {
  const progress = (current / total) * 100;

  return (
    <div className="w-full max-w-xl mx-auto mb-8">
      <div className="flex justify-between mb-2 text-sm font-medium text-white/70">
        <span>Question {current + 1} of {total}</span>
        <span>{Math.round(progress)}% Complete</span>
      </div>
      <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
}; 