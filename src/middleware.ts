import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;

    // Rutas públicas que nunca deben redirigir
    const publicAdmin = ['/admin/login', '/admin/forgot-password'];
    const publicApp = ['/app/login', '/app/register', '/app/forgot-password'];

    const isAdmin = pathname.startsWith('/admin');
    const isApp = pathname.startsWith('/app');

    // Solo checamos auth en secciones protegidas
    if (isAdmin || isApp) {
      const isAuthed = !!request.cookies.get('firebase-authed-token')?.value;

      if (!isAuthed) {
        if (isAdmin && !publicAdmin.some(p => pathname.startsWith(p))) {
          return NextResponse.redirect(new URL('/admin/login', request.url));
        }
        if (isApp && !publicApp.some(p => pathname.startsWith(p))) {
          return NextResponse.redirect(new URL('/app/login', request.url));
        }
      }
    }
  } catch (_err) {
    // Fallback: nunca botes el server por la middleware
    return NextResponse.next();
  }
  return NextResponse.next();
}

// Solo corre en /admin y /app (no en todo)
export const config = {
  matcher: ['/admin/:path*', '/app/:path*'],
};
