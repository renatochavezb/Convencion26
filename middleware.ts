import { NextRequest, NextResponse } from 'next/server';
import { getInternoAuthCookieName, isValidInternoToken } from '@/lib/internoAuth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith('/interno')) {
    return NextResponse.next();
  }

  if (pathname.startsWith('/api/interno/auth') || pathname === '/interno/login') {
    return NextResponse.next();
  }

  const token = request.cookies.get(getInternoAuthCookieName())?.value;
  if (await isValidInternoToken(token)) {
    return NextResponse.next();
  }

  if (pathname.startsWith('/api/interno')) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const loginUrl = new URL('/interno/login', request.url);
  loginUrl.searchParams.set('next', pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/interno/:path*', '/api/interno/:path*'],
};
