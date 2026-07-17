import jwt from 'jsonwebtoken';
import { DomainRole } from '@/types/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_must_change_in_prod_otto';

export interface OttoJWTPayload {
  userId: string;
  email: string;
  fullName: string;
  isSuperAdmin: boolean;
  domains: Array<{
    slug: string;
    name: string;
    role: DomainRole;
    route: string;
    color: string;
    icon: string;
  }>;
  sessionId: string;
  iat?: number;
  exp?: number;
}

export function signJWT(payload: Omit<OttoJWTPayload, 'iat' | 'exp'>): string {
  const expiresInSeconds = parseInt(process.env.SESSION_EXPIRES_HOURS || '8', 10) * 3600;
  return jwt.sign(payload, JWT_SECRET, { expiresIn: expiresInSeconds });
}

export function verifyJWT(token: string): OttoJWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as OttoJWTPayload;
    return decoded;
  } catch (err) {
    return null;
  }
}

export function refreshJWT(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, { ignoreExpiration: true }) as OttoJWTPayload;
    
    // Check if within 1 hour of expiration
    const now = Math.floor(Date.now() / 1000);
    const exp = decoded.exp || 0;
    
    // If expired or expiring in less than 1 hour (3600 seconds)
    if (now > exp - 3600) {
      // Remove old iat/exp so signJWT generates new ones
      const { iat, exp: oldExp, ...payloadWithoutTime } = decoded;
      return signJWT(payloadWithoutTime);
    }
    
    return null; // Not close enough to expiry to need refresh
  } catch (err) {
    return null;
  }
}
