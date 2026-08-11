'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { MOCK_ARTISTS } from '@/lib/mockData';
import GlassCard from '@/components/GlassCard';
import { Users } from 'lucide-react';

export default function ArtistsPage() {
  const router = useRouter();

  return (
    <div className="space-y-10 pb-12">
      {/* Title */}
      <div>
        <h2 className="font-display-lg text-3xl font-bold flex items-center gap-2">
          <Users className="text-secondary" />
          Verified Artists
        </h2>
        <p className="text-sm text-on-surface-variant mt-1">
          Meet the minds shaping high-fidelity sonic experiences on VibeVault.
        </p>
      </div>

      {/* Grid of Artists */}
      <section className="grid grid-cols-4 max-lg:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1 gap-6">
        {MOCK_ARTISTS.map((artist) => (
          <GlassCard
            key={artist._id}
            title={artist.name}
            subtitle={`${artist.followersCount.toLocaleString()} Followers`}
            imageUrl={artist.imageUrl}
            onCardClick={() => router.push(`/artists/${artist._id}`)}
          />
        ))}
      </section>
    </div>
  );
}
