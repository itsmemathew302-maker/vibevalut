'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useAudio } from '@/context/AudioContext';
import { MOCK_PLAYLISTS, MOCK_SONGS } from '@/lib/mockData';
import SongList from '@/components/SongList';
import { ListMusic, Play, Trash2, Edit2, Share2 } from 'lucide-react';

export default function PlaylistDetails({ params }: { params: { id: string } }) {
  const { id } = params;
  const { data: session } = useSession();
  const { playSong } = useAudio();
  const router = useRouter();

  const [playlist, setPlaylist] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [songs, setSongs] = useState<any[]>([]);

  useEffect(() => {
    fetch(`/api/playlists?id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.playlist) {
          setPlaylist(data.playlist);
          setSongs(data.playlist.songs || []);
        } else {
          // Fallback mock check
          const mockPl = MOCK_PLAYLISTS.find((p) => p._id === id) || MOCK_PLAYLISTS[0];
          setPlaylist({
            ...mockPl,
            userId: 'mock_guest',
            userName: 'Editor'
          });
          setSongs(MOCK_SONGS);
        }
      })
      .catch(() => {
        const mockPl = MOCK_PLAYLISTS.find((p) => p._id === id) || MOCK_PLAYLISTS[0];
        setPlaylist({
          ...mockPl,
          userId: 'mock_guest',
          userName: 'Editor'
        });
        setSongs(MOCK_SONGS);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handlePlayPlaylist = () => {
    if (songs.length > 0) {
      playSong(songs[0], songs);
    }
  };

  const handleRemoveTrack = async (songId: string) => {
    if (!playlist) return;
    try {
      const res = await fetch('/api/playlists', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playlistId: playlist._id,
          songId,
          action: 'remove'
        })
      });
      const data = await res.json();
      if (data.success) {
        setSongs((prev) => prev.filter((s) => s._id !== songId));
      }
    } catch (err) {
      console.log('Error removing song from playlist:', err);
    }
  };

  const handleDeletePlaylist = async () => {
    if (!playlist) return;
    const conf = window.confirm('Are you sure you want to delete this playlist?');
    if (!conf) return;

    try {
      const res = await fetch(`/api/playlists?id=${playlist._id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        router.push('/library');
      }
    } catch (err) {
      console.log('Error deleting playlist:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-40">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!playlist) return null;

  const isOwner = session && session.user && (session.user as any).id === playlist.userId;

  return (
    <div className="space-y-10 pb-12">
      {/* Visual Playlist Header Card */}
      <section className="relative rounded-3xl overflow-hidden glass p-8 max-sm:p-6 border-white/10 flex items-center max-md:flex-col gap-8 bg-gradient-to-r from-primary/10 via-background to-secondary/10">
        <div className="w-48 h-48 max-sm:w-36 max-sm:h-36 rounded-2xl overflow-hidden border border-white/10 shadow-xl flex-none bg-surface-container">
          <img src={playlist.coverUrl || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819'} className="w-full h-full object-cover" alt="" />
        </div>
        <div className="flex-1 space-y-4 max-md:text-center">
          <div>
            <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-secondary/15 text-secondary border border-secondary/20 uppercase tracking-widest">
              Curated Playlist
            </span>
            <h2 className="font-display-lg text-4xl max-sm:text-3xl font-extrabold text-white mt-3">
              {playlist.name}
            </h2>
            <p className="text-sm text-on-surface-variant mt-2 max-w-xl">
              {playlist.description || 'No description provided.'}
            </p>
            <p className="text-xs text-on-surface-variant/75 mt-3 font-semibold">
              Created by {playlist.userName} • {songs.length} Tracks
            </p>
          </div>
          <div className="flex flex-wrap gap-3 max-md:justify-center">
            {songs.length > 0 && (
              <button
                onClick={handlePlayPlaylist}
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-primary to-secondary text-on-primary-container font-bold text-xs shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition flex items-center gap-1.5"
              >
                <Play size={14} className="fill-current" /> Play Vibe
              </button>
            )}
            <button className="p-2.5 rounded-xl glass border-white/15 text-on-surface-variant hover:text-white transition">
              <Share2 size={16} />
            </button>
            {isOwner && (
              <button
                onClick={handleDeletePlaylist}
                className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition"
                title="Delete Playlist"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Playlist Track rows */}
      <section className="space-y-4">
        <h3 className="font-headline-md text-xl font-bold flex items-center gap-2">
          <ListMusic size={18} className="text-secondary" /> Track List
        </h3>
        <SongList
          songs={songs}
          showRemoveFromPlaylist={!!isOwner}
          onRemoveFromPlaylist={handleRemoveTrack}
        />
      </section>
    </div>
  );
}
