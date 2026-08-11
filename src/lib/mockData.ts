import { ISongData } from '@/context/AudioContext';

export interface IMockPlaylist {
  _id: string;
  name: string;
  description: string;
  coverUrl: string;
  userName: string;
  songsCount: number;
}

export interface IMockArtist {
  _id: string;
  name: string;
  bio: string;
  imageUrl: string;
  followersCount: number;
  genres: string[];
}

export interface IMockAlbum {
  _id: string;
  title: string;
  artistName: string;
  coverUrl: string;
  songsCount: number;
  releaseYear: number;
}

export const MOCK_SONGS: ISongData[] = [
  {
    _id: 'mock_song_1',
    title: 'Neon Dreams',
    artistName: 'Lumina Synth',
    genres: ['pop'],
    artistId: 'mock_artist_1',
    coverUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    duration: 372,
    albumTitle: 'Synthwave Sessions',
    albumId: 'mock_album_1',
    lyrics: `[00:15.00] Floating in the neon light
[00:22.00] Driving through the endless night
[00:30.00] Synthwave frequencies in my head
[00:37.00] Words we left completely unsaid
[00:45.00] Oh, neon dreams call my name
[00:52.00] Driving fast, playing the game
[01:00.00] Oh, neon dreams feel so real
[01:07.00] Tell me what it is you feel`
  },
  {
    _id: 'mock_song_2',
    title: 'Midnight Pulse',
    artistName: 'Pulse Master',
    artistId: 'mock_artist_2',
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    duration: 423,
    albumTitle: 'Cyberpunk Odyssey',
    albumId: 'mock_album_2',
    lyrics: `[00:12.00] Midnight pulse, beating slow
[00:20.00] City streets, neon glow
[00:28.00] Digital ghosts in the machine
[00:36.00] The coldest wire you've ever seen
[00:44.00] Pulse is rising, feel the bass
[00:52.00] Moving through this cyber space`,
    genres: ["Synthwave", "Electronic"],
  },
  {
    _id: 'mock_song_3',
    title: 'Ethereal Echo',
    artistName: 'Cosmic Void',
    artistId: 'mock_artist_3',
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    duration: 302,
    albumTitle: 'Deep Cosmos',
    albumId: 'mock_album_3',
    lyrics: `[00:20.00] Echoes of the stellar wind
[00:28.00] Where the cosmic dreams begin
[00:36.00] Deep in space, silent and cold
[00:44.00] Stories that are left untold
[00:52.00] Listen to the solar flare
[01:00.00] Echoes floating in the air`,

    genres: ["Synthwave", "Electronic"],
  },
  {
    _id: 'mock_song_4',
    title: 'Synth Resonance',
    artistName: 'Future Retro',
    artistId: 'mock_artist_4',
    coverUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    duration: 345,
    albumTitle: 'Resonant Frequencies',
    albumId: 'mock_album_4',
    lyrics: `[00:10.00] Retro vibes in modern times
[00:18.00] Listening to harmonic chimes
[00:26.00] Oscillator starts to sweep
[00:34.00] Promises we have to keep
[00:42.00] Resonating with the soul
[00:50.00] Analogue beats take control`,
    genres: ["Synthwave", "Electronic"],
  },
];

export const MOCK_PLAYLISTS: IMockPlaylist[] = [
  {
    _id: 'mock_playlist_1',
    name: 'Night Drive',
    description: 'Immersive electronic tracks for driving in the dark.',
    coverUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17',
    userName: 'VibeVault Editor',
    songsCount: 12
  },
  {
    _id: 'mock_playlist_2',
    name: 'Chill Vibes',
    description: 'Lo-fi chill beats to relax, study, or unwind.',
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819',
    userName: 'VibeVault Editor',
    songsCount: 18
  },
  {
    _id: 'mock_playlist_3',
    name: 'Summer Euphoria',
    description: 'Bright up-tempo tracks to celebrate sunny days.',
    coverUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad',
    userName: 'User Curator',
    songsCount: 22
  }
];

export const MOCK_ARTISTS: IMockArtist[] = [
  {
    _id: 'mock_artist_1',
    name: 'Lumina Synth',
    bio: 'Pioneers of electronic vaporwave aesthetics, blending vintage drum loops with spacey modular synths.',
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4',
    followersCount: 145020,
    genres: ['Electronic', 'Vaporwave', 'Pop']
  },
  {
    _id: 'mock_artist_2',
    name: 'Pulse Master',
    bio: 'Industrial techno and synthwave DJ driving the cybernetic dance floors since 2018.',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819',
    followersCount: 89310,
    genres: ['Electronic', 'Techno', 'Rock']
  },
  {
    _id: 'mock_artist_3',
    name: 'Cosmic Void',
    bio: 'Ambient soundscape composer creating orchestral cosmic echoes and acoustic space layers.',
    imageUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad',
    followersCount: 52100,
    genres: ['Ambient', 'Classical', 'Hip-Hop']
  }
];

export const MOCK_ALBUMS: IMockAlbum[] = [
  {
    _id: 'mock_album_1',
    title: 'Synthwave Sessions',
    artistName: 'Lumina Synth',
    coverUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17',
    songsCount: 10,
    releaseYear: 2024
  },
  {
    _id: 'mock_album_2',
    title: 'Cyberpunk Odyssey',
    artistName: 'Pulse Master',
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819',
    songsCount: 8,
    releaseYear: 2023
  }
];

export const GENRES = ['Pop', 'Rock', 'Hip-Hop', 'Jazz', 'Electronic', 'Lofi', 'Ambient', 'Techno'];
export const MOODS = ['Happy', 'Chill', 'Energy', 'Moody'];
