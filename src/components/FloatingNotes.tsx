'use client';

import React, { useEffect, useState } from 'react';

interface Note {
  id: number;
  left: number;
  symbol: string;
  size: number;
  duration: number;
}

const NOTE_SYMBOLS = ['🎵', '🎶', '🎼', '🎹', '🎸'];

export default function FloatingNotes() {
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newNote: Note = {
        id: Date.now() + Math.random(),
        left: Math.random() * 100, // percentage
        symbol: NOTE_SYMBOLS[Math.floor(Math.random() * NOTE_SYMBOLS.length)],
        size: Math.random() * 20 + 12, // size in px
        duration: Math.random() * 3 + 4, // seconds
      };

      setNotes((prevNotes) => [...prevNotes, newNote]);

      // Remove the note after it finishes floating
      setTimeout(() => {
        setNotes((prevNotes) => prevNotes.filter((n) => n.id !== newNote.id));
      }, newNote.duration * 1000);
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-1 pointer-events-none overflow-hidden">
      {notes.map((note) => (
        <span
          key={note.id}
          className="absolute text-primary/10 select-none animate-float-note pointer-events-none"
          style={{
            left: `${note.left}%`,
            fontSize: `${note.size}px`,
            animationDuration: `${note.duration}s`,
            bottom: '-50px',
            animationName: 'floatNote',
            animationTimingFunction: 'linear',
          }}
        >
          {note.symbol}
        </span>
      ))}
      <style jsx global>{`
        @keyframes floatNote {
          0% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.4;
          }
          90% {
            opacity: 0.4;
          }
          100% {
            transform: translateY(-100vh) rotate(45deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
