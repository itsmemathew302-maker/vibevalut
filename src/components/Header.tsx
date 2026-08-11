'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { Search, LogOut, User, BarChart, Shield, LayoutDashboard, Menu, X } from 'lucide-react';

export default function Header() {
  const router = useRouter();
  const { data: session } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchVal.trim())}`);
    }
  };

  const handleSearchFocus = () => {
    router.push('/search');
  };

  return (
    <header className="fixed top-0 right-0 left-64 max-md:left-0 z-30 h-20 bg-surface/40 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-8 max-md:px-4">
      {/* Mobile Toggle & Brand logo (Mobile only) */}
      <div className="flex items-center gap-2 md:hidden">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="p-1 text-on-surface-variant hover:text-white"
        >
          <Menu size={24} />
        </button>
        <Link href="/" className="font-display-lg text-lg text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary font-bold">
          VibeVault
        </Link>
      </div>

      {/* Global Search Bar */}
      <form onSubmit={handleSearchSubmit} className="relative w-96 max-md:hidden">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary w-5 h-5" />
        <input
          type="text"
          placeholder="Search songs, artists, albums..."
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          onFocus={handleSearchFocus}
          className="w-full pl-12 pr-4 py-2 bg-white/5 border border-white/10 rounded-full font-body-sm text-on-surface focus:outline-none focus:border-primary transition-all duration-300 backdrop-blur-md"
        />
      </form>

      {/* Auth Control Section */}
      <div className="flex items-center gap-4">
        {session ? (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 p-1 rounded-full border border-primary/20 bg-surface-container/60 hover:bg-surface-container-high transition"
            >
              {/* User Avatar */}
              <div className="w-8 h-8 rounded-full overflow-hidden bg-primary/20 flex items-center justify-center font-bold text-sm text-white">
                {session.user?.image ? (
                  <img src={session.user.image} alt={session.user.name || 'User'} className="w-full h-full object-cover" />
                ) : (
                  (session.user?.name || 'U').charAt(0).toUpperCase()
                )}
              </div>
              <span className="text-sm font-semibold max-sm:hidden pr-2 text-on-surface">
                {session.user?.name}
              </span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl bg-surface-container-high/90 border border-white/10 p-2 shadow-2xl backdrop-blur-2xl">
                <Link
                  href="/dashboard"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-lg hover:bg-white/5 text-on-surface-variant hover:text-white transition"
                >
                  <LayoutDashboard size={16} />
                  Dashboard
                </Link>
                {session.user?.role === 'admin' && (
                  <Link
                    href="/admin"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-lg hover:bg-white/5 text-on-surface-variant hover:text-white transition"
                  >
                    <Shield size={16} />
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    signOut();
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-lg hover:bg-red-500/10 text-red-400 hover:text-red-300 transition"
                >
                  <LogOut size={16} />
                  Log Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              href="/auth/login"
              className="text-on-surface hover:text-secondary text-sm font-semibold transition"
            >
              Sign In
            </Link>
            <Link
              href="/auth/register"
              className="px-4 py-2 rounded-full bg-gradient-to-r from-primary to-secondary text-on-primary-container text-sm font-bold shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition"
            >
              Register
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-2xl md:hidden flex flex-col p-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="font-display-lg text-2xl text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary font-bold">
              VibeVault
            </h1>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-1 text-on-surface-variant hover:text-white"
            >
              <X size={24} />
            </button>
          </div>

          {/* Search bar inside mobile drawer */}
          <form onSubmit={handleSearchSubmit} className="relative mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary w-5 h-5" />
            <input
              type="text"
              placeholder="Search..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="w-full pl-12 pr-4 py-2 bg-white/5 border border-white/10 rounded-full font-body-sm text-on-surface"
            />
          </form>

          {/* Mobile links */}
          <nav className="flex-1 flex flex-col gap-4 text-lg">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary transition">Home</Link>
            <Link href="/explore" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary transition">Explore</Link>
            <Link href="/trending" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary transition">Trending</Link>
            <Link href="/genres" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary transition">Genres</Link>
            <Link href="/library" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary transition">Library</Link>
            <Link href="/favorites" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary transition">Favorites</Link>
            <Link href="/settings" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary transition">Settings</Link>
          </nav>
        </div>
      )}
    </header>
  );
}
