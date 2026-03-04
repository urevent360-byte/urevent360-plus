import { NextRequest, NextResponse } from 'next/server';

export async function POST(_req: NextRequest) {
  const res = NextResponse.json({ ok: true });

  const isProd = process.env.NODE_ENV === 'production';
  const secure = isProd;
  const domain = '.urevent360plus.com';

  // Expire both cookies
  res.cookies.set('role', '', {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    path: '/',
    domain,
    expires: new Date(0),
  });

  res.cookies.set('role_ui', '', {
    httpOnly: false,
    secure,
    sameSite: 'lax',
    path: '/',
    domain,
    expires: new Date(0),
  });

  return res;
}