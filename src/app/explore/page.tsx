'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MOCK_ALBUMS, MOCK_PLAYLISTS, GENRES, MOODS } from '@/lib/mockData';
import GlassCard from '@/components/GlassCard';
import { Compass, Music, Flame, Disc } from 'lucide-react';

function ExploreContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const moodFilter = searchParams.get('mood');

  const [albums, setAlbums] = useState<any[]>([]);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [activeGenre, setActiveGenre] = useState('All');

  useEffect(() => {
    // Simulated DB fetches, falling back to mock lists
    fetch('/api/songs?limit=8') // In dynamic app, fetch albums or songs
      .then((res) => res.json())
      .then((data) => {
        // Build mock/dynamic album structures
        setAlbums(MOCK_ALBUMS);
      })
      .catch(() => setAlbums(MOCK_ALBUMS));

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
    <div className="space-y-10 pb-12">
      {/* Header title */}
      <div>
        <h2 className="font-display-lg text-3xl font-bold flex items-center gap-2">
          <Compass className="text-secondary" />
          Explore Music
        </h2>
        <p className="text-sm text-on-surface-variant mt-1">
          {moodFilter ? `Showing mood recommendations for: ${moodFilter}` : 'Discover the latest releases, featured playlists, and hot vibes.'}
        </p>
      </div>

      {/* Categories filters */}
      <section className="space-y-4">
        <h3 className="text-md font-bold text-on-surface uppercase tracking-wider font-label-caps">
          Filter by Vibe
        </h3>
        <div className="flex flex-wrap gap-2">
          {['All', ...GENRES].map((genre) => (
            <button
              key={genre}
              onClick={() => setActiveGenre(genre)}
              className={`px-4 py-2 text-xs font-bold rounded-full border transition duration-300 ${
                activeGenre === genre
                  ? 'bg-gradient-to-r from-primary to-secondary border-transparent text-on-primary-container shadow-lg'
                  : 'glass border-white/10 text-on-surface-variant hover:text-white hover:border-white/20'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </section>

      {/* New Releases Albums grid */}
      <section className="space-y-4">
        <h3 className="font-headline-md text-xl font-bold flex items-center gap-2">
          <Disc className="text-primary" />
          New Releases
        </h3>
        <div className="grid grid-cols-4 max-lg:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1 gap-6">
          {albums.map((album) => (
            <GlassCard
              key={album._id}
              title={album.title}
              subtitle={album.artistName}
              imageUrl={album.coverUrl}
              onCardClick={() => router.push(`/albums/${album._id}`)}
              onPlayClick={() => {
                // Play album tracks
                router.push(`/albums/${album._id}`);
              }}
            />
          ))}
        </div>
      </section>

      {/* Playlists grid */}
      <section className="space-y-4">
        <h3 className="font-headline-md text-xl font-bold flex items-center gap-2">
          <Music className="text-tertiary" />
          Featured Playlists
        </h3>
        <div className="grid grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1 gap-6">
          {playlists.map((playlist) => (
            <GlassCard
              key={playlist._id}
              title={playlist.name}
              subtitle={playlist.description || 'Curated vibe compilation'}
              imageUrl={playlist.coverUrl}
              aspectRatio="video"
              onCardClick={() => router.push(`/playlists/${playlist._id}`)}
              onPlayClick={() => {
                router.push(`/playlists/${playlist._id}`);
              }}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

export default function Explore() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center py-20">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    }>
      <ExploreContent />
    </Suspense>
  );
}

