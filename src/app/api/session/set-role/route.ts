import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { role } = await req.json();

  if (!role || (role !== 'admin' && role !== 'host')) {
    return NextResponse.json({ ok: false, error: 'Invalid role' }, { status: 400 });
  }

  const res = NextResponse.json({ ok: true });

  const host = req.headers.get('host') ?? '';
  const isUreventDomain =
    host === 'urevent360plus.com' ||
    host === 'www.urevent360plus.com' ||
    host.endsWith('.urevent360plus.com');

  // ✅ Make cookie shared across apex + www (only for your real domain)
  const cookieDomain = isUreventDomain ? '.urevent360plus.com' : undefined;

  res.cookies.set('role', role, {
    httpOnly: false, // AuthProvider reads via document.cookie
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    domain: cookieDomain,
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return res;
}
