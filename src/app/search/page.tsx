'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { MOCK_SONGS, MOCK_ALBUMS, MOCK_ARTISTS } from '@/lib/mockData';
import SongList from '@/components/SongList';
import GlassCard from '@/components/GlassCard';
import { Search as SearchIcon, Disc, User, Music } from 'lucide-react';

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';

  const [searchVal, setSearchVal] = useState(query);
  const [songs, setSongs] = useState<any[]>([]);
  const [albums, setAlbums] = useState<any[]>([]);
  const [artists, setArtists] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSearchVal(query);
    if (!query.trim()) {
      setSongs([]);
      setAlbums([]);
      setArtists([]);
      return;
    }

    setLoading(true);
    // Dynamic search endpoints
    fetch(`/api/songs?search=${encodeURIComponent(query)}&limit=10`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.songs && data.songs.length > 0) {
          setSongs(data.songs);
        } else {
          // Fallback mock fuzzy match
          const matchingSongs = MOCK_SONGS.filter(
            (s) =>
              s.title.toLowerCase().includes(query.toLowerCase()) ||
              s.artistName.toLowerCase().includes(query.toLowerCase())
          );
          setSongs(matchingSongs);
        }
      })
      .catch(() => setSongs([]))
      .finally(() => setLoading(false));

    // Simple mock filter for albums/artists
    const matchingAlbums = MOCK_ALBUMS.filter(
      (a) =>
        a.title.toLowerCase().includes(query.toLowerCase()) ||
        a.artistName.toLowerCase().includes(query.toLowerCase())
    );
    setAlbums(matchingAlbums);

    const matchingArtists = MOCK_ARTISTS.filter((art) =>
      art.name.toLowerCase().includes(query.toLowerCase())
    );
    setArtists(matchingArtists);
  }, [query]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(searchVal.trim())}`);
  };

  return (
    <div className="space-y-10 pb-12">
      {/* Search form bar */}
      <form onSubmit={handleSearchSubmit} className="relative w-full max-w-2xl mx-auto md:hidden">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary w-5 h-5" />
        <input
          type="text"
          placeholder="Search..."
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-full font-body-sm text-on-surface focus:outline-none focus:border-primary transition"
        />
      </form>

      {/* Query label */}
      <div>
        <h2 className="font-display-lg text-2xl font-bold">
          {query ? `Search results for &quot;${query}&quot;` : 'Search VibeVault'}
        </h2>
        {!query && (
          <p className="text-sm text-on-surface-variant mt-1">
            Type in keywords above to discover songs, albums, playlists, and artists.
          </p>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      ) : query && songs.length === 0 && albums.length === 0 && artists.length === 0 ? (
        <div className="glass rounded-2xl p-16 text-center border-white/5 bg-white/10">
          <p className="text-on-surface-variant font-semibold text-lg">No results found.</p>
          <p className="text-xs text-on-surface-variant/70 mt-1">Try spelling terms differently or browse other vibes.</p>
        </div>
      ) : (
        <>
          {/* Songs results list */}
          {songs.length > 0 && (
            <section className="space-y-4">
              <h3 className="font-headline-md text-lg font-bold flex items-center gap-2">
                <Music size={16} className="text-primary" /> Songs
              </h3>
              <SongList songs={songs} />
            </section>
          )}

          {/* Albums results */}
          {albums.length > 0 && (
            <section className="space-y-4">
              <h3 className="font-headline-md text-lg font-bold flex items-center gap-2">
                <Disc size={16} className="text-secondary" /> Albums
              </h3>
              <div className="grid grid-cols-4 max-md:grid-cols-2 max-sm:grid-cols-1 gap-6">
                {albums.map((album) => (
                  <GlassCard
                    key={album._id}
                    title={album.title}
                    subtitle={album.artistName}
                    imageUrl={album.coverUrl}
                    onCardClick={() => router.push(`/albums/${album._id}`)}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Artists results */}
          {artists.length > 0 && (
            <section className="space-y-4">
              <h3 className="font-headline-md text-lg font-bold flex items-center gap-2">
                <User size={16} className="text-tertiary" /> Artists
              </h3>
              <div className="grid grid-cols-4 max-md:grid-cols-2 max-sm:grid-cols-1 gap-6">
                {artists.map((artist) => (
                  <GlassCard
                    key={artist._id}
                    title={artist.name}
                    subtitle="Artist Profile"
                    imageUrl={artist.imageUrl}
                    onCardClick={() => router.push(`/artists/${artist._id}`)}
                  />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center py-20">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}

