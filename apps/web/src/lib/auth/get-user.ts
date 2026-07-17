import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyJWT } from './jwt';
import { OttoJWTPayload } from './jwt';

export function getCurrentUser(): OttoJWTPayload | null {
  const cookieStore = cookies();
  const token = cookieStore.get('otto_session')?.value;
  
  if (!token) return null;
  
  return verifyJWT(token);
}

export function requireUser(): OttoJWTPayload {
  const user = getCurrentUser();
  if (!user) {
    redirect('/login');
  }
  return user;
}

export function requireDomainAccess(domainSlug: string): OttoJWTPayload {
  const user = requireUser();
  
  if (user.isSuperAdmin) {
    return user;
  }
  
  const hasAccess = user.domains.some(d => d.slug === domainSlug);
  if (!hasAccess) {
    redirect('/unauthorized');
  }
  
  return user;
}

export function requireSuperAdmin(): OttoJWTPayload {
  const user = requireUser();
  if (!user.isSuperAdmin) {
    redirect('/unauthorized');
  }
  return user;
}
