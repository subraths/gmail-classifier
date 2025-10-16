import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const cookie = await cookies();

  const accessToken = cookie.get('access_token');
  const refreshToken = cookie.get('refresh_token');
  const tokenType = cookie.get('token_type');
  const expiryDate = cookie.get('expiry_date');
  const tokenId = cookie.get('id_token');
  const scope = cookie.get('scope');

  if (!accessToken || !refreshToken || !expiryDate) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (accessToken && req.url.includes('login')) {
    return NextResponse.redirect(new URL('/', req.url));
  }
}

export const config = {
  matcher: ['/', '/login'],
};
