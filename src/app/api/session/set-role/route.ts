import { NextResponse } from 'next/server';

type Role = 'admin' | 'host';

function cookieDomainFromHost(host: string | null) {
  if (!host) return undefined;

  const h = host.split(':')[0].toLowerCase();
  // cubre www y sin-www
  if (h === 'urevent360plus.com' || h === 'www.urevent360plus.com') return '.urevent360plus.com';

  // para previews tipo *.vercel.app no fuerces domain
  return undefined;
}

export async function POST(req: Request) {
  const { role } = (await req.json()) as { role: Role };

  if (role !== 'admin' && role !== 'host') {
    return NextResponse.json({ ok: false, error: 'Invalid role' }, { status: 400 });
  }

  const host = req.headers.get('host');
  const domain = cookieDomainFromHost(host);

  const res = NextResponse.json({ ok: true, role });

  const secure = true; // estás en https en prod

  res.cookies.set('role', role, {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    path: '/',
    domain,
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  res.cookies.set('role_ui', role, {
    httpOnly: false,
    secure,
    sameSite: 'lax',
    path: '/',
    domain,
    maxAge: 60 * 60 * 24 * 30,
  });

  return res;
}