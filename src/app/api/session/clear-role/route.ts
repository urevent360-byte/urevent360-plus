import { NextRequest, NextResponse } from 'next/server';

function getCookieDomain(req: NextRequest): string | undefined {
  const host = req.headers.get('host') || '';
  const hostname = host.split(':')[0].toLowerCase();

  if (hostname === 'urevent360plus.com' || hostname.endsWith('.urevent360plus.com')) {
    return '.urevent360plus.com';
  }

  return undefined;
}

export async function POST(req: NextRequest) {
  const res = NextResponse.json({ ok: true });

  const domain = getCookieDomain(req);
  const isSecure = (req.headers.get('x-forwarded-proto') || '').toLowerCase() === 'https';

  const cookieOptions: any = {
    httpOnly: false,
    sameSite: 'lax',
    path: '/',
    expires: new Date(0),
    secure: isSecure,
  };

  if (domain) cookieOptions.domain = domain;

  res.cookies.set('role', '', cookieOptions);

  return res;
}
