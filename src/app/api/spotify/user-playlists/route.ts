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
    
    // Fetch user playlists (limit to 3)
    const playlistsResponse = await fetch(
      'https://api.spotify.com/v1/me/playlists?limit=3',
      {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      }
    );
    
    if (!playlistsResponse.ok) {
      console.error('Error fetching playlists:', 
        playlistsResponse.status, await playlistsResponse.text());
      
      return NextResponse.json(
        { error: 'Failed to fetch playlists from Spotify' },
        { status: 500 }
      );
    }
    
    const playlistsData = await playlistsResponse.json();
    
    const playlists = playlistsData.items.map((playlist: any) => ({
      id: playlist.id,
      name: playlist.name,
      image: playlist.images?.[0]?.url || null,
      url: playlist.external_urls?.spotify || null,
      tracks: playlist.tracks?.total || 0
    }));
    
    return NextResponse.json({ playlists });
    
  } catch (error) {
    console.error('Error fetching playlists:', error);
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
} 