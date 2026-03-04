import { NextResponse } from 'next/server';

function cookieDomainFromHost(host: string | null) {
  if (!host) return undefined;

  const h = host.split(':')[0].toLowerCase();
  if (h === 'urevent360plus.com' || h === 'www.urevent360plus.com') return '.urevent360plus.com';
  return undefined;
}

export async function POST(req: Request) {
  const host = req.headers.get('host');
  const domain = cookieDomainFromHost(host);

  const res = NextResponse.json({ ok: true });

  res.cookies.set('role', '', {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    domain,
    maxAge: 0,
  });

  res.cookies.set('role_ui', '', {
    httpOnly: false,
    secure: true,
    sameSite: 'lax',
    path: '/',
    domain,
    maxAge: 0,
  });

  return res;
}