import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Volume2, VolumeX, Compass, ArrowRight, Activity, Terminal } from 'lucide-react';
import { audioEngine } from '../utils/audioSystem';

/**
 * WelcomeScreen: High-impact cinematic entrance gate for Ajay Jadhao's Portfolio.
 * 1. Provides a memorable, high-tech industrial engineering boot sequence.
 * 2. Elegantly solves browser autoplay restrictions with an intentional user gesture.
 * 3. Immediately triggers the exciting driving soundtrack and actuation sound.
 * 4. Offers options to enter with/without sound or jump straight to the 3D Circuit World.
 */
export default function WelcomeScreen({ onEnter, onEnter3DWorld }) {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isInitializing, setIsInitializing] = useState(false);

  const handleEnterStudio = () => {
    setIsInitializing(true);
    audioEngine.playSystemBoot();

    if (soundEnabled) {
      setTimeout(() => {
        audioEngine.startMusic();
      }, 150);
    }

    setTimeout(() => {
      onEnter();
    }, 300);
  };

  const handleEnter3D = () => {
    setIsInitializing(true);
    audioEngine.playSystemBoot();

    if (soundEnabled) {
      setTimeout(() => {
        audioEngine.startMusic();
      }, 150);
    }

    setTimeout(() => {
      onEnter3DWorld();
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 w-full h-full bg-[#181A17] text-[#F4EBDD] flex flex-col justify-between overflow-hidden select-none font-sans">
      
      {/* Background Blueprint Grid & Ambient Particle Glow */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="w-full h-full bg-[linear-gradient(to_right,#E9DDC715_1px,transparent_1px),linear-gradient(to_bottom,#E9DDC715_1px,transparent_1px)] bg-[size:32px_32px]" />
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#B17B53]/10 rounded-full blur-[140px] pointer-events-none" />

      {/* TOP HEADER: Telemetry Status & Audio Toggle */}
      <header className="relative z-20 w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center space-x-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[#DACAB0] tracking-widest uppercase font-bold text-[10px] sm:text-xs">
            SYS.STATUS // READY
          </span>
          <span className="text-white/20 hidden sm:inline">|</span>
          <span className="text-[#89634C] text-[10px] hidden sm:inline">
            CORE FREQ: 240 MHz · LAT 18.52° N
          </span>
        </div>

        {/* Audio Preference Toggle */}
        <button
          onClick={() => {
            audioEngine.playClick();
            setSoundEnabled(!soundEnabled);
          }}
          className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-full border transition-all cursor-pointer text-xs font-mono active:scale-95 ${
            soundEnabled
              ? 'bg-[#B17B53]/20 border-[#B17B53] text-amber-300 shadow-[0_0_12px_rgba(177,123,83,0.3)]'
              : 'bg-white/5 border-white/20 text-[#DACAB0]/70 hover:bg-white/10'
          }`}
          title={soundEnabled ? 'Music & Sound Enabled' : 'Muted'}
        >
          {soundEnabled ? (
            <>
              <Volume2 className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-bold text-[10px] tracking-wider uppercase">SOUND ON</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-bold text-[10px] tracking-wider uppercase">SOUND OFF</span>
            </>
          )}
        </button>
      </header>

      {/* CENTER STAGE: Protagonist Identity & Primary Entrance Trigger */}
      <main className="relative z-20 w-full max-w-4xl mx-auto px-6 py-8 flex flex-col items-center text-center my-auto">
        
        {/* Engineering Lab Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#292B27] border border-[#B17B53]/40 text-[#B17B53] font-mono text-[10px] tracking-widest uppercase font-bold mb-4 shadow-inner"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#B17B53] animate-ping" />
          <span>AUTONOMOUS SYSTEMS & ROBOTICS LAB</span>
        </motion.div>

        {/* Hero Name Headline: AJAY JADHAO */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="font-display text-5xl sm:text-7xl md:text-8xl font-black uppercase tracking-tight text-[#F4EBDD] leading-none mb-3"
        >
          AJAY JADHAO
        </motion.h1>

        {/* Role Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="font-mono text-xs sm:text-sm md:text-base font-bold tracking-[0.16em] uppercase text-[#DACAB0] mb-5"
        >
          ELECTRONICS & TELECOMMUNICATION ENGINEER
        </motion.p>

        {/* Engineering Vision Statement */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          className="max-w-xl mx-auto space-y-2 mb-8 bg-[#292B27]/70 backdrop-blur-md p-4 sm:p-5 rounded-xl border border-[#B17B53]/20 shadow-xl"
        >
          <p className="font-display text-lg sm:text-2xl font-bold uppercase tracking-tight text-[#F4EBDD]">
            "I HAVE IDEAS. I BUILD THEM."
          </p>
          <p className="font-mono text-xs sm:text-sm text-[#DACAB0]/80 leading-relaxed">
            Building real-world systems through robotics, embedded systems, IoT and electronics.
          </p>
        </motion.div>

        {/* Action Triggers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          {/* PRIMARY CTA: ENTER STUDIO */}
          <button
            onClick={handleEnterStudio}
            disabled={isInitializing}
            className="group relative w-full sm:w-auto flex items-center justify-center space-x-3 px-8 py-4 min-h-[54px] rounded-lg bg-[#B17B53] text-[#181A17] hover:bg-amber-400 active:scale-95 transition-all shadow-[0_0_25px_rgba(177,123,83,0.4)] cursor-pointer font-mono font-bold text-sm uppercase tracking-wider disabled:opacity-50"
          >
            <div className="w-6 h-6 rounded-full bg-[#181A17] text-[#B17B53] flex items-center justify-center group-hover:bg-[#181A17] group-hover:text-amber-400 transition-colors">
              <Play className="w-3 h-3 fill-current ml-0.5" />
            </div>
            <span>{isInitializing ? 'INITIALIZING STUDIO...' : 'ENTER STUDIO'}</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          {/* SECONDARY CTA: JUMP DIRECT TO 3D CIRCUIT WORLD */}
          <button
            onClick={handleEnter3D}
            disabled={isInitializing}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-4 min-h-[54px] rounded-lg border-2 border-[#DACAB0]/30 hover:border-[#DACAB0] bg-white/5 hover:bg-white/10 text-[#F4EBDD] active:scale-95 transition-all cursor-pointer font-mono text-xs font-bold uppercase tracking-wider disabled:opacity-50"
          >
            <Compass className="w-4 h-4 text-[#B17B53]" />
            <span>EXPLORE 3D WORLD DIRECTLY</span>
          </button>
        </motion.div>
      </main>

      {/* FOOTER BAR: Engineering Specifications & Node Status */}
      <footer className="relative z-20 w-full max-w-6xl mx-auto px-6 py-4 border-t border-white/10 flex flex-wrap items-center justify-between text-[10px] font-mono text-[#DACAB0]/60 gap-2">
        <div className="flex items-center space-x-3">
          <span>SYS.SPEC: ESP32 · LoRa · PID 200Hz</span>
          <span className="hidden sm:inline">|</span>
          <span>5 ACTIVE HARDWARE NODES</span>
        </div>
        <div className="flex items-center space-x-2">
          <Terminal className="w-3 h-3 text-[#B17B53]" />
          <span>© {new Date().getFullYear()} AJAY JADHAO // ALL CIRCUITS ARMED</span>
        </div>
      </footer>
    </div>
  );
}
