'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MOCK_SONGS, MOCK_ARTISTS } from '@/lib/mockData';
import SongList from '@/components/SongList';
import GlassCard from '@/components/GlassCard';
import { Flame, Star, Trophy } from 'lucide-react';

export default function Trending() {
  const router = useRouter();
  const [songs, setSongs] = useState<any[]>([]);
  const [artists, setArtists] = useState<any[]>([]);

  useEffect(() => {
    // Fetch songs sorted by playsCount
    fetch('/api/songs?limit=10&sort=playsCount')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.songs && data.songs.length > 0) {
          setSongs(data.songs);
        } else {
          setSongs(MOCK_SONGS);
        }
      })
      .catch(() => setSongs(MOCK_SONGS));

    // Simulated artists query
    setArtists(MOCK_ARTISTS);
  }, []);

  return (
    <div className="space-y-10 pb-12">
      {/* Header title */}
      <div className="flex justify-between items-center max-sm:flex-col max-sm:items-start gap-4">
        <div>
          <h2 className="font-display-lg text-3xl font-bold flex items-center gap-2">
            <Flame className="text-tertiary animate-pulse" />
            Trending Hotlist
          </h2>
          <p className="text-sm text-on-surface-variant mt-1">
            Realtime chart data calculated automatically based on total plays.
          </p>
        </div>
        <div className="flex gap-2 bg-white/5 border border-white/10 rounded-xl p-1.5 backdrop-blur-md">
          <span className="px-3 py-1 bg-gradient-to-r from-primary to-secondary text-on-primary-container text-xs font-bold rounded-lg flex items-center gap-1 shadow">
            <Trophy size={12} /> Today
          </span>
          <span className="px-3 py-1 text-xs text-on-surface-variant hover:text-white font-semibold cursor-pointer">
            This Week
          </span>
        </div>
      </div>

      {/* Main Ranking Grid */}
      <section className="grid grid-cols-3 max-lg:grid-cols-1 gap-8">
        {/* Top Played Chart list */}
        <div className="col-span-2 space-y-4">
          <h3 className="font-headline-md text-xl font-bold flex items-center gap-2">
            <Star size={18} className="text-secondary" />
            Top Played Songs
          </h3>
          <SongList songs={songs} />
        </div>

        {/* Hot Artists cards list */}
        <div className="space-y-6">
          <h3 className="font-headline-md text-xl font-bold flex items-center gap-2">
            <Flame size={18} className="text-tertiary" />
            Top Artists
          </h3>
          <div className="flex flex-col gap-4">
            {artists.map((artist, idx) => (
              <div
                key={artist._id}
                onClick={() => router.push(`/artists/${artist._id}`)}
                className="flex items-center gap-4 p-3 rounded-2xl glass hover:border-primary/20 cursor-pointer transition duration-300 group"
              >
                <div className="w-12 text-center text-lg font-bold font-mono text-on-surface-variant/50 group-hover:text-primary">
                  #0{idx + 1}
                </div>
                <img
                  src={artist.imageUrl}
                  className="w-12 h-12 rounded-full object-cover border border-white/10"
                  alt=""
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-on-surface truncate group-hover:text-primary transition">
                    {artist.name}
                  </h4>
                  <p className="text-xs text-on-surface-variant truncate">
                    {artist.followersCount.toLocaleString()} Followers
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
