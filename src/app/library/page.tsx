'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { MOCK_PLAYLISTS, MOCK_ALBUMS, MOCK_ARTISTS } from '@/lib/mockData';
import GlassCard from '@/components/GlassCard';
import { FolderHeart, Plus, ListMusic, User, Disc } from 'lucide-react';

export default function LibraryPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'playlists' | 'albums' | 'artists'>('playlists');
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDesc, setNewPlaylistDesc] = useState('');

  useEffect(() => {
    if (!session) {
      setPlaylists(MOCK_PLAYLISTS);
      return;
    }

    fetch('/api/playlists')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.playlists) {
          setPlaylists(data.playlists);
        } else {
          setPlaylists([]);
        }
      })
      .catch(() => setPlaylists([]));
  }, [session]);

  const handleCreatePlaylist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;

    try {
      const res = await fetch('/api/playlists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newPlaylistName,
          description: newPlaylistDesc,
        }),
      });
      const data = await res.json();
      if (data.success && data.playlist) {
        setPlaylists((prev) => [data.playlist, ...prev]);
        setCreateModalOpen(false);
        setNewPlaylistName('');
        setNewPlaylistDesc('');
      }
    } catch (err) {
      console.log('Error creating playlist:', err);
    }
  };

  return (
    <div className="space-y-10 pb-12">
      {/* Header title & action */}
      <div className="flex justify-between items-center max-sm:flex-col max-sm:items-start gap-4">
        <div>
          <h2 className="font-display-lg text-3xl font-bold flex items-center gap-2">
            <FolderHeart className="text-primary" />
            Your Music Library
          </h2>
          <p className="text-sm text-on-surface-variant mt-1 font-medium">
            Manage your personal playlists, saved albums, and followed artists.
          </p>
        </div>
        {activeTab === 'playlists' && (
          <button
            onClick={() => {
              if (!session) router.push('/auth/login');
              else setCreateModalOpen(true);
            }}
            className="px-5 py-2.5 rounded-full bg-gradient-to-r from-primary to-secondary text-on-primary-container font-bold text-xs shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition flex items-center gap-1.5"
          >
            <Plus size={16} /> Create Playlist
          </button>
        )}
      </div>

      {/* Tabs list */}
      <section className="flex gap-4 border-b border-white/5 pb-2">
        {(['playlists', 'albums', 'artists'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-sm font-bold uppercase tracking-wider pb-2.5 border-b-2 transition capitalize ${
              activeTab === tab
                ? 'border-primary text-primary font-extrabold'
                : 'border-transparent text-on-surface-variant hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </section>

      {/* Tab Contents */}
      <section className="grid grid-cols-4 max-lg:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1 gap-6">
        {activeTab === 'playlists' &&
          playlists.map((pl) => (
            <GlassCard
              key={pl._id}
              title={pl.name}
              subtitle={pl.description || 'Custom playlist'}
              imageUrl={pl.coverUrl || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819'}
              onCardClick={() => router.push(`/playlists/${pl._id}`)}
            />
          ))}

        {activeTab === 'albums' &&
          MOCK_ALBUMS.map((album) => (
            <GlassCard
              key={album._id}
              title={album.title}
              subtitle={album.artistName}
              imageUrl={album.coverUrl}
              onCardClick={() => router.push(`/albums/${album._id}`)}
            />
          ))}

        {activeTab === 'artists' &&
          MOCK_ARTISTS.map((artist) => (
            <GlassCard
              key={artist._id}
              title={artist.name}
              subtitle="Artist Profile"
              imageUrl={artist.imageUrl}
              onCardClick={() => router.push(`/artists/${artist._id}`)}
            />
          ))}
      </section>

      {/* Create Playlist Modal overlay */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <form
            onSubmit={handleCreatePlaylist}
            className="w-full max-w-md rounded-2xl glass-dark border border-white/10 p-6 flex flex-col gap-4 shadow-2xl animate-fade-in"
          >
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <h4 className="font-title-lg text-md font-bold text-primary flex items-center gap-2">
                <ListMusic size={18} />
                Create New Playlist
              </h4>
              <button
                type="button"
                onClick={() => setCreateModalOpen(false)}
                className="text-xs text-on-surface-variant hover:text-white"
              >
                Cancel
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-on-surface-variant font-semibold">Playlist Name</label>
                <input
                  type="text"
                  required
                  placeholder="E.g. Study Lo-Fi beats"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl font-body-sm focus:outline-none focus:border-primary text-on-surface"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-on-surface-variant font-semibold">Description (Optional)</label>
                <textarea
                  placeholder="Describe the vibe of this playlist"
                  value={newPlaylistDesc}
                  onChange={(e) => setNewPlaylistDesc(e.target.value)}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl font-body-sm focus:outline-none focus:border-primary text-on-surface h-20 resize-none"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-full bg-gradient-to-r from-primary to-secondary text-on-primary-container font-bold text-sm shadow-lg shadow-primary/20 hover:scale-102 transition"
            >
              Create Playlist
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
