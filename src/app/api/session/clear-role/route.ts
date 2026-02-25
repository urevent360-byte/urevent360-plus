import { NextRequest, NextResponse } from 'next/server';

function getHost(req: NextRequest) {
  return (req.headers.get('host') || '').split(':')[0].toLowerCase();
}

function isProdHost(host: string) {
  return host === 'urevent360plus.com' || host.endsWith('.urevent360plus.com');
}

export async function POST(req: NextRequest) {
  const res = NextResponse.json({ ok: true });

  const host = getHost(req);
  const isProd = isProdHost(host);
  const secure = isProd;

  // Host-only
  res.cookies.set('role', '', {
    path: '/',
    expires: new Date(0),
    sameSite: 'lax',
    secure,
  });

  if (isProd) {
    // Apex explícito
    res.cookies.set('role', '', {
      path: '/',
      expires: new Date(0),
      sameSite: 'lax',
      secure,
      domain: 'urevent360plus.com',
    });

    // Wildcard
    res.cookies.set('role', '', {
      path: '/',
      expires: new Date(0),
      sameSite: 'lax',
      secure,
      domain: '.urevent360plus.com',
    });
  }

  return res;
}