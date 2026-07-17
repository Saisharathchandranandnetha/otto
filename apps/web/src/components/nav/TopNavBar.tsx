'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut, Settings, LayoutGrid, ChevronDown, User } from 'lucide-react';

interface TopNavBarProps {
  user: any; // We'll type this dynamically as it comes from server
}

export function TopNavBar({ user }: TopNavBarProps) {
  const pathname = usePathname();
  const router = useRouter();
  
  // Find current domain based on pathname
  const currentDomainSlug = pathname.split('/')[1] || 'dashboard';
  const currentDomain = user?.domains?.find((d: any) => d.slug === currentDomainSlug);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Left: Brand & Breadcrumb */}
          <div className="flex items-center space-x-4">
            <Link href="/dashboard" className="flex items-center space-x-2 group">
              <div className="p-1.5 bg-neutral-900 border border-neutral-800 rounded-lg group-hover:border-amber-500/50 transition-colors">
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-amber-500">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="font-semibold text-white tracking-tight hidden sm:block">Otto</span>
            </Link>
            
            {pathname !== '/dashboard' && pathname !== '/admin' && (
              <>
                <div className="h-4 w-px bg-neutral-800" />
                <div className="flex items-center space-x-2">
                  <span 
                    className="text-sm font-medium"
                    style={{ color: currentDomain?.color || '#a3a3a3' }}
                  >
                    {currentDomain?.name || 'Domain'}
                  </span>
                </div>
              </>
            )}

            {pathname.startsWith('/admin') && (
              <>
                <div className="h-4 w-px bg-neutral-800" />
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-red-500">Super Admin</span>
                </div>
              </>
            )}
          </div>

          {/* Right: User Menu */}
          <div className="flex items-center space-x-4">
            <div className="relative group">
              <button className="flex items-center space-x-2 p-1.5 pr-3 rounded-full bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-colors">
                <div className="h-7 w-7 rounded-full bg-neutral-800 flex items-center justify-center text-xs font-medium text-neutral-300">
                  {user?.fullName?.charAt(0) || <User size={14} />}
                </div>
                <span className="text-sm font-medium text-neutral-300 truncate max-w-[100px]">
                  {user?.fullName?.split(' ')[0]}
                </span>
                <ChevronDown className="h-4 w-4 text-neutral-500" />
              </button>
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-48 bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right">
                <div className="p-1">
                  <div className="px-3 py-2 border-b border-neutral-800 mb-1">
                    <p className="text-sm font-medium text-white truncate">{user?.fullName}</p>
                    <p className="text-xs text-neutral-500 truncate">{user?.email}</p>
                  </div>
                  
                  <Link href="/dashboard" className="flex items-center w-full px-3 py-2 text-sm text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors">
                    <LayoutGrid className="mr-2 h-4 w-4" />
                    Domain Selector
                  </Link>
                  
                  {user?.isSuperAdmin && (
                    <Link href="/admin" className="flex items-center w-full px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors">
                      <Settings className="mr-2 h-4 w-4" />
                      Super Admin
                    </Link>
                  )}
                  
                  <div className="h-px bg-neutral-800 my-1" />
                  
                  <button 
                    onClick={handleLogout}
                    className="flex items-center w-full px-3 py-2 text-sm text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </nav>
  );
}
