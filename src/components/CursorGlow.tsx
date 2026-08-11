'use client';

import React, { useEffect, useState } from 'react';

export default function CursorGlow() {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCoords({ x: e.clientX, y: e.clientY });
      if (!visible) setVisible(true);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className="cursor-glow-element"
      style={{
        left: `${coords.x}px`,
        top: `${coords.y}px`,
      }}
    />
  );
}
