import { useEffect, useState } from 'react';
import { Particle, ParticlesProps } from './types';

export const Particles = ({ count = 25 }: ParticlesProps) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  
  // Generate particles only once on component mount
  useEffect(() => {
    const generatedParticles = Array.from({ length: count }).map(() => ({
      width: `${Math.random() * 10 + 3}px`,  // Larger particles
      height: `${Math.random() * 10 + 3}px`, // Larger particles
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      opacity: 0.15 + Math.random() * 0.25, // Higher opacity
      animationDuration: `${Math.random() * 8 + 12}s`,
      animationDelay: `${Math.random() * 5}s` // Add delay for more variety
    }));
    
    setParticles(generatedParticles);
  }, [count]);
  
  if (particles.length === 0) return null;
  
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle, i) => (
        <div 
          key={i}
          className="absolute rounded-full"
          style={{
            width: particle.width,
            height: particle.height,
            left: particle.left,
            top: particle.top,
            background: 'linear-gradient(to right, var(--color-accent), var(--color-purple-400))',
            opacity: particle.opacity,
            animation: `float ${particle.animationDuration} linear infinite`,
            animationDelay: particle.animationDelay,
            filter: 'blur(0.5px)', // Subtle blur for glow effect
            boxShadow: '0 0 6px rgba(var(--color-accent-rgb), 0.3)' // Subtle glow
          }}
        />
      ))}
      
      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-40px); }
          100% { transform: translateY(-80px) opacity(0); }
        }
      `}</style>
    </div>
  );
}; 