import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function getRole(req: NextRequest) {
  return req.cookies.get('role')?.value as 'admin' | 'host' | 'client' | undefined;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const role = getRole(req);

  // ADMIN
  if (pathname.startsWith('/admin')) {
    const adminAuth = ['/admin/login', '/admin/forgot-password'];
    if (adminAuth.includes(pathname)) return NextResponse.next();
    if (role !== 'admin') {
      const url = req.nextUrl.clone();
      url.pathname = '/app/login';
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // APP (host/cliente)
  if (pathname.startsWith('/app')) {
    const appAuth = ['/app/login', '/app/register', '/app/forgot-password'];
    if (appAuth.includes(pathname)) return NextResponse.next();
    if (role === 'admin') {
      const url = req.nextUrl.clone();
      url.pathname = '/admin/dashboard';
      return NextResponse.redirect(url);
    }
    if (!role) {
      const url = req.nextUrl.clone();
      url.pathname = '/app/login';
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/app/:path*'],
};
