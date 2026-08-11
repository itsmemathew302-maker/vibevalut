'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { MOCK_SONGS, GENRES } from '@/lib/mockData';
import SongList from '@/components/SongList';
import { Radio, Headphones } from 'lucide-react';

function GenresContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const selectedGenre = searchParams.get('genre') || 'All';

  const [songs, setSongs] = useState<any[]>([]);

  useEffect(() => {
    const fetchUrl = selectedGenre === 'All' ? '/api/songs?limit=20' : `/api/songs?genre=${selectedGenre}&limit=20`;
    fetch(fetchUrl)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.songs && data.songs.length > 0) {
          setSongs(data.songs);
        } else {
          // Local fallback filter
          if (selectedGenre === 'All') {
            setSongs(MOCK_SONGS);
          } else {
            const filtered = MOCK_SONGS.filter(
              (song) => song.genres && song.genres.includes(selectedGenre)
            );
            setSongs(filtered.length > 0 ? filtered : MOCK_SONGS.slice(0, 2));
          }
        }
      })
      .catch(() => setSongs(MOCK_SONGS));
  }, [selectedGenre]);

  return (
    <div className="space-y-10 pb-12">
      {/* Header title */}
      <div>
        <h2 className="font-display-lg text-3xl font-bold flex items-center gap-2">
          <Radio className="text-secondary animate-pulse" />
          Music Genres
        </h2>
        <p className="text-sm text-on-surface-variant mt-1">
          Browse songs filtered by specific sound waves and styles.
        </p>
      </div>

      {/* Genre Grid Selector */}
      <section className="grid grid-cols-6 max-xl:grid-cols-4 max-md:grid-cols-3 max-sm:grid-cols-2 gap-4">
        <button
          onClick={() => router.push('/genres?genre=All')}
          className={`h-20 rounded-2xl flex items-center justify-center font-bold text-sm border transition duration-300 ${
            selectedGenre === 'All'
              ? 'bg-gradient-to-r from-primary to-secondary border-transparent text-on-primary-container shadow-lg shadow-primary/10'
              : 'glass border-white/5 text-on-surface-variant hover:text-white'
          }`}
        >
          All Genres
        </button>
        {GENRES.map((genre) => (
          <button
            key={genre}
            onClick={() => router.push(`/genres?genre=${genre}`)}
            className={`h-20 rounded-2xl flex flex-col items-center justify-center gap-1 font-bold text-sm border transition duration-300 ${
              selectedGenre === genre
                ? 'bg-gradient-to-r from-primary to-secondary border-transparent text-on-primary-container shadow-lg shadow-primary/10'
                : 'glass border-white/5 text-on-surface-variant hover:text-white'
            }`}
          >
            <Headphones size={16} />
            {genre}
          </button>
        ))}
      </section>

      {/* Song list for selected genre */}
      <section className="space-y-4">
        <h3 className="font-headline-md text-xl font-bold text-on-surface">
          Tracks matching &quot;{selectedGenre}&quot;
        </h3>
        <SongList songs={songs} />
      </section>
    </div>
  );
}

export default function Genres() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center py-20">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    }>
      <GenresContent />
    </Suspense>
  );
}

