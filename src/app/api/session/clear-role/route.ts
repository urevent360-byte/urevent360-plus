import { NextRequest, NextResponse } from 'next/server';

function getCookieDomain(req: NextRequest) {
  const host = (req.headers.get('host') || '').split(':')[0].toLowerCase();

  if (host === 'urevent360plus.com' || host === 'www.urevent360plus.com') {
    return '.urevent360plus.com';
  }

  return undefined;
}

export async function POST(req: NextRequest) {
  const res = NextResponse.json({ ok: true });

  const forwardedProto = (req.headers.get('x-forwarded-proto') || '').toLowerCase();
  const isSecure = forwardedProto === 'https' || process.env.NODE_ENV === 'production';
  const domain = getCookieDomain(req);

  const common = {
    secure: isSecure,
    sameSite: 'lax' as const,
    path: '/',
    expires: new Date(0),
  };

  res.cookies.set('role', '', {
    ...common,
    httpOnly: true,
    ...(domain ? { domain } : {}),
  });

  res.cookies.set('role_ui', '', {
    ...common,
    httpOnly: false,
    ...(domain ? { domain } : {}),
  });

  res.headers.set('Cache-Control', 'no-store');

  return res;
}