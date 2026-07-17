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

export async function requireOrg(req: NextRequest, minRole: string = 'member') {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Missing or invalid token' }, { status: 401 });
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = await verifyToken(token);
    
    if (!payload.orgId) {
      return NextResponse.json({ error: 'Organization context required' }, { status: 403 });
    }

    const roles = ['viewer', 'member', 'manager', 'admin', 'owner'];
    const userRoleIndex = roles.indexOf(payload.role || 'viewer');
    const minRoleIndex = roles.indexOf(minRole);

    if (userRoleIndex < minRoleIndex) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-user-id', payload.userId);
    requestHeaders.set('x-org-id', payload.orgId);
    requestHeaders.set('x-org-role', payload.role);
    
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
