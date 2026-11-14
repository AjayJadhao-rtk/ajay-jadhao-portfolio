import React from 'react';
import { MapPin, GraduationCap, Briefcase, ArrowRight, ExternalLink } from 'lucide-react';
import { audioEngine } from '../utils/audioSystem';

/**
 * Custom SVG Icons matching the exact artwork in "About section reference image.png"
 */

// Card 1 Icon: Smart Robotics Rover with wheels, mast, and sensor head
function RoverIcon({ className = "w-8 h-8" }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 16V8M20 8H28M24 8L26 5" stroke="#0E1F21" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="20" y="10" width="8" height="6" rx="1.5" stroke="#0E1F21" strokeWidth="2" fill="#E4ECE7" />
      <circle cx="24" cy="13" r="1.5" fill="#6A8E8B" />
      <rect x="12" y="16" width="24" height="12" rx="2" stroke="#0E1F21" strokeWidth="2.2" fill="#FFFFFF" />
      <line x1="16" y1="20" x2="32" y2="20" stroke="#6A8E8B" strokeWidth="1.5" strokeDasharray="2 2" />
      <line x1="16" y1="24" x2="32" y2="24" stroke="#6A8E8B" strokeWidth="1.5" strokeDasharray="2 2" />
      <path d="M14 28L10 34M34 28L38 34M24 28V34" stroke="#0E1F21" strokeWidth="2" strokeLinecap="round" />
      <rect x="7" y="32" width="7" height="9" rx="2" fill="#0E1F21" />
      <rect x="21" y="32" width="6" height="9" rx="2" fill="#0E1F21" />
      <rect x="34" y="32" width="7" height="9" rx="2" fill="#0E1F21" />
      <line x1="8" y1="36.5" x2="13" y2="36.5" stroke="#FFFFFF" strokeWidth="1" />
      <line x1="22" y1="36.5" x2="26" y2="36.5" stroke="#FFFFFF" strokeWidth="1" />
      <line x1="35" y1="36.5" x2="40" y2="36.5" stroke="#FFFFFF" strokeWidth="1" />
    </svg>
  );
}

// Card 2 Icon: Browser Window with Isometric 3D Cube inside
function Browser3DCubeIcon({ className = "w-8 h-8" }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="8" width="36" height="32" rx="4" stroke="#0E1F21" strokeWidth="2.2" fill="#FFFFFF" />
      <path d="M6 16H42" stroke="#0E1F21" strokeWidth="1.8" />
      <circle cx="11" cy="12" r="1.5" fill="#EF4444" />
      <circle cx="16" cy="12" r="1.5" fill="#F59E0B" />
      <circle cx="21" cy="12" r="1.5" fill="#10B981" />
      <g transform="translate(24, 28) scale(0.72)">
        <polygon points="0,-16 14,-8 0,0 -14,-8" fill="#F5EAE0" stroke="#0E1F21" strokeWidth="2" strokeLinejoin="round" />
        <polygon points="-14,-8 0,0 0,16 -14,8" fill="#EAD9CD" stroke="#0E1F21" strokeWidth="2" strokeLinejoin="round" />
        <polygon points="0,0 14,-8 14,8 0,16" fill="#FBF2EB" stroke="#0E1F21" strokeWidth="2" strokeLinejoin="round" />
        <circle cx="0" cy="0" r="1.5" fill="#6A8E8B" />
      </g>
    </svg>
  );
}

// Card 3 Icon: Origami Paper Airplane in Teal
function OrigamiAirplaneIcon({ className = "w-8 h-8" }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M40 8L8 23L22 28L40 8Z" fill="#6A8E8B" stroke="#0E1F21" strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M40 8L28 38L22 28L40 8Z" fill="#4A6E6B" stroke="#0E1F21" strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M22 28L28 38L27 28L22 28Z" fill="#2A4E4B" stroke="#0E1F21" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M6 18C4 18 3 20 5 21" stroke="#6A8E8B" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 32C10 33 9 35 12 36" stroke="#6A8E8B" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default function AboutSection({ onOpen3DWorld, onExploreClick }) {

  // CARD 01 ACTION — SMART HARDWARE & ROBOTICS INQUIRY
  const handleHardwareInquiry = () => {
    audioEngine.playClick();
    const subject = encodeURIComponent('Smart Hardware & Robotics Collaboration');
    const body = encodeURIComponent(
`Hello Ajay,

I'm interested in collaborating on a Smart Hardware or Robotics project with you.
Here are some details about what I'm looking to build:

Project Focus (IoT / Sensors / Autonomous Robots / Embedded Systems): 
Brief Description of the Idea: 
Key Hardware Requirements: 
Target Timeline: 

Looking forward to connecting with you.

Best regards,
[Your Name]`
    );
    window.location.href = `mailto:rutikjadhao20@gmail.com?subject=${subject}&body=${body}`;
  };

  // CARD 02 ACTION — INTERACTIVE 3D & WEB (Launch 3D Circuit World)
  const handleInteractive3DClick = () => {
    audioEngine.playRadarPing();
    if (onOpen3DWorld) {
      onOpen3DWorld();
    } else {
      const el = document.getElementById('projects');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // CARD 03 ACTION — BUILD YOUR PROTOTYPE
  const handleBuildPrototype = () => {
    audioEngine.playClick();
    const subject = encodeURIComponent('Prototype Development Inquiry');
    const body = encodeURIComponent(
`Hello Ajay,

I'm interested in building a prototype with you.
Here are some initial details about my idea:

Project / Prototype Name: 
Brief Description of the Idea: 
Problem I Want to Solve: 
Key Features: 
Required Functionality: 
Preferred Components or Technologies: 
Estimated Budget: 
Expected Timeline: 

Looking forward to hearing from you.

Best regards,
[Your Name]`
    );
    window.location.href = `mailto:rutikjadhao20@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <div className="relative w-full h-full max-w-[1920px] mx-auto select-none pointer-events-none flex flex-col justify-between">
      
      {/* MAIN RIGHT-SIDE ABOUT CONTENT STAGE */}
      <div className="w-full flex justify-end px-2 sm:px-6 lg:pr-10 xl:pr-16 pt-1 sm:pt-4 lg:pt-6 z-40">
        
        {/* Solid, Elevated Parchment Card on Mobile with Full Scrollability */}
        <div className="w-full lg:w-[56%] xl:w-[52%] max-w-[720px] pointer-events-auto flex flex-col items-start text-left bg-[#FAF6EE] lg:bg-transparent border border-[#2C3835]/25 lg:border-none p-4 sm:p-6 lg:p-0 rounded-2xl lg:rounded-none shadow-xl lg:shadow-none overflow-y-auto max-h-[calc(100vh-100px)] lg:max-h-none scrollbar-thin touch-pan-y">
          
          {/* ============================================================== */}
          {/* 1. SECTION IDENTIFIER: 01 // ABOUT ——————————————             */}
          {/* ============================================================== */}
          <div className="about-eyebrow w-full flex items-center space-x-3 mb-2 sm:mb-3 flex-shrink-0">
            <span className="font-mono text-[11px] sm:text-xs md:text-[13px] font-bold tracking-[0.25em] text-[#0E1F21] uppercase whitespace-nowrap">
              01 &nbsp;//&nbsp; ABOUT
            </span>
            <div className="flex-1 h-[1px] bg-[#6A8E8B]/40 max-w-[420px]" />
          </div>

          {/* ============================================================== */}
          {/* 2. MAIN DISPLAY HEADING: AJAY JADHAO                           */}
          {/* ============================================================== */}
          <h2
            className="about-heading font-playfair font-bold text-3xl sm:text-4xl md:text-5xl lg:text-[62px] xl:text-[72px] leading-[0.96] tracking-tight uppercase mb-2.5 sm:mb-4 text-[#0E1F21] flex-shrink-0"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            <span>AJAY </span>
            <span
              className="bg-gradient-to-r from-[#6A8E8B] via-[#7FA6A1] to-[#27433B] bg-clip-text text-transparent inline-block"
              style={{
                backgroundImage: 'linear-gradient(135deg, #1E3A32 0%, #6A8E8B 50%, #27433B 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              JADHAO
            </span>
          </h2>

          {/* ============================================================== */}
          {/* 3. SUPPORTING BIO PARAGRAPH WITH KEY PHRASE EMPHASIS           */}
          {/* ============================================================== */}
          <p className="about-bio font-inter font-normal text-xs sm:text-sm md:text-[15px] leading-relaxed text-[#1A2A2D]/90 max-w-[640px] mb-3.5 sm:mb-5 flex-shrink-0">
            I&rsquo;m an <strong className="font-semibold text-[#0E1F21]">Electronics &amp; Telecommunication Engineering</strong> student at SSGMCE, Shegaon, who builds <strong className="font-semibold text-[#0E1F21]">smart machines, connected hardware, and interactive 3D websites</strong>. From <strong className="font-semibold text-[#0E1F21]">disaster-rescue robots for Smart India Hackathon</strong> to custom embedded devices, I turn complex engineering ideas into <strong className="font-semibold text-[#0E1F21]">working real-world products</strong>.
          </p>

          {/* ============================================================== */}
          {/* 4. PROFILE METADATA ROW (Location, Education, Availability)    */}
          {/* ============================================================== */}
          <div className="about-meta w-full grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 py-2.5 sm:py-3.5 border-y border-[#D9E3E1] mb-3.5 sm:mb-5 flex-shrink-0">
            {/* Item 1: Location */}
            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-full bg-[#E4ECE7] flex items-center justify-center flex-shrink-0 shadow-xs">
                <MapPin className="w-3.5 h-3.5 text-[#1E3A32]" />
              </div>
              <div className="min-w-0">
                <h4 className="font-inter font-bold text-xs sm:text-[12.5px] text-[#0E1F21] truncate">
                  Maharashtra, India
                </h4>
                <p className="font-inter text-[10px] sm:text-[11px] text-[#6B7B7D]">
                  Location
                </p>
              </div>
            </div>

            {/* Item 2: Education */}
            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-full bg-[#E4ECE7] flex items-center justify-center flex-shrink-0 shadow-xs">
                <GraduationCap className="w-3.5 h-3.5 text-[#1E3A32]" />
              </div>
              <div className="min-w-0">
                <h4 className="font-inter font-bold text-xs sm:text-[12.5px] text-[#0E1F21] truncate">
                  B.E. ENTC — SSGMCE
                </h4>
                <p className="font-inter text-[10px] sm:text-[11px] text-[#6B7B7D]">
                  Education
                </p>
              </div>
            </div>

            {/* Item 3: Availability */}
            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-full bg-[#E4ECE7] flex items-center justify-center flex-shrink-0 shadow-xs">
                <Briefcase className="w-3.5 h-3.5 text-[#1E3A32]" />
              </div>
              <div className="min-w-0">
                <h4 className="font-inter font-bold text-xs sm:text-[12.5px] text-[#0E1F21] truncate">
                  Open for Custom Builds
                </h4>
                <p className="font-inter text-[10px] sm:text-[11px] text-[#6B7B7D]">
                  Availability
                </p>
              </div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* 5. THREE INTERACTIVE CARDS (Preserved visual design & actions)  */}
          {/* ============================================================== */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 mb-3 flex-shrink-0">
            
            {/* CARD 01: SMART HARDWARE & ROBOTICS */}
            <button
              onClick={handleHardwareInquiry}
              onMouseEnter={() => audioEngine.playHover()}
              className="about-card-1 group relative flex flex-col items-start text-left p-3 sm:p-3.5 rounded-xl bg-[#E4ECE7] border border-[#CAD8D1] hover:border-[#1E3A32] hover:bg-[#EDF5F1] shadow-xs hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
            >
              <div className="w-full flex items-center justify-between mb-1.5">
                <RoverIcon className="w-6 h-6 text-[#0E1F21] group-hover:scale-105 transition-transform" />
                <span className="text-[9px] font-mono font-bold text-[#1E3A32] opacity-80 group-hover:opacity-100 transition-opacity">
                  INQUIRE &rarr;
                </span>
              </div>
              <h3 className="font-inter font-bold text-xs sm:text-[12px] text-[#0E1F21] tracking-wide uppercase mb-0.5 leading-snug">
                SMART HARDWARE &amp; ROBOTICS
              </h3>
              <p className="font-inter text-[10px] sm:text-[10.5px] text-[#556965] leading-relaxed">
                Custom IoT devices, sensors &amp; autonomous robots
              </p>
            </button>

            {/* CARD 02: INTERACTIVE 3D & WEB */}
            <button
              onClick={handleInteractive3DClick}
              onMouseEnter={() => audioEngine.playHover()}
              className="about-card-2 group relative flex flex-col items-start text-left p-3 sm:p-3.5 rounded-xl bg-[#F7EBE1] border border-[#EAD9CD] hover:border-[#1E3A32] hover:bg-[#FBF2EB] shadow-xs hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
            >
              <div className="w-full flex items-center justify-between mb-1.5">
                <Browser3DCubeIcon className="w-6 h-6 text-[#0E1F21] group-hover:scale-105 transition-transform" />
                <span className="text-[9px] font-mono font-bold text-[#1E3A32] opacity-80 group-hover:opacity-100 transition-opacity flex items-center space-x-0.5">
                  <span>LAUNCH</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </span>
              </div>
              <h3 className="font-inter font-bold text-xs sm:text-[12px] text-[#0E1F21] tracking-wide uppercase mb-0.5 leading-snug">
                INTERACTIVE 3D &amp; WEB
              </h3>
              <p className="font-inter text-[10px] sm:text-[10.5px] text-[#6B7B7D] leading-relaxed">
                Modern 3D web experiences &amp; product showcases
              </p>
            </button>

            {/* CARD 03: BUILD YOUR PROTOTYPE → */}
            <button
              onClick={handleBuildPrototype}
              onMouseEnter={() => audioEngine.playHover()}
              className="about-card-3 group relative flex flex-col items-start text-left p-3 sm:p-3.5 rounded-xl bg-[#1E3A32] text-white border border-[#1E3A32] hover:bg-[#27433B] shadow-xs hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
            >
              <div className="w-full flex items-center justify-between mb-1.5">
                <OrigamiAirplaneIcon className="w-6 h-6 group-hover:scale-110 group-hover:rotate-6 transition-transform" />
                <ArrowRight className="w-3.5 h-3.5 text-[#A5F3FC] group-hover:translate-x-1 transition-transform" />
              </div>
              <h3 className="font-inter font-bold text-xs sm:text-[12px] text-[#FFFFFF] tracking-wide uppercase mb-0.5 leading-snug flex items-center space-x-1">
                <span>BUILD YOUR PROTOTYPE</span>
                <span className="text-[#A5F3FC]">→</span>
              </h3>
              <p className="font-inter text-[10px] sm:text-[10.5px] text-[#D1E7DD] leading-relaxed">
                Have an idea? Let&rsquo;s turn it into a working MVP
              </p>
            </button>

          </div>

          {/* ============================================================== */}
          {/* 6. BOTTOM RIGHT PHILOSOPHY TAGLINE                             */}
          {/* ============================================================== */}
          <div className="about-tagline w-full flex justify-end items-center space-x-3 pt-1 flex-shrink-0">
            <span className="w-8 sm:w-12 h-[1px] bg-[#6A8E8B]/40 inline-block align-middle" />
            <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.22em] text-[#6B7B7D] uppercase">
              IDEAS INTO REAL-WORLD SOLUTIONS
            </span>
          </div>

        </div>
      </div>

    </div>
  );
}
