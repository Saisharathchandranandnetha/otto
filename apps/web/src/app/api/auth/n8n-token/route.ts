import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth/get-user';
import { hashToken } from '@/lib/auth/crypto';

export async function GET() {
  try {
    const user = await requireUser();
    
    // In a real n8n integration, this could call n8n's API to generate a user-specific token
    // or just return a JWT signed by our JWT_SECRET that n8n validates on its end (if configured).
    // For now, we return a signed token that can be passed to n8n iframes or API calls.
    
    const n8nToken = hashToken(`n8n-auth-${user.userId}-${Date.now()}`);
    
    return NextResponse.json({
      success: true,
      token: n8nToken,
      userId: user.userId,
      email: user.email
    });
  } catch (error) {
    console.error('Failed to generate n8n token:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
