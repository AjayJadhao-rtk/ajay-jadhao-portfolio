import React from 'react';
import { ArrowRight } from 'lucide-react';
import { audioEngine } from '../utils/audioSystem';

/**
 * HeroTypography Component
 * 
 * Recreates the exact typography layout, font hierarchy, and color scheme
 * from the user's Figma Typography reference and Color Palette:
 * 
 * Palette:
 * - Primary:        #0E1F21 (Headings, Buttons, Emphasis)
 * - Secondary:      #6A8E8B (Highlights, Accent Text, Underlines, Gradient Start)
 * - Tertiary:       #D9E3E1 (Dividers, Borders, Gradient End)
 * - Text Primary:   #1A2A2D (Body Text, Navigation, Overline)
 * - Text Secondary: #6B7B7D (Subtext, Category Labels)
 * 
 * Typography:
 * - Headings: Playfair Display (Bold, high-contrast serif)
 * - Body / Overline / UI: Inter (Clean modern sans-serif with tracking)
 * - Gradient Text: "IMPACT" with linear-gradient(#6A8E8B -> #D9E3E1) + calligraphic swoosh
 * 
 * Layout:
 * - Precisely mapped to the right-hand column (x: 888-1388, y: 152-730 in 1451x821 viewBox)
 * - Sits naturally in the sky above the bottom tree canopy line
 * - Responsive collapse for tablets and mobile viewports
 */
export default function HeroTypography({ onExploreClick, onAboutClick }) {
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

  return (
    <div className="relative w-full h-full max-w-[1920px] mx-auto select-none pointer-events-none flex flex-col justify-between">
      
      {/* ============================================================== */}
      {/* 1. LEFT MARGIN TECHNICAL ACCENTS (From Figma Master Template)   */}
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

        {/* Bottom left philosophy */}
        <div className="text-[9px] tracking-widest uppercase text-[#6B7B7D] leading-tight font-inter">
          <p className="text-[#0E1F21] font-semibold">A MORE</p>
          <p>MEANINGFUL</p>
          <p>TOMORROW</p>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. MAIN RIGHT-SIDE HERO TYPOGRAPHY COLUMN (From Reference Spec) */}
      {/* Positioned cleanly on the right half, leaving room for character */}
      {/* ============================================================== */}
      <div className="w-full flex justify-end px-3 sm:px-6 lg:pr-12 xl:pr-16 pt-2 sm:pt-5 lg:pt-6 z-30">
        <div className="w-full lg:w-[46%] xl:w-[40%] max-w-[540px] pointer-events-auto flex flex-col items-start text-left max-lg:bg-gradient-to-b max-lg:from-[#E9DDC7]/90 max-lg:via-[#E9DDC7]/60 max-lg:to-transparent max-lg:p-3 sm:max-lg:p-4 max-lg:rounded-2xl">
          
          {/* Overline / Tagline: CREATIVE. CURIOUS. BUILDER. — */}
          <div className="flex items-center space-x-2 sm:space-x-3 mb-1.5 sm:mb-3">
            <span className="font-inter font-semibold text-[10px] sm:text-xs md:text-[13px] tracking-[0.25em] text-[#1A2A2D] uppercase">
              CREATIVE.&nbsp;&nbsp;CURIOUS.&nbsp;&nbsp;BUILDER.
            </span>
            <span className="w-6 sm:w-12 h-[1px] bg-[#6A8E8B]/60 inline-block align-middle" />
          </div>

          {/* Main Display Headline: TURNING IDEAS INTO IMPACT */}
          <h1
            className="font-playfair font-bold text-[#0E1F21] text-[32px] sm:text-4xl md:text-5xl lg:text-[64px] xl:text-[74px] leading-[0.98] tracking-tight uppercase mb-2.5 sm:mb-4"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            <span className="block">TURNING</span>
            <span className="block mt-0.5 sm:mt-1">IDEAS INTO</span>
            
            {/* "IMPACT" with brand gradient (#6A8E8B -> #D9E3E1) + calligraphic swoosh */}
            <span className="relative inline-block mt-0.5 sm:mt-1">
              <span
                className="bg-gradient-to-r from-[#6A8E8B] via-[#7DA5A1] to-[#C2D6D3] bg-clip-text text-transparent"
                style={{
                  backgroundImage: 'linear-gradient(135deg, #6A8E8B 0%, #7DA5A1 50%, #C2D6D3 100%)',
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
          <p className="font-inter font-normal text-[#1A2A2D]/85 text-xs sm:text-sm md:text-base lg:text-[16px] leading-relaxed max-w-[450px] mb-3.5 sm:mb-5">
            I'm a designer &amp; developer who loves building meaningful digital experiences.
          </p>

          {/* Action Buttons: View My Work & About Me */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-6 mb-4 sm:mb-6">
            {/* Primary Action Button (#0E1F21 pill button) */}
            <button
              onClick={handlePrimaryClick}
              onMouseEnter={() => audioEngine.playHover()}
              className="group relative inline-flex items-center space-x-2 px-4.5 sm:px-7 py-2 sm:py-3 rounded-xl sm:rounded-2xl bg-[#0E1F21] text-[#FFFFFF] font-inter font-semibold text-xs sm:text-sm md:text-[15px] shadow-md hover:bg-[#1A2A2D] hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
            >
              <span>View My Work</span>
              <ArrowRight className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-[#FFFFFF] group-hover:translate-x-1 transition-transform duration-200" />
            </button>

            {/* Secondary Action Button (Text with #6A8E8B underline) */}
            <button
              onClick={handleSecondaryClick}
              onMouseEnter={() => audioEngine.playHover()}
              className="relative inline-flex items-center font-inter font-semibold text-xs sm:text-sm md:text-[15px] text-[#1A2A2D] hover:text-[#0E1F21] transition-colors py-1 cursor-pointer after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#6A8E8B] hover:after:bg-[#0E1F21] after:transition-colors duration-200"
            >
              <span>About Me</span>
            </button>
          </div>

          {/* Three-Column Philosophy / Highlight Stats Row */}
          <div className="w-full max-w-[460px] flex items-center justify-between pt-3 sm:pt-4.5 border-t border-[#D9E3E1]">
            {/* Column 1: IDEAS / Better Thinking */}
            <div className="flex-1 pr-1.5 sm:pr-3">
              <h4 className="font-inter font-bold text-[10px] sm:text-xs md:text-[13px] tracking-wider text-[#1A2A2D] uppercase mb-0.5">
                IDEAS
              </h4>
              <p className="font-inter font-light text-[9px] sm:text-xs md:text-[12.5px] text-[#6B7B7D]">
                Better Thinking
              </p>
            </div>

            {/* Divider 1 */}
            <div className="w-[1px] h-6 sm:h-8 bg-[#D9E3E1]" />

            {/* Column 2: DESIGN / Meaningful Design */}
            <div className="flex-1 px-1.5 sm:px-4">
              <h4 className="font-inter font-bold text-[10px] sm:text-xs md:text-[13px] tracking-wider text-[#1A2A2D] uppercase mb-0.5">
                DESIGN
              </h4>
              <p className="font-inter font-light text-[9px] sm:text-xs md:text-[12.5px] text-[#6B7B7D]">
                Meaningful Design
              </p>
            </div>

            {/* Divider 2 */}
            <div className="w-[1px] h-6 sm:h-8 bg-[#D9E3E1]" />

            {/* Column 3: SOLUTIONS / Real Impact */}
            <div className="flex-1 pl-1.5 sm:pl-4">
              <h4 className="font-inter font-bold text-[10px] sm:text-xs md:text-[13px] tracking-wider text-[#1A2A2D] uppercase mb-0.5">
                SOLUTIONS
              </h4>
              <p className="font-inter font-light text-[9px] sm:text-xs md:text-[12.5px] text-[#6B7B7D]">
                Real Impact
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. BOTTOM RIGHT TAGLINE (From Figma Template)                  */}
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
