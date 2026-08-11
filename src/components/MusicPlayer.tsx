'use client';

import React, { useState } from 'react';
import { useAudio } from '@/context/AudioContext';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Shuffle,
  Repeat,
  Repeat1,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  ListMusic,
  BookOpen,
  Heart,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MusicPlayer() {
  const {
    currentSong,
    isPlaying,
    queue,
    currentQueueIndex,
    progress,
    duration,
    volume,
    isMuted,
    shuffle,
    repeatMode,
    lyricsOpen,
    fullscreenOpen,
    togglePlay,
    next,
    previous,
    seek,
    changeVolume,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    setLyricsOpen,
    setFullscreenOpen
  } = useAudio();

  const [queueOpen, setQueueOpen] = useState(false);

  if (!currentSong) return null;

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    seek(parseFloat(e.target.value));
  };

  return (
    <>
      {/* Sticky Bottom Player */}
      <div className="fixed bottom-0 left-0 right-0 z-50 h-24 bg-surface-container/85 backdrop-blur-2xl border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] flex flex-col px-6">
        {/* Progress Bar Seeker */}
        <div className="w-full relative group pt-2 -mt-1 cursor-pointer">
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={progress}
            onChange={handleSeekChange}
            className="w-full h-1 bg-white/10 rounded-full appearance-none outline-none cursor-pointer accent-secondary group-hover:h-2 transition-all"
            style={{
              background: `linear-gradient(to right, #06B6D4 0%, #EC4899 ${(progress / (duration || 1)) * 100}%, rgba(255, 255, 255, 0.1) ${(progress / (duration || 1)) * 100}%)`,
            }}
          />
        </div>

        <div className="flex items-center justify-between h-full py-2">
          {/* Metadata details */}
          <div className="flex items-center gap-4 w-1/3 min-w-[200px]">
            <div
              onClick={() => setFullscreenOpen(true)}
              className="w-12 h-12 rounded-xl overflow-hidden flex-none border border-white/10 cursor-pointer hover:scale-105 active:scale-95 transition"
            >
              <img
                src={currentSong.coverUrl || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17'}
                alt={currentSong.title}
                className={`w-full h-full object-cover ${isPlaying ? 'animate-[spin_10s_linear_infinite]' : ''}`}
              />
            </div>
            <div className="overflow-hidden">
              <h5
                onClick={() => setFullscreenOpen(true)}
                className="text-sm font-bold text-on-surface truncate cursor-pointer hover:text-primary transition"
              >
                {currentSong.title}
              </h5>
              <p className="text-xs text-on-surface-variant truncate">{currentSong.artistName}</p>
            </div>
            {/* Animated Equalizer */}
            {isPlaying && (
              <div className="flex items-end gap-[3px] h-4 mb-1.5 flex-none max-sm:hidden">
                <div className="w-[3px] bg-secondary rounded-full animate-[bounce_0.8s_infinite_ease-in-out]" style={{ animationDelay: '0.1s' }} />
                <div className="w-[3px] bg-primary rounded-full animate-[bounce_0.8s_infinite_ease-in-out]" style={{ animationDelay: '0.4s' }} />
                <div className="w-[3px] bg-tertiary rounded-full animate-[bounce_0.8s_infinite_ease-in-out]" style={{ animationDelay: '0.2s' }} />
                <div className="w-[3px] bg-secondary rounded-full animate-[bounce_0.8s_infinite_ease-in-out]" style={{ animationDelay: '0.6s' }} />
              </div>
            )}
          </div>

          {/* Action controller deck */}
          <div className="flex flex-col items-center justify-center gap-1 w-1/3">
            <div className="flex items-center gap-5">
              <button
                onClick={toggleShuffle}
                className={`text-on-surface-variant hover:text-secondary transition ${shuffle ? 'text-secondary drop-shadow-[0_0_8px_#06B6D4]' : ''}`}
                title="Shuffle"
              >
                <Shuffle size={18} />
              </button>
              <button onClick={previous} className="text-on-surface hover:text-primary transition active:scale-90">
                <SkipBack size={22} />
              </button>
              <button
                onClick={togglePlay}
                className="w-12 h-12 rounded-full bg-secondary text-on-secondary flex items-center justify-center shadow-lg shadow-secondary/20 hover:scale-105 active:scale-95 transition"
              >
                {isPlaying ? <Pause size={22} /> : <Play size={22} className="ml-1" />}
              </button>
              <button onClick={next} className="text-on-surface hover:text-primary transition active:scale-90">
                <SkipForward size={22} />
              </button>
              <button
                onClick={toggleRepeat}
                className={`text-on-surface-variant hover:text-tertiary transition ${repeatMode !== 'off' ? 'text-tertiary drop-shadow-[0_0_8px_#EC4899]' : ''}`}
                title={`Repeat: ${repeatMode}`}
              >
                {repeatMode === 'one' ? <Repeat1 size={18} /> : <Repeat size={18} />}
              </button>
            </div>
            <div className="text-[10px] text-on-surface-variant flex gap-2 font-mono max-sm:hidden">
              <span>{formatTime(progress)}</span>
              <span>/</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Utility decks: volume, fullscreen, lyrics */}
          <div className="flex items-center justify-end gap-4 w-1/3">
            <button
              onClick={() => setLyricsOpen(!lyricsOpen)}
              className={`text-on-surface-variant hover:text-primary transition max-sm:hidden ${lyricsOpen ? 'text-primary drop-shadow-[0_0_8px_#8B5CF6]' : ''}`}
              title="Lyrics"
            >
              <BookOpen size={18} />
            </button>
            <button
              onClick={() => setQueueOpen(!queueOpen)}
              className={`text-on-surface-variant hover:text-secondary transition ${queueOpen ? 'text-secondary drop-shadow-[0_0_8px_#06B6D4]' : ''}`}
              title="Queue"
            >
              <ListMusic size={18} />
            </button>

            {/* Volume Deck */}
            <div className="flex items-center gap-2 max-sm:hidden group/vol">
              <button onClick={toggleMute} className="text-on-surface-variant hover:text-white transition">
                {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={isMuted ? 0 : volume}
                onChange={(e) => changeVolume(parseFloat(e.target.value))}
                className="w-20 h-1 bg-white/10 rounded-full appearance-none outline-none cursor-pointer accent-secondary transition-all"
                style={{
                  background: `linear-gradient(to right, #06B6D4 0%, #06B6D4 ${(isMuted ? 0 : volume) * 100}%, rgba(255, 255, 255, 0.1) ${(isMuted ? 0 : volume) * 100}%)`,
                }}
              />
            </div>

            <button
              onClick={() => setFullscreenOpen(true)}
              className="text-on-surface-variant hover:text-white transition"
              title="Fullscreen"
            >
              <Maximize2 size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Floating Queue Drawer */}
      <AnimatePresence>
        {queueOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-28 right-6 z-50 w-80 h-96 rounded-2xl glass-dark p-4 shadow-2xl overflow-y-auto no-scrollbar flex flex-col gap-3"
          >
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <h4 className="font-title-lg text-sm flex items-center gap-2">
                <ListMusic size={16} className="text-secondary" />
                Play Queue ({queue.length})
              </h4>
              <button onClick={() => setQueueOpen(false)} className="text-xs text-on-surface-variant hover:text-white">
                Close
              </button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2 no-scrollbar">
              {queue.map((song, i) => {
                const isCurrent = i === currentQueueIndex;
                return (
                  <div
                    key={song._id + i}
                    className={`flex items-center gap-3 p-2 rounded-xl transition ${
                      isCurrent ? 'bg-primary/20 border border-primary/30' : 'hover:bg-white/5'
                    }`}
                  >
                    <img src={song.coverUrl} className="w-9 h-9 rounded-md object-cover" alt="" />
                    <div className="flex-1 overflow-hidden">
                      <p className={`text-xs font-bold truncate ${isCurrent ? 'text-primary' : 'text-on-surface'}`}>
                        {song.title}
                      </p>
                      <p className="text-[10px] text-on-surface-variant truncate">{song.artistName}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Lyrics Overlay Drawer */}
      <AnimatePresence>
        {lyricsOpen && !fullscreenOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-20 right-0 bottom-24 w-96 max-sm:w-full z-40 bg-surface-container/95 border-l border-white/10 backdrop-blur-3xl shadow-2xl p-6 flex flex-col"
          >
            <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-4">
              <h4 className="font-title-lg text-md flex items-center gap-2">
                <BookOpen size={18} className="text-primary" />
                Lyrics
              </h4>
              <button onClick={() => setLyricsOpen(false)} className="text-xs text-on-surface-variant hover:text-white">
                Close
              </button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 font-poppins text-lg leading-relaxed text-on-surface-variant font-semibold select-none no-scrollbar">
              {currentSong.lyrics ? (
                currentSong.lyrics.split('\n').map((line, idx) => (
                  <p key={idx} className="hover:text-white transition duration-300">
                    {line}
                  </p>
                ))
              ) : (
                <p className="text-sm italic text-center pt-20">Lyrics not available for this song.</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Immersive Full Screen Player Overlay */}
      <AnimatePresence>
        {fullscreenOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-3xl flex flex-col p-8 overflow-y-auto"
          >
            {/* Top Bar */}
            <div className="flex justify-between items-center max-w-6xl mx-auto w-full mb-8">
              <button
                onClick={() => setFullscreenOpen(false)}
                className="flex items-center gap-2 text-on-surface-variant hover:text-white transition"
              >
                <ChevronDown size={28} />
                <span className="text-sm font-semibold max-sm:hidden">Minimize</span>
              </button>
              <div className="text-center">
                <p className="text-xs uppercase tracking-widest text-on-surface-variant">Now Playing</p>
                <p className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                  VibeVault Session
                </p>
              </div>
              <button className="text-on-surface-variant hover:text-tertiary transition">
                <Heart size={24} />
              </button>
            </div>

            {/* Main Immersive Layout */}
            <div className="max-w-6xl mx-auto w-full flex-1 grid grid-cols-2 max-md:grid-cols-1 gap-12 items-center justify-center my-auto">
              {/* Spinning Disc Cover */}
              <div className="flex flex-col items-center justify-center text-center gap-6">
                <div className="relative w-80 h-80 max-sm:w-60 max-sm:h-60 rounded-full border-4 border-white/10 overflow-hidden shadow-2xl glow-purple p-1 flex-none bg-surface-container-high/40">
                  <img
                    src={currentSong.coverUrl}
                    className={`w-full h-full rounded-full object-cover ${isPlaying ? 'animate-[spin_20s_linear_infinite]' : ''}`}
                    alt=""
                  />
                  <div className="absolute inset-0 bg-black/20 rounded-full" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-background border border-white/10 flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-secondary" />
                  </div>
                </div>

                <div className="space-y-2 mt-4">
                  <h2 className="font-display-lg text-3xl max-sm:text-2xl font-bold text-on-surface">
                    {currentSong.title}
                  </h2>
                  <p className="font-title-lg text-lg text-secondary">{currentSong.artistName}</p>
                  {currentSong.albumTitle && (
                    <p className="text-sm text-on-surface-variant/75">Album: {currentSong.albumTitle}</p>
                  )}
                </div>
              </div>

              {/* Scrolling Lyrics or Play Queue */}
              <div className="h-96 rounded-2xl glass p-6 overflow-hidden flex flex-col bg-white/5 border border-white/10 backdrop-blur-lg">
                <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-4">
                  <span className="font-title-lg text-md font-bold text-primary">Lyrics / Track Details</span>
                  <span className="text-xs text-on-surface-variant font-mono">Synced</span>
                </div>
                <div className="flex-1 overflow-y-auto space-y-4 text-center pr-2 font-poppins text-xl leading-relaxed text-on-surface-variant font-semibold select-none no-scrollbar">
                  {currentSong.lyrics ? (
                    currentSong.lyrics.split('\n').map((line, idx) => (
                      <p key={idx} className="hover:text-white transition duration-300">
                        {line}
                      </p>
                    ))
                  ) : (
                    <p className="text-sm italic text-center pt-20">Lyrics not available for this song.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Immersive Playback Controls */}
            <div className="max-w-4xl mx-auto w-full mt-8 border-t border-white/5 pt-8">
              {/* Progress Slider */}
              <div className="flex items-center gap-4 text-xs font-mono text-on-surface-variant mb-4">
                <span>{formatTime(progress)}</span>
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  value={progress}
                  onChange={handleSeekChange}
                  className="flex-1 h-1 bg-white/10 rounded-full appearance-none outline-none cursor-pointer accent-secondary"
                  style={{
                    background: `linear-gradient(to right, #06B6D4 0%, #EC4899 ${(progress / (duration || 1)) * 100}%, rgba(255, 255, 255, 0.1) ${(progress / (duration || 1)) * 100}%)`,
                  }}
                />
                <span>{formatTime(duration)}</span>
              </div>

              {/* Controls Deck */}
              <div className="flex items-center justify-between">
                <button
                  onClick={toggleShuffle}
                  className={`text-on-surface-variant hover:text-secondary transition ${shuffle ? 'text-secondary drop-shadow-[0_0_8px_#06B6D4]' : ''}`}
                >
                  <Shuffle size={24} />
                </button>
                <div className="flex items-center gap-8">
                  <button onClick={previous} className="text-on-surface hover:text-primary transition active:scale-90">
                    <SkipBack size={32} />
                  </button>
                  <button
                    onClick={togglePlay}
                    className="w-16 h-16 rounded-full bg-secondary text-on-secondary flex items-center justify-center shadow-lg shadow-secondary/20 hover:scale-105 active:scale-95 transition"
                  >
                    {isPlaying ? <Pause size={32} /> : <Play size={32} className="ml-1.5" />}
                  </button>
                  <button onClick={next} className="text-on-surface hover:text-primary transition active:scale-90">
                    <SkipForward size={32} />
                  </button>
                </div>
                <button
                  onClick={toggleRepeat}
                  className={`text-on-surface-variant hover:text-tertiary transition ${repeatMode !== 'off' ? 'text-tertiary drop-shadow-[0_0_8px_#EC4899]' : ''}`}
                >
                  {repeatMode === 'one' ? <Repeat1 size={24} /> : <Repeat size={24} />}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
