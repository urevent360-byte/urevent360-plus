
import { NextRequest, NextResponse } from 'next/server';

type Role = 'admin' | 'host';

function getCookieDomain(hostname: string) {
  // En producción queremos compartir entre urevent360plus.com y www.urevent360plus.com
  if (hostname === 'urevent360plus.com' || hostname.endsWith('.urevent360plus.com')) {
    return '.urevent360plus.com';
  }
  // En local/preview no seteamos domain para evitar que el browser lo ignore
  return undefined;
}

export async function POST(req: NextRequest) {
  const { role } = (await req.json()) as { role?: Role };

  if (role !== 'admin' && role !== 'host') {
    return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
  }

  const res = NextResponse.json({ ok: true });

  const secure = process.env.NODE_ENV === 'production';
  const domain = getCookieDomain(req.nextUrl.hostname);

  const base = {
    path: '/',
    sameSite: 'lax' as const,
    secure,
    domain,
  };

  // Cookie para middleware (server-side)
  res.cookies.set('role', role, {
    ...base,
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  // Cookie para UI (client-side)
  res.cookies.set('role_ui', role, {
    ...base,
    httpOnly: false,
    maxAge: 60 * 60 * 24 * 30,
  });

  return res;
}
