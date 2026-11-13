import React, { useState, useEffect, useRef } from 'react';

/**
 * AnimatedCharacter Component
 * 
 * High-Fidelity 100-Frame Hero Character Animation Engine:
 * - Built from the authentic 50-frame animation sequence in '100 frame hero char png.zip'.
 * - Background cleanly removed with sub-pixel edge defringing and alpha feathering.
 * - 98-step continuous harmonic ping-pong cycle (Frame 1 -> 50 -> 1) producing an ultra-smooth,
 *   organic breathing, wind hair-flutter, and natural eye-blinking idle loop.
 * - High-performance requestAnimationFrame playback at 24 FPS with zero DOM thrashing.
 * - Perfectly placed in the master 1451x821 viewBox (X: 170px, Y: 199px, W: 715px, H: 622px)
 *   firmly anchored to the bottom ground edge (y = 821px) in front of the wheel & building.
 */

const TOTAL_FRAMES = 50;
const CYCLE_LENGTH = 2 * (TOTAL_FRAMES - 1); // 98 steps for seamless ping-pong loop

// Generate array of 50 frame paths from public assets
const FRAME_PATHS = Array.from({ length: TOTAL_FRAMES }, (_, i) => 
  `/assets/character_100/frame_${String(i + 1).padStart(2, '0')}.webp`
);

export default function AnimatedCharacter() {
  const imageRef = useRef(null);
  const [isPreloaded, setIsPreloaded] = useState(false);
  const [currentFrameUrl, setCurrentFrameUrl] = useState(FRAME_PATHS[0]);

  // 1. Asynchronous In-Memory Preloader for all 50 frames
  useEffect(() => {
    let loadedCount = 0;
    const imgCache = [];

    FRAME_PATHS.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loadedCount++;
        if (loadedCount >= TOTAL_FRAMES) {
          setIsPreloaded(true);
        }
      };
      imgCache.push(img);
    });

    return () => {
      imgCache.length = 0;
    };
  }, []);

  // 2. High-Performance requestAnimationFrame Ping-Pong Animation Engine (24 FPS)
  useEffect(() => {
    let animId;
    let lastTimestamp = performance.now();
    let step = 0;
    const targetFps = 24;
    const frameInterval = 1000 / targetFps; // ~41.67ms per frame

    const animateLoop = (now) => {
      animId = requestAnimationFrame(animateLoop);
      const elapsed = now - lastTimestamp;

      if (elapsed >= frameInterval) {
        lastTimestamp = now - (elapsed % frameInterval);

        // Advance harmonic ping-pong cycle: 0 -> 49 -> 0
        step = (step + 1) % CYCLE_LENGTH;
        const frameIdx = step < TOTAL_FRAMES ? step : CYCLE_LENGTH - step;
        const nextUrl = FRAME_PATHS[frameIdx];

        // Direct DOM update via ref for zero-latency, zero-render performance
        if (imageRef.current) {
          imageRef.current.setAttribute('href', nextUrl);
        }
      }
    };

    animId = requestAnimationFrame(animateLoop);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="relative w-full h-full max-w-[1920px] mx-auto select-none pointer-events-none overflow-hidden flex items-center justify-start">
      
      {/* Dynamic Keyframes for Organic Macro Breathing Float */}
      <style>{`
        @keyframes characterGentleBreathe {
          0% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-3.5px) scale(1.001);
          }
          100% {
            transform: translateY(0px) scale(1);
          }
        }

        .character-breathe-container {
          transform-origin: 520px 821px;
          animation: characterGentleBreathe 4.8s ease-in-out infinite;
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
            <feDropShadow dx="-3" dy="8" stdDeviation="12" floodColor="#0E1F21" floodOpacity="0.18" />
          </filter>
        </defs>

        {/* Breathing Animated Character Container */}
        <g
          id="animated-character-container"
          className="character-breathe-container"
          filter="url(#characterShadow)"
        >
          {/* Active Frame rendered in master viewBox coordinate space */}
          <image
            ref={imageRef}
            href={currentFrameUrl}
            xlinkHref={currentFrameUrl}
            x="170"
            y="199"
            width="715"
            height="622"
            preserveAspectRatio="none"
            className="pointer-events-none select-none"
          />
        </g>
      </svg>
    </div>
  );
}
