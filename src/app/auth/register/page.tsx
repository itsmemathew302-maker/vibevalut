'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserPlus, User, Mail, Lock, ShieldAlert } from 'lucide-react';

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminSecret, setAdminSecret] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, adminSecret }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Registration failed');
      } else {
        setSuccess('Registration successful! Redirecting to login...');
        setTimeout(() => {
          router.push('/auth/login');
        }, 1500);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-md rounded-3xl glass border border-white/10 p-8 flex flex-col gap-6 shadow-2xl bg-surface-container/30 backdrop-blur-2xl">
        <div className="text-center">
          <h2 className="font-display-lg text-3xl font-extrabold text-white">Join VibeVault</h2>
          <p className="text-sm text-on-surface-variant mt-1">Create an account to save playlists and followed artists.</p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs font-semibold text-red-400 font-poppins">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3.5 rounded-xl bg-green-500/10 border border-green-500/20 text-xs font-semibold text-green-400 font-poppins">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-on-surface-variant font-semibold pl-1">Your Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant w-4 h-4" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="E.g. Princemathew"
                className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl font-body-sm focus:outline-none focus:border-primary text-on-surface"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-on-surface-variant font-semibold pl-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant w-4 h-4" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl font-body-sm focus:outline-none focus:border-primary text-on-surface"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-on-surface-variant font-semibold pl-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant w-4 h-4" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                minLength={6}
                className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl font-body-sm focus:outline-none focus:border-primary text-on-surface"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-on-surface-variant font-semibold pl-1 flex items-center gap-1">
              Admin Signup Token <span className="text-[10px] text-on-surface-variant/40">(Optional)</span>
            </label>
            <div className="relative">
              <ShieldAlert className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 w-4 h-4" />
              <input
                type="password"
                value={adminSecret}
                onChange={(e) => setAdminSecret(e.target.value)}
                placeholder="To register with administrative power"
                className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl font-body-sm focus:outline-none focus:border-primary text-on-surface"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-on-primary-container font-bold text-sm shadow-lg shadow-primary/20 hover:scale-102 active:scale-95 transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 rounded-full border-2 border-on-primary-container border-t-transparent animate-spin" />
            ) : (
              <>
                <UserPlus size={16} /> Sign Up
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-on-surface-variant/80 mt-2 font-semibold">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-primary hover:text-secondary underline transition">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
