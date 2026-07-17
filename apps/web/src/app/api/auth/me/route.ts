import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/get-user';

export async function GET() {
  try {
    const user = getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }
    
    // Omit sensitive details if any
    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.userId,
        email: user.email,
        fullName: user.fullName,
        isSuperAdmin: user.isSuperAdmin,
        domains: user.domains
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
