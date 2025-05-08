import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if there is any supported locale in the pathname
  return NextResponse.next();

}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    // '/((?!_next).*)',
    // '/((?!well-known).*)',
    // Optional: only run on root (/) URL
    '/'
  ],
};