'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogIn, Github, Mail, Lock } from 'lucide-react';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setError('');

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError(res.error);
      } else {
        router.push('/');
        router.refresh();
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
        {/* Brand details */}
        <div className="text-center">
          <h2 className="font-display-lg text-3xl font-extrabold text-white">VibeVault Login</h2>
          <p className="text-sm text-on-surface-variant mt-1">Unlock your cinematic sonic landscape.</p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs font-semibold text-red-400">
            {error}
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-1 relative">
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
          <div className="flex flex-col gap-1 relative">
            <label className="text-xs text-on-surface-variant font-semibold pl-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant w-4 h-4" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
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
                <LogIn size={16} /> Sign In
              </>
            )}
          </button>
        </form>

        {/* Separator line */}
        <div className="flex items-center gap-4 text-xs font-semibold text-on-surface-variant/50">
          <div className="flex-1 h-px bg-white/5" />
          <span>OR CONTINUE WITH</span>
          <div className="flex-1 h-px bg-white/5" />
        </div>

        {/* OAuth grid buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => signIn('google', { callbackUrl: '/' })}
            className="flex items-center justify-center gap-2 py-3 rounded-xl border border-white/10 glass text-sm text-on-surface hover:bg-white/5 hover:border-white/20 transition font-bold"
          >
            Google
          </button>
          <button
            onClick={() => signIn('github', { callbackUrl: '/' })}
            className="flex items-center justify-center gap-2 py-3 rounded-xl border border-white/10 glass text-sm text-on-surface hover:bg-white/5 hover:border-white/20 transition font-bold"
          >
            <Github size={16} /> GitHub
          </button>
        </div>

        {/* Bottom switcher link */}
        <div className="text-center text-xs text-on-surface-variant/80 mt-2 font-semibold">
          Don&apos;t have an account?{' '}
          <Link href="/auth/register" className="text-primary hover:text-secondary underline transition">
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}
