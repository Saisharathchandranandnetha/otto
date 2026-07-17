import { OttoUser, DomainRole } from '@/types/auth';

const roleHierarchy: Record<DomainRole, number> = {
  viewer: 1,
  operator: 2,
  manager: 3,
  admin: 4
};

export function isSuperAdmin(user: OttoUser | null): boolean {
  if (!user) return false;
  return user.isSuperAdmin;
}

export function canAccessDomain(user: OttoUser | null, domainSlug: string): boolean {
  if (!user) return false;
  if (user.isSuperAdmin) return true;
  
  return user.domains.some(d => d.slug === domainSlug);
}

export function hasPermission(user: OttoUser | null, domainSlug: string, requiredRole: DomainRole): boolean {
  if (!user) return false;
  if (user.isSuperAdmin) return true;
  
  const userDomain = user.domains.find(d => d.slug === domainSlug);
  if (!userDomain) return false;
  
  const userRoleLevel = roleHierarchy[userDomain.role];
  const requiredRoleLevel = roleHierarchy[requiredRole];
  
  return userRoleLevel >= requiredRoleLevel;
}
