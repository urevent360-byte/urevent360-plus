import { NextRequest, NextResponse } from 'next/server';

type Role = 'admin' | 'host';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const role = body?.role as Role | undefined;

  if (role !== 'admin' && role !== 'host') {
    return NextResponse.json({ ok: false, error: 'Invalid role' }, { status: 400 });
  }

  const res = NextResponse.json({ ok: true });

  const isProd = process.env.NODE_ENV === 'production';
  const secure = isProd; // https in prod
  const domain = '.urevent360plus.com'; // IMPORTANT: works for www + root

  // 1) HttpOnly cookie for middleware/security
  res.cookies.set('role', role, {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    path: '/',
    domain,
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  // 2) Non-HttpOnly cookie for UI (AuthProvider)
  res.cookies.set('role_ui', role, {
    httpOnly: false,
    secure,
    sameSite: 'lax',
    path: '/',
    domain,
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return res;
}