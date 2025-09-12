import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow access to the new admin login page
  if (pathname === '/admin/login') {
      return NextResponse.next();
  }

  if (pathname.startsWith('/admin')) {
      // This is a simplified example. In a real app, you'd use a more robust
      // method for managing auth state on the server, likely involving middleware
      // that verifies a session cookie against your auth provider.
      // For now, we'll let the client-side checks in AuthProvider handle redirection.
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
