import { NextRequest, NextResponse } from 'next/server';

type Role = 'admin' | 'host';

function getCookieDomain(req: NextRequest) {
  const host = (req.headers.get('host') || '').split(':')[0].toLowerCase();

  if (host === 'urevent360plus.com' || host === 'www.urevent360plus.com') {
    return '.urevent360plus.com';
  }

  return undefined;
}

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as { role?: Role } | null;
  const role = body?.role;

  if (role !== 'admin' && role !== 'host') {
    return NextResponse.json({ ok: false, error: 'Invalid role' }, { status: 400 });
  }

  const res = NextResponse.json({ ok: true });

  const forwardedProto = req.headers.get('x-forwarded-proto')?.split(',')[0]?.trim().toLowerCase();
  const isSecure = forwardedProto === 'https' || req.nextUrl.protocol === 'https:';
  const domain = getCookieDomain(req);
  const sameSite: 'none' | 'lax' = isSecure ? 'none' : 'lax';

  const common = {
    secure: isSecure,
    sameSite,
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  };

  res.cookies.set('role', role, {
    ...common,
    httpOnly: true,
    ...(domain ? { domain } : {}),
  });

  res.cookies.set('role_ui', role, {
    ...common,
    httpOnly: false,
    ...(domain ? { domain } : {}),
  });

  res.headers.set('Cache-Control', 'no-store');
  return res;
}
