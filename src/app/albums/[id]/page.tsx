'use client';

import React, { useEffect, useState } from 'react';
import { MOCK_ALBUMS, MOCK_SONGS } from '@/lib/mockData';
import { useAudio } from '@/context/AudioContext';
import SongList from '@/components/SongList';
import { Disc, Play, Calendar, Music } from 'lucide-react';

export default function AlbumDetails({ params }: { params: { id: string } }) {
  const { id } = params;
  const { playSong } = useAudio();

  const [album, setAlbum] = useState<any | null>(null);
  const [songs, setSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated DB queries, falling back to mock lists
    const match = MOCK_ALBUMS.find((a) => a._id === id) || MOCK_ALBUMS[0];
    setAlbum(match);

    const matchSongs = MOCK_SONGS.filter((s) => s.albumId === id || s.albumId === match._id);
    setSongs(matchSongs.length > 0 ? matchSongs : MOCK_SONGS.slice(0, 2));
    setLoading(false);
  }, [id]);

  const handlePlayAlbum = () => {
    if (songs.length > 0) {
      playSong(songs[0], songs);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-40">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!album) return null;

  return (
    <div className="space-y-10 pb-12">
      {/* Visual Album Header Card */}
      <section className="relative rounded-3xl overflow-hidden glass p-8 max-sm:p-6 border-white/10 flex items-center max-md:flex-col gap-8 bg-gradient-to-r from-secondary/10 via-background to-primary/10">
        <div className="w-48 h-48 max-sm:w-36 max-sm:h-36 rounded-2xl overflow-hidden border border-white/10 shadow-xl flex-none bg-surface-container">
          <img src={album.coverUrl} className="w-full h-full object-cover" alt="" />
        </div>
        <div className="flex-grow space-y-4 max-md:text-center">
          <div>
            <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-primary/15 text-primary border border-primary/20 uppercase tracking-widest">
              Album Release
            </span>
            <h2 className="font-display-lg text-4xl max-sm:text-3xl font-extrabold text-white mt-3">
              {album.title}
            </h2>
            <p className="text-sm text-secondary font-semibold mt-1">
              By {album.artistName}
            </p>
            <div className="flex items-center gap-4 text-xs text-on-surface-variant/80 mt-3 max-md:justify-center">
              <span className="flex items-center gap-1">
                <Calendar size={14} /> {album.releaseYear || 2024}
              </span>
              <span>•</span>
              <span>{songs.length} Tracks</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 max-md:justify-center">
            {songs.length > 0 && (
              <button
                onClick={handlePlayAlbum}
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-primary to-secondary text-on-primary-container font-bold text-xs shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition flex items-center gap-1.5"
              >
                <Play size={14} className="fill-current" /> Play Album
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Album Tracks list */}
      <section className="space-y-4">
        <h3 className="font-headline-md text-xl font-bold flex items-center gap-2">
          <Music size={18} className="text-primary" /> Album Songs
        </h3>
        <SongList songs={songs} />
      </section>
    </div>
  );
}
