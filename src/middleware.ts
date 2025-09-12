import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get('sessionToken')?.value;
  const { pathname } = request.nextUrl;

  const protectedRoutes = ['/dashboard'];

  if (protectedRoutes.some(p => pathname.startsWith(p))) {
    if (!sessionToken) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  if ((pathname.startsWith('/login') || pathname.startsWith('/register')) && sessionToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
    '/register',
  ],
};
