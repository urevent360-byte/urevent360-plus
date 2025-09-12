import { NextResponse, type NextRequest } from 'next/server';

// This middleware is now mostly handled by the client-side AuthProvider,
// which provides a better user experience by avoiding page flashes.
// The AuthProvider checks the user's auth state and role, then redirects
// them to the correct portal (/admin or /app) or the login page.
// We'll keep a simple version here as a backup for server-side protection.

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // This is a conceptual check. In a real-world scenario with server-side rendering,
  // you would use Firebase session cookies to reliably check authentication status here.
  const isAuthed = request.cookies.has('firebase-authed');

  // Redirect unauthenticated users trying to access protected portals
  if (!isAuthed) {
    if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login') && !pathname.startsWith('/admin/forgot-password')) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    if (pathname.startsWith('/app') && !pathname.startsWith('/app/login') && !pathname.startsWith('/app/register') && !pathname.startsWith('/app/forgot-password')) {
      return NextResponse.redirect(new URL('/app/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     *
     * This ensures the middleware runs on all our app and admin pages.
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
