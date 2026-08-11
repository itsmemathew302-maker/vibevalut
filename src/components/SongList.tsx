'use client';

import React, { useState, useEffect } from 'react';
import { useAudio, ISongData } from '@/context/AudioContext';
import { Play, Pause, Heart, Plus, Clock, ListPlus, Trash2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface SongListProps {
  songs: ISongData[];
  onDeleteSong?: (songId: string) => void; // Optional admin deletion callback
  showRemoveFromPlaylist?: boolean;
  onRemoveFromPlaylist?: (songId: string) => void;
}

export default function SongList({
  songs,
  onDeleteSong,
  showRemoveFromPlaylist = false,
  onRemoveFromPlaylist
}: SongListProps) {
  const { currentSong, isPlaying, playSong, addToQueue } = useAudio();
  const { data: session } = useSession();
  const router = useRouter();
  const [likedSongIds, setLikedSongIds] = useState<string[]>([]);

  // Fetch user favorites to check likes
  useEffect(() => {
    if (!session) return;
    fetch('/api/playlists?favorites=true')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.favorites) {
          setLikedSongIds(data.favorites.map((s: any) => s._id));
        }
      })
      .catch(() => { });
  }, [session, songs]);

  const handlePlayToggle = (song: ISongData) => {
    if (currentSong?._id === song._id) {
      // Toggle play/pause
      const audioBtn = document.querySelector('button[title="Play/Pause"]') as HTMLButtonElement;
      if (audioBtn) audioBtn.click();
    } else {
      playSong(song, songs);
    }
  };

  const handleLikeToggle = async (e: React.MouseEvent, songId: string) => {
    e.stopPropagation();
    if (!session) {
      router.push('/auth/login');
      return;
    }

    try {
      const res = await fetch('/api/songs/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ songId })
      });
      const data = await res.json();
      if (data.success) {
        if (data.liked) {
          setLikedSongIds((prev) => [...prev, songId]);
        } else {
          setLikedSongIds((prev) => prev.filter((id) => id !== songId));
        }
      }
    } catch (err) {
      console.log('Error toggling like:', err);
    }
  };

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (songs.length === 0) {
    return (
      <div className="glass rounded-2xl p-12 text-center border-white/5 bg-white/20">
        <p className="text-on-surface-variant font-semibold text-lg">No songs available in this collection.</p>
        <p className="text-xs text-on-surface-variant/70 mt-1">Check back later or upload new tracks.</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-1.5">
      {/* Header labels */}
      <div className="flex items-center px-4 py-2 text-xs font-label-caps text-on-surface-variant/50 uppercase tracking-widest border-b border-white/5 mb-2">
        <span className="w-10 text-center">#</span>
        <span className="flex-1">Title</span>
        <span className="w-36 max-md:hidden">Album</span>
        <span className="w-20 text-center"><Clock size={14} className="mx-auto" /></span>
        <span className="w-24 text-right">Actions</span>
      </div>

      {/* Tracks rows */}
      {songs.map((song, index) => {
        const isCurrent = currentSong?._id === song._id;
        const isLiked = likedSongIds.includes(song._id);

        return (
          <div
            key={song._id}
            onClick={() => handlePlayToggle(song)}
            className={`flex items-center px-4 py-3 rounded-xl cursor-pointer transition duration-300 group ${isCurrent
                ? 'bg-gradient-to-r from-primary/20 to-secondary/10 border border-primary/20 shadow-md'
                : 'hover:bg-white/5 border border-transparent'
              }`}
          >
            {/* Number Index / Play Button hover */}
            <div className="w-10 text-center flex items-center justify-center">
              <span className="group-hover:hidden text-sm font-semibold text-on-surface-variant/70 font-mono">
                {isCurrent && isPlaying ? (
                  <div className="flex items-end gap-[2px] h-3.5 w-3 mx-auto">
                    <div className="w-[2px] bg-secondary rounded-full animate-[bounce_0.8s_infinite_ease-in-out]" style={{ animationDelay: '0.1s' }} />
                    <div className="w-[2px] bg-primary rounded-full animate-[bounce_0.8s_infinite_ease-in-out]" style={{ animationDelay: '0.4s' }} />
                    <div className="w-[2px] bg-tertiary rounded-full animate-[bounce_0.8s_infinite_ease-in-out]" style={{ animationDelay: '0.2s' }} />
                  </div>
                ) : (
                  index + 1
                )}
              </span>
              <span className="hidden group-hover:block text-secondary">
                {isCurrent && isPlaying ? <Pause size={16} /> : <Play size={16} />}
              </span>
            </div>

            {/* Title & Cover */}
            <div className="flex-1 min-w-0 flex items-center gap-3">
              <img
                src={song.coverUrl || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17'}
                className="w-10 h-10 rounded-lg object-cover flex-none"
                alt=""
              />
              <div className="min-w-0">
                <p className={`text-sm font-bold truncate ${isCurrent ? 'text-primary drop-shadow-[0_0_8px_rgba(139,92,246,0.3)]' : 'text-on-surface'}`}>
                  {song.title}
                </p>
                <p className="text-xs text-on-surface-variant truncate">{song.artistName}</p>
              </div>
            </div>

            {/* Album field */}
            <span className="w-36 max-md:hidden text-sm text-on-surface-variant/80 truncate">
              {song.albumTitle || 'Single'}
            </span>

            {/* Duration */}
            <span className="w-20 text-center text-xs font-mono text-on-surface-variant">
              {formatDuration(song.duration)}
            </span>

            {/* Action buttons */}
            <div className="w-24 flex items-center justify-end gap-2.5" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={(e) => handleLikeToggle(e, song._id)}
                className={`transition ${isLiked ? 'text-tertiary drop-shadow-[0_0_6px_#EC4899]' : 'text-on-surface-variant hover:text-white'}`}
              >
                <Heart size={16} className={isLiked ? 'fill-current' : ''} />
              </button>
              <button
                onClick={() => addToQueue(song)}
                className="text-on-surface-variant hover:text-secondary transition"
                title="Add to queue"
              >
                <ListPlus size={16} />
              </button>
              {showRemoveFromPlaylist && onRemoveFromPlaylist && (
                <button
                  onClick={() => onRemoveFromPlaylist(song._id)}
                  className="text-on-surface-variant hover:text-red-400 transition"
                  title="Remove from playlist"
                >
                  <Trash2 size={16} />
                </button>
              )}
              {(session?.user as any)?.role === 'admin' && onDeleteSong && (
                <button
                  onClick={() => onDeleteSong(song._id)}
                  className="text-on-surface-variant hover:text-red-500 transition"
                  title="Delete Track"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
