'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { MOCK_SONGS } from '@/lib/mockData';
import SongList from '@/components/SongList';
import { LayoutDashboard, Clock, History, BarChart, Library } from 'lucide-react';

export default function UserDashboard() {
  const { data: session } = useSession();
  const router = useRouter();

  const [history, setHistory] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalListened: 0,
    topGenre: 'Electronic',
    avgDuration: '4:22'
  });

  useEffect(() => {
    if (!session) {
      setHistory(MOCK_SONGS.slice(0, 3)); // Fallback mock history for guest
      return;
    }

    fetch('/api/songs?limit=6') // Fetch general tracks for fallback or profile queries
      .then((res) => res.json())
      .then((data) => {
        // In actual app, history logs can be fetched here
        setHistory(MOCK_SONGS);
        setStats({
          totalListened: 48,
          topGenre: 'Synthwave',
          avgDuration: '5:10'
        });
      })
      .catch(() => setHistory(MOCK_SONGS));
  }, [session]);

  return (
    <div className="space-y-10 pb-12">
      {/* Header Profile Title */}
      <div>
        <h2 className="font-display-lg text-3xl font-bold flex items-center gap-2">
          <LayoutDashboard className="text-secondary" />
          Welcome Back, {session?.user?.name || 'Vibe Listener'}
        </h2>
        <p className="text-sm text-on-surface-variant mt-1">
          Here is your personal music landscape summary.
        </p>
      </div>

      {/* Analytics Counter Grid */}
      <section className="grid grid-cols-3 max-md:grid-cols-1 gap-6">
        <div className="glass rounded-2xl p-6 border-white/5 bg-white/5 flex items-center gap-4">
          <div className="p-3 bg-primary/10 text-primary rounded-xl">
            <History size={24} />
          </div>
          <div>
            <p className="text-xs text-on-surface-variant font-semibold">Total Songs Played</p>
            <p className="text-2xl font-extrabold text-white mt-1">{stats.totalListened}</p>
          </div>
        </div>
        <div className="glass rounded-2xl p-6 border-white/5 bg-white/5 flex items-center gap-4">
          <div className="p-3 bg-secondary/10 text-secondary rounded-xl">
            <BarChart size={24} />
          </div>
          <div>
            <p className="text-xs text-on-surface-variant font-semibold">Top Genre Style</p>
            <p className="text-2xl font-extrabold text-white mt-1">{stats.topGenre}</p>
          </div>
        </div>
        <div className="glass rounded-2xl p-6 border-white/5 bg-white/5 flex items-center gap-4">
          <div className="p-3 bg-tertiary/10 text-tertiary rounded-xl">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-xs text-on-surface-variant font-semibold">Avg. Track Duration</p>
            <p className="text-2xl font-extrabold text-white mt-1">{stats.avgDuration}</p>
          </div>
        </div>
      </section>

      {/* Recently Played History */}
      <section className="space-y-4">
        <h3 className="font-headline-md text-xl font-bold flex items-center gap-2">
          <History size={18} className="text-secondary" />
          Listening History
        </h3>
        <SongList songs={history} />
      </section>
    </div>
  );
}
