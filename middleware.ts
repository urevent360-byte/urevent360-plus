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

  const isAdminArea = pathname === '/admin' || pathname.startsWith('/admin/');
  const isAppArea = pathname === '/app' || pathname.startsWith('/app/');

  // Fuera de /admin y /app no hacemos nada
  if (!isAdminArea && !isAppArea) {
    return NextResponse.next();
  }

  const role = getRole(req);
  const isAdminAuth = adminAuthPages.includes(pathname);
  const isAppAuth = appAuthPages.includes(pathname);

  // 🔹 1) SIN ROL (no logueado) → solo puede ver páginas de login/register/forgot
  if (role === 'unknown') {
    if (isAdminArea && !isAdminAuth) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
    if (isAppArea && !isAppAuth) {
      return NextResponse.redirect(new URL('/app/login', req.url));
    }
    return NextResponse.next();
  }

  // 🔹 2) ROL ADMIN
  if (role === 'admin') {
    // Admin NO debe entrar a /app/*
    if (isAppArea) {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url));
    }
    // Si intenta ir al login de admin estando logueado → mándalo al dashboard
    if (isAdminAuth) {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url));
    }
    return NextResponse.next();
  }

  // 🔹 3) ROL HOST
  if (role === 'host') {
    // Host NO debe entrar a /admin/*
    if (isAdminArea) {
      return NextResponse.redirect(new URL('/app/dashboard', req.url));
    }
    // Si intenta ir a login/register/forgot de host estando logueado → dashboard host
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
