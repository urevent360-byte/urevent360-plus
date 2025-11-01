
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { role } = await req.json(); // 'admin' | 'host' | 'client'
    if (!role || !['admin', 'host', 'client'].includes(role)) {
        return NextResponse.json({ ok: false, error: 'Invalid role specified' }, { status: 400 });
    }
    const res = NextResponse.json({ ok: true });
    res.cookies.set('role', role, { httpOnly: true, sameSite: 'lax', path: '/' });
    return res;
  } catch (error) {
    return NextResponse.json({ ok: false, error: 'Invalid request body' }, { status: 400 });
  }
}
