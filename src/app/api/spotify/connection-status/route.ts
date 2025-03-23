import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';
import { CookieOptions } from '@supabase/ssr';

export async function GET(request: NextRequest) {
  try {
    const response = NextResponse.json({ connected: false }, { status: 200 });
    
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
      return NextResponse.json({ 
        connected: false,
        error: 'User not authenticated' 
      }, { status: 401 });
    }
    
    // Check if user has Spotify tokens
    const { data: tokenData, error: tokenError } = await supabase
      .from('spotify_tokens')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    // Return connection status
    return NextResponse.json({ 
      connected: !tokenError && !!tokenData
    });
  } catch (error) {
    return NextResponse.json({ 
      connected: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
} 