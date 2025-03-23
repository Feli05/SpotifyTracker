import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { CookieOptions } from "@supabase/ssr";

export async function POST(request: NextRequest) {
  // Create a response object first
  let response = NextResponse.json(
    { success: true },
    { status: 200 }
  );
  
  const { email, password } = await request.json();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          // Set cookies on the response object
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

  // Sign in with password
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  // If there's an error
  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }

  // On success return the response with cookies set
  return response;
}
