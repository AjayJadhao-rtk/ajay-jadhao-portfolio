import React from 'react';
import { motion } from 'framer-motion';
import { Play, Download, Github, Linkedin, Mail, Sparkles } from 'lucide-react';
import SatelliteRadar from './SatelliteRadar';
import { audioEngine } from '../utils/audioSystem';

/**
 * LeftIntroSection features refined editorial typographic hierarchy with
 * fluid, butter-smooth scroll animations via framer-motion:
 * 1. Japanese Mincho calligraphy accent: エンジニアの旅 (Journey of an Engineer)
 * 2. High-contrast luxury editorial serif headline with terracotta copper initial "J"
 * 3. Monospace engineering credentials & rhythmic 3-line bio
 * 4. High-contrast solid/outline action triggers
 * 5. Telecommunications ground station with pulsing RF radar
 * 6. Translucent frosted parchment dossier card on mobile viewports for 100% readability
 */
export default function LeftIntroSection({ onExploreClick, onResumeClick }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.09,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 18, filter: 'blur(3px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.65,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <div className="relative z-20 flex flex-col justify-between h-full max-w-xl pr-1 sm:pr-2 lg:pr-6 pointer-events-auto">
      
      {/* Top Editorial Identity Block - Wrapped in frosted parchment card on mobile */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.15 }}
        className="rounded-2xl lg:rounded-none bg-[#E9DDC7]/90 sm:bg-[#E9DDC7]/85 lg:bg-transparent backdrop-blur-md lg:backdrop-blur-none border border-[#292B27]/15 lg:border-none shadow-xl lg:shadow-none p-5 sm:p-6 lg:p-0 space-y-4 pt-4 lg:pt-2 transition-all"
      >
        
        {/* HIERARCHY LEVEL 1: Japanese Calligraphy Subtitle (Journey of an Engineer) */}
        <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          <span className="font-jp text-sm sm:text-base font-normal tracking-[0.28em] text-[#626B50] select-none hover:text-[#292B27] transition-colors cursor-default">
            エンジニアの旅
          </span>
          <span className="w-6 h-[1px] bg-[#626B50]/35 inline-block" />
          <span className="font-mono text-[9px] tracking-widest text-[#89634C] uppercase font-semibold">
            JOURNEY OF AN ENGINEER
          </span>
        </motion.div>

        {/* HIERARCHY LEVEL 2: High-Contrast Editorial Name Headline */}
        <motion.div
          variants={itemVariants}
          className="select-none tracking-[-0.03em] leading-[0.86] group cursor-default"
          onMouseEnter={() => audioEngine.playHover()}
        >
          <h1 className="font-editorial text-5xl sm:text-7xl md:text-8xl lg:text-[6.2rem] font-bold text-[#292B27] transition-transform duration-300 group-hover:translate-x-1">
            Ajay
          </h1>
          <h1 className="font-editorial text-5xl sm:text-7xl md:text-8xl lg:text-[6.2rem] font-bold text-[#292B27] flex items-baseline transition-transform duration-300 group-hover:translate-x-1.5">
            <span className="text-[#B17B53] font-editorial italic font-medium pr-0.5 group-hover:text-amber-600 transition-colors">
              J
            </span>
            adhao
          </h1>
        </motion.div>

        {/* HIERARCHY LEVEL 3: Technical Engineering Role Subtitle */}
        <motion.div variants={itemVariants} className="pt-1 pb-0.5">
          <p className="font-mono text-xs sm:text-[13px] md:text-[14px] text-[#26352D] font-bold tracking-wide flex flex-wrap items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-[#292B27]/8 border border-[#292B27]/12">
              Electronics & Telecommunication Engineer
            </span>
          </p>
        </motion.div>

        {/* HIERARCHY LEVEL 4: Rhythmic 3-Line Engineering Bio */}
        <motion.div
          variants={itemVariants}
          className="font-mono text-xs sm:text-[13px] text-[#292B27]/90 leading-[1.65] max-w-sm sm:max-w-md pt-0.5 border-l-2 border-[#B17B53] pl-3.5 bg-[#F4EBDD]/40 rounded-r-md py-1"
        >
          <p className="block font-medium">Building real-world systems through</p>
          <p className="block font-semibold text-[#292B27]">Electronics, Robotics, IoT and</p>
          <p className="block text-[#89634C] font-semibold">Embedded Technology.</p>
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
            className="group relative flex items-center justify-center space-x-2.5 px-6 py-3 min-h-[48px] rounded-lg bg-[#292B27] text-[#F4EBDD] hover:bg-[#1E201D] hover:shadow-lg hover:shadow-[#292B27]/25 transition-all duration-200 active:scale-98 cursor-pointer shadow-md"
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
            className="group flex items-center justify-center space-x-2 px-5 py-3 min-h-[48px] rounded-lg border-2 border-[#292B27] bg-[#F4EBDD] text-[#292B27] hover:bg-[#292B27] hover:text-[#F4EBDD] transition-all duration-200 active:scale-98 cursor-pointer shadow-sm"
          >
            <Download className="w-4 h-4 transition-transform duration-200 group-hover:translate-y-0.5" />
            <span className="font-mono text-xs font-bold tracking-wider uppercase">
              Download Resume
            </span>
          </button>
        </motion.div>

        {/* HIERARCHY LEVEL 6: Social Identity Badges & Geolocation Stamp (Min 44px tap targets) */}
        <motion.div variants={itemVariants} className="pt-2 flex flex-wrap items-center gap-2.5">
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub Profile"
            onMouseEnter={() => audioEngine.playHover()}
            onClick={() => audioEngine.playClick()}
            className="flex items-center justify-center min-w-[44px] min-h-[44px] w-11 h-11 rounded-lg border border-[#292B27]/30 bg-[#F4EBDD] text-[#292B27] hover:bg-[#292B27] hover:text-[#F4EBDD] hover:border-[#292B27] transition-all duration-200 shadow-sm"
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
            className="flex items-center justify-center min-w-[44px] min-h-[44px] w-11 h-11 rounded-lg border border-[#292B27]/30 bg-[#F4EBDD] text-[#292B27] hover:bg-[#292B27] hover:text-[#F4EBDD] hover:border-[#292B27] transition-all duration-200 shadow-sm"
          >
            <Linkedin className="w-4 h-4" />
          </a>
          <a
            href="mailto:ajayjadhao@example.com"
            aria-label="Send Email"
            onMouseEnter={() => audioEngine.playHover()}
            onClick={() => audioEngine.playClick()}
            className="flex items-center justify-center min-w-[44px] min-h-[44px] w-11 h-11 rounded-lg border border-[#292B27]/30 bg-[#F4EBDD] text-[#292B27] hover:bg-[#292B27] hover:text-[#F4EBDD] hover:border-[#292B27] transition-all duration-200 shadow-sm"
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
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      >
        <SatelliteRadar />
      </motion.div>
    </div>
  );
}
