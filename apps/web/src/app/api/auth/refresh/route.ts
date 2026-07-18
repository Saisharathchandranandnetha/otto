import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { refreshJWT } from '@/lib/auth/jwt';

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('otto_session')?.value;

    if (!token) {
      return NextResponse.json({ error: 'No session' }, { status: 401 });
    }

    const newToken = refreshJWT(token);

    if (newToken) {
      const expiresHours = parseInt(process.env.SESSION_EXPIRES_HOURS || '8', 10);
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + expiresHours);

      cookieStore.set('otto_session', newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        expires: expiresAt,
        path: '/'
      });
      return NextResponse.json({ refreshed: true });
    }

    return NextResponse.json({ refreshed: false });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
