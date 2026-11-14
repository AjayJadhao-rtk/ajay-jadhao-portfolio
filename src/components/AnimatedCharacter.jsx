import React, { useState, useEffect, useRef } from 'react';
import { useIsMobile } from '../hooks/useIsMobile';

/**
 * AnimatedCharacter Component
 * 
 * Ultra-Smooth 60 FPS Cinematic Hero Character Animation Engine:
 * - 100-frame high-resolution sequence from 'Final hero.zip'
 * - Background cleanly removed with edge defringing & alpha feathering.
 * - Gentle, slowed-down cinematic pace (targetPaceFps = 14 keyframes/sec)
 *   producing a calm, meditative 14-second deep breathing & natural blinking cycle.
 * - HTML5 Canvas rendering pipeline with hardware GPU acceleration.
 * - Sub-frame temporal interpolation: continuously blends between consecutive frames
 *   (dual-frame alpha cross-dissolve) at native display refresh rate (60Hz / 120Hz / 144Hz)
 *   completely eliminating discrete frame-stepping and stutter.
 * - Master 1451x821 viewBox coordinate placement (X: 240px, Y: 199px, W: 596px, H: 622px)
 *   anchored firmly to the bottom ground edge (y = 821px).
 */

const TOTAL_FRAMES = 100;
const CYCLE_LENGTH = 2 * (TOTAL_FRAMES - 1); // 198 steps for seamless ping-pong loop

// 100 WebP frame paths from character_final
const FRAME_PATHS = Array.from({ length: TOTAL_FRAMES }, (_, i) => 
  `/assets/character_final/frame_${String(i + 1).padStart(3, '0')}.webp`
);

export default function AnimatedCharacter() {
  const canvasRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

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
    // 14 keyframe steps/sec = ~7.1s forward + ~7.1s reverse = 14.2s natural breathing cycle
    const targetPaceFps = 14;
    const stepDurationMs = 1000 / targetPaceFps;
    const startTime = performance.now();

    const render = (now) => {
      animId = requestAnimationFrame(render);

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d', { alpha: true });
      if (!ctx) return;

      // Calculate continuous floating-point progress through the 198-step cycle
      const elapsed = now - startTime;
      const rawProgress = (elapsed / stepDurationMs) % CYCLE_LENGTH;
      const stepA = Math.floor(rawProgress);
      const stepB = (stepA + 1) % CYCLE_LENGTH;
      const blendFraction = rawProgress - stepA; // 0.0 to 1.0 smooth sub-frame interpolation

      // Map ping-pong steps: 0..99..0
      const idxA = stepA < TOTAL_FRAMES ? stepA : CYCLE_LENGTH - stepA;
      const idxB = stepB < TOTAL_FRAMES ? stepB : CYCLE_LENGTH - stepB;

      const imgA = loadedImages[idxA];
      const imgB = loadedImages[idxB];

      if (!imgA) return;

      const w = canvas.width;
      const h = canvas.height;

      // Clear previous canvas buffer
      ctx.clearRect(0, 0, w, h);

      // Render base frame A with 100% opacity
      ctx.globalAlpha = 1.0;
      ctx.drawImage(imgA, 0, 0, w, h);

      // Sub-frame temporal interpolation: blend next frame B on top for liquid-smooth 60 FPS fluidity
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

  return (
    <div className="relative w-full h-full max-w-[1920px] mx-auto select-none pointer-events-none overflow-hidden flex items-center justify-start">
      
      {/* SVG Viewport matching 1451x821 master coordinate system (Responsive for mobile grounding) */}
      <svg
        viewBox={isMobile ? "80 0 880 821" : "0 0 1451 821"}
        preserveAspectRatio={isMobile ? "xMidYMax meet" : "xMinYMid meet"}
        className="w-full h-full overflow-visible pointer-events-none"
      >
        {/* Render HTML5 Canvas inside SVG foreignObject for mathematical lockstep scaling */}
        <foreignObject
          x={isMobile ? "180" : "240"}
          y={isMobile ? "270" : "199"}
          width={isMobile ? "540" : "596"}
          height={isMobile ? "551" : "622"}
          className="overflow-visible pointer-events-none"
        >
          <div className="w-full h-full relative pointer-events-none">
            {/* Instant Initial Paint Poster (Frame 1) while canvas initializes */}
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
