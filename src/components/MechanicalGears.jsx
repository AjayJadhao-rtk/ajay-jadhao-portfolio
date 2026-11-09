import React from 'react';

/**
 * MechanicalGears renders interlocking mechanical clockwork gears
 * with antique brass/bronze styling.
 * 
 * Positioned strictly in the upper-left sky quadrant above and away
 * from the character's head and hair to prevent visual collision.
 */
export default function MechanicalGears() {
  return (
    <div className="pointer-events-none absolute top-1 sm:top-2 left-[2%] sm:left-[5%] md:left-[8%] w-56 sm:w-72 h-56 sm:h-72 z-5 opacity-20 sm:opacity-25 mix-blend-multiply select-none">
      {/* Primary Large Gear (Clockwise) */}
      <svg
        viewBox="0 0 200 200"
        className="absolute top-0 left-0 w-48 sm:w-60 h-48 sm:h-60 animate-spin-slow origin-center"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="100" cy="100" r="76" stroke="#292B27" strokeWidth="2.5" strokeDasharray="4 2" />
        <circle cx="100" cy="100" r="62" stroke="#89634C" strokeWidth="1.5" />
        <circle cx="100" cy="100" r="28" fill="#E9DDC7" stroke="#292B27" strokeWidth="3" />
        <circle cx="100" cy="100" r="12" fill="#89634C" />
        <circle cx="100" cy="100" r="4" fill="#292B27" />

        {/* 16 Cogs / Teeth around perimeter */}
        {[...Array(16)].map((_, i) => {
          const angle = (i * 360) / 16;
          return (
            <rect
              key={i}
              x="93"
              y="10"
              width="14"
              height="18"
              rx="2"
              fill="#292B27"
              transform={`rotate(${angle} 100 100)`}
            />
          );
        })}

        {/* 6 Structural Spokes with Rivets */}
        {[...Array(6)].map((_, i) => {
          const angle = (i * 360) / 6;
          return (
            <g key={i} transform={`rotate(${angle} 100 100)`}>
              <line x1="100" y1="28" x2="100" y2="72" stroke="#292B27" strokeWidth="3.5" strokeLinecap="round" />
              <circle cx="100" cy="48" r="2.5" fill="#B17B53" />
            </g>
          );
        })}
      </svg>

      {/* Secondary Interlocking Smaller Gear (Counter-Clockwise) */}
      <svg
        viewBox="0 0 140 140"
        className="absolute top-20 sm:top-28 left-28 sm:left-36 w-28 sm:w-36 h-28 sm:h-36 animate-spin-reverse-slow origin-center"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="70" cy="70" r="50" stroke="#626B50" strokeWidth="2" strokeDasharray="3 3" />
        <circle cx="70" cy="70" r="38" stroke="#89634C" strokeWidth="1.5" />
        <circle cx="70" cy="70" r="16" fill="#F4EBDD" stroke="#292B27" strokeWidth="2" />
        <circle cx="70" cy="70" r="6" fill="#B17B53" />

        {/* 12 Cogs */}
        {[...Array(12)].map((_, i) => {
          const angle = (i * 360) / 12;
          return (
            <rect
              key={i}
              x="64"
              y="10"
              width="12"
              height="14"
              rx="1.5"
              fill="#89634C"
              transform={`rotate(${angle} 70 70)`}
            />
          );
        })}

        {/* 4 Spokes */}
        {[...Array(4)].map((_, i) => {
          const angle = (i * 360) / 4;
          return (
            <g key={i} transform={`rotate(${angle} 70 70)`}>
              <line x1="70" y1="20" x2="70" y2="52" stroke="#292B27" strokeWidth="2.5" />
              <circle cx="70" cy="34" r="2" fill="#626B50" />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
