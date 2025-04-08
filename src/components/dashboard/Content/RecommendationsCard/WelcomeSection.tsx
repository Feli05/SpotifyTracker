import { useEffect } from "react";
import Link from "next/link";
import { MusicNoteIcon } from "@/components/icons";

const WelcomeSection = () => {
  useEffect(() => {
    // Add the gradient border animation styles
    const styleId = 'gradient-border-styles';
    if (!document.getElementById(styleId)) {
      const styleEl = document.createElement('style');
      styleEl.id = styleId;
      styleEl.innerHTML = `
        @keyframes gradient-border {
          0%, 100% {
            border: 2px solid rgba(102, 126, 234, 1);
            box-shadow: 0 0 10px rgba(102, 126, 234, 0.5);
          }
          25% {
            border: 2px solid rgba(142, 45, 226, 1);
            box-shadow: 0 0 10px rgba(142, 45, 226, 0.5);
          }
          50% {
            border: 2px solid rgba(74, 222, 128, 1);
            box-shadow: 0 0 10px rgba(74, 222, 128, 0.5);
          }
          75% {
            border: 2px solid rgba(245, 158, 11, 1);
            box-shadow: 0 0 10px rgba(245, 158, 11, 0.5);
          }
        }

        .animate-gradient-border {
          position: relative;
          animation: gradient-border 5s ease infinite;
        }
      `;
      document.head.appendChild(styleEl);
    }
    
    // Cleanup function to remove styles when component unmounts
    return () => {
      const styleEl = document.getElementById(styleId);
      if (styleEl) {
        styleEl.remove();
      }
    };
  }, []);

  return (
    <div className="bg-gradient-to-r from-primary-accent/30 to-primary-accent/10 min-h-[65vh] flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold text-text-primary mb-6">Welcome back!</h1>
      <p className="text-text-secondary text-xl mb-12 max-w-2xl text-center">
        Ready to discover new music that matches your unique taste?
      </p>
      
      <div className="mt-8">
        <Link 
          href="/recommendations"
          className="inline-flex items-center justify-center bg-primary hover:bg-primary-subtle transition-all duration-300 px-10 py-5 rounded-xl text-text-primary font-medium text-xl relative animate-gradient-border"
        >
          <span className="absolute inset-0 rounded-xl animate-gradient-border"></span>
          <MusicNoteIcon />
          <span className="ml-4">Get Recommendations</span>
        </Link>
      </div>
    </div>
  );
};

export default WelcomeSection; 