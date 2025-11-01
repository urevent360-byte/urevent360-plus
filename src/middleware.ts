
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Lee cookie 'role' puesta tras login (o cámbialo a verificación de Firebase si ya usas tokens)
function getRole(req: NextRequest) {
  const cookieRole = req.cookies.get('role')?.value; // 'admin' | 'host' | 'client' | undefined
  return cookieRole;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const role = getRole(req);

  // Rutas admin protegidas
  if (pathname.startsWith('/admin')) {
    // Permitir las rutas de auth admin
    const adminAuth = ['/admin/login', '/admin/forgot-password'];
    if (adminAuth.includes(pathname)) return NextResponse.next();

    if (role !== 'admin') {
      const url = req.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Rutas app (host/cliente)
  if (pathname.startsWith('/app')) {
    const appAuth = ['/app/login', '/app/register', '/app/forgot-password'];
    if (appAuth.includes(pathname)) return NextResponse.next();

    // Si marcaste rol 'host' o 'client' permites; si es admin, manda a admin dashboard
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

// Aplica solo a estas rutas
export const config = {
  matcher: ['/admin/:path*', '/app/:path*']
};
