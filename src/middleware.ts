import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const publicRoutes = ['/', '/services', '/gallery', '/contact', '/login', '/register'];

  // This is a simplified example. In a real app, you'd use a more robust
  // method for managing auth state on the server, likely involving middleware
  // that verifies a session cookie against your auth provider.
  // For now, we'll keep the client-side check as the primary guard.

  if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) {
      // These routes are protected and rely on client-side auth checks.
      // The middleware's primary job is to allow Next.js to render the page shell,
      // which will then handle redirection if the user is not authenticated.
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
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
