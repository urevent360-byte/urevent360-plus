import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { role } = await req.json(); // 'admin' | 'host'
    if (role !== 'admin' && role !== 'host') {
      return NextResponse.json({ ok: false, error: 'Invalid role' }, { status: 400 });
    }

    const res = NextResponse.json({ ok: true });

    res.cookies.set('role', role, {
      path: '/',
      sameSite: 'lax',
      // httpOnly: false // por defecto ya no es httpOnly
    });

    return res;
  } catch (error) {
    return NextResponse.json({ ok: false, error: 'Invalid request body' }, { status: 400 });
  }
}
