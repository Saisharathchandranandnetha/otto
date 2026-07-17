import postgres from 'postgres';
import bcrypt from 'bcryptjs';

const sql = postgres(process.env.DATABASE_URL ?? 'postgres://otto:otto@localhost:5432/otto', { max: 1 });

const domains = [
  {
    slug: 'education',
    name: 'Education',
    description: 'AI tools for schools, universities and ed-tech',
    icon: 'GraduationCap',
    route: '/education',
    color: '#3B82F6'
  },
  {
    slug: 'manufacturing',
    name: 'Manufacturing',
    description: 'Factory floor AI, supply chain, predictive maintenance',
    icon: 'Factory',
    route: '/manufacturing',
    color: '#F59E0B'
  },
  {
    slug: 'healthcare',
    name: 'Healthcare',
    description: 'Clinical AI, patient triage, care coordination',
    icon: 'HeartPulse',
    route: '/healthcare',
    color: '#EF4444'
  },
  {
    slug: 'customer-support',
    name: 'Customer Support',
    description: 'AI frontline agents, ticket deflection, CSAT',
    icon: 'Headphones',
    route: '/customer-support',
    color: '#8B5CF6'
  },
  {
    slug: 'retail',
    name: 'Retail',
    description: 'AI personal shopper, inventory, VIP clienteling',
    icon: 'ShoppingBag',
    route: '/retail',
    color: '#EC4899'
  },
  {
    slug: 'sales',
    name: 'Sales',
    description: 'Lead qualification, CPQ, deal pipeline AI',
    icon: 'TrendingUp',
    route: '/sales',
    color: '#10B981'
  },
  {
    slug: 'legal',
    name: 'Legal',
    description: 'Contract drafting, case law retrieval, intake AI',
    icon: 'Scale',
    route: '/legal',
    color: '#6B7280'
  }
];

async function main() {
  console.log('Seeding domains and super admin...');

  // Upsert domains
  const insertedDomains = [];
  for (const d of domains) {
    const [inserted] = await sql`
      INSERT INTO otto_domains (slug, name, description, icon, route, color)
      VALUES (${d.slug}, ${d.name}, ${d.description}, ${d.icon}, ${d.route}, ${d.color})
      ON CONFLICT (slug) DO UPDATE 
      SET name = EXCLUDED.name, description = EXCLUDED.description, icon = EXCLUDED.icon, route = EXCLUDED.route, color = EXCLUDED.color
      RETURNING id, slug
    `;
    insertedDomains.push(inserted);
  }

  // Create super admin
  const email = process.env.ADMIN_EMAIL || 'admin@otto.ai';
  const password = process.env.ADMIN_PASSWORD || 'Otto@2026!';
  const passwordHash = await bcrypt.hash(password, 12);

  const [admin] = await sql`
    INSERT INTO otto_users (email, password_hash, full_name, is_super_admin, is_active)
    VALUES (${email}, ${passwordHash}, 'Otto Super Admin', true, true)
    ON CONFLICT (email) DO UPDATE 
    SET password_hash = EXCLUDED.password_hash, full_name = EXCLUDED.full_name, is_super_admin = true
    RETURNING id
  `;

  // Give super admin 'admin' role on all domains
  for (const d of insertedDomains) {
    await sql`
      INSERT INTO otto_user_domain_roles (user_id, domain_id, role)
      VALUES (${admin!.id}, ${d!.id}, 'admin')
      ON CONFLICT (user_id, domain_id) DO UPDATE
      SET role = 'admin'
    `;
  }

  console.log('✓ Domains and super admin seeded successfully.');
  await sql.end();
}

main().catch((e) => { console.error(e); process.exit(1); });
