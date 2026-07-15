import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'otto_super_secret_dev_key');

export interface OttoJwtPayload {
  userId: string;
  orgId: string;
  role: string;
  [key: string]: any;
}

export async function signToken(payload: OttoJwtPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<OttoJwtPayload> {
  const { payload } = await jwtVerify(token, JWT_SECRET);
  return payload as unknown as OttoJwtPayload;
}
