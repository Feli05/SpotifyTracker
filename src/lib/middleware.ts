import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

/**
 * updateSession: Refreshes the Supabase session and updates cookies if needed.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

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
            // Update the request's cookies
            request.cookies.set(name, value);

            // Update the response cookies so they reach the client
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  // Attempt to refresh session or retrieve user
  const { data: { user }, error } = await supabase.auth.getUser();

  // Return the possibly updated response (with new cookies)
  return response;
}
