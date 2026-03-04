import { NextResponse } from 'next/server';

export async function POST() {
  const res = NextResponse.json({ ok: true });

  const isProd = process.env.NODE_ENV === 'production';
  const domain = 'urevent360plus.com';

  res.cookies.set('role', '', {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    domain,
    maxAge: 0,
  });

  res.cookies.set('role_ui', '', {
    httpOnly: false,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    domain,
    maxAge: 0,
  });

  return res;
}