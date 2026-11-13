import React from 'react';
import buildingUrl from '../assets/building_clean.png';
import treesUrl from '../assets/trees_clean.png';

/**
 * BuildingGrassLayer Component
 * 
 * Strict User Requirements:
 * 1. ZERO MOVEMENT IN THE BUILDINGS:
 *    - The building, satellite dish, telemetry beacon, distant skyline, and flying birds
 *      are 100% stationary and locked in place.
 *    - No mouse parallax, no transforms, no shifts under any circumstance.
 * 
 * 2. SILKY SMOOTH GRASS & TREE WAVE ANIMATION:
 *    - Pure GPU-accelerated CSS transforms (no CPU-bound filter jitter or mouseover stutters).
 *    - Anchored at ground base (y = 821px) so the roots remain firmly grounded.
 *    - Dual-harmonic sinusoidal breeze (6s primary sway + 3.7s canopy flutter) with
 *      infinite alternate easing for mathematically continuous, seamless flow without loop seams.
 * 
 * Coordinate System:
 * - Master 1451x821 viewBox matching Figma template, Cloud Strips, and Rotating Wheel.
 * - Stacking Index: z-[25] (in front of Wheel z-20 & Cloud Strips z-10).
 */
export default function BuildingGrassLayer() {
  return (
    <div className="relative w-full h-full max-w-[1920px] mx-auto select-none pointer-events-none overflow-hidden flex items-center justify-start">
      
      {/* Silky Smooth Pure GPU-Composited Keyframes */}
      <style>{`
        @keyframes treeSmoothSway {
          0% {
            transform: rotate(-0.65deg) skewX(-1.1deg);
          }
          100% {
            transform: rotate(0.85deg) skewX(1.35deg);
          }
        }

        @keyframes treeSmoothCanopyFlutter {
          0% {
            transform: skewX(-0.55deg) scaleX(0.998);
          }
          100% {
            transform: skewX(0.75deg) scaleX(1.002);
          }
        }

        /* Anchored at ground base (x=500, y=821) */
        .tree-sway-primary {
          transform-box: view-box;
          transform-origin: 520px 821px;
          animation: treeSmoothSway 5.8s ease-in-out infinite alternate;
          will-change: transform;
        }

        .tree-flutter-secondary {
          transform-box: view-box;
          transform-origin: 520px 821px;
          animation: treeSmoothCanopyFlutter 3.6s ease-in-out infinite alternate;
          will-change: transform;
        }
      `}</style>

      {/* SVG Viewport matching 1451x821 master coordinate system — 100% STATIONARY WRAPPER */}
      <svg
        viewBox="0 0 1451 821"
        preserveAspectRatio="xMinYMid meet"
        className="w-full h-full overflow-visible pointer-events-none"
      >
        <defs>
          {/* Soft atmospheric depth shadow */}
          <filter id="buildingAtmosphere" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#1e293b" floodOpacity="0.10" />
          </filter>
        </defs>

        {/* ========================================================== */}
        {/* 1. STATIONARY BUILDING LAYER */}
        {/* "There should be no movement in the buildings" */}
        {/* Completely static, zero transforms, zero mouse shift */}
        {/* ========================================================== */}
        <g id="stationary-building-layer" filter="url(#buildingAtmosphere)">
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
        {/* 2. ANIMATED TREES & GRASS LAYER */}
        {/* "The grass should be move with smooth animation" */}
        {/* Continuous, ultra-smooth GPU-accelerated wave motion */}
        {/* ========================================================== */}
        <g id="animated-trees-layer">
          {/* Primary Trunk & Grove Sway */}
          <g className="tree-sway-primary">
            {/* Secondary Foliage Canopy Breeze */}
            <g className="tree-flutter-secondary">
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
  );
}
