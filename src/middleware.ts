import { updateSession } from "./lib/middleware";
import { NextRequest, NextResponse } from "next/server";

export default async function middleware(request: NextRequest) {
  const response = await updateSession(request);

  // Parse the cookie name from the URL
  const projectRef = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!).host.split(".")[0];
  const cookieName = `sb-${projectRef}-auth-token`;
  const token = request.cookies.get(cookieName)?.value;

  // 3. If no token, redirect user to the /login page
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
