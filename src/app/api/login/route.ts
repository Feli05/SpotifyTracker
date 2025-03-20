import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  let response = new NextResponse(null, { status: 200 });
  const { email, password } = await request.json();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, {
              ...options,
              secure: false, // false for local development, true for production
            });
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

  // On success 
  return NextResponse.json(
    { success: true },
    { status: 200 }
  );
}
