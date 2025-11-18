import { NextResponse } from 'next/server';

export async function POST() {
  const res = NextResponse.json({ ok: true });

  // Igual que arriba: sin httpOnly
  res.cookies.set('role', '', {
    path: '/',
    sameSite: 'lax',
    expires: new Date(0),
  });

  return res;
}
