declare module 'spotify-preview-finder' {
  interface SpotifyPreviewResult {
    success: boolean;
    results: {
      name: string;
      spotifyUrl: string;
      previewUrls: string[];
    }[];
    error?: string;
  }
  
  const spotifyPreviewFinder: (songName: string, limit?: number) => Promise<SpotifyPreviewResult>;
  export default spotifyPreviewFinder;
} 