import React from 'react';
import MechanicalGears from './MechanicalGears';
import DivergenceMeter from './DivergenceMeter';

/**
 * CenterHeroArtwork coordinates the atmospheric elements in the center column:
 * 1. Rotating mechanical clockwork gears in the sky
 * 2. Glowing Steins;Gate divergence coordinates ("0.571024")
 * 3. Atmospheric golden dust particles drifting in the sunlight
 * 
 * The living anime engineer character breathes through from the full-screen
 * background canvas, creating an integrated panoramic scene.
 */
export default function CenterHeroArtwork() {
  return (
    <div className="relative w-full h-full min-h-[460px] sm:min-h-[540px] lg:min-h-[600px] flex flex-col items-center justify-between pointer-events-none select-none">
      
      {/* Rotating Mechanical Clockwork Gears in Background */}
      <MechanicalGears />

      {/* Divergence Meter Coordinates '0.571024' */}
      <DivergenceMeter />

      {/* Floating Golden Dust Particles drifting in the golden hour light */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {[...Array(14)].map((_, i) => {
          const left = 15 + ((i * 19) % 70);
          const delay = (i * 0.7) % 5;
          const duration = 6 + (i % 4);
          const size = 2 + (i % 3);
          return (
            <div
              key={i}
              className="absolute rounded-full bg-amber-200/80 blur-[0.6px] animate-float"
              style={{
                left: `${left}%`,
                bottom: `${15 + (i * 5)}%`,
                width: `${size}px`,
                height: `${size}px`,
                animationDelay: `${delay}s`,
                animationDuration: `${duration}s`,
                boxShadow: '0 0 6px rgba(251, 191, 36, 0.6)',
              }}
            />
          );
        })}
      </div>

      {/* Midground Silhouette on the Bridge */}
      <div className="absolute bottom-12 right-[8%] sm:right-[15%] z-10 w-24 sm:w-32 h-32 opacity-65 mix-blend-multiply pointer-events-none">
        <svg viewBox="0 0 100 120" className="w-full h-full fill-[#26352D]">
          {/* Bridge railings */}
          <line x1="0" y1="100" x2="100" y2="100" stroke="#26352D" strokeWidth="2" />
          <line x1="0" y1="110" x2="100" y2="110" stroke="#26352D" strokeWidth="1.5" />
          {[10, 30, 50, 70, 90].map((rx) => (
            <line key={rx} x1={rx} y1="95" x2={rx} y2="115" stroke="#26352D" strokeWidth="1.5" />
          ))}
          {/* Standing figure back view */}
          <circle cx="50" cy="50" r="7" />
          <path d="M42,60 C42,57 58,57 58,60 L62,96 L38,96 Z" />
          <path d="M41,48 C41,42 59,42 59,48 C61,46 59,42 55,41 C50,40 45,42 41,48 Z" />
        </svg>
      </div>

      {/* Technical blueprint tick marks in the sky */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-none z-10 hidden sm:flex items-center space-x-6 text-[9px] font-mono text-[#626B50]/60">
        <span>[E&TC_RAD.892]</span>
        <span className="w-12 h-[1px] bg-[#292B27]/20" />
        <span>[SYS.HZ 2.400]</span>
      </div>
    </div>
  );
}
