
import { NextResponse, type NextRequest } from 'next/server';
import { getApps, getApp, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// This is a simplified middleware. For production, you'd use a more robust
// solution like NextAuth.js or server-side session verification with cookies.

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const publicHostRoutes = ['/app/login', '/app/register', '/app/forgot-password'];
  const publicAdminRoutes = ['/admin/login', '/admin/forgot-password'];
  
  const authedCookie = request.cookies.get('firebase-authed');

  // If the user is not authenticated and trying to access a private route
  if (!authedCookie) {
    if (pathname.startsWith('/admin') && !publicAdminRoutes.includes(pathname)) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    if (pathname.startsWith('/app') && !publicHostRoutes.includes(pathname)) {
        return NextResponse.redirect(new URL('/app/login', request.url));
    }
  }

  // If the user is authenticated, handle redirects from login pages
  if (authedCookie) {
      if (publicAdminRoutes.includes(pathname)) {
          // This is a tricky part. We don't know the user's role here.
          // The client-side AuthProvider will handle the final redirect to /admin/home or /app/home.
          // We can just let them pass or redirect to a generic home.
          return NextResponse.redirect(new URL('/', request.url));
      }
       if (publicHostRoutes.includes(pathname)) {
          return NextResponse.redirect(new URL('/app/home', request.url));
      }
  }


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
     * - / (public homepage)
     * - /services, /gallery, /contact (other public pages)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|services|gallery|contact|$).*)',
  ],
};
