export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';

export async function GET() {
  const csrfRes = await fetch('http://localhost:3000/api/auth/csrf');
  const { csrfToken } = await csrfRes.json();
  const csrfCookie = csrfRes.headers.get('set-cookie') || '';

  const res = await fetch('http://localhost:3000/api/auth/callback/credentials', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Cookie: csrfCookie,
    },
    body: new URLSearchParams({
      csrfToken,
      email: 'testadmin123@gmail.com',
      password: 'Review123!',
      callbackUrl: 'http://localhost:3000/admin',
    }),
    redirect: 'manual',
  });

  const setCookie = res.headers.get('set-cookie');
  const response = NextResponse.redirect('http://localhost:3000/admin');
  if (setCookie) {
    const match = setCookie.match(/next-auth\.session-token=([^;]+)/);
    if (match) {
      response.cookies.set('next-auth.session-token', match[1], {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
      });
    }
  }
  return response;
}
