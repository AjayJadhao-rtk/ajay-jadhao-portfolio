import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Music, ArrowRight, Compass } from 'lucide-react';
import { audioEngine } from '../utils/audioSystem';

/**
 * WelcomeScreen: Clean, minimalist entrance screen matching the portfolio's design system:
 * - Warm parchment background (#E9DDC7) and deep charcoal accents (#0E1F21)
 * - Sound / Music toggle button
 * - Elegant "Welcome" card with Enter Portfolio and 3D World buttons
 * - No cluttered lab diagnostics or technical telemetry
 */
export default function WelcomeScreen({ onEnter, onEnter3DWorld }) {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isInitializing, setIsInitializing] = useState(false);

  const toggleSound = () => {
    audioEngine.playClick();
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    if (nextState) {
      audioEngine.startMusic();
    } else {
      audioEngine.stopMusic();
    }
  };

  const handleEnterStudio = () => {
    if (isInitializing) return;
    setIsInitializing(true);
    audioEngine.playClick();

    if (soundEnabled && !audioEngine.isMusicPlaying) {
      audioEngine.startMusic();
    }

    setTimeout(() => {
      onEnter();
    }, 200);
  };

  const handleEnter3D = () => {
    if (isInitializing) return;
    setIsInitializing(true);
    audioEngine.playClick();

    if (soundEnabled && !audioEngine.isMusicPlaying) {
      audioEngine.startMusic();
    }

    setTimeout(() => {
      onEnter3DWorld();
    }, 200);
  };

  return (
    <div className="fixed inset-0 z-50 w-full h-full bg-[#E9DDC7] text-[#0E1F21] flex flex-col justify-between overflow-hidden select-none font-sans">
      
      {/* Subtle Background Canvas Grid (Matching Portfolio Aesthetic) */}
      <div className="absolute inset-0 pointer-events-none opacity-25">
        <div className="w-full h-full bg-[linear-gradient(to_right,#0E1F2110_1px,transparent_1px),linear-gradient(to_bottom,#0E1F2110_1px,transparent_1px)] bg-[size:32px_32px]" />
      </div>

      {/* TOP HEADER: Music / Sound Toggle (Aligned to Top Right) */}
      <header className="relative z-20 w-full max-w-5xl mx-auto px-6 py-6 flex items-center justify-end">
        {/* Music / Sound Toggle Pill (Matches Portfolio Navigation Style) */}
        <button
          onClick={toggleSound}
          className={`flex items-center space-x-2 px-3.5 py-1.5 min-h-[38px] rounded-full border transition-all text-xs font-inter cursor-pointer shadow-xs active:scale-95 ${
            soundEnabled
              ? 'bg-[#0E1F21] border-[#0E1F21] text-white'
              : 'bg-[#FFFFFF]/80 border-[#D9E3E1] text-[#1A2A2D] hover:bg-[#FFFFFF]'
          }`}
          title={soundEnabled ? 'Music Active' : 'Music Off'}
        >
          {soundEnabled ? (
            <div className="flex items-end space-x-0.5 h-3 w-3">
              <span className="w-0.5 bg-[#6A8E8B] h-full animate-pulse rounded-full" />
              <span className="w-0.5 bg-teal-300 h-2/3 animate-ping rounded-full" />
              <span className="w-0.5 bg-[#D9E3E1] h-4/5 animate-pulse rounded-full" />
            </div>
          ) : (
            <Music className="w-3.5 h-3.5 text-[#6B7B7D]" />
          )}
          <span className="font-semibold text-[11px] tracking-wide">
            {soundEnabled ? 'MUSIC ON' : 'MUSIC OFF'}
          </span>
        </button>
      </header>

      {/* CENTER STAGE: Simple, Beautiful Welcome Card matching Portfolio Design */}
      <main className="relative z-20 w-full max-w-md mx-auto px-5 py-6 flex flex-col items-center text-center my-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full bg-[#FAF6EE] border border-[#292B27]/20 rounded-2xl shadow-xl p-8 sm:p-10 flex flex-col items-center space-y-5"
          style={{
            boxShadow: '0 20px 40px rgba(41, 43, 39, 0.12), inset 0 0 30px rgba(233, 221, 199, 0.3)',
          }}
        >
          {/* Overline identifier */}
          <span className="font-mono text-[10px] tracking-[0.25em] text-[#89634C] uppercase font-bold">
            PERSONAL PORTFOLIO
          </span>

          {/* Welcome Title */}
          <div className="space-y-1">
            <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-[#0E1F21]">
              Welcome
            </h1>
            <p className="font-inter text-sm sm:text-[15px] text-[#292B27]/75 font-medium">
              Explore the engineering work of Ajay Jadhao
            </p>
          </div>

          {/* Action Triggers */}
          <div className="w-full pt-2 flex flex-col space-y-2.5">
            {/* Primary Action Button: Enter Portfolio */}
            <button
              onClick={handleEnterStudio}
              disabled={isInitializing}
              className="group w-full flex items-center justify-center space-x-2 py-3.5 px-6 min-h-[48px] rounded-full bg-[#0E1F21] text-white hover:bg-[#1A2A2D] transition-all shadow-md active:scale-98 font-inter text-sm font-semibold cursor-pointer disabled:opacity-50"
            >
              <span>{isInitializing ? 'Entering...' : 'Enter Portfolio'}</span>
              <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Secondary Action Button: Explore 3D World */}
            <button
              onClick={handleEnter3D}
              disabled={isInitializing}
              className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 min-h-[40px] rounded-full border border-[#292B27]/20 hover:border-[#0E1F21] bg-transparent text-[#292B27] hover:bg-[#0E1F21]/5 transition-all font-inter text-xs font-semibold cursor-pointer disabled:opacity-50"
            >
              <Compass className="w-3.5 h-3.5 text-[#6A8E8B]" />
              <span>Explore projects in 3d world</span>
            </button>
          </div>
        </motion.div>
      </main>

      {/* MINIMAL FOOTER: Clean and unencumbered */}
      <footer className="relative z-20 w-full max-w-5xl mx-auto px-6 py-4 flex items-center justify-center text-[11px] font-inter text-[#292B27]/60">
        <span>&copy; {new Date().getFullYear()} Ajay Jadhao. All rights reserved.</span>
      </footer>
    </div>
  );
}
