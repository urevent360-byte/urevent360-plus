import { NextResponse } from 'next/server';

export async function POST() {
  const res = NextResponse.json({ ok: true });

  // Borrar cookie de rol (también sin httpOnly)
  res.cookies.set('role', '', {
    httpOnly: false,
    sameSite: 'lax',
    path: '/',
    expires: new Date(0),
  });

  return res;
}
