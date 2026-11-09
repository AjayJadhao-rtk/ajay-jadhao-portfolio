import React from 'react';

/**
 * PaperGrainOverlay renders a subtle noise and vintage vignette overlay
 * that gives the entire portfolio an authentic vintage manga/aged paper texture.
 */
export default function PaperGrainOverlay() {
  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden mix-blend-multiply opacity-[0.28]">
      {/* SVG noise texture */}
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <filter id="parchmentNoise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.75"
            numOctaves="4"
            stitchTiles="stitch"
          />
          <feColorMatrix
            type="matrix"
            values="0.33 0.33 0.33 0 0
                    0.33 0.33 0.33 0 0
                    0.33 0.33 0.33 0 0
                    0    0    0    0.35 0"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#parchmentNoise)" />
      </svg>
      {/* Subtle aged paper edge vignette */}
      <div className="absolute inset-0 bg-radial-vignette" />
    </div>
  );
}
