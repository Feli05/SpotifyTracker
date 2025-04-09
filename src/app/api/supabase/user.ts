import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

/**
 * Get the authenticated Supabase user from a Next.js request
 * Returns the user ID and a response object with cookies set
 */
export async function getSupabaseUser(req: NextRequest) {
  // Initialize response for cookie handling
  let responseObj = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });
  
  // Create Supabase client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          responseObj.cookies.set(name, value, options);
        },
        remove(name: string, options: CookieOptions) {
          responseObj.cookies.set(name, '', {
            ...options,
            expires: new Date(0),
          });
        },
      },
    }
  );
  
  // Get user directly from Supabase
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  return { 
    user, 
    error: userError, 
    response: responseObj,
    supabase
  };
} 