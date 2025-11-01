
import { NextResponse } from 'next/server';

export async function POST() {
  const res = NextResponse.json({ ok: true });
  // Set the cookie with a past expiry date to clear it
  res.cookies.set('role', '', { httpOnly: true, sameSite: 'lax', path: '/', expires: new Date(0) });
  return res;
}
