import type { Metadata, Viewport } from 'next';
import './globals.css';
import Providers from '@/components/Providers';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import MusicPlayer from '@/components/MusicPlayer';
import ShaderBackground from '@/components/ShaderBackground';
import FloatingNotes from '@/components/FloatingNotes';
import CursorGlow from '@/components/CursorGlow';

export const metadata: Metadata = {
  title: 'VibeVault - Sonic Experiences',
  description: 'Immerse yourself in a sonic journey tailored to your emotions. High-fidelity audio streaming, curated by vibe.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1.0,
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Loading typography matching visual designs */}
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Poppins:wght@400;600;700&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased selection:bg-secondary selection:text-on-secondary">
        <Providers>
          {/* Glowing cursor visualizer */}
          <CursorGlow />

          {/* WebGL animated waves background */}
          <ShaderBackground />

          {/* Particle music notes */}
          <FloatingNotes />

          {/* Primary View Shell */}
          <div className="relative min-h-screen flex">
            {/* Nav Menu */}
            <Sidebar />

            {/* View container */}
            <div className="flex-1 flex flex-col md:pl-64 min-w-0">
              <Header />
              <main className="flex-grow pt-24 pb-32 px-8 max-md:px-4 max-sm:px-3 relative z-10 overflow-y-auto">
                {children}
              </main>
            </div>

            {/* Player Deck */}
            <MusicPlayer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
