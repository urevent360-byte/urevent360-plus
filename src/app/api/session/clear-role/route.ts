
import { NextRequest, NextResponse } from 'next/server';

function getCookieDomain(hostname: string) {
  if (hostname === 'urevent360plus.com' || hostname.endsWith('.urevent360plus.com')) {
    return '.urevent360plus.com';
  }
  return undefined;
}

export async function POST(req: NextRequest) {
  const res = NextResponse.json({ ok: true });

  const secure = process.env.NODE_ENV === 'production';
  const domain = getCookieDomain(req.nextUrl.hostname);

  const base = {
    path: '/',
    sameSite: 'lax' as const,
    secure,
    domain,
    expires: new Date(0),
  };

  res.cookies.set('role', '', { ...base, httpOnly: true });
  res.cookies.set('role_ui', '', { ...base, httpOnly: false });

  return res;
}
