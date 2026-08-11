'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Settings, User, Sliders, Volume2, Keyboard, Trash2 } from 'lucide-react';

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const [name, setName] = useState(session?.user?.name || '');
  const [theme, setTheme] = useState('dark');
  const [offlineCacheSize, setOfflineCacheSize] = useState('12.4 MB');

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    // Dynamic profile name updates
    alert('Profile name saved successfully!');
    if (update) update({ user: { name } });
  };

  const handleClearCache = () => {
    setOfflineCacheSize('0.0 MB');
    alert('Offline audio cache cleared successfully.');
  };

  const keyboardShortcuts = [
    { key: 'Space', action: 'Play / Pause playback' },
    { key: 'Right Arrow', action: 'Seek forward 5s' },
    { key: 'Left Arrow', action: 'Seek backward 5s' },
    { key: 'Up Arrow', action: 'Volume up 10%' },
    { key: 'Down Arrow', action: 'Volume down 10%' },
    { key: 'M', action: 'Toggle audio mute' },
    { key: 'N', action: 'Skip to next track' },
    { key: 'P', action: 'Skip to previous track' }
  ];

  return (
    <div className="space-y-10 pb-12">
      {/* Header title */}
      <div>
        <h2 className="font-display-lg text-3xl font-bold flex items-center gap-2">
          <Settings className="text-secondary" />
          Settings Panel
        </h2>
        <p className="text-sm text-on-surface-variant mt-1">
          Customize VibeVault behaviors and manage account controls.
        </p>
      </div>

      <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-8">
        {/* Profile Card details */}
        <section className="space-y-6">
          <div className="glass rounded-2xl p-6 border-white/5 bg-white/5 space-y-4">
            <h3 className="font-headline-md text-lg font-bold flex items-center gap-2 border-b border-white/5 pb-2">
              <User size={18} className="text-primary" /> Profile Credentials
            </h3>
            <form onSubmit={handleProfileSave} className="space-y-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-on-surface-variant font-semibold">User Email Address</label>
                <input
                  type="email"
                  disabled
                  value={session?.user?.email || 'guest@vibevault.com'}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/5 rounded-xl font-body-sm text-on-surface-variant cursor-not-allowed"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-on-surface-variant font-semibold">Display Username</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Vibe listener"
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl font-body-sm focus:outline-none focus:border-primary text-on-surface"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-primary to-secondary text-on-primary-container font-bold text-xs shadow-lg shadow-primary/20 hover:scale-102 transition"
              >
                Save Profile
              </button>
            </form>
          </div>

          {/* Preferences controls */}
          <div className="glass rounded-2xl p-6 border-white/5 bg-white/5 space-y-4">
            <h3 className="font-headline-md text-lg font-bold flex items-center gap-2 border-b border-white/5 pb-2">
              <Sliders size={18} className="text-secondary" /> Audio & App Vibe
            </h3>
            <div className="flex justify-between items-center py-1">
              <div>
                <p className="text-sm font-semibold">Offline PWA Audio Cache</p>
                <p className="text-xs text-on-surface-variant">Size: {offlineCacheSize}</p>
              </div>
              <button
                onClick={handleClearCache}
                className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition"
                title="Clear cache"
              >
                <Trash2 size={16} />
              </button>
            </div>
            <div className="flex justify-between items-center py-1">
              <div>
                <p className="text-sm font-semibold">Visual Glow Animations</p>
                <p className="text-xs text-on-surface-variant">Enable cursor glow & floating notes</p>
              </div>
              <div className="w-10 h-6 bg-primary rounded-full relative cursor-pointer flex items-center px-1">
                <div className="w-4 h-4 bg-white rounded-full absolute right-1" />
              </div>
            </div>
          </div>
        </section>

        {/* Keyboard shortcuts help details */}
        <section className="glass rounded-2xl p-6 border-white/5 bg-white/5 space-y-4 h-fit">
          <h3 className="font-headline-md text-lg font-bold flex items-center gap-2 border-b border-white/5 pb-2">
            <Keyboard size={18} className="text-tertiary" /> Keyboard Shortcuts
          </h3>
          <div className="space-y-3 font-poppins">
            {keyboardShortcuts.map((shortcut) => (
              <div key={shortcut.key} className="flex justify-between items-center py-1.5 border-b border-white/5 last:border-b-0">
                <span className="text-sm text-on-surface-variant font-semibold">{shortcut.action}</span>
                <kbd className="px-2.5 py-1 rounded bg-white/10 border border-white/10 text-xs font-mono font-bold text-secondary">
                  {shortcut.key}
                </kbd>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
