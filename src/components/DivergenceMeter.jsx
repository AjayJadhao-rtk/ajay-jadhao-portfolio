import React, { useState } from 'react';
import { audioEngine } from '../utils/audioSystem';

/**
 * DivergenceMeter displays the iconic vintage anime coordinate '0.571024'
 * reminiscent of Steins;Gate Divergence Meter and retro nixie tubes.
 */
export default function DivergenceMeter() {
  const [digits, setDigits] = useState('0.571024');
  const [isGlitching, setIsGlitching] = useState(false);

  // Subtle rare flicker effect
  const triggerGlitch = () => {
    audioEngine.playRadarPing();
    setIsGlitching(true);
    let frames = 0;
    const interval = setInterval(() => {
      frames++;
      const randomJitter = (Math.random() * 0.999999).toFixed(6);
      setDigits(randomJitter);
      if (frames > 4) {
        clearInterval(interval);
        setDigits('0.571024');
        setIsGlitching(false);
      }
    }, 45);
  };

  return (
    <div
      onMouseEnter={() => {
        audioEngine.playHover();
        triggerGlitch();
      }}
      onClick={triggerGlitch}
      className="absolute top-12 left-[38%] md:left-[43%] z-15 flex flex-col items-center select-none cursor-pointer group pointer-events-auto"
      title="Temporal Divergence Coordinate"
    >
      <div className="relative flex items-center px-3 py-1 rounded bg-[#292B27]/10 backdrop-blur-[2px] border border-[#B17B53]/30 shadow-[0_0_15px_rgba(212,155,85,0.25)] transition-all duration-300 group-hover:border-[#B17B53]/80 group-hover:bg-[#292B27]/20">
        {/* Nixie glow ambient background */}
        <div className="absolute inset-0 bg-amber-500/10 blur-md rounded" />

        {/* Technical index badge */}
        <span className="hidden sm:inline-block font-mono text-[8px] text-[#89634C] mr-2 tracking-widest font-bold">
          DIV:
        </span>

        {/* Digits with amber glow */}
        <span
          className={`relative font-mono font-bold text-lg sm:text-2xl md:text-3xl tracking-[0.18em] transition-all ${
            isGlitching
              ? 'text-amber-300 drop-shadow-[0_0_8px_rgba(245,158,11,0.9)]'
              : 'text-[#B17B53] sm:text-amber-700/90 drop-shadow-[0_0_6px_rgba(177,123,83,0.45)]'
          }`}
          style={{ textShadow: '0 0 10px rgba(177, 123, 83, 0.5), 0 0 20px rgba(212, 155, 85, 0.3)' }}
        >
          {digits}
        </span>
      </div>

      <span className="text-[7.5px] font-mono tracking-widest text-[#626B50] uppercase mt-0.5 opacity-70 group-hover:opacity-100 transition-opacity">
        WORLD LINE · E&TC SYS
      </span>
    </div>
  );
}
