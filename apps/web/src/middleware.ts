import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/dashboard', '/education', '/manufacturing', '/healthcare', '/customer-support', '/retail', '/sales', '/legal', '/admin'];

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
    
    // In Edge middleware, we can't easily use jsonwebtoken due to Node crypto dependencies.
    // So we manually decode the payload to check access, knowing the Server Components 
    // will strictly verify the signature.
    try {
      let payload: any;
      const payloadBase64 = token.split('.')[1];
      if (payloadBase64) {
        const payloadDecoded = Buffer.from(payloadBase64, 'base64').toString('utf8');
        payload = JSON.parse(payloadDecoded);
      } else {
        throw new Error('Invalid token format');
      }
      
      // If token expired
      if (payload.exp && payload.exp < Date.now() / 1000) {
        return NextResponse.redirect(new URL('/login', request.url));
      }
      
      // Check domain access
      if (pathname !== '/dashboard' && pathname !== '/admin') {
        const domainSlug = pathname.split('/')[1];
        if (domainSlug && !payload.isSuperAdmin) {
          const hasAccess = payload.domains?.some((d: any) => d.slug === domainSlug);
          if (!hasAccess) {
            return NextResponse.redirect(new URL('/unauthorized', request.url));
          }
        }
      }
      
      if (pathname.startsWith('/admin') && !payload.isSuperAdmin) {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
      
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-user-id', payload.userId);
      requestHeaders.set('x-user-email', payload.email);
      
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
