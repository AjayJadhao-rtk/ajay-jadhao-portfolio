import React, { useState } from 'react';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { audioEngine } from '../utils/audioSystem';

/**
 * HeroTypography Component
 * 
 * Recreates the exact typography layout, font hierarchy, and color scheme
 * from Figma with rich micro-interactivity:
 * - Live status beacon
 * - Interactive philosophy pillar cards with acoustic feedback
 * - Floating keyboard shortcuts pill
 */
export default function HeroTypography({ onExploreClick, onAboutClick }) {
  const [activePillar, setActivePillar] = useState(null);

  const handlePrimaryClick = () => {
    audioEngine.playClick();
    if (onExploreClick) {
      onExploreClick();
    } else {
      const el = document.getElementById('projects');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSecondaryClick = () => {
    audioEngine.playClick();
    if (onAboutClick) {
      onAboutClick();
    } else {
      const el = document.getElementById('about');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const pillars = [
    {
      id: 'ideas',
      title: 'IDEAS',
      subtitle: 'Better Thinking',
      detail: 'First-principles architecture & algorithms',
    },
    {
      id: 'design',
      title: 'DESIGN',
      subtitle: 'Meaningful Design',
      detail: 'Sensory UI/UX & precision schematics',
    },
    {
      id: 'solutions',
      title: 'SOLUTIONS',
      subtitle: 'Real Impact',
      detail: 'Working robots, IoT devices & web apps',
    },
  ];

  return (
    <div className="relative w-full h-full max-w-[1920px] mx-auto select-none pointer-events-none flex flex-col justify-between">
      
      {/* ============================================================== */}
      {/* 1. LEFT MARGIN TECHNICAL ACCENTS & KEYBOARD SHORTCUTS          */}
      {/* ============================================================== */}
      <div className="hidden lg:flex flex-col justify-between absolute left-6 xl:left-12 top-20 bottom-10 z-20 pointer-events-none text-[#1A2A2D]/70 font-mono select-none">
        {/* Top left marker */}
        <div className="space-y-1">
          <p className="font-bold text-xs tracking-widest text-[#0E1F21]">01</p>
          <p className="text-[10px] tracking-widest uppercase text-[#6B7B7D] leading-tight font-inter font-medium">
            IDEAS<br />INTO<br />IMPACT
          </p>
        </div>

        {/* Mid left technical tags */}
        <div className="space-y-1.5 text-[9px] tracking-[0.25em] uppercase text-[#6B7B7D] pl-2 border-l border-[#6A8E8B]/40 font-inter">
          <p>BUILD</p>
          <p>DESIGN</p>
          <p>LEARN</p>
          <p className="text-[#0E1F21] font-bold">IMPACT</p>
        </div>

        {/* Interactive Keyboard Shortcuts Widget */}
        <div className="pointer-events-auto bg-[#FAF6EE]/95 backdrop-blur-md border border-[#2C3835]/25 rounded-xl p-3 shadow-md text-[10px] font-mono space-y-1.5 transition-all hover:border-[#1E4E49]">
          <div className="flex items-center space-x-1.5 text-[#0E1F21] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="tracking-wider uppercase text-[9px]">HOTKEYS</span>
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[8.5px] text-[#5A6966]">
            <span><kbd className="bg-[#E5DCD0] px-1 py-0.5 rounded font-bold text-[#0E1F21]">1-4</kbd> Sections</span>
            <span><kbd className="bg-[#E5DCD0] px-1 py-0.5 rounded font-bold text-[#0E1F21]">W</kbd> 3D World</span>
            <span><kbd className="bg-[#E5DCD0] px-1 py-0.5 rounded font-bold text-[#0E1F21]">M</kbd> Music</span>
            <span><kbd className="bg-[#E5DCD0] px-1 py-0.5 rounded font-bold text-[#0E1F21]">Tap</kbd> Character</span>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. MAIN RIGHT-SIDE HERO TYPOGRAPHY COLUMN                     */}
      {/* ============================================================== */}
      <div className="w-full flex justify-end px-2 sm:px-6 lg:pr-12 xl:pr-16 pt-1 sm:pt-5 lg:pt-6 z-30">
        <div className="w-full lg:w-[46%] xl:w-[40%] max-w-[540px] pointer-events-auto flex flex-col items-start text-left bg-[#FAF6EE]/95 lg:bg-transparent border border-[#2C3835]/20 lg:border-none p-4 sm:p-5 lg:p-0 rounded-2xl lg:rounded-none shadow-lg lg:shadow-none">
          
          {/* Overline / Tagline: CREATIVE. CURIOUS. BUILDER. — */}
          <div className="flex items-center space-x-2 sm:space-x-3 mb-1.5 sm:mb-3">
            <span className="font-inter font-semibold text-[10px] sm:text-xs md:text-[13px] tracking-[0.25em] text-[#1E3A32] uppercase">
              CREATIVE.&nbsp;&nbsp;CURIOUS.&nbsp;&nbsp;BUILDER.
            </span>
            <span className="w-6 sm:w-12 h-[1px] bg-[#6A8E8B]/60 inline-block align-middle" />
          </div>

          {/* Main Display Headline: TURNING IDEAS INTO IMPACT */}
          <h1
            className="font-playfair font-bold text-[#0E1F21] text-[28px] sm:text-4xl md:text-5xl lg:text-[64px] xl:text-[74px] leading-[0.98] tracking-tight uppercase mb-2 sm:mb-4 group cursor-default"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            onMouseEnter={() => audioEngine.playHover()}
          >
            <span className="block transition-transform duration-300 group-hover:translate-x-1">TURNING</span>
            <span className="block mt-0.5 sm:mt-1 transition-transform duration-300 group-hover:translate-x-1">IDEAS INTO</span>
            
            {/* "IMPACT" with brand gradient + calligraphic swoosh */}
            <span className="relative inline-block mt-0.5 sm:mt-1">
              <span
                className="bg-gradient-to-r from-[#1E3A32] via-[#6A8E8B] to-[#7DA5A1] bg-clip-text text-transparent inline-block transition-transform duration-300 group-hover:scale-105"
                style={{
                  backgroundImage: 'linear-gradient(135deg, #1E3A32 0%, #6A8E8B 50%, #7DA5A1 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                IMPACT
              </span>
              
              {/* Calligraphic Underline Swoosh from Figma reference */}
              <svg
                className="absolute -bottom-1 sm:-bottom-2.5 left-0 w-full max-w-[200px] sm:max-w-[300px] h-2 sm:h-3.5 overflow-visible pointer-events-none"
                viewBox="0 0 300 12"
                fill="none"
              >
                <path
                  d="M 2 4 C 60 10, 170 11, 295 3 C 250 7, 120 9, 2 4 Z"
                  fill="#6A8E8B"
                  opacity="0.85"
                />
              </svg>
            </span>
          </h1>

          {/* Subtitle / Bio Paragraph */}
          <p className="font-inter font-normal text-[#1A2A2D]/90 text-xs sm:text-sm md:text-base leading-relaxed max-w-[450px] mb-3 sm:mb-5">
            I&rsquo;m a designer &amp; developer who loves building meaningful digital experiences.
          </p>

          {/* Action Buttons: View My Work & About Me */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-6 mb-3 sm:mb-5">
            {/* Primary Action Button (#0E1F21 pill button) */}
            <button
              onClick={handlePrimaryClick}
              onMouseEnter={() => audioEngine.playHover()}
              className="group relative inline-flex items-center space-x-2 px-5 sm:px-7 py-2 sm:py-3 rounded-full bg-[#0E1F21] text-[#FFFFFF] font-inter font-semibold text-xs sm:text-sm shadow-md hover:bg-[#1E3A32] hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
            >
              <span>View My Work</span>
              <ArrowRight className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-[#FFFFFF] group-hover:translate-x-1 transition-transform duration-200" />
            </button>

            {/* Secondary Action Button (Text with underline) */}
            <button
              onClick={handleSecondaryClick}
              onMouseEnter={() => audioEngine.playHover()}
              className="relative inline-flex items-center font-inter font-semibold text-xs sm:text-sm text-[#1A2A2D] hover:text-[#0E1F21] transition-colors py-1 cursor-pointer after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#1E3A32] hover:after:bg-[#0E1F21] after:transition-colors duration-200"
            >
              <span>About Me</span>
            </button>
          </div>

          {/* Three-Column Interactive Philosophy Row */}
          <div className="w-full max-w-[460px] flex items-center justify-between pt-2.5 sm:pt-3.5 border-t border-[#D9E3E1]">
            {pillars.map((p, idx) => (
              <React.Fragment key={p.id}>
                {idx > 0 && <div className="w-[1px] h-6 sm:h-8 bg-[#D9E3E1]" />}
                <div
                  onMouseEnter={() => {
                    audioEngine.playHover();
                    setActivePillar(p.id);
                  }}
                  onMouseLeave={() => setActivePillar(null)}
                  className={`flex-1 px-1.5 sm:px-3 py-1 rounded-md transition-all cursor-pointer ${
                    activePillar === p.id 
                      ? 'bg-[#1E4E49]/10 -translate-y-0.5' 
                      : 'hover:bg-black/[0.03]'
                  }`}
                >
                  <h4 className="font-inter font-bold text-[10px] sm:text-xs md:text-[13px] tracking-wider text-[#1A2A2D] uppercase mb-0.5">
                    {p.title}
                  </h4>
                  <p className="font-inter font-light text-[9px] sm:text-xs md:text-[12.5px] text-[#6B7B7D]">
                    {activePillar === p.id ? p.detail : p.subtitle}
                  </p>
                </div>
              </React.Fragment>
            ))}
          </div>

        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. BOTTOM RIGHT TAGLINE                                       */}
      {/* ============================================================== */}
      <div className="hidden md:flex w-full justify-end px-6 sm:px-12 lg:px-16 pb-2 sm:pb-3 z-20 pointer-events-none">
        <div className="flex items-center space-x-3 text-[9px] sm:text-[10px] md:text-[10.5px] font-inter font-medium tracking-[0.22em] text-[#6B7B7D] uppercase">
          <span className="w-6 sm:w-10 h-[1px] bg-[#6A8E8B]/50" />
          <span>BUILDING DIGITAL EXPERIENCES FOR A BRIGHTER TOMORROW</span>
        </div>
      </div>

    </div>
  );
}
