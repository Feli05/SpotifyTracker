import { Skeleton } from "@heroui/react";
import { TopGenre } from "./types";

interface TopGenresChartProps {
  genres: TopGenre[];
  loading: boolean;
  error: string | null;
}

export const TopGenresChart = ({ genres, loading, error }: TopGenresChartProps) => {
  if (loading) {
    return (
        <div className="bg-primary rounded-xl p-5 flex-grow">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Skeleton className="h-3 w-full rounded-full" />
                </div>
            ))}
          </div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="bg-red-900/30 text-text-primary rounded-lg p-4 text-center">
          <p>{error}</p>
        </div>
    );
  }

  if (!genres || genres.length === 0) {
    return (
        <div className="bg-primary-subtle text-text-primary rounded-lg p-4 text-center">
          <p>No genre data available</p>
        </div>
    );
  }

  // Sort genres by count (highest first)
  const sortedGenres = [...genres].sort((a, b) => b.count - a.count).slice(0, 5);

  // Genre colors - Spotify-inspired palette but more subtle
  const genreColors = [
    'bg-green-500',
    'bg-indigo-500',
    'bg-blue-500',
    'bg-pink-500',
    'bg-yellow-500',
  ];

  const genreTextColors = [
    'text-green-300',
    'text-indigo-300',
    'text-blue-300',
    'text-pink-300',
    'text-yellow-300',
  ];

  return (
      <div className="p-5 bg-secondary rounded-xl shadow-md flex-grow">
        <div className="flex flex-col h-full">
          <div className="grid grid-cols-2 gap-2 mb-5">
            {sortedGenres.slice(0, 4).map((genre, index) => (
                <div
                    key={genre.name}
                    className="bg-primary-subtle p-3 rounded-lg border border-gray-800/40"
                >
                  <div className={`${genreTextColors[index % genreTextColors.length]} mb-1 text-sm font-medium`}>
                    {genre.name}
                  </div>
                  <div className="text-xl font-bold text-text-primary">{genre.percentage}%</div>
                </div>
            ))}
          </div>

          {/* Genre distribution bars */}
          <div className="space-y-3 flex-grow">
            {sortedGenres.map((genre, index) => (
                <div key={genre.name} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-text-secondary">{genre.name}</span>
                    <span className="text-xs text-text-muted">{genre.percentage}%</span>
                  </div>
                  <div className="bg-primary-subtle h-2 rounded-full w-full overflow-hidden">
                    <div
                        className={`h-full ${genreColors[index % genreColors.length]} rounded-full`}
                        style={{ width: `${genre.percentage}%` }}
                    ></div>
                  </div>
                </div>
            ))}
          </div>
        </div>
      </div>
  );
};