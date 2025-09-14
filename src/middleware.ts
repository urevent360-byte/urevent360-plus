
import { NextResponse, type NextRequest } from 'next/server';

// This middleware is now mostly handled by the client-side AuthProvider,
// which provides a better user experience by avoiding page flashes.
// The AuthProvider checks the user's auth state and role, then redirects
// them to the correct portal (/admin or /app) or the login page.
// We'll keep a simple version here as a backup for server-side protection.

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // This is a conceptual check for production. In a real-world scenario with server-side
  // rendering, you would use Firebase session cookies to reliably check authentication status here.
  // The 'firebase-authed' cookie would be set upon sign-in on the client and verified here.
  const isAuthed = request.cookies.has('firebase-authed-token'); // Example cookie name

  // --- AUTHENTICATION IS TEMPORARILY DISABLED FOR DEVELOPMENT ---
  // The logic below is commented out to allow for free navigation without logging in.
  // To re-enable server-side route protection, uncomment this block.
  /*
  if (!isAuthed) {
    // If a user is not authenticated and tries to access a protected admin route,
    // redirect them to the admin login page.
    if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login') && !pathname.startsWith('/admin/forgot-password')) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    // If a user is not authenticated and tries to access a protected app route,
    // redirect them to the app login page.
    if (pathname.startsWith('/app') && !pathname.startsWith('/app/login') && !pathname.startsWith('/app/register') && !pathname.startsWith('/app/forgot-password')) {
      return NextResponse.redirect(new URL('/app/login', request.url));
    }
  }
  */

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
