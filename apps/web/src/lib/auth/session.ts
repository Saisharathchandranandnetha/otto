import { sql } from '@/lib/db';
import { generateSessionToken, hashToken } from './crypto';
import { OttoUser, OttoDomainAccess } from '@/types/auth';

export async function createSession(userId: string, ipAddress?: string, userAgent?: string) {
  const token = generateSessionToken();
  const tokenHash = hashToken(token);
  
  // Set expiration to 8 hours from now
  const expiresHours = parseInt(process.env.SESSION_EXPIRES_HOURS || '8', 10);
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + expiresHours);
  
  await sql`
    INSERT INTO otto_sessions (user_id, token_hash, expires_at, ip_address, user_agent)
    VALUES (${userId}, ${tokenHash}, ${expiresAt.toISOString()}, ${ipAddress || null}, ${userAgent || null})
  `;
  
  return { token, expiresAt };
}

export async function validateSession(token: string): Promise<OttoUser | null> {
  const tokenHash = hashToken(token);
  
  // Clean up expired sessions periodically (10% chance on validation to avoid locking overhead)
  if (Math.random() < 0.1) {
    sql`DELETE FROM otto_sessions WHERE expires_at < NOW()`.execute().catch(console.error);
  }
  
  // Fetch session and user
  const sessions = await sql`
    SELECT s.id, s.expires_at, 
           u.id as user_id, u.email, u.full_name, u.avatar_url, u.is_super_admin, u.is_active, u.last_login_at
    FROM otto_sessions s
    JOIN otto_users u ON s.user_id = u.id
    WHERE s.token_hash = ${tokenHash} AND s.expires_at > NOW() AND u.is_active = true
  `;
  
  if (sessions.length === 0) {
    return null;
  }
  
  const userRow = sessions[0];
  if (!userRow) return null;
  
  // Load domains
  const domainRoles = await sql`
    SELECT d.slug, d.name, d.route, d.color, d.icon, r.role
    FROM otto_user_domain_roles r
    JOIN otto_domains d ON r.domain_id = d.id
    WHERE r.user_id = ${userRow.userId} AND d.is_active = true
  `;
  
  // If user is super admin, they might not have rows in the roles table if not seeded correctly,
  // but our seed gives them 'admin' role on all. Let's make sure they get it even if not seeded.
  let finalDomains = domainRoles as unknown as OttoDomainAccess[];
  
  if (userRow.isSuperAdmin && finalDomains.length === 0) {
    // Fetch all domains
    const allDomains = await sql`SELECT slug, name, route, color, icon FROM otto_domains WHERE is_active = true`;
    finalDomains = allDomains.map(d => ({ ...d, role: 'admin' })) as unknown as OttoDomainAccess[];
  }
  
  return {
    id: userRow.userId,
    email: userRow.email,
    fullName: userRow.fullName,
    avatarUrl: userRow.avatarUrl,
    isSuperAdmin: userRow.isSuperAdmin,
    isActive: userRow.isActive,
    lastLoginAt: userRow.lastLoginAt ? new Date(userRow.lastLoginAt).toISOString() : null,
    domains: finalDomains
  };
}

export async function invalidateSession(token: string): Promise<void> {
  const tokenHash = hashToken(token);
  await sql`DELETE FROM otto_sessions WHERE token_hash = ${tokenHash}`;
}

export async function invalidateAllUserSessions(userId: string): Promise<void> {
  await sql`DELETE FROM otto_sessions WHERE user_id = ${userId}`;
}
