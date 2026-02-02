import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const res = NextResponse.json({ ok: true });

  const host = req.headers.get('host') ?? '';
  const isUreventDomain =
    host === 'urevent360plus.com' ||
    host === 'www.urevent360plus.com' ||
    host.endsWith('.urevent360plus.com');

  const cookieDomain = isUreventDomain ? '.urevent360plus.com' : undefined;

  // Clear cookie for both apex/www
  res.cookies.set('role', '', {
    httpOnly: false,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    domain: cookieDomain,
    expires: new Date(0),
  });

  return res;
}
