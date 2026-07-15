import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './jwt';

export async function authMiddleware(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Missing or invalid token' }, { status: 401 });
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = await verifyToken(token);
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-user-id', payload.userId);
    requestHeaders.set('x-org-id', payload.orgId);
    
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
