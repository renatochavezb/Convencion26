import { NextRequest, NextResponse } from 'next/server';
import {
  createInternoAuthToken,
  getInternoAuthCookieName,
  isValidInternoPassword,
} from '@/lib/internoAuth';

const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 días

export async function POST(req: NextRequest) {
  try {
    const { password, action } = await req.json();

    if (action === 'logout') {
      const res = NextResponse.json({ success: true });
      res.cookies.set(getInternoAuthCookieName(), '', { httpOnly: true, path: '/', maxAge: 0 });
      return res;
    }

    if (!process.env.INTERNAL_CONTENT_PASSWORD) {
      return NextResponse.json(
        { error: 'INTERNAL_CONTENT_PASSWORD no configurada en el servidor' },
        { status: 503 }
      );
    }

    if (!password || !isValidInternoPassword(String(password))) {
      return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 });
    }

    const token = await createInternoAuthToken(String(password));
    const res = NextResponse.json({ success: true });
    res.cookies.set(getInternoAuthCookieName(), token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: COOKIE_MAX_AGE,
    });
    return res;
  } catch {
    return NextResponse.json({ error: 'Solicitud inválida' }, { status: 400 });
  }
}
