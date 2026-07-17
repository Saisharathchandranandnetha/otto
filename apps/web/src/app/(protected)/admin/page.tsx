import React from 'react';
import { sql } from '@/lib/db';
import { requireSuperAdmin } from '@/lib/auth/get-user';
import { ShieldCheck, Users, Activity, Lock, Search } from 'lucide-react';

export default async function AdminPage() {
  const user = requireSuperAdmin();

  // Fetch all users
  const users = await sql`
    SELECT id, email, full_name, is_super_admin, is_active, last_login_at, created_at 
    FROM otto_users 
    ORDER BY created_at DESC
  `;

  // Fetch all domains
  const domains = await sql`
    SELECT id, slug, name, is_active 
    FROM otto_domains 
    ORDER BY name ASC
  `;

  // Fetch all user roles
  const roles = await sql`
    SELECT r.user_id, r.domain_id, r.role, d.slug, d.name
    FROM otto_user_domain_roles r
    JOIN otto_domains d ON r.domain_id = d.id
  `;

  // Process data for UI
  const usersWithRoles = users.map((u: any) => ({
    ...u,
    roles: roles.filter((r: any) => r.userId === u.id)
  }));

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light text-white tracking-tight mb-2">
            Super Admin Control Center
          </h1>
          <p className="text-neutral-400">
            Manage system access, domains, and security across the Otto platform.
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-red-400 bg-red-500/10 px-4 py-2 rounded-full border border-red-500/20">
          <ShieldCheck className="h-4 w-4" />
          <span>Super Admin Privileges Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1 space-y-2">
          <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl bg-neutral-900 text-white border border-neutral-800 transition-colors">
            <Users className="h-5 w-5 text-amber-500" />
            <span className="font-medium">User Management</span>
          </button>
          <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-neutral-900/50 text-neutral-400 hover:text-white transition-colors">
            <Lock className="h-5 w-5 text-blue-500" />
            <span className="font-medium">Global RBAC</span>
          </button>
          <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-neutral-900/50 text-neutral-400 hover:text-white transition-colors">
            <Activity className="h-5 w-5 text-emerald-500" />
            <span className="font-medium">Audit Logs</span>
          </button>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-neutral-800 flex justify-between items-center">
              <h2 className="text-xl font-medium text-white">Users</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
                <input 
                  type="text" 
                  placeholder="Search users..." 
                  className="pl-9 pr-4 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500/50 w-64"
                />
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-neutral-950/50">
                    <th className="px-6 py-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">Access Rights</th>
                    <th className="px-6 py-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">Last Login</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                  {usersWithRoles.map((u: any) => (
                    <tr key={u.id} className="hover:bg-neutral-800/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-9 w-9 rounded-full bg-neutral-800 flex items-center justify-center text-sm font-medium text-white">
                            {u.fullName.charAt(0)}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-white">{u.fullName}</div>
                            <div className="text-xs text-neutral-500">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {u.isActive ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                            Disabled
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {u.isSuperAdmin ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                            Super Admin
                          </span>
                        ) : (
                          <div className="flex flex-wrap gap-1 max-w-[200px]">
                            {u.roles.length > 0 ? (
                              u.roles.map((r: any) => (
                                <span key={r.domainId} className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-neutral-800 text-neutral-300">
                                  {r.name}: {r.role}
                                </span>
                              ))
                            ) : (
                              <span className="text-xs text-neutral-500">No access</span>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-400">
                        {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleDateString() : 'Never'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="p-4 border-t border-neutral-800 bg-neutral-950 flex justify-center">
              <p className="text-xs text-neutral-500">
                Note: In this implementation, User CRUD operations are read-only for demo purposes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
