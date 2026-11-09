import React, { useState, useEffect, useRef } from 'react';

/**
 * WindPhysicsCharacter renders the central anime engineer character
 * looking up toward the golden horizon, with:
 * 1. Butter-smooth SVG turbulence displacement wind wave for hair and hoodie cloth
 * 2. Secondary organic CSS flutter & float animation
 * 3. Interactive subtle mouse parallax depth tilt
 * 4. Golden hour atmospheric floating dust motes
 */
export default function WindPhysicsCharacter() {
  const containerRef = useRef(null);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  // Mouse Parallax reaction
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const { innerWidth, innerHeight } = window;
      const xNorm = (e.clientX / innerWidth - 0.5) * 2; // -1 to 1
      const yNorm = (e.clientY / innerHeight - 0.5) * 2;
      setMouseOffset({
        x: xNorm * 8, // subtle 8px shift
        y: yNorm * 6,
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex items-end justify-center pointer-events-none select-none overflow-hidden"
    >
      {/* SVG Filters for organic cloth & hair wind wave simulation */}
      <svg className="absolute w-0 h-0 pointer-events-none">
        <defs>
          {/* Subtle Organic Wind Physics Filter */}
          <filter id="windClothPhysics" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.015 0.028"
              numOctaves="3"
              result="noise"
              seed="7"
            >
              <animate
                attributeName="baseFrequency"
                dur="9s"
                values="0.012 0.025; 0.019 0.034; 0.013 0.026; 0.012 0.025"
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

          {/* Micro hair flutter filter */}
          <filter id="hairWaveTurbulence" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence
              type="turbulence"
              baseFrequency="0.035 0.045"
              numOctaves="2"
              result="fineNoise"
              seed="19"
            >
              <animate
                attributeName="baseFrequency"
                dur="4.5s"
                values="0.03 0.04; 0.045 0.055; 0.03 0.04"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap
              in="SourceGraphic"
              in2="fineNoise"
              scale="4"
              xChannelSelector="G"
              yChannelSelector="B"
            />
          </filter>
        </defs>
      </svg>

      {/* Floating Golden Hour Dust Motes / Particles */}
      <div className="absolute inset-0 pointer-events-none z-20">
        {[...Array(14)].map((_, i) => {
          const left = 20 + ((i * 17) % 65);
          const delay = (i * 0.7) % 5;
          const duration = 5 + (i % 4);
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

      {/* Midground Silhouette on the Bridge in sunset */}
      <div
        className="absolute bottom-16 right-[18%] md:right-[22%] z-12 w-28 sm:w-36 h-36 opacity-75 mix-blend-multiply pointer-events-none transition-transform duration-300 ease-out"
        style={{
          transform: `translate(${mouseOffset.x * 0.3}px, ${mouseOffset.y * 0.2}px)`,
        }}
      >
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
          {/* Tousled hair */}
          <path d="M41,48 C41,42 59,42 59,48 C61,46 59,42 55,41 C50,40 45,42 41,48 Z" />
        </svg>
      </div>

      {/* PRIMARY CHARACTER CONTAINER WITH WIND PHYSICS & PARALLAX */}
      <div
        className="relative z-15 w-[85%] sm:w-[75%] md:w-[68%] lg:w-[62%] max-w-[560px] flex items-end justify-center transition-transform duration-200 ease-out"
        style={{
          transform: `translate3d(${mouseOffset.x}px, ${mouseOffset.y * 0.6}px, 0)`,
        }}
      >
        {/* Wind sway wrapper with combined keyframe and SVG turbulence filter */}
        <div
          className="relative w-full origin-bottom animate-wind-sway"
          style={{
            filter: 'url(#windClothPhysics)',
            willChange: 'transform, filter',
          }}
        >
          {/* Hair strand micro-flutter layer */}
          <div
            className="w-full origin-top-right animate-hair-flutter"
            style={{
              filter: 'url(#hairWaveTurbulence)',
            }}
          >
            {/* The Character Image Texture */}
            <img
              src="/assets/crops/center-character.jpg"
              alt="Vintage Anime Engineer Character gazing toward horizon"
              className="w-full h-auto object-contain drop-shadow-[0_12px_24px_rgba(41,43,39,0.35)] select-none pointer-events-none"
              style={{
                maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 85%, rgba(0,0,0,0) 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 90%, rgba(0,0,0,0.4) 98%, transparent 100%)',
              }}
            />
          </div>
        </div>

        {/* Cinematic golden-hour rim lighting accent */}
        <div
          className="absolute inset-0 pointer-events-none mix-blend-screen opacity-40 bg-gradient-to-tr from-transparent via-amber-400/20 to-amber-200/40 rounded-full blur-xl"
          style={{
            transform: 'scale(0.9) translate(15px, -15px)',
          }}
        />
      </div>

      {/* Diagonal shard divider line cutting behind the character */}
      <div className="absolute inset-0 pointer-events-none z-16">
        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
          <line
            x1="18"
            y1="0"
            x2="55"
            y2="100"
            stroke="#292B27"
            strokeWidth="0.3"
            strokeDasharray="1.5 1.5"
            opacity="0.35"
          />
        </svg>
      </div>
    </div>
  );
}
