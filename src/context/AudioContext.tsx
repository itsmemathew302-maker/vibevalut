'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

export interface ISongData {
  _id: string;
  title: string;
  artistName: string;
  genres: string[];
  artistId: string;
  coverUrl: string;
  audioUrl: string;
  duration: number;
  lyrics?: string;
  albumTitle?: string;
  albumId?: string;
}

interface AudioContextType {
  currentSong: ISongData | null;
  isPlaying: boolean;
  queue: ISongData[];
  currentQueueIndex: number;
  progress: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  shuffle: boolean;
  repeatMode: 'off' | 'all' | 'one';
  lyricsOpen: boolean;
  fullscreenOpen: boolean;
  playSong: (song: ISongData, newQueue?: ISongData[]) => void;
  togglePlay: () => void;
  next: () => void;
  previous: () => void;
  seek: (time: number) => void;
  changeVolume: (v: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  addToQueue: (song: ISongData) => void;
  removeFromQueue: (songId: string) => void;
  clearQueue: () => void;
  setLyricsOpen: (open: boolean) => void;
  setFullscreenOpen: (open: boolean) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [currentSong, setCurrentSong] = useState<ISongData | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [queue, setQueue] = useState<ISongData[]>([]);
  const [currentQueueIndex, setCurrentQueueIndex] = useState<number>(-1);
  const [progress, setProgress] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0.7);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [shuffle, setShuffle] = useState<boolean>(false);
  const [repeatMode, setRepeatMode] = useState<'off' | 'all' | 'one'>('off');
  const [lyricsOpen, setLyricsOpen] = useState<boolean>(false);
  const [fullscreenOpen, setFullscreenOpen] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize HTMLAudioElement client-side
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    // Sync volume
    audio.volume = volume;

    const handleTimeUpdate = () => {
      setProgress(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleEnded = () => {
      handleSongEnded();
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [queue, currentQueueIndex, repeatMode, shuffle]);

  // Handle source changes
  useEffect(() => {
    if (!audioRef.current || !currentSong) return;

    const isSameSource = audioRef.current.src === currentSong.audioUrl;
    if (!isSameSource) {
      audioRef.current.src = currentSong.audioUrl;
      audioRef.current.load();
      setProgress(0);
    }

    if (isPlaying) {
      audioRef.current.play().catch((err) => console.log('Audio playback prevented:', err));
    }
  }, [currentSong]);

  // Handle play/pause changes
  useEffect(() => {
    if (!audioRef.current || !currentSong) return;
    if (isPlaying) {
      audioRef.current.play().catch(() => { });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  const handleSongEnded = () => {
    if (repeatMode === 'one') {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => { });
      }
    } else {
      next();
    }
  };

  const playSong = (song: ISongData, newQueue?: ISongData[]) => {
    if (newQueue) {
      setQueue(newQueue);
      const index = newQueue.findIndex((s) => s._id === song._id);
      setCurrentQueueIndex(index >= 0 ? index : 0);
    } else {
      // If song not in queue, insert it
      const index = queue.findIndex((s) => s._id === song._id);
      if (index >= 0) {
        setCurrentQueueIndex(index);
      } else {
        const newQ = [...queue, song];
        setQueue(newQ);
        setCurrentQueueIndex(newQ.length - 1);
      }
    }
    setCurrentSong(song);
    setIsPlaying(true);

    // Save recently played to database if logged in
    fetch('/api/songs/history', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ songId: song._id }),
    }).catch(() => { });
  };

  const togglePlay = () => {
    if (!currentSong && queue.length > 0) {
      playSong(queue[0]);
    } else {
      setIsPlaying((prev) => !prev);
    }
  };

  const next = () => {
    if (queue.length === 0) return;

    let nextIndex = currentQueueIndex + 1;

    if (shuffle) {
      nextIndex = Math.floor(Math.random() * queue.length);
    } else if (nextIndex >= queue.length) {
      if (repeatMode === 'all') {
        nextIndex = 0;
      } else {
        setIsPlaying(false);
        return;
      }
    }

    setCurrentQueueIndex(nextIndex);
    setCurrentSong(queue[nextIndex]);
    setIsPlaying(true);
  };

  const previous = () => {
    if (queue.length === 0) return;

    let prevIndex = currentQueueIndex - 1;

    if (progress > 3) {
      // Restart current song
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        setProgress(0);
      }
      return;
    }

    if (prevIndex < 0) {
      if (repeatMode === 'all') {
        prevIndex = queue.length - 1;
      } else {
        prevIndex = 0;
      }
    }

    setCurrentQueueIndex(prevIndex);
    setCurrentSong(queue[prevIndex]);
    setIsPlaying(true);
  };

  const seek = (time: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = time;
    setProgress(time);
  };

  const changeVolume = (v: number) => {
    setVolume(v);
    if (audioRef.current) {
      audioRef.current.volume = v;
    }
    if (v > 0) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    const newMute = !isMuted;
    setIsMuted(newMute);
    audioRef.current.muted = newMute;
  };

  const toggleShuffle = () => {
    setShuffle((prev) => !prev);
  };

  const toggleRepeat = () => {
    setRepeatMode((prev) => {
      if (prev === 'off') return 'all';
      if (prev === 'all') return 'one';
      return 'off';
    });
  };

  const addToQueue = (song: ISongData) => {
    setQueue((prev) => {
      if (prev.some((s) => s._id === song._id)) return prev;
      return [...prev, song];
    });
    if (currentQueueIndex === -1) {
      setCurrentQueueIndex(0);
      setCurrentSong(song);
    }
  };

  const removeFromQueue = (songId: string) => {
    setQueue((prev) => prev.filter((s) => s._id !== songId));
  };

  const clearQueue = () => {
    setQueue([]);
    setCurrentQueueIndex(-1);
    setCurrentSong(null);
    setIsPlaying(false);
  };

  return (
    <AudioContext.Provider
      value={{
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
        playSong,
        togglePlay,
        next,
        previous,
        seek,
        changeVolume,
        toggleMute,
        toggleShuffle,
        toggleRepeat,
        addToQueue,
        removeFromQueue,
        clearQueue,
        setLyricsOpen,
        setFullscreenOpen,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}
