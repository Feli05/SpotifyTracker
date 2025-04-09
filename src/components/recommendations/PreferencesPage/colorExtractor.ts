/**
 * Color palette extracted from an image
 */
export interface ColorPalette {
  dominantColor: string;
  secondaryColor: string;
}

/**
 * Default color palette to use as a fallback
 */
const DEFAULT_COLORS: ColorPalette = {
  dominantColor: '#3b82f6', // blue
  secondaryColor: '#8b5cf6', // purple
};

// Pre-defined color pairs for different music genres
const GENRE_COLORS: Record<string, ColorPalette> = {
  pop: { dominantColor: '#ff4d88', secondaryColor: '#a74fff' },
  rock: { dominantColor: '#e33e3e', secondaryColor: '#d35400' },
  electronic: { dominantColor: '#3498db', secondaryColor: '#2ecc71' },
  hiphop: { dominantColor: '#9b59b6', secondaryColor: '#3498db' },
  jazz: { dominantColor: '#d35400', secondaryColor: '#f1c40f' },
  classical: { dominantColor: '#2c3e50', secondaryColor: '#7f8c8d' },
  country: { dominantColor: '#f39c12', secondaryColor: '#d35400' },
  metal: { dominantColor: '#2c3e50', secondaryColor: '#c0392b' },
  indie: { dominantColor: '#16a085', secondaryColor: '#27ae60' },
  default: DEFAULT_COLORS
};

/**
 * Simple utility to get colors based on genre or a default color cycle
 * 
 * @param genre The music genre, if available
 * @param index Optional index to use for cycling through colors
 * @returns A color palette
 */
export function getColorsForGenre(genre?: string, index?: number): ColorPalette {
  if (genre) {
    // Try to match genre to our predefined color mappings
    const genreKey = Object.keys(GENRE_COLORS).find(
      key => genre.toLowerCase().includes(key)
    );
    
    if (genreKey) {
      return GENRE_COLORS[genreKey];
    }
  }
  
  // If no genre match or index provided, use a color cycle
  if (typeof index === 'number') {
    const colorKeys = Object.keys(GENRE_COLORS);
    const selectedKey = colorKeys[index % colorKeys.length];
    return GENRE_COLORS[selectedKey];
  }
  
  // Default fallback
  return DEFAULT_COLORS;
}

/**
 * Generate a CSS gradient string using colors
 * 
 * @param colors The color palette to use for the gradient
 * @param type The type of gradient to generate (defaults to vertical)
 * @returns A CSS gradient string
 */
export function generateGradient(
  colors: ColorPalette, 
  type: 'vertical' | 'diagonal' | 'radial' = 'vertical'
): string {
  const { dominantColor, secondaryColor } = colors;
  
  switch (type) {
    case 'diagonal':
      return `linear-gradient(135deg, ${dominantColor}99, ${secondaryColor}77, var(--color-bg-primary) 90%)`;
    
    case 'radial':
      return `radial-gradient(circle at center, ${dominantColor}99, ${secondaryColor}77, var(--color-bg-primary) 90%)`;
    
    case 'vertical':
    default:
      return `linear-gradient(to bottom, ${dominantColor}99, ${secondaryColor}77, var(--color-bg-primary) 85%)`;
  }
} 