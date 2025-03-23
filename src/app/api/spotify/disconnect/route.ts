import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';
import { CookieOptions } from '@supabase/ssr';

export async function POST(request: NextRequest) {
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
    
    // Delete Spotify tokens for user
    const { error: deleteError } = await supabase
      .from('spotify_tokens')
      .delete()
      .eq('user_id', user.id);
    
    if (deleteError) {
      return NextResponse.json({ 
        error: 'Failed to disconnect Spotify', 
        details: deleteError.message 
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Spotify disconnected successfully' 
    });
  } catch (error) {
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
} 