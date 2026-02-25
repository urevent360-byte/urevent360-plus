import { NextRequest, NextResponse } from 'next/server';

function getHost(req: NextRequest) {
  return (req.headers.get('host') || '').split(':')[0].toLowerCase();
}

function isProdHost(host: string) {
  return host === 'urevent360plus.com' || host.endsWith('.urevent360plus.com');
}

export async function POST(req: NextRequest) {
  const { role } = await req.json();

  if (role !== 'admin' && role !== 'host') {
    return NextResponse.json({ ok: false, error: 'Invalid role' }, { status: 400 });
  }

  const res = NextResponse.json({ ok: true });

  const host = getHost(req);
  const isProd = isProdHost(host);

  // En prod SIEMPRE secure (evita depender de x-forwarded-proto)
  const secure = isProd;

  // STEP 1: BORRAR TODAS LAS VARIANTES POSIBLES (evita duplicadas)
  // Host-only (sin domain)
  res.cookies.set('role', '', {
    path: '/',
    expires: new Date(0),
    sameSite: 'lax',
    secure,
  });

  if (isProd) {
    // Apex explícito (Domain=urevent360plus.com)
    res.cookies.set('role', '', {
      path: '/',
      expires: new Date(0),
      sameSite: 'lax',
      secure,
      domain: 'urevent360plus.com',
    });

    // Wildcard (Domain=.urevent360plus.com)
    res.cookies.set('role', '', {
      path: '/',
      expires: new Date(0),
      sameSite: 'lax',
      secure,
      domain: '.urevent360plus.com',
    });
  }

  // STEP 2: SETEAR UNA SOLA COOKIE LIMPIA
  const cookieOptions: any = {
    httpOnly: false, // la lees en cliente (AuthProvider)
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
    secure,
  };

  if (isProd) {
    cookieOptions.domain = '.urevent360plus.com';
  }

  res.cookies.set('role', role, cookieOptions);

  return res;
}