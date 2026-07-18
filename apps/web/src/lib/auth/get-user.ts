import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyJWT } from './jwt';
import { OttoJWTPayload } from './jwt';

export async function getCurrentUser(): Promise<OttoJWTPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('otto_session')?.value;
  
  if (!token) return null;
  
  return verifyJWT(token);
}

export async function requireUser(): Promise<OttoJWTPayload> {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }
  return user;
}

export async function requireDomainAccess(domainSlug: string): Promise<OttoJWTPayload> {
  const user = await requireUser();
  
  if (user.isSuperAdmin) {
    return user;
  }
  
  const hasAccess = user.domains.some(d => d.slug === domainSlug);
  if (!hasAccess) {
    redirect('/unauthorized');
  }
  
  return user;
}

export async function requireSuperAdmin(): Promise<OttoJWTPayload> {
  const user = await requireUser();
  if (!user.isSuperAdmin) {
    redirect('/unauthorized');
  }
  return user;
}
