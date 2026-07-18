import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getCurrentUser } from '@/lib/auth/get-user';
import { invalidateSession } from '@/lib/auth/session';
import { sql } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (user?.sessionId) {
      // Invalidate in DB
      await invalidateSession(user.sessionId);
      
      // Log it
      await sql`
        INSERT INTO otto_auth_logs (user_id, event, ip_address)
        VALUES (${user.userId}, 'logout', ${req.headers.get('x-forwarded-for') || null})
      `;
    }

    // Clear cookie
    const cookieStore = await cookies();
    cookieStore.delete('otto_session');

    return NextResponse.json({ success: true, redirectTo: '/login' });
  } catch (error) {
    console.error('Logout error:', error);
    // Still clear the cookie on error
    const cookieStore = await cookies();
    cookieStore.delete('otto_session');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
