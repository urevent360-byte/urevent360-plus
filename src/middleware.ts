
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function getRole(req: NextRequest) {
  return req.cookies.get('role')?.value as 'admin' | 'host' | undefined;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const role = getRole(req);

  // ADMIN routes protection
  if (pathname.startsWith('/admin')) {
    const adminAuthRoutes = ['/admin/login', '/admin/forgot-password'];
    if (adminAuthRoutes.includes(pathname)) {
      // If a logged-in admin tries to access login, redirect them to dashboard
      if (role === 'admin') {
        return NextResponse.redirect(new URL('/admin/dashboard', req.url));
      }
      return NextResponse.next();
    }
    // If not an admin (either host or no role), redirect to admin login
    if (role !== 'admin') {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
    return NextResponse.next();
  }

  // APP (host/client) routes protection
  if (pathname.startsWith('/app')) {
    const appAuthRoutes = ['/app/login', '/app/register', '/app/forgot-password'];
    if (appAuthRoutes.includes(pathname)) {
       // If a logged-in user (host or admin) tries to access login, redirect them away
      if (role === 'host') {
        return NextResponse.redirect(new URL('/app/home', req.url));
      }
      if (role === 'admin') {
        return NextResponse.redirect(new URL('/admin/dashboard', req.url));
      }
      return NextResponse.next();
    }
    // If user is an admin, they belong in the admin portal
    if (role === 'admin') {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url));
    }
    // If no role (not logged in), redirect to host login
    if (!role) {
      return NextResponse.redirect(new URL('/app/login', req.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/app/:path*'],
};
