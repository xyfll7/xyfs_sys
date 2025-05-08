import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export let locales = ['en', 'zh', 'nl'];

// Get the preferred locale, similar to the above or using a library
function getLocale(request: NextRequest) {
  const acceptLanguage = request.headers.get('accept-language')?.split(',')[0]?.split("-")[0] || '';
  return locales.includes(acceptLanguage) ? acceptLanguage : 'en';
}

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