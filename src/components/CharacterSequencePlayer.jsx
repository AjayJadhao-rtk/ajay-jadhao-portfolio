import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Play, Pause, RefreshCw, Sparkles, Gauge } from 'lucide-react';

const TOTAL_FRAMES = 299;
const TARGET_FPS = 30; // 30 FPS = ~10s per cycle
const FRAME_DURATION = 1000 / TARGET_FPS;

/**
 * CharacterSequencePlayer renders a buttery-smooth 299-frame 1920x1080 animation
 * using HTML5 Canvas, asynchronous Image.decode() caching, delta-time RAF,
 * ping-pong smooth looping, and interactive 3D mouse parallax.
 */
export default function CharacterSequencePlayer() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  // Animation state refs (refs prevent unnecessary React re-renders during 60FPS loop)
  const framesCacheRef = useRef(new Map());
  const currentFrameRef = useRef(1);
  const directionRef = useRef(1); // 1 = forward, -1 = reverse (for ping-pong)
  const isPlayingRef = useRef(true);
  const lastTimeRef = useRef(0);
  const accumulatorRef = useRef(0);
  const animationIdRef = useRef(null);

  // UI state for telemetry badge
  const [currentFrameNum, setCurrentFrameNum] = useState(1);
  const [loadedCount, setLoadedCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1); // 1x, 0.75x, 1.25x
  const [isPingPong, setIsPingPong] = useState(true); // ping-pong creates seamless eye-opening/closing
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

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
            setLoadedCount((c) => Math.max(c, framesCacheRef.current.size));
            resolve(img);
          })
          .catch(() => {
            // Fallback for decode error
            framesCacheRef.current.set(index, img);
            resolve(img);
          });
      } else {
        img.onload = () => {
          framesCacheRef.current.set(index, img);
          setLoadedCount((c) => Math.max(c, framesCacheRef.current.size));
          resolve(img);
        };
        img.onerror = () => resolve(null);
      }
    });
  }, [getFrameUrl]);

  // Draw current frame on canvas
  const drawFrame = useCallback((img) => {
    const canvas = canvasRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Use high quality image smoothing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Clear and draw
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  }, []);

  // Initialize and preload initial batch
  useEffect(() => {
    let isCancelled = false;

    // 1. Immediately load frame 1 for instant first paint
    preloadFrame(1).then((img) => {
      if (!isCancelled && img) {
        drawFrame(img);
      }
    });

    // 2. Stream load remaining frames progressively
    const preloadAll = async () => {
      // Priority batch 1-40
      for (let i = 2; i <= 40; i++) {
        if (isCancelled) return;
        await preloadFrame(i);
      }
      // Remaining frames in chunks of 15
      for (let i = 41; i <= TOTAL_FRAMES; i++) {
        if (isCancelled) return;
        await preloadFrame(i);
      }
    };

    preloadAll();

    return () => {
      isCancelled = true;
    };
  }, [preloadFrame, drawFrame]);

  // Main high-precision animation loop
  useEffect(() => {
    const loop = (timestamp) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const elapsed = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      if (isPlayingRef.current) {
        accumulatorRef.current += elapsed * playbackSpeed;
        const adjustedFrameDuration = FRAME_DURATION;

        while (accumulatorRef.current >= adjustedFrameDuration) {
          accumulatorRef.current -= adjustedFrameDuration;

          let nextFrame = currentFrameRef.current;
          if (isPingPong) {
            nextFrame += directionRef.current;
            if (nextFrame >= TOTAL_FRAMES) {
              nextFrame = TOTAL_FRAMES;
              directionRef.current = -1; // Reverse back smoothly
            } else if (nextFrame <= 1) {
              nextFrame = 1;
              directionRef.current = 1; // Forward again
            }
          } else {
            nextFrame = nextFrame >= TOTAL_FRAMES ? 1 : nextFrame + 1;
          }

          currentFrameRef.current = nextFrame;
        }

        // Fetch frame from cache
        const frameImg = framesCacheRef.current.get(currentFrameRef.current);
        if (frameImg) {
          drawFrame(frameImg);
        } else {
          // If frame not yet cached, fallback to frame 1 or nearest
          const fallback = framesCacheRef.current.get(1);
          if (fallback) drawFrame(fallback);
        }

        // Sync UI badge throttle (update every 6 frames)
        if (currentFrameRef.current % 6 === 0) {
          setCurrentFrameNum(currentFrameRef.current);
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
  }, [drawFrame, isPingPong, playbackSpeed]);

  // Toggle play/pause
  const togglePlay = () => {
    const next = !isPlaying;
    setIsPlaying(next);
    isPlayingRef.current = next;
  };

  // Toggle speed (1x -> 0.75x -> 1.25x)
  const cycleSpeed = () => {
    if (playbackSpeed === 1) setPlaybackSpeed(0.75);
    else if (playbackSpeed === 0.75) setPlaybackSpeed(1.25);
    else setPlaybackSpeed(1);
  };

  // Mouse Parallax reaction
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const { innerWidth, innerHeight } = window;
      const xNorm = (e.clientX / innerWidth - 0.5) * 2; // -1 to 1
      const yNorm = (e.clientY / innerHeight - 0.5) * 2;
      setMouseOffset({
        x: xNorm * 10,
        y: yNorm * 8,
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex flex-col items-center justify-end select-none overflow-hidden"
    >
      {/* 3D PARALLAX WRAPPER */}
      <div
        className="relative w-full max-w-[880px] h-[480px] sm:h-[560px] lg:h-[620px] flex items-end justify-center transition-transform duration-200 ease-out"
        style={{
          transform: `translate3d(${mouseOffset.x}px, ${mouseOffset.y * 0.6}px, 0) perspective(1000px) rotateY(${mouseOffset.x * 0.4}deg) rotateX(${-mouseOffset.y * 0.3}deg)`,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* HTML5 Canvas rendering 1920x1080 Full HD animation */}
        <canvas
          ref={canvasRef}
          width={1920}
          height={1080}
          className="w-full h-full object-contain pointer-events-none drop-shadow-[0_15px_30px_rgba(41,43,39,0.3)] transition-opacity duration-500"
          style={{
            // Radial & bottom edge feathering to seamlessly blend with aged parchment canvas
            maskImage:
              'radial-gradient(ellipse at 50% 55%, rgba(0,0,0,1) 50%, rgba(0,0,0,0.85) 75%, transparent 95%), linear-gradient(to top, transparent 0%, black 15%)',
            WebkitMaskImage:
              'radial-gradient(ellipse at 50% 55%, rgba(0,0,0,1) 50%, rgba(0,0,0,0.85) 75%, transparent 95%), linear-gradient(to top, transparent 0%, black 15%)',
          }}
        />

        {/* Ambient Warm Golden Rim Glow */}
        <div className="absolute inset-0 pointer-events-none mix-blend-color-dodge opacity-25 bg-gradient-to-tr from-transparent via-amber-300/20 to-amber-100/40 blur-2xl" />
      </div>

      {/* TELEMETRY & PLAYBACK CONTROLS BADGE */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-30 flex items-center space-x-2 px-3 py-1.5 rounded-full bg-[#292B27]/85 backdrop-blur-md border border-[#B17B53]/40 shadow-lg text-[9px] font-mono text-[#F4EBDD]">
        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          className="flex items-center justify-center w-5 h-5 rounded-full bg-[#B17B53] text-[#292B27] hover:bg-amber-400 transition-colors cursor-pointer"
          title={isPlaying ? 'Pause Animation' : 'Play Animation'}
        >
          {isPlaying ? <Pause className="w-2.5 h-2.5 fill-current" /> : <Play className="w-2.5 h-2.5 fill-current ml-0.5" />}
        </button>

        {/* Frame & FPS Telemetry */}
        <div className="flex items-center space-x-2 border-l border-white/20 pl-2">
          <span className="text-[#B17B53] font-bold">
            FRM {String(currentFrameNum).padStart(3, '0')} / {TOTAL_FRAMES}
          </span>
          <span className="text-white/40">|</span>
          <span className="text-emerald-400 font-semibold flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
            <span>{Math.round(TARGET_FPS * playbackSpeed)} FPS</span>
          </span>
        </div>

        {/* Speed Selector */}
        <button
          onClick={cycleSpeed}
          className="border-l border-white/20 pl-2 text-[8.5px] hover:text-[#B17B53] transition-colors cursor-pointer"
          title="Toggle Playback Speed (0.75x, 1x, 1.25x)"
        >
          {playbackSpeed}x
        </button>

        {/* Ping-Pong Mode Indicator */}
        <button
          onClick={() => setIsPingPong(!isPingPong)}
          className={`border-l border-white/20 pl-2 text-[8.5px] transition-colors cursor-pointer ${
            isPingPong ? 'text-amber-400 font-bold' : 'text-white/60'
          }`}
          title="Toggle Ping-Pong Smooth Loop"
        >
          {isPingPong ? '⇄ PING-PONG' : '→ LOOP'}
        </button>

        {/* Buffer Status */}
        {loadedCount < TOTAL_FRAMES && (
          <div className="hidden sm:flex items-center space-x-1 text-[8px] text-white/50 border-l border-white/20 pl-2">
            <span>BUFF:</span>
            <span>{Math.round((loadedCount / TOTAL_FRAMES) * 100)}%</span>
          </div>
        )}
      </div>
    </div>
  );
}
