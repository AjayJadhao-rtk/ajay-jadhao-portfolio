import React, { useState, useEffect, useRef } from 'react';

/**
 * AnimatedCloudStrips renders the 4 vertical rectangle strips
 * with buttery-smooth living cloud animation.
 * 
 * Takes 01_strip.svg, 02_strip.svg, 03_strip.svg from the reference folder
 * and continuously animates the blue sky and whitish cloud colors with:
 * 1. Infinite smooth sinusoidal crossfade between the 3 SVG frames.
 * 2. Drifting cloud luminescence & sunlight caustic waves across the white cloud puffs.
 * 3. Gentle vertical atmospheric breathing drift.
 * 4. Interactive mouse parallax response.
 */
export default function AnimatedCloudStrips() {
  const [opacities, setOpacities] = useState({ f1: 1, f2: 0, f3: 0 });
  const [mouseShift, setMouseShift] = useState({ x: 0, y: 0 });
  const animFrameRef = useRef(null);
  const startTimeRef = useRef(null);

  const stripSvgFiles = [
    '/assets/strips/01_strip.svg',
    '/assets/strips/02_strip.svg',
    '/assets/strips/03_strip.svg',
  ];

  // Continuous sinusoidal RAF crossfade loop for buttery-smooth cloud motion
  useEffect(() => {
    const cycleDuration = 6000; // 6 seconds for a full breathing cycle

    const updateCloudAnimation = (time) => {
      if (!startTimeRef.current) startTimeRef.current = time;
      const elapsed = time - startTimeRef.current;
      const progress = (elapsed % cycleDuration) / cycleDuration;
      const angle = progress * Math.PI * 2;

      // 3-phase sinusoidal blend with soft normalization
      // Phase 1 (0 rad), Phase 2 (2*PI/3 rad), Phase 3 (4*PI/3 rad)
      const raw1 = Math.max(0, Math.cos(angle));
      const raw2 = Math.max(0, Math.cos(angle - (2 * Math.PI) / 3));
      const raw3 = Math.max(0, Math.cos(angle - (4 * Math.PI) / 3));

      const sum = (raw1 + raw2 + raw3) || 1;

      setOpacities({
        f1: raw1 / sum,
        f2: raw2 / sum,
        f3: raw3 / sum,
      });

      animFrameRef.current = requestAnimationFrame(updateCloudAnimation);
    };

    animFrameRef.current = requestAnimationFrame(updateCloudAnimation);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  // Subtle interactive parallax
  useEffect(() => {
    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const xNorm = (e.clientX / innerWidth - 0.5) * 2;
      const yNorm = (e.clientY / innerHeight - 0.5) * 2;
      setMouseShift({
        x: xNorm * 10,
        y: yNorm * 6,
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative w-full h-full max-w-[1920px] mx-auto select-none pointer-events-none overflow-hidden flex items-center justify-start">
      
      {/* 3D Parallax & Atmospheric Floating Container */}
      <div
        className="relative w-full h-full transition-transform duration-500 ease-out flex items-center justify-start"
        style={{
          transform: `translate3d(${mouseShift.x}px, ${mouseShift.y}px, 0)`,
          willChange: 'transform, opacity',
        }}
      >
        {/* ========================================================================= */}
        {/* 3 SEQUENTIAL SVG STRIP FRAMES WITH SMOOTH CONTINUOUS BLENDING */}
        {/* ========================================================================= */}

        {/* Frame 01: Base Cloud Formation */}
        <div
          className="absolute inset-0 w-full h-full pointer-events-none will-change-transform"
          style={{
            opacity: opacities.f1,
            transition: 'opacity 0.1s linear',
          }}
        >
          <img
            src={stripSvgFiles[0]}
            alt="Rectangle Cloud Strip Frame 01"
            className="w-full h-full object-contain object-left pointer-events-none drop-shadow-sm"
          />
        </div>

        {/* Frame 02: Mid-Drift Cloud Puffs */}
        <div
          className="absolute inset-0 w-full h-full pointer-events-none will-change-transform"
          style={{
            opacity: opacities.f2,
            transition: 'opacity 0.1s linear',
          }}
        >
          <img
            src={stripSvgFiles[1]}
            alt="Rectangle Cloud Strip Frame 02"
            className="w-full h-full object-contain object-left pointer-events-none drop-shadow-sm"
          />
        </div>

        {/* Frame 03: Ascending Cloud Puffs with Sunlight Highlights */}
        <div
          className="absolute inset-0 w-full h-full pointer-events-none will-change-transform"
          style={{
            opacity: opacities.f3,
            transition: 'opacity 0.1s linear',
          }}
        >
          <img
            src={stripSvgFiles[2]}
            alt="Rectangle Cloud Strip Frame 03"
            className="w-full h-full object-contain object-left pointer-events-none drop-shadow-sm"
          />
        </div>

        {/* ========================================================================= */}
        {/* ATMOSPHERIC CLOUD LUMINESCENCE (Animates the blue and whitish cloud colors) */}
        {/* ========================================================================= */}
        
        {/* Shimmering sunlight glow wave moving across the whitish cloud puffs */}
        <div
          className="absolute inset-0 w-full h-full pointer-events-none mix-blend-color-dodge opacity-40 animate-pulse duration-[3500ms]"
          style={{
            clipPath: 'polygon(7% 0%, 58% 0%, 58% 100%, 7% 100%)', // Constrained strictly to the 4 rectangle strips area
          }}
        >
          <div className="w-full h-full bg-gradient-to-tr from-cyan-200/10 via-white/35 to-amber-100/20" />
        </div>

        {/* Delicate azure sky atmospheric depth wave */}
        <div
          className="absolute inset-0 w-full h-full pointer-events-none mix-blend-overlay opacity-30 animate-pulse duration-[5500ms]"
          style={{
            clipPath: 'polygon(7% 0%, 58% 0%, 58% 100%, 7% 100%)',
          }}
        >
          <div className="w-full h-full bg-gradient-to-b from-sky-400/20 via-transparent to-teal-300/15" />
        </div>
      </div>
    </div>
  );
}
