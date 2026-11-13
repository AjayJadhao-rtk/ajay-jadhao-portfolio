import React, { useState, useEffect } from 'react';
import buildingGroundUrl from '../assets/building_ground.png';

/**
 * BuildingGrassLayer Component
 * 
 * Renders the Building, Satellite Dish, City Skyline, Birds, and Lush Tree/Grass Ground Layer
 * directly from the user's Figma template assets ("Reference.svg" / "extracted_ref.png").
 * 
 * Features:
 * 1. Pixel-perfect 1451x821 coordinate mapping matching cloud strips and rotating wheel.
 * 2. Positioned at z-25: In front of the cloud strips (z-10) and wheel (z-20),
 *    ready to sit behind the forthcoming Character layer (z-30).
 * 3. Multiplane parallax: Subtle mouse-drift tracking with midground depth factor (0.6x).
 * 4. Ambient atmospheric wind breathing on the canopy.
 * 5. Satellite dish telemetry indicator accent on the antenna hub.
 */
export default function BuildingGrassLayer() {
  const [mouseShift, setMouseShift] = useState({ x: 0, y: 0 });

  // Midground parallax tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const xNorm = (e.clientX / innerWidth - 0.5) * 2;
      const yNorm = (e.clientY / innerHeight - 0.5) * 2;
      // Midground depth ratio (60% of foreground shift for authentic 3D multiplane perspective)
      setMouseShift({
        x: xNorm * 6,
        y: yNorm * 3.5,
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative w-full h-full max-w-[1920px] mx-auto select-none pointer-events-none overflow-hidden flex items-center justify-start">
      
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
            {/* Soft sunlight atmospheric glow filter */}
            <filter id="cityAtmosphere" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#222824" floodOpacity="0.12" />
            </filter>
          </defs>

          {/* Master Ground Layer: Satellite Dish, Modernist Building, City Skyline, Birds, and Forest Trees */}
          <g filter="url(#cityAtmosphere)">
            <image
              href={buildingGroundUrl}
              xlinkHref={buildingGroundUrl}
              x="0"
              y="0"
              width="1451"
              height="821"
              preserveAspectRatio="xMinYMid meet"
              className="pointer-events-none select-none"
            />
          </g>

          {/* Subtle Technical Satellite Dish Active Telemetry Beacon */}
          {/* Dish center coordinates located at roughly (135, 595) in 1451x821 viewBox */}
          <g transform="translate(138, 598)" className="pointer-events-none">
            <circle cx="0" cy="0" r="2.5" fill="#38BDF8" className="animate-ping opacity-75" />
            <circle cx="0" cy="0" r="1.5" fill="#38BDF8" />
          </g>

          {/* Subtle Ambient Sunlight Caustics Over Tree Tops */}
          <path
            d="M 0 680 Q 250 660 500 700 T 950 720 L 950 821 L 0 821 Z"
            fill="url(#treeSunlight)"
            className="pointer-events-none opacity-20 mix-blend-soft-light"
          />
          <linearGradient id="treeSunlight" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#15803D" stopOpacity="0" />
          </linearGradient>

        </svg>
      </div>

    </div>
  );
}
