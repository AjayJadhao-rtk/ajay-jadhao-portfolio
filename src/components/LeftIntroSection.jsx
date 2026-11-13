import React from 'react';
import { motion } from 'framer-motion';
import { Play, Download, Github, Linkedin, Mail } from 'lucide-react';
import SatelliteRadar from './SatelliteRadar';
import { audioEngine } from '../utils/audioSystem';

/**
 * LeftIntroSection features clean, professional industrial engineering typography:
 * 1. Monospace hardware telemetry overline
 * 2. Bold, authoritative architectural sans-serif headline: AJAY JADHAO
 * 3. Precision credentials: ELECTRONICS & TELECOMMUNICATION ENGINEER
 * 4. Authoritative engineering ethos: "I HAVE IDEAS. I BUILD THEM."
 * 5. High-contrast solid/outline action triggers
 * 6. Telecommunications ground station with pulsing RF radar
 */
export default function LeftIntroSection({ onExploreClick, onResumeClick }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16, filter: 'blur(3px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <div className="relative z-20 flex flex-col justify-between h-full max-w-xl pr-1 sm:pr-2 lg:pr-6 pointer-events-auto">
      
      {/* Top Editorial Identity Block - Framed in clean architectural dossier card on mobile */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.15 }}
        className="rounded-xl lg:rounded-none bg-[#E9DDC7]/92 sm:bg-[#E9DDC7]/85 lg:bg-transparent backdrop-blur-md lg:backdrop-blur-none border border-[#292B27]/15 lg:border-none shadow-xl lg:shadow-none p-5 sm:p-6 lg:p-0 space-y-4 pt-4 lg:pt-2 transition-all"
      >
        
        {/* HIERARCHY LEVEL 1: Hardware Engineering Overline (No foreign script, pure technical) */}
        <motion.div variants={itemVariants} className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-[#B17B53] inline-block animate-pulse" />
          <span className="font-mono text-[9.5px] sm:text-[10px] tracking-[0.2em] text-[#89634C] uppercase font-bold">
            SYS // ROBOTICS & EMBEDDED SYSTEMS
          </span>
        </motion.div>

        {/* HIERARCHY LEVEL 2: Authoritative Architectural Engineering Headline */}
        <motion.div
          variants={itemVariants}
          className="select-none tracking-[-0.03em] leading-none group cursor-default"
          onMouseEnter={() => audioEngine.playHover()}
        >
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold uppercase tracking-tight text-[#292B27] drop-shadow-xs transition-transform duration-300 group-hover:translate-x-1">
            AJAY JADHAO
          </h1>
        </motion.div>

        {/* HIERARCHY LEVEL 3: Technical Engineering Role Subtitle */}
        <motion.div variants={itemVariants} className="pt-0.5">
          <p className="font-mono text-xs sm:text-[13px] font-bold tracking-[0.14em] uppercase text-[#626B50]">
            ELECTRONICS & TELECOMMUNICATION ENGINEER
          </p>
        </motion.div>

        {/* HIERARCHY LEVEL 4: Engineering Vision & Scope */}
        <motion.div
          variants={itemVariants}
          className="pt-1 border-l-2 border-[#B17B53] pl-3.5 space-y-1"
        >
          <p className="font-display text-base sm:text-lg font-bold uppercase tracking-tight text-[#292B27] leading-tight">
            "I HAVE IDEAS. I BUILD THEM."
          </p>
          <p className="font-sans text-xs sm:text-[13px] text-[#292B27]/85 leading-relaxed font-medium max-w-md">
            Building real-world systems through robotics, embedded systems, IoT and electronics.
          </p>
        </motion.div>

        {/* HIERARCHY LEVEL 5: Action Triggers (Solid Charcoal vs Outline Ivory, min 44px touch targets) */}
        <motion.div
          variants={itemVariants}
          className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
        >
          {/* Primary CTA: Solid Charcoal */}
          <button
            onMouseEnter={() => audioEngine.playHover()}
            onClick={() => {
              audioEngine.playClick();
              onExploreClick();
            }}
            className="group relative flex items-center justify-center space-x-2.5 px-6 py-3 min-h-[48px] rounded-md bg-[#292B27] text-[#F4EBDD] hover:bg-[#1E201D] hover:shadow-lg hover:shadow-[#292B27]/25 transition-all duration-200 active:scale-98 cursor-pointer shadow-md"
          >
            <div className="w-5 h-5 rounded-full bg-[#B17B53] flex items-center justify-center text-[#292B27] group-hover:bg-amber-400 transition-colors">
              <Play className="w-2.5 h-2.5 fill-current ml-0.5 text-[#F4EBDD]" />
            </div>
            <span className="font-mono text-xs font-bold tracking-wider uppercase">
              Explore Projects
            </span>
          </button>

          {/* Secondary CTA: Outline Warm Ivory */}
          <button
            onMouseEnter={() => audioEngine.playHover()}
            onClick={() => {
              audioEngine.playClick();
              onResumeClick();
            }}
            className="group flex items-center justify-center space-x-2 px-5 py-3 min-h-[48px] rounded-md border-2 border-[#292B27] bg-[#F4EBDD] text-[#292B27] hover:bg-[#292B27] hover:text-[#F4EBDD] transition-all duration-200 active:scale-98 cursor-pointer shadow-xs"
          >
            <Download className="w-4 h-4 transition-transform duration-200 group-hover:translate-y-0.5" />
            <span className="font-mono text-xs font-bold tracking-wider uppercase">
              Download Resume
            </span>
          </button>
        </motion.div>

        {/* HIERARCHY LEVEL 6: Social Identity Badges & Geolocation Stamp (Min 44px tap targets) */}
        <motion.div variants={itemVariants} className="pt-1 flex flex-wrap items-center gap-2.5">
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub Profile"
            onMouseEnter={() => audioEngine.playHover()}
            onClick={() => audioEngine.playClick()}
            className="flex items-center justify-center min-w-[44px] min-h-[44px] w-11 h-11 rounded-md border border-[#292B27]/30 bg-[#F4EBDD] text-[#292B27] hover:bg-[#292B27] hover:text-[#F4EBDD] hover:border-[#292B27] transition-all duration-200 shadow-xs"
          >
            <Github className="w-4 h-4" />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn Profile"
            onMouseEnter={() => audioEngine.playHover()}
            onClick={() => audioEngine.playClick()}
            className="flex items-center justify-center min-w-[44px] min-h-[44px] w-11 h-11 rounded-md border border-[#292B27]/30 bg-[#F4EBDD] text-[#292B27] hover:bg-[#292B27] hover:text-[#F4EBDD] hover:border-[#292B27] transition-all duration-200 shadow-xs"
          >
            <Linkedin className="w-4 h-4" />
          </a>
          <a
            href="mailto:ajayjadhao@example.com"
            aria-label="Send Email"
            onMouseEnter={() => audioEngine.playHover()}
            onClick={() => audioEngine.playClick()}
            className="flex items-center justify-center min-w-[44px] min-h-[44px] w-11 h-11 rounded-md border border-[#292B27]/30 bg-[#F4EBDD] text-[#292B27] hover:bg-[#292B27] hover:text-[#F4EBDD] hover:border-[#292B27] transition-all duration-200 shadow-xs"
          >
            <Mail className="w-4 h-4" />
          </a>

          <div className="h-4 w-[1px] bg-[#292B27]/25 mx-1 hidden sm:block" />

          <span className="text-[10px] font-mono text-[#626B50] tracking-widest uppercase font-bold">
            18.52°N 73.85°E // PUNE, IN
          </span>
        </motion.div>
      </motion.div>

      {/* HIERARCHY LEVEL 7: Bottom Telecommunication Parabolic Ground Station with Scroll Animation */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      >
        <SatelliteRadar />
      </motion.div>
    </div>
  );
}
