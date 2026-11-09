import React, { useEffect, useRef, useState, useCallback } from 'react';

const TOTAL_FRAMES = 299;
const TARGET_FPS = 30; // 30 FPS = ~10s per cycle
const FRAME_DURATION = 1000 / TARGET_FPS;

/**
 * FullscreenLivingCanvas renders the 299-frame high-resolution anime sequence
 * as the seamless edge-to-edge panoramic background of the entire portfolio.
 * 
 * It automatically handles:
 * - Full viewport cover scaling with focal point alignment
 * - High-DPI retina rendering
 * - Non-blocking Image.decode() caching
 * - Delta-time RAF clock for locked 30 FPS
 * - Ping-pong seamless loop (natural eye open -> gaze -> smile -> close -> reopen)
 * - Interactive mouse parallax shift
 */
export default function FullscreenLivingCanvas({ children, onFrameUpdate }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  // Animation state refs
  const framesCacheRef = useRef(new Map());
  const currentFrameRef = useRef(1);
  const directionRef = useRef(1); // 1 = forward, -1 = reverse (ping-pong)
  const isPlayingRef = useRef(true);
  const lastTimeRef = useRef(0);
  const accumulatorRef = useRef(0);
  const animationIdRef = useRef(null);

  // Mouse parallax state
  const [mouseShift, setMouseShift] = useState({ x: 0, y: 0 });

  // Get frame image URL by index (1 to 299)
  const getFrameUrl = useCallback((index) => {
    const padded = String(index).padStart(3, '0');
    return `/assets/character-frames/ezgif-frame-${padded}.jpg`;
  }, []);

  // Preload a single frame using Image.decode() off the main thread
  const preloadFrame = useCallback((index) => {
    return new Promise((resolve) => {
      if (framesCacheRef.current.has(index)) {
        resolve(framesCacheRef.current.get(index));
        return;
      }
      const img = new Image();
      img.src = getFrameUrl(index);
      if ('decode' in img) {
        img
          .decode()
          .then(() => {
            framesCacheRef.current.set(index, img);
            resolve(img);
          })
          .catch(() => {
            framesCacheRef.current.set(index, img);
            resolve(img);
          });
      } else {
        img.onload = () => {
          framesCacheRef.current.set(index, img);
          resolve(img);
        };
        img.onerror = () => resolve(null);
      }
    });
  }, [getFrameUrl]);

  // Draw frame to canvas using "cover" math aligned to character focal point
  const drawFrame = useCallback((img) => {
    const canvas = canvasRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth || 1920;
    const ih = img.naturalHeight || 1080;

    // Calculate aspect ratio cover
    const canvasRatio = cw / ch;
    const imgRatio = iw / ih;

    let drawW, drawH, drawX, drawY;

    if (canvasRatio > imgRatio) {
      // Screen is wider than 16:9 (ultrawide)
      drawW = cw;
      drawH = cw / imgRatio;
      drawX = 0;
      // Anchor slightly to bottom to keep character visible
      drawY = ch - drawH;
    } else {
      // Screen is narrower (standard 16:9, laptop, tablet, mobile)
      drawH = ch;
      drawW = ch * imgRatio;
      // Focus on character: character center is at ~45% of width (x=830)
      const focalPercent = 0.45;
      drawX = cw * 0.45 - drawW * focalPercent;

      // Clamp so we never show empty space
      if (drawX > 0) drawX = 0;
      if (drawX + drawW < cw) drawX = cw - drawW;

      drawY = 0;
    }

    ctx.drawImage(img, drawX, drawY, drawW, drawH);
  }, []);

  // Resize canvas according to display DPI
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);

    const currentImg = framesCacheRef.current.get(currentFrameRef.current) || framesCacheRef.current.get(1);
    if (currentImg) {
      drawFrame(currentImg);
    }
  }, [drawFrame]);

  // Handle window resize
  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  // Preload initial frames and start stream
  useEffect(() => {
    let isCancelled = false;

    // 1. Immediately paint frame 1
    preloadFrame(1).then((img) => {
      if (!isCancelled && img) {
        handleResize();
        drawFrame(img);
      }
    });

    // 2. Stream load remaining frames in chunks
    const preloadAll = async () => {
      // Initial priority buffer
      for (let i = 2; i <= 40; i++) {
        if (isCancelled) return;
        await preloadFrame(i);
      }
      // Progressive streaming
      for (let i = 41; i <= TOTAL_FRAMES; i++) {
        if (isCancelled) return;
        await preloadFrame(i);
      }
    };

    preloadAll();

    return () => {
      isCancelled = true;
    };
  }, [preloadFrame, drawFrame, handleResize]);

  // Animation RAF loop
  useEffect(() => {
    const loop = (timestamp) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const elapsed = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      if (isPlayingRef.current) {
        accumulatorRef.current += elapsed;

        while (accumulatorRef.current >= FRAME_DURATION) {
          accumulatorRef.current -= FRAME_DURATION;

          // Ping-pong loop
          let nextFrame = currentFrameRef.current + directionRef.current;
          if (nextFrame >= TOTAL_FRAMES) {
            nextFrame = TOTAL_FRAMES;
            directionRef.current = -1; // Smoothly reverse (eyes open naturally)
          } else if (nextFrame <= 1) {
            nextFrame = 1;
            directionRef.current = 1; // Play forward
          }

          currentFrameRef.current = nextFrame;
        }

        const img = framesCacheRef.current.get(currentFrameRef.current);
        if (img) {
          drawFrame(img);
        } else {
          const fallback = framesCacheRef.current.get(1);
          if (fallback) drawFrame(fallback);
        }

        if (onFrameUpdate && currentFrameRef.current % 10 === 0) {
          onFrameUpdate(currentFrameRef.current);
        }
      }

      animationIdRef.current = requestAnimationFrame(loop);
    };

    animationIdRef.current = requestAnimationFrame(loop);

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [drawFrame, onFrameUpdate]);

  // Mouse Parallax reaction
  useEffect(() => {
    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const xNorm = (e.clientX / innerWidth - 0.5) * 2;
      const yNorm = (e.clientY / innerHeight - 0.5) * 2;
      setMouseShift({
        x: xNorm * 12,
        y: yNorm * 8,
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden select-none pointer-events-none z-0"
    >
      {/* High-Performance Living Canvas with 3D Parallax */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full transition-transform duration-300 ease-out"
        style={{
          transform: `scale(1.03) translate3d(${mouseShift.x}px, ${mouseShift.y}px, 0)`,
          willChange: 'transform',
        }}
      />

      {/* Subtle Warm Sunset Ambient Vignette */}
      <div className="absolute inset-0 bg-radial-vignette pointer-events-none opacity-40 mix-blend-multiply" />

      {/* Children overlay (gears, particles, divergence meter, etc.) */}
      {children}
    </div>
  );
}
