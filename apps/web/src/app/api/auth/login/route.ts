import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { verifyPassword } from '@/lib/auth/crypto';
import { createSession } from '@/lib/auth/session';
import { signJWT } from '@/lib/auth/jwt';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    const users = await sql`
      SELECT id, password_hash, full_name, is_super_admin, is_active 
      FROM otto_users 
      WHERE email = ${email}
    `;

    if (users.length === 0) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const user = users[0];

    if (!user!.isActive) {
      return NextResponse.json({ error: 'Account disabled' }, { status: 403 });
    }

    const isValid = await verifyPassword(password, user!.passwordHash);

    if (!isValid) {
      // Log failed login
      await sql`
        INSERT INTO otto_auth_logs (user_id, event, ip_address)
        VALUES (${user!.id}, 'login_failed', ${req.ip || null})
      `;
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Fetch user domains for JWT
    const domainRoles = await sql`
      SELECT d.slug, d.name, d.icon, d.route, d.color, r.role
      FROM otto_user_domain_roles r
      JOIN otto_domains d ON r.domain_id = d.id
      WHERE r.user_id = ${user!.id} AND d.is_active = true
    `;
    
    // If super admin and no roles, assume access to all
    let finalDomains = domainRoles;
    if (user!.isSuperAdmin && finalDomains.length === 0) {
      const allDomains = await sql`SELECT slug, name, icon, route, color FROM otto_domains WHERE is_active = true`;
      finalDomains = allDomains.map((d: any) => Object.assign({}, d, { role: 'admin' })) as any;
    }

    // Create session in DB
    const { token, expiresAt } = await createSession(user!.id, req.ip || undefined, req.headers.get('user-agent') || undefined);

    // Create JWT
    const jwtToken = signJWT({
      userId: user!.id,
      email: email,
      fullName: user!.fullName,
      isSuperAdmin: user!.isSuperAdmin,
      domains: finalDomains.map((d: any) => ({ slug: d.slug, name: d.name, role: d.role, route: d.route, color: d.color, icon: d.icon })),
      sessionId: token
    });

    // Set cookies
    const cookieStore = cookies();
    cookieStore.set('otto_session', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: expiresAt,
      path: '/'
    });

    // Update last login & log
    await sql`UPDATE otto_users SET last_login_at = NOW() WHERE id = ${user!.id}`;
    await sql`
      INSERT INTO otto_auth_logs (user_id, event, ip_address)
      VALUES (${user!.id}, 'login_success', ${req.ip || null})
    `;

    return NextResponse.json({ success: true, redirectTo: '/dashboard' });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
