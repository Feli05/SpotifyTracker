import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';
import { CookieOptions } from '@supabase/ssr';

export async function POST(request: NextRequest) {
  let response = NextResponse.json(
    { success: true },
    { status: 200 }
  );

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

  // Sign the user out
  const { error } = await supabase.auth.signOut();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Clear the auth cookie by setting it to expire in the past
  const projectRef = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!).host.split(".")[0];
  const cookieName = `sb-${projectRef}-auth-token`;
  
  response.cookies.set(cookieName, '', {
    expires: new Date(0),
    path: '/',
  });

  return response;
} 