// src/middleware.ts
import { NextResponse, type NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // lee la cookie; .get() devuelve { name, value } | undefined
  const isAuthed = !!req.cookies.get('firebase-authed-token')?.value;

  // Proteger sólo /admin y /app (excepto sus páginas de auth)
  if (!isAuthed) {
    if (
      pathname.startsWith('/admin') &&
      !pathname.startsWith('/admin/login') &&
      !pathname.startsWith('/admin/forgot-password')
    ) {
      const url = new URL('/admin/login', req.url);
      url.searchParams.set('next', pathname);
      return NextResponse.redirect(url);
    }

    if (
      pathname.startsWith('/app') &&
      !pathname.startsWith('/app/login') &&
      !pathname.startsWith('/app/register') &&
      !pathname.startsWith('/app/forgot-password')
    ) {
      const url = new URL('/app/login', req.url);
      url.searchParams.set('next', pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// ⚠️ Muy importante: sólo hacer match en /admin y /app
export const config = {
  matcher: ['/admin/:path*', '/app/:path*'],
};
