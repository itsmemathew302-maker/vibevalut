'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  Home,
  Compass,
  TrendingUp,
  Music,
  User,
  Heart,
  Settings,
  FolderHeart,
  BarChart,
  Shield,
  Search,
  Radio
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === 'admin';

  const mainNav = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Explore', href: '/explore', icon: Compass },
    { name: 'Trending', href: '/trending', icon: TrendingUp },
    { name: 'Genres', href: '/genres', icon: Radio },
    { name: 'Search', href: '/search', icon: Search }
  ];

  const libraryNav = [
    { name: 'Library', href: '/library', icon: FolderHeart },
    { name: 'Favorites', href: '/favorites', icon: Heart },
    { name: 'Dashboard', href: '/dashboard', icon: BarChart }
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <aside className="fixed left-0 top-0 h-full w-64 z-40 bg-surface-container/60 backdrop-blur-xl border-r border-white/10 flex flex-col p-6 max-md:hidden">
      {/* Brand logo */}
      <div className="flex items-center gap-3 mb-8">
        <span className="p-2 rounded-xl bg-gradient-to-r from-primary to-secondary text-white flex items-center justify-center animate-pulse">
          <Music size={22} />
        </span>
        <h1 className="font-display-lg text-2xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
          VibeVault
        </h1>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 flex flex-col gap-6 overflow-y-auto no-scrollbar">
        {/* Main Section */}
        <div>
          <h3 className="font-label-caps text-xs text-on-surface-variant/50 uppercase tracking-widest mb-3 pl-2">
            Discover
          </h3>
          <ul className="space-y-1">
            {mainNav.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-[12px] font-body-sm transition-all duration-300 group ${
                      active
                        ? 'bg-gradient-to-r from-primary/20 to-secondary/10 border-l-4 border-primary text-on-surface shadow-md'
                        : 'text-on-surface-variant hover:bg-white/5 hover:text-on-surface'
                    }`}
                  >
                    <Icon size={18} className={active ? 'text-primary' : 'group-hover:text-secondary'} />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Library Section */}
        <div>
          <h3 className="font-label-caps text-xs text-on-surface-variant/50 uppercase tracking-widest mb-3 pl-2">
            Your Space
          </h3>
          <ul className="space-y-1">
            {libraryNav.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-[12px] font-body-sm transition-all duration-300 group ${
                      active
                        ? 'bg-gradient-to-r from-primary/20 to-secondary/10 border-l-4 border-primary text-on-surface shadow-md'
                        : 'text-on-surface-variant hover:bg-white/5 hover:text-on-surface'
                    }`}
                  >
                    <Icon size={18} className={active ? 'text-primary' : 'group-hover:text-secondary'} />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Admin Section if Admin */}
        {isAdmin && (
          <div>
            <h3 className="font-label-caps text-xs text-on-surface-variant/50 uppercase tracking-widest mb-3 pl-2">
              Management
            </h3>
            <ul className="space-y-1">
              <li>
                <Link
                  href="/admin"
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-[12px] font-body-sm transition-all duration-300 group ${
                    isActive('/admin')
                      ? 'bg-gradient-to-r from-primary/20 to-secondary/10 border-l-4 border-primary text-on-surface shadow-md'
                      : 'text-on-surface-variant hover:bg-white/5 hover:text-on-surface'
                  }`}
                >
                  <Shield size={18} className={isActive('/admin') ? 'text-primary' : 'group-hover:text-tertiary'} />
                  Admin Panel
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Footer Navigation */}
      <div className="pt-4 border-t border-white/5">
        <Link
          href="/settings"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-[12px] font-body-sm transition-all duration-300 group ${
            isActive('/settings')
              ? 'bg-gradient-to-r from-primary/20 to-secondary/10 border-l-4 border-primary text-on-surface shadow-md'
              : 'text-on-surface-variant hover:bg-white/5 hover:text-on-surface'
          }`}
        >
          <Settings size={18} className={isActive('/settings') ? 'text-primary' : 'group-hover:text-secondary'} />
          Settings
        </Link>
      </div>
    </aside>
  );
}
