import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';
import { refreshAccessToken } from '@/lib/spotify';
import { CookieOptions } from '@supabase/ssr';

export async function GET(request: NextRequest) {
  try {
    const response = NextResponse.json({ success: false }, { status: 401 });
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            response.cookies.set(name, value, options);
          },
          remove(name: string, options: CookieOptions) {
            response.cookies.set(name, '', {
              ...options,
              expires: new Date(0),
            });
          },
        },
      }
    );
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }
    
    // Get Spotify tokens for user
    const { data: tokenData, error: tokenError } = await supabase
      .from('spotify_tokens')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    if (tokenError || !tokenData) {
      return NextResponse.json({ error: 'Spotify not connected' }, { status: 400 });
    }
    
    // Check if token is expired
    const now = new Date();
    const tokenExpiresAt = new Date(tokenData.token_expires_at);
    
    let access_token = tokenData.access_token;
    
    // Refresh token if expired
    if (now >= tokenExpiresAt) {
      try {
        const refreshResponse = await refreshAccessToken(tokenData.refresh_token);
        
        // Update tokens in database
        access_token = refreshResponse.access_token;
        const expires_in = refreshResponse.expires_in;
        const token_expires_at = new Date(Date.now() + expires_in * 1000).toISOString();
        
        await supabase
          .from('spotify_tokens')
          .update({
            access_token,
            token_expires_at,
            ...(refreshResponse.refresh_token ? { refresh_token: refreshResponse.refresh_token } : {})
          })
          .eq('user_id', user.id);
      } catch (error) {
        return NextResponse.json({ 
          error: 'Failed to refresh token', 
          details: error instanceof Error ? error.message : String(error)
        }, { status: 400 });
      }
    }
    
    // Fetch top 20 tracks with medium_term range (approx. last 6 months)
    const tracksResponse = await fetch(
      'https://api.spotify.com/v1/me/top/tracks?time_range=medium_term&limit=20',
      {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      }
    );
    
    if (!tracksResponse.ok) {
      console.error('Error fetching top tracks:', 
        tracksResponse.status, await tracksResponse.text());
      
      return NextResponse.json(
        { error: 'Failed to fetch top tracks from Spotify' },
        { status: 500 }
      );
    }
    
    const tracksData = await tracksResponse.json();
    
    // Transform track data
    const topTracks = tracksData.items.map((track: any, index: number) => ({
      rank: index + 1,
      id: track.id,
      name: track.name,
      artist: track.artists.map((artist: any) => artist.name).join(', '),
      album: track.album.name,
      albumCover: track.album.images?.[0]?.url || null,
      releaseDate: track.album.release_date || 'Unknown',
      releaseYear: track.album.release_date ? new Date(track.album.release_date).getFullYear() : 'Unknown',
      popularity: track.popularity || 0,
      url: track.external_urls?.spotify || null
    }));
    
    return NextResponse.json({ topTracks });
    
  } catch (error) {
    console.error('Error fetching top tracks:', error);
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
} 