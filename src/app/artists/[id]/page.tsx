'use client';

import React, { useEffect, useState } from 'react';
import { MOCK_ARTISTS, MOCK_SONGS, MOCK_ALBUMS } from '@/lib/mockData';
import { useAudio } from '@/context/AudioContext';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import SongList from '@/components/SongList';
import GlassCard from '@/components/GlassCard';
import { User, Users, Play, Radio, Music, Disc } from 'lucide-react';

export default function ArtistProfile({ params }: { params: { id: string } }) {
  const { id } = params;
  const { data: session } = useSession();
  const { playSong } = useAudio();
  const router = useRouter();

  const [artist, setArtist] = useState<any | null>(null);
  const [songs, setSongs] = useState<any[]>([]);
  const [albums, setAlbums] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    // Simulated DB queries, falling back to mock lists
    const match = MOCK_ARTISTS.find((a) => a._id === id) || MOCK_ARTISTS[0];
    setArtist(match);

    const matchSongs = MOCK_SONGS.filter((s) => s.artistId === id || s.artistId === match._id);
    setSongs(matchSongs.length > 0 ? matchSongs : MOCK_SONGS);

    const matchAlbums = MOCK_ALBUMS.filter((a) => a.artistName === match.name);
    setAlbums(matchAlbums);

    setLoading(false);
  }, [id]);

  const handleFollowToggle = () => {
    if (!session) {
      router.push('/auth/login');
      return;
    }
    setIsFollowing((prev) => !prev);
  };

  const handlePlayArtist = () => {
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

  if (!artist) return null;

  return (
    <div className="space-y-10 pb-12">
      {/* Visual Artist Header Banner */}
      <section className="relative rounded-3xl overflow-hidden glass p-10 max-sm:p-6 border-white/10 flex items-center max-md:flex-col gap-8 bg-gradient-to-r from-primary/10 via-background to-secondary/10">
        <div className="w-44 h-44 max-sm:w-32 max-sm:h-32 rounded-full overflow-hidden border-2 border-primary/20 shadow-xl flex-none bg-surface-container">
          <img src={artist.imageUrl} className="w-full h-full object-cover" alt="" />
        </div>
        <div className="flex-1 space-y-4 max-md:text-center">
          <div>
            <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-secondary/15 text-secondary border border-secondary/20 uppercase tracking-widest flex items-center gap-1 w-fit max-md:mx-auto">
              <Radio size={12} className="animate-pulse" /> Verified Artist
            </span>
            <h2 className="font-display-lg text-4xl max-sm:text-3xl font-extrabold text-white mt-3">
              {artist.name}
            </h2>
            <p className="text-sm text-on-surface-variant mt-2 max-w-xl">
              {artist.bio || 'No artist bio available yet.'}
            </p>
            <div className="flex items-center gap-2 text-xs text-on-surface-variant/80 mt-3 max-md:justify-center font-semibold">
              <Users size={14} />
              <span>{(artist.followersCount + (isFollowing ? 1 : 0)).toLocaleString()} Followers</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 max-md:justify-center">
            {songs.length > 0 && (
              <button
                onClick={handlePlayArtist}
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-primary to-secondary text-on-primary-container font-bold text-xs shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition flex items-center gap-1.5"
              >
                <Play size={14} className="fill-current" /> Play Tracks
              </button>
            )}
            <button
              onClick={handleFollowToggle}
              className={`px-6 py-2.5 rounded-full border text-xs font-bold transition duration-300 ${
                isFollowing
                  ? 'bg-transparent border-tertiary text-tertiary shadow-lg shadow-tertiary/10'
                  : 'glass border-white/10 text-white hover:border-white/30'
              }`}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </button>
          </div>
        </div>
      </section>

      {/* Main artist grids */}
      <section className="grid grid-cols-3 max-lg:grid-cols-1 gap-8">
        {/* Popular tracks list */}
        <div className="col-span-2 space-y-4">
          <h3 className="font-headline-md text-xl font-bold flex items-center gap-2">
            <Music size={18} className="text-primary" /> Popular Tracks
          </h3>
          <SongList songs={songs} />
        </div>

        {/* Albums discography list */}
        <div className="space-y-4">
          <h3 className="font-headline-md text-xl font-bold flex items-center gap-2">
            <Disc size={18} className="text-secondary" /> Albums
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {albums.length > 0 ? (
              albums.map((album) => (
                <div
                  key={album._id}
                  onClick={() => router.push(`/albums/${album._id}`)}
                  className="flex items-center gap-4 p-3 rounded-2xl glass hover:border-primary/20 cursor-pointer transition"
                >
                  <img src={album.coverUrl} className="w-16 h-16 rounded-xl object-cover" alt="" />
                  <div>
                    <h4 className="text-sm font-bold text-on-surface hover:text-primary transition">
                      {album.title}
                    </h4>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      {album.songsCount || 10} Songs • {album.releaseYear || 2024}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm italic text-on-surface-variant">No albums published yet.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
