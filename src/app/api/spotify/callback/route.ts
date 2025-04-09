import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';
import { getAccessToken } from '@/lib/spotify';
import { CookieOptions } from '@supabase/ssr';

export async function GET(request: NextRequest) {
  // Create response object
  const response = NextResponse.redirect(new URL('/dashboard', request.url));
  
  // Get authorization code from query params
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const error = url.searchParams.get('error');
  
  if (error || !code) {
    return NextResponse.redirect(
      new URL(`/dashboard?error=${error || 'No authorization code received'}`, request.url)
    );
  }
  
  // Create Supabase client
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
  
  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.redirect(
        new URL('/login?error=Authentication required', request.url)
      );
    }
    
    // Exchange code for access token
    const tokenResponse = await getAccessToken(code);
    
    if (tokenResponse.error) {
      return NextResponse.redirect(
        new URL(`/dashboard?error=${tokenResponse.error_description || 'Failed to get tokens'}`, request.url)
      );
    }
    
    const { access_token, refresh_token, expires_in } = tokenResponse;
    const token_expires_at = new Date(Date.now() + expires_in * 1000).toISOString();
    
    // Store tokens in Supabase
    const { error: insertError } = await supabase
      .from('spotify_tokens')
      .upsert({
        user_id: user.id,
        access_token,
        refresh_token,
        token_expires_at
      }, { onConflict: 'user_id' });
    
    if (insertError) {
      return NextResponse.redirect(
        new URL('/dashboard?error=Failed to store tokens', request.url)
      );
    }
    
    // Redirect to dashboard with success message
    return NextResponse.redirect(
      new URL('/dashboard?success=Connected to Spotify', request.url)
    );
  } catch (error) {
    return NextResponse.redirect(
      new URL('/dashboard?error=Unexpected error occurred', request.url)
    );
  }
}