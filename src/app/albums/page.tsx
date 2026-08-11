'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { MOCK_ALBUMS } from '@/lib/mockData';
import GlassCard from '@/components/GlassCard';
import { Disc } from 'lucide-react';

export default function AlbumsPage() {
  const router = useRouter();

  return (
    <div className="space-y-10 pb-12">
      {/* Title */}
      <div>
        <h2 className="font-display-lg text-3xl font-bold flex items-center gap-2">
          <Disc className="text-primary animate-spin-slow" />
          Browse Albums
        </h2>
        <p className="text-sm text-on-surface-variant mt-1">
          Explore complete dynamic record releases from registered VibeVault creators.
        </p>
      </div>

      {/* Grid of Albums */}
      <section className="grid grid-cols-4 max-lg:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1 gap-6">
        {MOCK_ALBUMS.map((album) => (
          <GlassCard
            key={album._id}
            title={album.title}
            subtitle={album.artistName}
            imageUrl={album.coverUrl}
            onCardClick={() => router.push(`/albums/${album._id}`)}
          />
        ))}
      </section>
    </div>
  );
}
