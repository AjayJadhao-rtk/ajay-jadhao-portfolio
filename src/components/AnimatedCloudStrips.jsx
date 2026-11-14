import React, { useState, useEffect, useRef } from 'react';
import { useIsMobile } from '../hooks/useIsMobile';

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
  const isMobile = useIsMobile(1024);
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
        {/* SVG Viewport matching 1451x821 master coordinate system (Responsive for mobile grounding) */}
        <svg
          viewBox={isMobile ? "80 0 880 821" : "0 0 1451 821"}
          preserveAspectRatio={isMobile ? "xMidYMax meet" : "xMinYMid meet"}
          className="w-full h-full overflow-visible pointer-events-none"
        >
          <defs>
            <linearGradient id="cloudSunGlow" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stopColor="#A5F3FC" stopOpacity="0.25" />
              <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#FEF08A" stopOpacity="0.30" />
            </linearGradient>
            <linearGradient id="cloudSkyGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.25" />
              <stop offset="50%" stopColor="#38BDF8" stopOpacity="0" />
              <stop offset="100%" stopColor="#5EEAD4" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* ========================================================================= */}
          {/* 3 SEQUENTIAL SVG STRIP FRAMES WITH SMOOTH CONTINUOUS BLENDING */}
          {/* ========================================================================= */}

          {/* Frame 01: Base Cloud Formation */}
          <g
            style={{
              opacity: opacities.f1,
              transition: 'opacity 0.1s linear',
            }}
          >
            <image
              href={stripSvgFiles[0]}
              xlinkHref={stripSvgFiles[0]}
              x="0"
              y="0"
              width="1451"
              height="821"
              className="pointer-events-none"
            />
          </g>

          {/* Frame 02: Mid-Drift Cloud Puffs */}
          <g
            style={{
              opacity: opacities.f2,
              transition: 'opacity 0.1s linear',
            }}
          >
            <image
              href={stripSvgFiles[1]}
              xlinkHref={stripSvgFiles[1]}
              x="0"
              y="0"
              width="1451"
              height="821"
              className="pointer-events-none"
            />
          </g>

          {/* Frame 03: Ascending Cloud Puffs with Sunlight Highlights */}
          <g
            style={{
              opacity: opacities.f3,
              transition: 'opacity 0.1s linear',
            }}
          >
            <image
              href={stripSvgFiles[2]}
              xlinkHref={stripSvgFiles[2]}
              x="0"
              y="0"
              width="1451"
              height="821"
              className="pointer-events-none"
            />
          </g>

          {/* ========================================================================= */}
          {/* ATMOSPHERIC CLOUD LUMINESCENCE (Animates the blue and whitish cloud colors) */}
          {/* ========================================================================= */}
          <rect
            x="110"
            y="0"
            width="600"
            height="821"
            fill="url(#cloudSunGlow)"
            className="pointer-events-none mix-blend-color-dodge animate-pulse duration-[3500ms]"
          />
          <rect
            x="110"
            y="0"
            width="600"
            height="821"
            fill="url(#cloudSkyGlow)"
            className="pointer-events-none mix-blend-overlay animate-pulse duration-[5500ms]"
          />
        </svg>
      </div>
    </div>
  );
}
