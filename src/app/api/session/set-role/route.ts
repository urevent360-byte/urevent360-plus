import { NextRequest, NextResponse } from 'next/server';

function getCookieDomain(req: NextRequest): string | undefined {
  // host puede venir como "www.urevent360plus.com" o "urevent360plus.com" o "localhost:3000"
  const host = req.headers.get('host') || '';
  const hostname = host.split(':')[0].toLowerCase();

  // Solo aplicamos Domain cuando estamos en el dominio real
  if (hostname === 'urevent360plus.com' || hostname.endsWith('.urevent360plus.com')) {
    return '.urevent360plus.com';
  }

  return undefined;
}

export async function POST(req: NextRequest) {
  const { role } = await req.json();

  if (!role || (role !== 'admin' && role !== 'host')) {
    return NextResponse.json({ ok: false, error: 'Invalid role' }, { status: 400 });
  }

  const res = NextResponse.json({ ok: true });

  const domain = getCookieDomain(req);

  // Nota: Secure debe ser true en HTTPS. En App Hosting / dominio real siempre es HTTPS.
  // En localhost/Studio puede ser false.
  const isSecure = (req.headers.get('x-forwarded-proto') || '').toLowerCase() === 'https';

  const cookieOptions: any = {
    httpOnly: false, // lo necesitas para leerlo con document.cookie (AuthProvider)
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 días
    secure: isSecure,
  };

  if (domain) cookieOptions.domain = domain;

  res.cookies.set('role', role, cookieOptions);

  return res;
}
