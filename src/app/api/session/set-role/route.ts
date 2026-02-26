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

  // ✅ prod = ALWAYS secure, no depender de x-forwarded-proto
  const secure = isProd;

  // 🔥 STEP 1 — DELETE ALL POSSIBLE OLD COOKIES

  // Host-only
  res.cookies.set('role', '', {
    path: '/',
    expires: new Date(0),
    sameSite: 'lax',
    secure,
  });

  if (isProd) {
    // Apex domain
    res.cookies.set('role', '', {
      path: '/',
      expires: new Date(0),
      sameSite: 'lax',
      secure,
      domain: 'urevent360plus.com',
    });

    // Wildcard domain
    res.cookies.set('role', '', {
      path: '/',
      expires: new Date(0),
      sameSite: 'lax',
      secure,
      domain: '.urevent360plus.com',
    });
  }

  // 🔥 STEP 2 — SET SINGLE CLEAN COOKIE

  const cookieOptions: any = {
    httpOnly: false,
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