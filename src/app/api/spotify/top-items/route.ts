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
    
    // Fetch top artist
    const artistResponse = await fetch(
      'https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=1',
      {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      }
    );
    
    // Fetch top track
    const trackResponse = await fetch(
      'https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=1',
      {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      }
    );
    
    if (!artistResponse.ok || !trackResponse.ok) {
      console.error('Error fetching top items:', 
        artistResponse.status, await artistResponse.text(),
        trackResponse.status, await trackResponse.text());
      
      return NextResponse.json(
        { error: 'Failed to fetch top items from Spotify' },
        { status: 500 }
      );
    }
    
    const artistData = await artistResponse.json();
    const trackData = await trackResponse.json();
    
    const topArtist = artistData.items && artistData.items.length > 0 
      ? {
          name: artistData.items[0].name,
          image: artistData.items[0].images?.[0]?.url || null,
          url: artistData.items[0].external_urls?.spotify || null,
          followers: artistData.items[0].followers?.total || 0,
          popularity: artistData.items[0].popularity || 0
        }
      : null;
    
    const topTrack = trackData.items && trackData.items.length > 0
      ? {
          name: trackData.items[0].name,
          artist: trackData.items[0].artists?.[0]?.name || 'Unknown Artist',
          image: trackData.items[0].album?.images?.[0]?.url || null,
          url: trackData.items[0].external_urls?.spotify || null,
          popularity: trackData.items[0].popularity || 0
        }
      : null;
    
    return NextResponse.json({
      topArtist,
      topTrack
    });
    
  } catch (error) {
    console.error('Error fetching top items:', error);
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
} 