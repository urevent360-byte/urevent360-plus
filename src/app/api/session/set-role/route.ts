import { NextResponse } from 'next/server';

type Role = 'admin' | 'host';

export async function POST(req: Request) {
  const { role } = (await req.json()) as { role?: Role };

  if (role !== 'admin' && role !== 'host') {
    return NextResponse.json({ ok: false, error: 'Invalid role' }, { status: 400 });
  }

  const res = NextResponse.json({ ok: true });

  const isProd = process.env.NODE_ENV === 'production';
  const domain = 'urevent360plus.com';

  // Server cookie for middleware
  res.cookies.set('role', role, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    domain,
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  // Client cookie for UI/AuthProvider
  res.cookies.set('role_ui', role, {
    httpOnly: false,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    domain,
    maxAge: 60 * 60 * 24 * 30,
  });

  return res;
}