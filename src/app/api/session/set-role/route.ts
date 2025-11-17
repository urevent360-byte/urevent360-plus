import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { role } = await req.json(); // 'admin' | 'host'
    if (role !== 'admin' && role !== 'host') {
      return NextResponse.json({ ok: false, error: 'Invalid role' }, { status: 400 });
    }
    const res = NextResponse.json({ ok: true });
    // Set httpOnly for security
    res.cookies.set('role', role, { httpOnly: true, sameSite: 'lax', path: '/' });
    return res;
  } catch (error) {
    return NextResponse.json({ ok: false, error: 'Invalid request body' }, { status: 400 });
  }
}
