import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";

// Define type for recommendations
interface Recommendation {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
}

interface RecommendationsSectionProps {
  recommendations: Recommendation[];
}

const RecommendationsSection: React.FC<RecommendationsSectionProps> = ({ 
  recommendations 
}) => {
  return (
    <div className="relative pt-14 opacity-90 hover:opacity-100 transition-opacity">
      {/* Enhanced separator */}
      <div className="absolute top-0 left-0 right-0 flex flex-col items-center">
        <div className="w-full h-0.5 bg-secondary"></div>
        <div className="w-2/3 h-1 -mt-0.5 bg-gradient-to-r from-transparent via-accent to-transparent"></div>
        <div className="w-1/3 h-1 -mt-0.5 bg-gradient-to-r from-transparent via-accent/70 to-transparent"></div>
      </div>
      
      <div className="mb-6">
        <h2 className="text-lg text-text-secondary">Your Past Recommendations</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((recommendation) => (
          <div 
            key={recommendation._id}
            className="border-l-2 border-secondary pl-3 hover:border-accent transition-colors"
          >
            <div className="flex justify-between items-start">
              <h3 className="font-medium text-text-primary mb-1">{recommendation.name}</h3>
              <span className="text-text-muted text-xs">{recommendation.createdAt}</span>
            </div>
            <p className="text-text-secondary text-sm mb-2">{recommendation.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-text-muted text-xs">12 tracks</span>
              <Link
                href={`/playlist/${recommendation._id}`}
                className="text-accent hover:text-accent/80 text-sm font-medium transition-colors flex items-center"
              >
                View
                <ArrowRightIcon />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendationsSection; 