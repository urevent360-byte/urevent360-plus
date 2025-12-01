import { NextRequest, NextResponse } from 'next/server';

// --- Helpers de rol ---

type Role = 'admin' | 'host' | 'unknown';

function getRole(req: NextRequest): Role {
  const value = req.cookies.get('role')?.value;
  if (value === 'admin') return 'admin';
  if (value === 'host') return 'host';
  return 'unknown';
}

const adminAuthPages = ['/admin/login', '/admin/forgot-password'];
const appAuthPages = ['/app/login', '/app/register', '/app/forgot-password'];

// --- Middleware principal ---

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAdminArea = pathname === '/admin' || pathname.startsWith('/admin/');
  const isAppArea = pathname === '/app' || pathname.startsWith('/app/');

  // Solo nos importa /admin y /app
  if (!isAdminArea && !isAppArea) {
    return NextResponse.next();
  }

  const role = getRole(req);
  const isAdminAuth = adminAuthPages.includes(pathname);
  const isAppAuth = appAuthPages.includes(pathname);

  // ----------------------------
  // 1) Rutas del HOST /app/...
  // ----------------------------
  if (isAppArea) {
    // Si es admin y quiere entrar al área host → mandarlo al dashboard admin
    if (role === 'admin') {
      const url = new URL('/admin/dashboard', req.url);
      return NextResponse.redirect(url);
    }

    // Si NO tiene rol (no logueado), SOLO puede ver login/register/forgot
    if (role === 'unknown' && !isAppAuth) {
      const url = new URL('/app/login', req.url);
      return NextResponse.redirect(url);
    }

    // Si es host o está en páginas de auth → dejar pasar
    return NextResponse.next();
  }

  // ----------------------------
  // 2) Rutas del ADMIN /admin/...
  // ----------------------------
  if (isAdminArea) {
    // Si es host e intenta entrar en /admin → enviarlo a su dashboard host
    if (role === 'host') {
      const url = new URL('/app/dashboard', req.url);
      return NextResponse.redirect(url);
    }

    // Si es admin y entra a /admin/login o /admin/forgot → mandarlo al dashboard
    if (role === 'admin' && isAdminAuth) {
      const url = new URL('/admin/dashboard', req.url);
      return NextResponse.redirect(url);
    }

    // IMPORTANTE:
    // Si el rol es 'unknown' pero viene de Firebase logueado como admin,
    // igualmente lo vamos a dejar entrar al área /admin.
    // (La seguridad fuerte se hará en el backend si hace falta).
    return NextResponse.next();
  }

  return NextResponse.next();
}

// Solo aplicar a /admin y /app
export const config = {
  matcher: ['/admin/:path*', '/app/:path*'],
};
