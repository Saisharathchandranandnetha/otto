import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/overview', '/platform', '/workspace', '/education', '/manufacturing', '/healthcare', '/customer-support', '/retail', '/sales', '/legal', '/admin'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  const isProtected = protectedRoutes.some(route => pathname === route || pathname.startsWith(`${route}/`));
  
  if (isProtected) {
    const token = request.cookies.get('otto_session')?.value;
    
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    try {
      let payload: any;
      const payloadBase64 = token.split('.')[1];
      if (payloadBase64) {
        const payloadDecoded = Buffer.from(payloadBase64, 'base64').toString('utf8');
        payload = JSON.parse(payloadDecoded);
      } else {
        throw new Error('Invalid token format');
      }
      
      if (payload.exp && payload.exp < Date.now() / 1000) {
        return NextResponse.redirect(new URL('/login', request.url));
      }
      
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-user-id', payload.userId || '');
      requestHeaders.set('x-user-email', payload.email || '');
      requestHeaders.set('x-org-id', payload.orgId || '00000000-0000-0000-0000-000000000000');
      
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
      
    } catch (e) {
      console.error('Middleware token decode error:', e);
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login (auth routes)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|login).*)',
  ],
};
