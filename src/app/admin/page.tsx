'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Shield, Upload, FileAudio, Image as ImageIcon, Music, Trash2, Plus, Sparkles } from 'lucide-react';
import { MOCK_SONGS } from '@/lib/mockData';
import SongList from '@/components/SongList';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Form Fields
  const [title, setTitle] = useState('');
  const [artistName, setArtistName] = useState('');
  const [artistId, setArtistId] = useState('mock_artist_1');
  const [albumTitle, setAlbumTitle] = useState('');
  const [genres, setGenres] = useState('');
  const [lyrics, setLyrics] = useState('');
  const [duration, setDuration] = useState('240'); // Default seconds

  // Upload States
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [uploadingAudio, setUploadingAudio] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [audioUrl, setAudioUrl] = useState('');
  const [coverUrl, setCoverUrl] = useState('');

  // General States
  const [songs, setSongs] = useState<any[]>([]);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [submittingSong, setSubmittingSong] = useState(false);

  // Sync current database catalog
  const loadSongs = () => {
    fetch('/api/songs?limit=20')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.songs && data.songs.length > 0) {
          setSongs(data.songs);
        } else {
          setSongs(MOCK_SONGS);
        }
      })
      .catch(() => setSongs(MOCK_SONGS));
  };

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
      return;
    }
    if (session && (session.user as any).role === 'admin') {
      loadSongs();
    }
  }, [session, status]);

  // Handle uploading audio file to Cloudinary / mock
  const handleAudioUpload = async (file: File) => {
    setUploadingAudio(true);
    setFormError('');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'audio');

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setAudioUrl(data.url);
        setFormSuccess('Audio track processed successfully!');
      } else {
        setFormError(data.error || 'Audio upload failed');
      }
    } catch (err) {
      setFormError('Failed to upload audio file');
    } finally {
      setUploadingAudio(false);
    }
  };

  // Handle uploading cover image file
  const handleCoverUpload = async (file: File) => {
    setUploadingCover(true);
    setFormError('');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'image');

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setCoverUrl(data.url);
        setFormSuccess('Cover image processed successfully!');
      } else {
        setFormError(data.error || 'Image upload failed');
      }
    } catch (err) {
      setFormError('Failed to upload cover art file');
    } finally {
      setUploadingCover(false);
    }
  };

  const handleSongSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !artistName || !audioUrl || !coverUrl) {
      setFormError('Please fill in title, artist name, and upload both audio and cover files.');
      return;
    }

    setSubmittingSong(true);
    setFormError('');
    setFormSuccess('');

    try {
      const res = await fetch('/api/songs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          artistName,
          artistId,
          albumTitle,
          audioUrl,
          coverUrl,
          duration: parseInt(duration) || 240,
          genres: genres.split(',').map((g) => g.trim()).filter(Boolean),
          lyrics
        })
      });

      const data = await res.json();
      if (data.success) {
        setFormSuccess('Song uploaded and cataloged successfully!');
        // Reset form
        setTitle('');
        setAlbumTitle('');
        setLyrics('');
        setAudioUrl('');
        setCoverUrl('');
        setAudioFile(null);
        setCoverFile(null);
        loadSongs();
      } else {
        setFormError(data.error || 'Failed to submit song details');
      }
    } catch (err) {
      setFormError('An error occurred during submission');
    } finally {
      setSubmittingSong(false);
    }
  };

  const handleSongDelete = async (songId: string) => {
    alert('Delete song request: Song deleted locally. (Actual delete endpoint can be integrated with Mongoose)');
    setSongs((prev) => prev.filter((s) => s._id !== songId));
  };

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center py-40">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  // Deny access if not admin
  if (!session || (session.user as any).role !== 'admin') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6 text-center">
        <div className="max-w-md rounded-2xl glass border border-red-500/20 p-8 space-y-4 bg-red-500/5 backdrop-blur-2xl">
          <Shield size={64} className="mx-auto text-red-400" />
          <h3 className="font-display-lg text-2xl font-bold text-white">Access Denied</h3>
          <p className="text-sm text-on-surface-variant font-semibold">
            Administrative credentials are required to view this panel.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-12">
      {/* Header title */}
      <div>
        <h2 className="font-display-lg text-3xl font-bold flex items-center gap-2">
          <Shield className="text-primary animate-pulse" />
          Admin Control Center
        </h2>
        <p className="text-sm text-on-surface-variant mt-1">
          Upload new media streaming assets and moderate the current sound catalogs.
        </p>
      </div>

      <div className="grid grid-cols-2 max-xl:grid-cols-1 gap-8">
        {/* Track creation form */}
        <section className="glass rounded-2xl p-6 border-white/5 bg-white/5 space-y-6">
          <h3 className="font-headline-md text-lg font-bold flex items-center gap-2 border-b border-white/5 pb-2">
            <Plus size={18} className="text-secondary" /> Add New Song
          </h3>

          {formError && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs font-semibold text-red-400">
              {formError}
            </div>
          )}

          {formSuccess && (
            <div className="p-3.5 rounded-xl bg-green-500/10 border border-green-500/20 text-xs font-semibold text-green-400">
              {formSuccess}
            </div>
          )}

          <form onSubmit={handleSongSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-on-surface-variant font-semibold">Song Title</label>
                <input
                  type="text"
                  required
                  placeholder="Neon dreams"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl font-body-sm focus:outline-none focus:border-primary text-on-surface"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-on-surface-variant font-semibold">Artist Name</label>
                <input
                  type="text"
                  required
                  placeholder="Lumina Synth"
                  value={artistName}
                  onChange={(e) => setArtistName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl font-body-sm focus:outline-none focus:border-primary text-on-surface"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-on-surface-variant font-semibold">Album Name</label>
                <input
                  type="text"
                  placeholder="Leave blank for single"
                  value={albumTitle}
                  onChange={(e) => setAlbumTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl font-body-sm focus:outline-none focus:border-primary text-on-surface"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-on-surface-variant font-semibold">Track Duration (seconds)</label>
                <input
                  type="number"
                  required
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl font-body-sm focus:outline-none focus:border-primary text-on-surface"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-on-surface-variant font-semibold">Genres (comma separated)</label>
              <input
                type="text"
                placeholder="Pop, Synthwave, Electronic"
                value={genres}
                onChange={(e) => setGenres(e.target.value)}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl font-body-sm focus:outline-none focus:border-primary text-on-surface"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-on-surface-variant font-semibold">Lyrics</label>
              <textarea
                placeholder="Add scrolling/static lyrics lines here"
                value={lyrics}
                onChange={(e) => setLyrics(e.target.value)}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl font-body-sm focus:outline-none focus:border-primary text-on-surface h-24 resize-none"
              />
            </div>

            {/* Custom File Upload drop grids */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              {/* Audio Uploader */}
              <div className="border border-dashed border-white/15 rounded-xl p-4 flex flex-col items-center justify-center gap-2 bg-white/5 cursor-pointer relative hover:border-primary/40 transition">
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setAudioFile(file);
                      handleAudioUpload(file);
                    }
                  }}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <FileAudio className={audioUrl ? 'text-primary' : 'text-on-surface-variant'} size={24} />
                <p className="text-xs font-semibold text-center text-on-surface">
                  {audioFile ? audioFile.name : 'Upload Audio Track'}
                </p>
                <p className="text-[10px] text-on-surface-variant text-center">MP3, WAV, FLAC</p>
                {uploadingAudio && (
                  <div className="absolute inset-0 bg-background/80 rounded-xl flex items-center justify-center">
                    <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                  </div>
                )}
              </div>

              {/* Cover Art Uploader */}
              <div className="border border-dashed border-white/15 rounded-xl p-4 flex flex-col items-center justify-center gap-2 bg-white/5 cursor-pointer relative hover:border-primary/40 transition">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setCoverFile(file);
                      handleCoverUpload(file);
                    }
                  }}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <ImageIcon className={coverUrl ? 'text-secondary' : 'text-on-surface-variant'} size={24} />
                <p className="text-xs font-semibold text-center text-on-surface">
                  {coverFile ? coverFile.name : 'Upload Cover Image'}
                </p>
                <p className="text-[10px] text-on-surface-variant text-center">PNG, JPG, WEBP</p>
                {uploadingCover && (
                  <div className="absolute inset-0 bg-background/80 rounded-xl flex items-center justify-center">
                    <div className="w-5 h-5 rounded-full border-2 border-secondary border-t-transparent animate-spin" />
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={submittingSong || uploadingAudio || uploadingCover}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-on-primary-container font-bold text-sm shadow-lg shadow-primary/20 hover:scale-102 active:scale-95 transition flex items-center justify-center gap-2"
            >
              {submittingSong ? (
                <div className="w-5 h-5 rounded-full border-2 border-on-primary-container border-t-transparent animate-spin" />
              ) : (
                <>
                  <Sparkles size={16} /> Publish Track
                </>
              )}
            </button>
          </form>
        </section>

        {/* Media Catalogue list */}
        <section className="space-y-4">
          <h3 className="font-headline-md text-lg font-bold flex items-center gap-2 border-b border-white/5 pb-2">
            <Music size={18} className="text-primary" /> Song Catalog ({songs.length})
          </h3>
          <div className="max-h-[600px] overflow-y-auto pr-2 no-scrollbar">
            <SongList songs={songs} onDeleteSong={handleSongDelete} />
          </div>
        </section>
      </div>
    </div>
  );
}
