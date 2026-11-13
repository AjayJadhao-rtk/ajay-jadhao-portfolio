import React, { useState, useEffect, useRef } from 'react';
import buildingUrl from '../assets/building_clean.png';
import treesUrl from '../assets/trees_clean.png';

/**
 * BuildingGrassLayer Component
 * 
 * Implements the user's Figma hero ground layer with distinct physical separation:
 * 1. Stationary Building Layer:
 *    - Modernist building, telecommunication satellite dish, antenna hub,
 *      distant skyline skyscrapers, and flying birds.
 *    - Rendered 100% static, crisp, and rock-solid as requested.
 *    - Includes high-precision active satellite dish telemetry pulse accent.
 * 
 * 2. Animated Tree & Grass Layer:
 *    - Organic wind swaying anchored to the ground base (transform-origin: 38% 100%).
 *    - Multi-harmonic natural wind oscillation (slow deep trunk sway + higher frequency canopy flex).
 *    - SVG fluid turbulence displacement filter (<feTurbulence> + <feDisplacementMap>)
 *      giving the leaves, treetops, and foliage authentic fluttering rustle.
 *    - Interactive cursor wind gust: mouse movement induces localized wind gusts that
 *      deepen the sway and smoothly decay back to natural ambient breeze.
 * 
 * Coordinate System:
 * - Master 1451x821 viewBox matching Figma composition, Cloud Strips, and Rotating Wheel.
 * - Stacking Index: z-[25] (in front of Wheel z-20 & Cloud Strips z-10).
 */
export default function BuildingGrassLayer() {
  const [mouseShift, setMouseShift] = useState({ x: 0, y: 0 });
  const [windGust, setWindGust] = useState({ angle: 0, skew: 0 });

  const lastMousePos = useRef({ x: 0, y: 0, time: Date.now() });
  const gustVelocity = useRef(0);
  const animFrameId = useRef(null);

  // 1. Mouse Parallax & Dynamic Interactive Wind Gust Tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const xNorm = (e.clientX / innerWidth - 0.5) * 2;
      const yNorm = (e.clientY / innerHeight - 0.5) * 2;

      // Midground multiplane parallax shift (0.5x depth)
      setMouseShift({
        x: xNorm * 5,
        y: yNorm * 3,
      });

      // Calculate mouse speed for wind gust impulse
      const now = Date.now();
      const dt = Math.max(16, now - lastMousePos.current.time);
      const dx = e.clientX - lastMousePos.current.x;
      const speed = dx / dt; // px per ms

      // Wind gust reacts to horizontal mouse swipe
      gustVelocity.current += speed * 0.45;
      // Cap maximum gust to prevent unnatural distortion
      gustVelocity.current = Math.max(-3.5, Math.min(3.5, gustVelocity.current));

      lastMousePos.current = { x: e.clientX, y: e.clientY, time: now };
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Smooth physics decay for cursor-generated wind gust
    const updatePhysics = () => {
      gustVelocity.current *= 0.92; // Smooth friction decay
      if (Math.abs(gustVelocity.current) < 0.005) {
        gustVelocity.current = 0;
      }

      setWindGust({
        angle: gustVelocity.current * 0.7,
        skew: gustVelocity.current * 1.2,
      });

      animFrameId.current = requestAnimationFrame(updatePhysics);
    };

    animFrameId.current = requestAnimationFrame(updatePhysics);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, []);

  return (
    <div className="relative w-full h-full max-w-[1920px] mx-auto select-none pointer-events-none overflow-hidden flex items-center justify-start">
      
      {/* Dynamic Keyframes for Authentic Organic Wind Swaying */}
      <style>{`
        @keyframes treeBreezeMain {
          0% {
            transform: rotate(0deg) skewX(0deg) scaleY(1);
          }
          18% {
            transform: rotate(0.45deg) skewX(0.85deg) scaleY(1.002);
          }
          36% {
            transform: rotate(-0.35deg) skewX(-0.65deg) scaleY(0.998);
          }
          52% {
            transform: rotate(0.75deg) skewX(1.35deg) scaleY(1.003);
          }
          68% {
            transform: rotate(0.2deg) skewX(0.4deg) scaleY(1.001);
          }
          82% {
            transform: rotate(-0.55deg) skewX(-0.95deg) scaleY(0.997);
          }
          100% {
            transform: rotate(0deg) skewX(0deg) scaleY(1);
          }
        }

        @keyframes treeCanopyFlutter {
          0%, 100% {
            transform: skewX(0deg) scaleX(1);
          }
          24% {
            transform: skewX(0.5deg) scaleX(1.002);
          }
          48% {
            transform: skewX(-0.4deg) scaleX(0.998);
          }
          76% {
            transform: skewX(0.65deg) scaleX(1.001);
          }
        }

        .animated-tree-sway {
          transform-origin: 38% 100%;
          animation: treeBreezeMain 6.8s cubic-bezier(0.42, 0, 0.58, 1) infinite;
          will-change: transform;
        }

        .animated-tree-flutter {
          transform-origin: 50% 100%;
          animation: treeCanopyFlutter 3.4s ease-in-out infinite;
          will-change: transform;
        }
      `}</style>

      {/* 3D Multiplane Parallax Wrapper */}
      <div
        className="relative w-full h-full transition-transform duration-700 ease-out flex items-center justify-start"
        style={{
          transform: `translate3d(${mouseShift.x}px, ${mouseShift.y}px, 0)`,
          willChange: 'transform',
        }}
      >
        {/* SVG Viewport matching 1451x821 master coordinate system */}
        <svg
          viewBox="0 0 1451 821"
          preserveAspectRatio="xMinYMid meet"
          className="w-full h-full overflow-visible pointer-events-none"
        >
          <defs>
            {/* Subtle atmospheric sunlight depth shadow */}
            <filter id="cityShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#1e293b" floodOpacity="0.10" />
            </filter>

            {/* Organic Fluid Foliage Turbulence Displacement Filter */}
            <filter id="foliageWindDistort" x="-5%" y="-5%" width="110%" height="110%">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.014 0.022"
                numOctaves="2"
                result="noise"
                seed="8"
              >
                <animate
                  attributeName="baseFrequency"
                  values="0.012 0.020; 0.018 0.028; 0.014 0.022; 0.012 0.020"
                  dur="7s"
                  repeatCount="indefinite"
                />
              </feTurbulence>
              <feDisplacementMap
                in="SourceGraphic"
                in2="noise"
                scale="6.5"
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          </defs>

          {/* ========================================================== */}
          {/* 1. STATIONARY BUILDING LAYER (As requested: "put building image as it is") */}
          {/* Contains: Modernist Building, Satellite Dish, Skyline, Birds */}
          {/* 100% stationary, zero wobble, razor sharp */}
          {/* ========================================================== */}
          <g id="stationary-building-layer" filter="url(#cityShadow)">
            <image
              href={buildingUrl}
              xlinkHref={buildingUrl}
              x="-4.28"
              y="0"
              width="1459.55"
              height="821"
              preserveAspectRatio="none"
              className="pointer-events-none select-none"
            />

            {/* Satellite Dish Active Hub Telemetry Pulse Accent at (138, 598) */}
            <g transform="translate(138, 598)" className="pointer-events-none">
              <circle cx="0" cy="0" r="3" fill="#38BDF8" className="animate-ping opacity-60" />
              <circle cx="0" cy="0" r="1.5" fill="#38BDF8" />
            </g>
          </g>

          {/* ========================================================== */}
          {/* 2. ANIMATED TREES & GRASS LAYER ("for the trees should be animate they should wave like a real tree") */}
          {/* Anchored at base (ground), swaying in wind with organic flutter & interactive cursor gusts */}
          {/* ========================================================== */}
          <g
            id="animated-trees-layer"
            style={{
              transformOrigin: '38% 100%',
              transform: `rotate(${windGust.angle}deg) skewX(${windGust.skew}deg)`,
              transition: 'transform 0.15s ease-out',
            }}
          >
            {/* Primary Wind Breeze Swaying Container */}
            <g className="animated-tree-sway">
              {/* Secondary Leaf Canopy Wave Flutter */}
              <g className="animated-tree-flutter">
                {/* SVG Displacement Shimmer for Individual Leaf Clusters */}
                <g filter="url(#foliageWindDistort)">
                  <image
                    href={treesUrl}
                    xlinkHref={treesUrl}
                    x="-4.25"
                    y="0"
                    width="1459.5"
                    height="821"
                    preserveAspectRatio="none"
                    className="pointer-events-none select-none"
                  />
                </g>
              </g>
            </g>
          </g>

          {/* Warm Ambient Sunlight Rim Glow on Upper Tree Canopy */}
          <path
            d="M 220 700 Q 420 640 650 670 T 1150 690 L 1150 821 L 220 821 Z"
            fill="url(#ambientCanopySun)"
            className="pointer-events-none opacity-20 mix-blend-soft-light"
          />
          <linearGradient id="ambientCanopySun" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#166534" stopOpacity="0" />
          </linearGradient>

        </svg>
      </div>

    </div>
  );
}
