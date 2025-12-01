import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { role } = await req.json();

  if (!role || (role !== 'admin' && role !== 'host')) {
    return NextResponse.json({ ok: false, error: 'Invalid role' }, { status: 400 });
  }

  const res = NextResponse.json({ ok: true });

  // IMPORTANTE: sin httpOnly para que AuthProvider pueda leerla con document.cookie
  res.cookies.set('role', role, {
    httpOnly: false,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 días
  });

  return res;
}
