import { StepCardProps } from './types';

export const StepCard = ({ step, title, description, icon }: StepCardProps) => {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="w-24 h-24 rounded-full bg-primary-subtle flex items-center justify-center mb-4">
        <div className="w-16 h-16 text-accent flex items-center justify-center">
          {icon}
        </div>
      </div>
      
      <h3 className="font-bold mb-2">{step}. {title}</h3>
      <p className="text-text-secondary text-sm">{description}</p>
    </div>
  );
}; 