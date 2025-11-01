import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { role } = await req.json(); // 'admin' | 'host' | 'client'
  const res = NextResponse.json({ ok: true });
  res.cookies.set('role', role, { httpOnly: true, sameSite: 'lax', path: '/' });
  return res;
}
