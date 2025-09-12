import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Publicly accessible auth pages for each portal
  const publicHostRoutes = ['/app/login', '/app/register'];
  const publicAdminRoutes = ['/admin/login'];
  
  // Attempt to get the authentication cookie.
  // Note: This is a simplification. Firebase's official recommendation for server-side
  // rendering is to use session cookies, which is more complex to set up.
  // This cookie (`firebase-authed`) is a placeholder name and would depend
  // on the actual implementation of how the session is persisted.
  // For this prototype, the client-side `AuthProvider` is the primary guard.
  const isAuthed = request.cookies.has('firebase-authed'); // This is a conceptual check

  // If the user is trying to access a private admin route and is not authenticated
  if (pathname.startsWith('/admin') && !publicAdminRoutes.includes(pathname) && !isAuthed) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  // If the user is trying to access a private host/client route and is not authenticated
  if (pathname.startsWith('/app') && !publicHostRoutes.includes(pathname) && !isAuthed) {
      return NextResponse.redirect(new URL('/app/login', request.url));
  }
  
  // All other cases are handled by the client-side AuthProvider,
  // which can correctly identify the user's role and redirect if necessary.
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - /, /services, /gallery, /contact (public pages)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|services|gallery|contact|^/$).*)',
  ],
};
