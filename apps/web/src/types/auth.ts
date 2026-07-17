export type DomainRole = 'viewer' | 'operator' | 'manager' | 'admin';

export interface OttoDomainAccess {
  slug: string;
  name: string;
  role: DomainRole;
  route: string;
  color: string;
  icon: string;
}

export interface OttoUser {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string | null;
  isSuperAdmin: boolean;
  isActive: boolean;
  lastLoginAt: string | null;
  domains: OttoDomainAccess[];
}

export interface OttoDomain {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  route: string;
  color: string;
  isActive: boolean;
}

export interface AuthSession {
  user: OttoUser;
  sessionId: string;
  expiresAt: string;
}
