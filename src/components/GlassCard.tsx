'use client';

import React from 'react';
import { Play } from 'lucide-react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  title: string;
  subtitle?: string;
  imageUrl: string;
  onPlayClick?: () => void;
  onCardClick?: () => void;
  badge?: string;
  aspectRatio?: 'square' | 'video' | 'portrait';
}

export default function GlassCard({
  title,
  subtitle,
  imageUrl,
  onPlayClick,
  onCardClick,
  badge,
  aspectRatio = 'square',
}: GlassCardProps) {
  const aspectClass = 
    aspectRatio === 'square' ? 'aspect-square' :
    aspectRatio === 'portrait' ? 'aspect-[3/4]' : 'aspect-video';

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      onClick={onCardClick}
      className={`glass rounded-2xl p-4 flex flex-col gap-3 group relative cursor-pointer overflow-hidden transition-all duration-300 hover:border-white/30`}
    >
      {/* Image container */}
      <div className={`relative ${aspectClass} w-full rounded-xl overflow-hidden bg-surface-container-low`}>
        <img
          src={imageUrl || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17'}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />

        {/* Hover overlay play button */}
        {onPlayClick && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPlayClick();
              }}
              className="w-12 h-12 rounded-full bg-secondary text-on-secondary flex items-center justify-center shadow-lg shadow-secondary/30 scale-90 group-hover:scale-100 transition-all duration-300 hover:bg-white hover:text-black"
            >
              <Play size={22} className="ml-1 fill-current" />
            </button>
          </div>
        )}

        {/* Optional Badge */}
        {badge && (
          <span className="absolute top-2 left-2 px-2.5 py-1 text-[10px] font-bold rounded-full bg-tertiary text-white shadow-lg uppercase tracking-wider">
            {badge}
          </span>
        )}
      </div>

      {/* Info details */}
      <div className="flex flex-col gap-1 min-w-0">
        <h4 className="text-sm font-bold text-on-surface truncate group-hover:text-primary transition">
          {title}
        </h4>
        {subtitle && (
          <p className="text-xs text-on-surface-variant truncate">
            {subtitle}
          </p>
        )}
      </div>
    </motion.div>
  );
}
