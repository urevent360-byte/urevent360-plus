// /middleware.ts
import { NextRequest, NextResponse } from 'next/server';

const adminAuthPages = ['/admin/login', '/admin/forgot-password'];
const appAuthPages = ['/app/login', '/app/register', '/app/forgot-password'];

function getRole(req: NextRequest): 'admin' | 'host' | 'unknown' {
  const value = req.cookies.get('role')?.value;
  if (value === 'admin') return 'admin';
  if (value === 'host') return 'host';
  return 'unknown';
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAdminArea = pathname.startsWith('/admin');
  const isAppArea = pathname.startsWith('/app');

  // Rutas que no son ni /admin ni /app -> no tocar
  if (!isAdminArea && !isAppArea) {
    return NextResponse.next();
  }

  const role = getRole(req);
  const isAdminAuth = adminAuthPages.includes(pathname);
  const isAppAuth = appAuthPages.includes(pathname);

  // 🔹 Sin rol -> sólo puede ver páginas de login/register/forgot
  if (role === 'unknown') {
    if (isAdminArea && !isAdminAuth) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
    if (isAppArea && !isAppAuth) {
      return NextResponse.redirect(new URL('/app/login', req.url));
    }
    return NextResponse.next();
  }

  // 🔹 Rol admin
  if (role === 'admin') {
    // Admin nunca debe ver zona /app
    if (isAppArea) {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url));
    }
    // Si intenta ir a /admin/login, mándalo al dashboard
    if (isAdminAuth) {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url));
    }
    return NextResponse.next();
  }

  // 🔹 Rol host
  if (role === 'host') {
    // Host nunca debe ver zona /admin
    if (isAdminArea) {
      return NextResponse.redirect(new URL('/app/dashboard', req.url));
    }
    // Si intenta ir a /app/login/register/forgot logueado, mándalo a dashboard host
    if (isAppAuth) {
      return NextResponse.redirect(new URL('/app/dashboard', req.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/app/:path*'],
};
