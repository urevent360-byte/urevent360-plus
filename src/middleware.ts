import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get('sessionToken')?.value;
  const { pathname } = request.nextUrl;

  const protectedRoutes = ['/dashboard', '/admin'];

  // If trying to access a protected route without a session token, redirect to login
  if (protectedRoutes.some(p => pathname.startsWith(p))) {
    if (!sessionToken) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // This part of the logic will be handled client-side after login,
  // based on the user's role (admin or not).
  // The middleware's job is just to protect routes that require any authentication.

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    // We remove /login and /register from here because client-side logic
    // in AuthProvider and the pages themselves will handle redirects
    // for already-logged-in users. This simplifies the middleware.
  ],
};
