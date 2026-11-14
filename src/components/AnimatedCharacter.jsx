import React, { useState, useEffect, useRef } from 'react';
import { useIsMobile } from '../hooks/useIsMobile';
import { MessageSquare, Sparkles } from 'lucide-react';
import { audioEngine } from '../utils/audioSystem';

/**
 * AnimatedCharacter Component
 * 
 * Ultra-Smooth 60 FPS Cinematic Hero Character Animation Engine
 * with Delightful Micro-Interactivity:
 * - Interactive click & hover dialogue bubble
 * - Dynamic acoustic radar feedback on tap
 * - Sub-frame temporal interpolation across 100 WebP frames
 */

const TOTAL_FRAMES = 100;
const CYCLE_LENGTH = 2 * (TOTAL_FRAMES - 1); // 198 steps for seamless ping-pong loop

// 100 WebP frame paths from character_final
const FRAME_PATHS = Array.from({ length: TOTAL_FRAMES }, (_, i) => 
  `/assets/character_final/frame_${String(i + 1).padStart(3, '0')}.webp`
);

const INTERACTIVE_QUOTES = [
  "Hi! I'm Ajay Jadhao. Welcome to my portfolio! 👋",
  "I build smart hardware, autonomous robots & 3D experiences 🤖",
  "Scroll down to journey through my skills, projects & background 📜",
  "Click '3D World' in the top bar to explore my autonomous rover! 🛰️",
  "\"I have ideas. I build them.\" — Let's create something together! ✨",
];

export default function AnimatedCharacter() {
  const canvasRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [showBubble, setShowBubble] = useState(false);
  const [isBouncing, setIsBouncing] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    let animId;
    const loadedImages = new Array(TOTAL_FRAMES);
    let loadedCount = 0;

    // 1. Asynchronous In-Memory Preloader & GPU Decoder
    FRAME_PATHS.forEach((src, idx) => {
      const img = new Image();
      img.src = src;

      const onDecoded = () => {
        if (isCancelled) return;
        loadedImages[idx] = img;
        loadedCount++;

        // Start playback once initial batch of frames is warm
        if (loadedCount >= Math.min(15, TOTAL_FRAMES) && !isReady) {
          setIsReady(true);
        }
      };

      if ('decode' in img) {
        img.decode().then(onDecoded).catch(() => {
          img.onload = onDecoded;
        });
      } else {
        img.onload = onDecoded;
      }
    });

    // 2. Gentle Slowed-Down 60 FPS Continuous Motion Engine
    const targetPaceFps = 14;
    const stepDurationMs = 1000 / targetPaceFps;
    const startTime = performance.now();

    const render = (now) => {
      animId = requestAnimationFrame(render);

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d', { alpha: true });
      if (!ctx) return;

      const elapsed = now - startTime;
      const rawProgress = (elapsed / stepDurationMs) % CYCLE_LENGTH;
      const stepA = Math.floor(rawProgress);
      const stepB = (stepA + 1) % CYCLE_LENGTH;
      const blendFraction = rawProgress - stepA;

      const idxA = stepA < TOTAL_FRAMES ? stepA : CYCLE_LENGTH - stepA;
      const idxB = stepB < TOTAL_FRAMES ? stepB : CYCLE_LENGTH - stepB;

      const imgA = loadedImages[idxA];
      const imgB = loadedImages[idxB];

      if (!imgA) return;

      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);
      ctx.globalAlpha = 1.0;
      ctx.drawImage(imgA, 0, 0, w, h);

      if (blendFraction > 0.005 && idxA !== idxB && imgB) {
        ctx.globalAlpha = blendFraction;
        ctx.drawImage(imgB, 0, 0, w, h);
      }
    };

    animId = requestAnimationFrame(render);

    return () => {
      isCancelled = true;
      cancelAnimationFrame(animId);
      loadedImages.length = 0;
    };
  }, []);

  const isMobile = useIsMobile(1024);

  const handleCharacterClick = () => {
    try {
      audioEngine.playRadarPing();
    } catch (_) {}

    setIsBouncing(true);
    setTimeout(() => setIsBouncing(false), 240);
    setQuoteIndex((prev) => (prev + 1) % INTERACTIVE_QUOTES.length);
    setShowBubble(true);
  };

  return (
    <div className="relative w-full h-full max-w-[1920px] mx-auto select-none pointer-events-none overflow-hidden flex items-center justify-start">
      
      {/* SVG Viewport matching 1451x821 master coordinate system */}
      <svg
        viewBox={isMobile ? "80 0 880 821" : "0 0 1451 821"}
        preserveAspectRatio={isMobile ? "xMidYMax meet" : "xMinYMid meet"}
        className="w-full h-full overflow-visible pointer-events-none"
      >
        <foreignObject
          x={isMobile ? "180" : "240"}
          y={isMobile ? "270" : "199"}
          width={isMobile ? "540" : "596"}
          height={isMobile ? "551" : "622"}
          className="overflow-visible pointer-events-auto"
        >
          <div 
            onClick={handleCharacterClick}
            onMouseEnter={() => {
              audioEngine.playHover();
              setShowBubble(true);
            }}
            onMouseLeave={() => {
              // Hide speech bubble smoothly after delay
              setTimeout(() => setShowBubble(false), 3000);
            }}
            className={`w-full h-full relative cursor-pointer group transition-transform duration-200 select-none ${
              isBouncing ? 'scale-103 -translate-y-1' : 'hover:scale-[1.01]'
            }`}
            title="Click to talk with Ajay!"
          >
            {/* Interactive Speech / Thought Balloon */}
            <div 
              className={`absolute -top-12 sm:-top-16 left-1/2 -translate-x-1/2 z-40 transition-all duration-300 pointer-events-none ${
                showBubble 
                  ? 'opacity-100 translate-y-0 scale-100' 
                  : 'opacity-0 translate-y-2 scale-95 pointer-events-none'
              }`}
            >
              <div 
                className="relative bg-[#FAF6EE] text-[#0E1F21] border-2 border-[#0E1F21] rounded-2xl px-3.5 py-2.5 shadow-2xl max-w-[240px] sm:max-w-[280px] text-center"
                style={{
                  boxShadow: '0 12px 30px rgba(14, 31, 33, 0.25)',
                }}
              >
                <div className="flex items-center justify-between pb-1 mb-1 border-b border-[#0E1F21]/15 text-[9px] font-mono font-bold tracking-wider text-[#6A8E8B] uppercase">
                  <span className="flex items-center space-x-1">
                    <Sparkles className="w-2.5 h-2.5 text-amber-500 fill-amber-400" />
                    <span>AJAY SAYS:</span>
                  </span>
                  <span className="text-[#89634C]">
                    [{quoteIndex + 1}/{INTERACTIVE_QUOTES.length}]
                  </span>
                </div>
                <p className="font-inter text-[11px] sm:text-xs text-[#0E1F21] font-semibold leading-snug">
                  {INTERACTIVE_QUOTES[quoteIndex]}
                </p>
                <div className="text-[8.5px] font-mono text-[#6B7B7D] mt-1 pt-0.5">
                  tap to change quote
                </div>

                {/* Speech Bubble Arrow pointing down to character head */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-[#0E1F21]" />
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-[#FAF6EE]" />
              </div>
            </div>

            {/* Instant Initial Paint Poster */}
            <img
              src={FRAME_PATHS[0]}
              alt="Hero Character"
              className={`absolute inset-0 w-full h-full object-contain pointer-events-none transition-opacity duration-300 ${
                isReady ? 'opacity-0' : 'opacity-100'
              }`}
              style={{
                filter: 'drop-shadow(-3px 8px 12px rgba(14, 31, 33, 0.18))',
              }}
            />

            {/* 60 FPS Sub-Frame Interpolated Canvas Engine */}
            <canvas
              ref={canvasRef}
              width={690}
              height={720}
              className={`w-full h-full object-contain pointer-events-none transition-opacity duration-300 ${
                isReady ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                filter: 'drop-shadow(-3px 8px 12px rgba(14, 31, 33, 0.18))',
                willChange: 'transform',
              }}
            />
          </div>
        </foreignObject>
      </svg>
    </div>
  );
}
