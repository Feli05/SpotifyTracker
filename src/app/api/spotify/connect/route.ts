import { NextRequest, NextResponse } from 'next/server';
import { getAuthUrl } from '@/lib/spotify';

export async function GET(request: NextRequest) {
  const authUrl = getAuthUrl();
  return NextResponse.json({ url: authUrl });
}