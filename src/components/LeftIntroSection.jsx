import React from 'react';
import { Play, Download, Github, Linkedin, Mail } from 'lucide-react';
import SatelliteRadar from './SatelliteRadar';
import { audioEngine } from '../utils/audioSystem';

/**
 * LeftIntroSection features refined editorial typographic hierarchy:
 * 1. Japanese Mincho calligraphy accent: エンジニアの旅 (Journey of an Engineer)
 * 2. High-contrast luxury editorial serif headline with terracotta copper initial "J"
 * 3. Precision monospace engineering credentials & rhythmic 3-line bio
 * 4. High-contrast solid/outline action triggers
 * 5. Telecommunications ground station with pulsing RF radar
 */
export default function LeftIntroSection({ onExploreClick, onResumeClick }) {
  return (
    <div className="relative z-20 flex flex-col justify-between h-full max-w-xl pr-2 lg:pr-6 pointer-events-auto">
      
      {/* Top Editorial Identity Block */}
      <div className="space-y-4 pt-1 sm:pt-2">
        
        {/* HIERARCHY LEVEL 1: Japanese Calligraphy Subtitle (Journey of an Engineer) */}
        <div className="inline-flex items-center space-x-2.5">
          <span className="font-jp text-sm sm:text-base font-normal tracking-[0.28em] text-[#626B50] select-none">
            エンジニアの旅
          </span>
          <span className="w-6 h-[1px] bg-[#626B50]/35 inline-block" />
          <span className="font-mono text-[9px] tracking-widest text-[#89634C] uppercase font-semibold">
            JOURNEY OF AN ENGINEER
          </span>
        </div>

        {/* HIERARCHY LEVEL 2: High-Contrast Editorial Name Headline */}
        <div className="select-none tracking-[-0.03em] leading-[0.86]">
          <h1 className="font-editorial text-6xl sm:text-7xl md:text-8xl lg:text-[6.2rem] font-bold text-[#292B27]">
            Ajay
          </h1>
          <h1 className="font-editorial text-6xl sm:text-7xl md:text-8xl lg:text-[6.2rem] font-bold text-[#292B27] flex items-baseline">
            <span className="text-[#B17B53] font-editorial italic font-medium pr-0.5">J</span>adhao
          </h1>
        </div>

        {/* HIERARCHY LEVEL 3: Technical Engineering Role Subtitle */}
        <div className="pt-1.5 pb-0.5">
          <p className="font-mono text-xs sm:text-[13px] md:text-[14px] text-[#26352D] font-semibold tracking-wide flex items-center space-x-2">
            <span>Electronics & Telecommunication Engineer</span>
          </p>
        </div>

        {/* HIERARCHY LEVEL 4: Rhythmic 3-Line Engineering Bio */}
        <div className="font-mono text-xs sm:text-[12.5px] text-[#292B27]/85 leading-[1.65] max-w-sm sm:max-w-md pt-0.5 border-l-2 border-[#B17B53]/50 pl-3">
          <p className="block">Building real-world systems through</p>
          <p className="block font-medium text-[#292B27]">Electronics, Robotics, IoT and</p>
          <p className="block text-[#89634C]">Embedded Technology.</p>
        </div>

        {/* HIERARCHY LEVEL 5: Action Triggers (Solid Charcoal vs Outline Ivory, min 44px touch targets) */}
        <div className="pt-2.5 flex flex-wrap items-center gap-3">
          {/* Primary CTA: Solid Charcoal */}
          <button
            onMouseEnter={() => audioEngine.playHover()}
            onClick={() => {
              audioEngine.playClick();
              onExploreClick();
            }}
            className="group relative flex items-center space-x-2.5 px-5 py-3 min-h-[44px] rounded-md bg-[#292B27] text-[#F4EBDD] hover:bg-[#1E201D] hover:shadow-lg hover:shadow-[#292B27]/25 transition-all duration-200 active:translate-y-0.5 cursor-pointer shadow-sm"
          >
            <div className="w-4 h-4 rounded-full bg-[#B17B53] flex items-center justify-center text-[#292B27] group-hover:bg-amber-400 transition-colors">
              <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
            </div>
            <span className="font-mono text-xs font-semibold tracking-wider uppercase">
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
            className="group flex items-center space-x-2 px-4 py-3 min-h-[44px] rounded-md border border-[#292B27] bg-[#F4EBDD]/90 text-[#292B27] hover:bg-[#292B27] hover:text-[#F4EBDD] transition-all duration-200 active:translate-y-0.5 cursor-pointer shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-y-0.5" />
            <span className="font-mono text-xs font-semibold tracking-wider uppercase">
              Download Resume
            </span>
          </button>
        </div>

        {/* HIERARCHY LEVEL 6: Social Identity Badges & Geolocation Stamp (Min 44px tap targets) */}
        <div className="pt-2 flex items-center space-x-2.5">
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub Profile"
            onMouseEnter={() => audioEngine.playHover()}
            onClick={() => audioEngine.playClick()}
            className="flex items-center justify-center min-w-[44px] min-h-[44px] w-11 h-11 rounded border border-[#292B27]/30 bg-[#F4EBDD]/80 text-[#292B27] hover:bg-[#292B27] hover:text-[#F4EBDD] hover:border-[#292B27] transition-all duration-200 shadow-2xs"
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
            className="flex items-center justify-center min-w-[44px] min-h-[44px] w-11 h-11 rounded border border-[#292B27]/30 bg-[#F4EBDD]/80 text-[#292B27] hover:bg-[#292B27] hover:text-[#F4EBDD] hover:border-[#292B27] transition-all duration-200 shadow-2xs"
          >
            <Linkedin className="w-4 h-4" />
          </a>
          <a
            href="mailto:ajayjadhao@example.com"
            aria-label="Send Email"
            onMouseEnter={() => audioEngine.playHover()}
            onClick={() => audioEngine.playClick()}
            className="flex items-center justify-center min-w-[44px] min-h-[44px] w-11 h-11 rounded border border-[#292B27]/30 bg-[#F4EBDD]/80 text-[#292B27] hover:bg-[#292B27] hover:text-[#F4EBDD] hover:border-[#292B27] transition-all duration-200 shadow-2xs"
          >
            <Mail className="w-4 h-4" />
          </a>

          <div className="h-4 w-[1px] bg-[#292B27]/25 mx-1" />

          <span className="text-[9.5px] font-mono text-[#626B50] tracking-widest uppercase font-medium">
            18.52°N 73.85°E // PUNE, IN
          </span>
        </div>
      </div>

      {/* HIERARCHY LEVEL 7: Bottom Telecommunication Parabolic Ground Station */}
      <SatelliteRadar />
    </div>
  );
}
