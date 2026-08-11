'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useAudio } from '@/context/AudioContext';
import { useRouter } from 'next/navigation';
import { MOCK_SONGS } from '@/lib/mockData';
import SongList from '@/components/SongList';
import { Heart, Play } from 'lucide-react';

export default function FavoritesPage() {
  const { data: session } = useSession();
  const { playSong } = useAudio();
  const router = useRouter();

  const [songs, setSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) {
      setSongs(MOCK_SONGS.slice(0, 2)); // Mock fallback for guest
      setLoading(false);
      return;
    }

    fetch('/api/playlists?favorites=true')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.favorites) {
          setSongs(data.favorites);
        } else {
          setSongs([]);
        }
      })
      .catch(() => setSongs([]))
      .finally(() => setLoading(false));
  }, [session]);

  const handlePlayAll = () => {
    if (songs.length > 0) {
      playSong(songs[0], songs);
    }
  };

  return (
    <div className="space-y-10 pb-12">
      {/* Immersive Header Banner */}
      <section className="relative rounded-3xl overflow-hidden glass p-10 max-sm:p-6 border-white/10 flex items-center max-sm:flex-col gap-8 bg-gradient-to-r from-tertiary/10 via-background to-primary/10">
        <div className="w-36 h-36 max-sm:w-28 max-sm:h-28 rounded-2xl bg-gradient-to-tr from-tertiary to-primary flex items-center justify-center shadow-xl shadow-tertiary/20">
          <Heart size={64} className="text-white fill-current animate-pulse" />
        </div>
        <div className="flex-1 space-y-4 max-sm:text-center">
          <div>
            <p className="text-xs uppercase tracking-widest text-on-surface-variant font-bold">Playlist</p>
            <h2 className="font-display-lg text-4xl max-sm:text-3xl font-extrabold text-white mt-1">
              Favorites
            </h2>
            <p className="text-sm text-on-surface-variant mt-2 font-semibold">
              {session ? session.user?.name : 'Guest Listener'} • {songs.length} Tracks
            </p>
          </div>
          {songs.length > 0 && (
            <button
              onClick={handlePlayAll}
              className="px-6 py-3 rounded-full bg-tertiary text-white font-bold text-sm shadow-lg shadow-tertiary/20 hover:scale-105 active:scale-95 transition flex items-center gap-2 max-sm:mx-auto"
            >
              <Play size={16} className="fill-current" /> Play All
            </button>
          )}
        </div>
      </section>

      {/* Song List */}
      <section className="space-y-4">
        <h3 className="font-headline-md text-xl font-bold flex items-center gap-2">
          <Heart size={18} className="text-tertiary" />
          Liked Tracks
        </h3>
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          </div>
        ) : (
          <SongList songs={songs} />
        )}
      </section>
    </div>
  );
}
