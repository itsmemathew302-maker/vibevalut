'use client';

import React, { useEffect, useState } from 'react';
import { useAudio } from '@/context/AudioContext';
import { MOCK_SONGS, MOCK_PLAYLISTS, MOODS, GENRES } from '@/lib/mockData';
import GlassCard from '@/components/GlassCard';
import SongList from '@/components/SongList';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Music, Zap, Flame, Smile, Headphones, Heart } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const { playSong } = useAudio();
  const [songs, setSongs] = useState<any[]>([]);
  const [playlists, setPlaylists] = useState<any[]>([]);

  useEffect(() => {
    // Attempt database fetching, fallback to mock data
    fetch('/api/songs?limit=4')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.songs && data.songs.length > 0) {
          setSongs(data.songs);
        } else {
          setSongs(MOCK_SONGS.slice(0, 4));
        }
      })
      .catch(() => setSongs(MOCK_SONGS.slice(0, 4)));

    fetch('/api/playlists')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.playlists && data.playlists.length > 0) {
          setPlaylists(data.playlists);
        } else {
          setPlaylists(MOCK_PLAYLISTS);
        }
      })
      .catch(() => setPlaylists(MOCK_PLAYLISTS));
  }, []);

  return (
    <div className="space-y-12 pb-12">
      {/* Immersive Hero Banner */}
      <section className="relative rounded-3xl overflow-hidden glass p-10 max-sm:p-6 border-white/10 flex flex-col gap-6 justify-center items-start bg-gradient-to-r from-primary/10 via-background to-secondary/15">
        <span className="px-3 py-1 text-xs font-bold rounded-full bg-secondary/10 text-secondary border border-secondary/20 uppercase tracking-widest flex items-center gap-1.5 animate-pulse">
          <Zap size={12} /> High Fidelity Audio
        </span>
        <h2 className="font-display-lg text-4xl max-sm:text-3xl leading-tight font-extrabold max-w-xl">
          Discover Music That <br />
          <span className="text-primary italic font-light">Matches Your Mood</span>
        </h2>
        <p className="text-on-surface-variant max-w-md font-body-main text-sm max-sm:text-xs">
          Immerse yourself in a sonic journey tailored to your emotions. High-fidelity audio, curated by vibe.
        </p>
        <div className="flex gap-4 max-sm:flex-col w-full max-sm:gap-2">
          <Link
            href="/explore"
            className="px-6 py-3 rounded-full bg-gradient-to-r from-primary to-secondary text-on-primary-container font-bold text-sm shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition text-center"
          >
            Explore Music
          </Link>
          <Link
            href="/trending"
            className="px-6 py-3 rounded-full border border-secondary/45 glass text-secondary hover:text-white hover:border-secondary font-bold text-sm text-center active:scale-95 transition"
          >
            Trending Now
          </Link>
        </div>
      </section>

      {/* Genres categories slider */}
      <section>
        <div className="flex justify-between items-end mb-4">
          <h3 className="font-headline-md text-xl font-bold flex items-center gap-2">
            <Music size={18} className="text-secondary" />
            Categories
          </h3>
          <Link href="/genres" className="text-secondary hover:text-white font-label-caps text-xs tracking-wider">
            SEE ALL
          </Link>
        </div>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
          {GENRES.map((genre) => (
            <Link
              key={genre}
              href={`/genres?genre=${genre}`}
              className="flex-none w-28 h-28 glass rounded-2xl flex flex-col items-center justify-center gap-2 border-white/5 hover:border-primary/40 hover:scale-105 transition-all duration-300 group"
            >
              <Headphones size={24} className="text-on-surface-variant group-hover:text-primary transition" />
              <span className="font-label-caps text-xs text-on-surface-variant font-semibold">{genre}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Trending Songs + Mood Grid */}
      <section className="grid grid-cols-3 max-lg:grid-cols-1 gap-8">
        {/* Trending Tracks */}
        <div className="col-span-2 space-y-4">
          <h3 className="font-headline-md text-xl font-bold flex items-center gap-2">
            <Flame size={18} className="text-primary" />
            Trending Today
          </h3>
          <SongList songs={songs} />
        </div>

        {/* Mood Selector Grid */}
        <div className="space-y-4">
          <h3 className="font-headline-md text-xl font-bold flex items-center gap-2">
            <Smile size={18} className="text-tertiary" />
            Select Your Mood
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {MOODS.map((mood) => {
              const bgImages: Record<string, string> = {
                Happy: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad',
                Chill: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4',
                Energy: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819',
                Moody: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17',
              };
              return (
                <Link
                  key={mood}
                  href={`/explore?mood=${mood}`}
                  className="relative h-28 rounded-2xl overflow-hidden group cursor-pointer border border-white/5 hover:border-white/20 transition-all duration-300"
                >
                  <img
                    src={bgImages[mood]}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition duration-500"
                    alt=""
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface/90 via-surface/40 to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <span className="font-title-lg text-sm font-bold text-white uppercase tracking-wider">{mood}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Curated Playlists section */}
      <section>
        <h3 className="font-headline-md text-xl font-bold flex items-center gap-2 mb-6">
          <Heart size={18} className="text-tertiary" />
          Curated Playlists
        </h3>
        <div className="grid grid-cols-4 max-lg:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1 gap-6">
          {playlists.slice(0, 4).map((pl) => (
            <GlassCard
              key={pl._id}
              title={pl.name}
              subtitle={pl.description || `${pl.songsCount || 0} Tracks`}
              imageUrl={pl.coverUrl}
              onCardClick={() => router.push(`/playlists/${pl._id}`)}
              onPlayClick={() => {
                // Fetch details and play
                fetch(`/api/playlists?id=${pl._id}`)
                  .then((res) => res.json())
                  .then((data) => {
                    if (data.success && data.playlist.songs.length > 0) {
                      playSong(data.playlist.songs[0], data.playlist.songs);
                    }
                  })
                  .catch(() => {});
              }}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
