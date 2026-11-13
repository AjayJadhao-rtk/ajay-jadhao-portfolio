import React, { useState, useEffect, useRef } from 'react';
import frame01 from '../assets/character/frame_01.png';
import frame02 from '../assets/character/frame_02.png';
import frame03 from '../assets/character/frame_03.png';
import frame04 from '../assets/character/frame_04.png';
import frame05 from '../assets/character/frame_05.png';
import frame06 from '../assets/character/frame_06.png';
import frame07 from '../assets/character/frame_07.png';
import frame08 from '../assets/character/frame_08.png';

/**
 * AnimatedCharacter Component
 * 
 * Recreates the anime hero character in the master 1451x821 coordinate system:
 * - Positioned at X: ~210px, Y: ~241px, Width: ~555px, Height: ~580px (anchored to bottom y=821).
 * - Sits in front of the Rotating Wheel (z-20), Cloud Strips (z-10), and Ground Layer (z-[25]).
 * - Animates through the 8 hand-drawn character frames (hair flutter, wind breathing, eye blinking).
 * - Gentle organic breathing float (4.5s ease-in-out infinite alternate) on the compositor thread.
 * - Cross-frame smooth rendering with memory preloading to prevent any visual popping or flicker.
 */

const FRAMES = [frame01, frame02, frame03, frame04, frame05, frame06, frame07, frame08];

export default function AnimatedCharacter() {
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // 1. Preload all 8 character frames in browser memory
  useEffect(() => {
    let loadedCount = 0;
    FRAMES.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === FRAMES.length) {
          setIsLoaded(true);
        }
      };
    });
  }, []);

  // 2. Smooth Frame Sequence Cycling (~125ms per frame = 8 FPS authentic anime cadence)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFrameIndex((prev) => (prev + 1) % FRAMES.length);
    }, 130);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full max-w-[1920px] mx-auto select-none pointer-events-none overflow-hidden flex items-center justify-start">
      
      {/* Dynamic Keyframes for Organic Character Breathing */}
      <style>{`
        @keyframes characterGentleBreathe {
          0% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-4px) scale(1.002);
          }
          100% {
            transform: translateY(0px) scale(1);
          }
        }

        .character-breathe-container {
          transform-origin: 380px 821px;
          animation: characterGentleBreathe 4.6s ease-in-out infinite;
          will-change: transform;
        }
      `}</style>

      {/* SVG Viewport matching 1451x821 master coordinate system */}
      <svg
        viewBox="0 0 1451 821"
        preserveAspectRatio="xMinYMid meet"
        className="w-full h-full overflow-visible pointer-events-none"
      >
        <defs>
          {/* Subtle cinematic ground depth shadow */}
          <filter id="characterShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="-2" dy="8" stdDeviation="10" floodColor="#0E1F21" floodOpacity="0.16" />
          </filter>
        </defs>

        {/* Breathing Animated Character Container */}
        <g
          id="animated-character-container"
          className="character-breathe-container"
          filter="url(#characterShadow)"
        >
          {/* Render all 8 pre-rendered frames stacked; toggle opacity for zero-latency frame flip */}
          {FRAMES.map((src, idx) => (
            <image
              key={idx}
              href={src}
              xlinkHref={src}
              x="210"
              y="241"
              width="555"
              height="580"
              preserveAspectRatio="xMidYMid meet"
              className="pointer-events-none select-none transition-opacity duration-75"
              style={{
                opacity: currentFrameIndex === idx ? 1 : 0,
                visibility: currentFrameIndex === idx ? 'visible' : 'hidden',
              }}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
