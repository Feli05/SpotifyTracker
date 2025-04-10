import { NextResponse } from 'next/server';
import { fetchSpotifyPreview } from '@/lib/spotify';

export async function GET(request: Request) {
  try {
    // Get query parameters
    const url = new URL(request.url);
    const song = url.searchParams.get('song');
    const artist = url.searchParams.get('artist');
    const limit = url.searchParams.get('limit') || '3';
    
    if (!song) {
      return NextResponse.json({
        success: false,
        error: 'Song parameter is required'
      }, { status: 400 });
    }
    
    // Create search query
    const searchQuery = artist ? `${song} ${artist}` : song;
    
    // Use the server-side function to get the preview
    const result = await fetchSpotifyPreview(searchQuery, parseInt(limit, 10));
    
    // Return the result directly
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      previews: []
    }, { status: 500 });
  }
} 