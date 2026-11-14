import React from 'react';
import { MapPin, GraduationCap, Briefcase, ArrowRight, ExternalLink } from 'lucide-react';
import { audioEngine } from '../utils/audioSystem';

/**
 * Custom SVG Icons matching the exact artwork in "About section reference image.png"
 */

// Card 1 Icon: Smart Robotics Rover with wheels, mast, and sensor head
function RoverIcon({ className = "w-9 h-9" }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Sensor mast / antenna */}
      <path d="M24 16V8M20 8H28M24 8L26 5" stroke="#0E1F21" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      {/* Camera head unit */}
      <rect x="20" y="10" width="8" height="6" rx="1.5" stroke="#0E1F21" strokeWidth="2" fill="#E4ECE7" />
      <circle cx="24" cy="13" r="1.5" fill="#6A8E8B" />
      {/* Chassis */}
      <rect x="12" y="16" width="24" height="12" rx="2" stroke="#0E1F21" strokeWidth="2.2" fill="#FFFFFF" />
      {/* Solar panel / top lines */}
      <line x1="16" y1="20" x2="32" y2="20" stroke="#6A8E8B" strokeWidth="1.5" strokeDasharray="2 2" />
      <line x1="16" y1="24" x2="32" y2="24" stroke="#6A8E8B" strokeWidth="1.5" strokeDasharray="2 2" />
      {/* Suspension struts */}
      <path d="M14 28L10 34M34 28L38 34M24 28V34" stroke="#0E1F21" strokeWidth="2" strokeLinecap="round" />
      {/* 4 Rover Wheels */}
      <rect x="7" y="32" width="7" height="9" rx="2" fill="#0E1F21" />
      <rect x="21" y="32" width="6" height="9" rx="2" fill="#0E1F21" />
      <rect x="34" y="32" width="7" height="9" rx="2" fill="#0E1F21" />
      {/* Wheel treads */}
      <line x1="8" y1="36.5" x2="13" y2="36.5" stroke="#FFFFFF" strokeWidth="1" />
      <line x1="22" y1="36.5" x2="26" y2="36.5" stroke="#FFFFFF" strokeWidth="1" />
      <line x1="35" y1="36.5" x2="40" y2="36.5" stroke="#FFFFFF" strokeWidth="1" />
    </svg>
  );
}

// Card 2 Icon: Browser Window with Isometric 3D Cube inside
function Browser3DCubeIcon({ className = "w-9 h-9" }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Browser window frame */}
      <rect x="6" y="8" width="36" height="32" rx="4" stroke="#0E1F21" strokeWidth="2.2" fill="#FFFFFF" />
      {/* Browser header bar */}
      <path d="M6 16H42" stroke="#0E1F21" strokeWidth="1.8" />
      {/* Window control dots */}
      <circle cx="11" cy="12" r="1.5" fill="#EF4444" />
      <circle cx="16" cy="12" r="1.5" fill="#F59E0B" />
      <circle cx="21" cy="12" r="1.5" fill="#10B981" />
      {/* Isometric 3D Wireframe Cube */}
      <g transform="translate(24, 28) scale(0.72)">
        {/* Top face */}
        <polygon points="0,-16 14,-8 0,0 -14,-8" fill="#F5EAE0" stroke="#0E1F21" strokeWidth="2" strokeLinejoin="round" />
        {/* Left face */}
        <polygon points="-14,-8 0,0 0,16 -14,8" fill="#EAD9CD" stroke="#0E1F21" strokeWidth="2" strokeLinejoin="round" />
        {/* Right face */}
        <polygon points="0,0 14,-8 14,8 0,16" fill="#FBF2EB" stroke="#0E1F21" strokeWidth="2" strokeLinejoin="round" />
        {/* Inner vertex point */}
        <circle cx="0" cy="0" r="1.5" fill="#6A8E8B" />
      </g>
    </svg>
  );
}

// Card 3 Icon: Origami Paper Airplane / Send Icon in Teal
function OrigamiAirplaneIcon({ className = "w-9 h-9" }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Main wing facet (left) */}
      <path
        d="M40 8L8 23L22 28L40 8Z"
        fill="#6A8E8B"
        stroke="#0E1F21"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      {/* Right wing facet */}
      <path
        d="M40 8L28 38L22 28L40 8Z"
        fill="#4A6E6B"
        stroke="#0E1F21"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      {/* Center keel fold */}
      <path
        d="M22 28L28 38L27 28L22 28Z"
        fill="#2A4E4B"
        stroke="#0E1F21"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Flight streak / wind accents */}
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

  // CARD 03 ACTION — BUILD YOUR PROTOTYPE (Exact user email template to rutikjadhao20@gmail.com)
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
Additional Information: 

I'd like to discuss the feasibility, development process and next steps for building this prototype.

Looking forward to hearing from you.

Best regards,
[Your Name]`
    );
    window.location.href = `mailto:rutikjadhao20@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <div className="relative w-full h-full max-w-[1920px] mx-auto select-none pointer-events-none flex flex-col justify-between">
      
      {/* MAIN RIGHT-SIDE ABOUT CONTENT STAGE */}
      <div className="w-full flex justify-end px-4 sm:px-6 lg:pr-10 xl:pr-16 pt-3 sm:pt-4 lg:pt-6 z-40">
        <div className="w-full lg:w-[54%] xl:w-[50%] max-w-[700px] pointer-events-auto flex flex-col items-start text-left max-lg:bg-gradient-to-b max-lg:from-[#E9DDC7]/95 max-lg:via-[#E9DDC7]/85 max-lg:to-[#E9DDC7]/90 max-lg:p-4 sm:max-lg:p-6 max-lg:rounded-2xl max-lg:shadow-md">
          
          {/* ============================================================== */}
          {/* 1. SECTION IDENTIFIER: 01 // ABOUT ——————————————             */}
          {/* ============================================================== */}
          <div className="about-eyebrow w-full flex items-center space-x-3 sm:space-x-4 mb-2 sm:mb-3">
            <span className="font-mono text-[11px] sm:text-xs md:text-[13px] font-bold tracking-[0.25em] text-[#0E1F21] uppercase whitespace-nowrap">
              01 &nbsp;//&nbsp; ABOUT
            </span>
            <div className="flex-1 h-[1px] bg-[#6A8E8B]/40 max-w-[420px]" />
          </div>

          {/* ============================================================== */}
          {/* 2. MAIN DISPLAY HEADING: AJAY JADHAO                           */}
          {/* ============================================================== */}
          <h2
            className="about-heading font-playfair font-bold text-4xl sm:text-5xl md:text-6xl lg:text-[66px] xl:text-[76px] leading-[0.95] tracking-tight uppercase mb-3 sm:mb-4 text-[#0E1F21]"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            <span>AJAY </span>
            <span
              className="bg-gradient-to-r from-[#6A8E8B] via-[#7FA6A1] to-[#C2D6D3] bg-clip-text text-transparent inline-block"
              style={{
                backgroundImage: 'linear-gradient(135deg, #6A8E8B 0%, #7FA6A1 50%, #C2D6D3 100%)',
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
          <p className="about-bio font-inter font-normal text-xs sm:text-sm md:text-[15px] lg:text-[15.5px] leading-relaxed text-[#1A2A2D]/85 max-w-[640px] mb-4 sm:mb-5">
            I'm an <strong className="font-semibold text-[#0E1F21]">Electronics &amp; Telecommunication Engineering</strong> student at SSGMCE, Shegaon, who builds <strong className="font-semibold text-[#0E1F21]">smart machines, connected hardware, and interactive 3D websites</strong>. From <strong className="font-semibold text-[#0E1F21]">disaster-rescue robots for Smart India Hackathon</strong> to custom embedded devices, I turn complex engineering ideas into <strong className="font-semibold text-[#0E1F21]">working real-world products</strong>.
          </p>

          {/* ============================================================== */}
          {/* 4. PROFILE METADATA ROW (Location, Education, Availability)    */}
          {/* ============================================================== */}
          <div className="about-meta w-full grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 py-3 sm:py-3.5 border-y border-[#D9E3E1] mb-4 sm:mb-5">
            {/* Item 1: Location */}
            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-full bg-[#E4ECE7] flex items-center justify-center flex-shrink-0">
                <MapPin className="w-4 h-4 text-[#6A8E8B]" />
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
              <div className="w-7 h-7 rounded-full bg-[#E4ECE7] flex items-center justify-center flex-shrink-0">
                <GraduationCap className="w-4 h-4 text-[#6A8E8B]" />
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
              <div className="w-7 h-7 rounded-full bg-[#E4ECE7] flex items-center justify-center flex-shrink-0">
                <Briefcase className="w-4 h-4 text-[#6A8E8B]" />
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
          <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-3.5 mb-3 sm:mb-4">
            
            {/* CARD 01: SMART HARDWARE & ROBOTICS */}
            <button
              onClick={handleHardwareInquiry}
              onMouseEnter={() => audioEngine.playHover()}
              className="about-card-1 group relative flex flex-col items-start text-left p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-[#E4ECE7] border border-[#CAD8D1] hover:border-[#6A8E8B] hover:bg-[#EDF5F1] shadow-2xs hover:shadow-md hover:-translate-y-1 active:translate-y-0 transition-all duration-200 cursor-pointer"
            >
              <div className="w-full flex items-center justify-between mb-2">
                <RoverIcon className="w-7 h-7 text-[#0E1F21] group-hover:scale-105 transition-transform" />
                <span className="text-[10px] font-mono font-bold text-[#6A8E8B] opacity-0 group-hover:opacity-100 transition-opacity">
                  INQUIRE
                </span>
              </div>
              <h3 className="font-inter font-bold text-xs sm:text-[12.5px] text-[#0E1F21] tracking-wider uppercase mb-1 leading-snug">
                SMART HARDWARE &amp; ROBOTICS
              </h3>
              <p className="font-inter text-[10px] sm:text-[11px] text-[#6B7B7D] leading-relaxed">
                Custom IoT devices, sensors &amp; autonomous robots
              </p>
            </button>

            {/* CARD 02: INTERACTIVE 3D & WEB */}
            <button
              onClick={handleInteractive3DClick}
              onMouseEnter={() => audioEngine.playHover()}
              className="about-card-2 group relative flex flex-col items-start text-left p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-[#F7EBE1] border border-[#EAD9CD] hover:border-[#6A8E8B] hover:bg-[#FBF2EB] shadow-2xs hover:shadow-md hover:-translate-y-1 active:translate-y-0 transition-all duration-200 cursor-pointer"
            >
              <div className="w-full flex items-center justify-between mb-2">
                <Browser3DCubeIcon className="w-7 h-7 text-[#0E1F21] group-hover:scale-105 transition-transform" />
                <span className="text-[10px] font-mono font-bold text-[#6A8E8B] opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-0.5">
                  <span>LAUNCH</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </span>
              </div>
              <h3 className="font-inter font-bold text-xs sm:text-[12.5px] text-[#0E1F21] tracking-wider uppercase mb-1 leading-snug">
                INTERACTIVE 3D &amp; WEB
              </h3>
              <p className="font-inter text-[10px] sm:text-[11px] text-[#6B7B7D] leading-relaxed">
                Modern 3D web experiences &amp; product showcases
              </p>
            </button>

            {/* CARD 03: BUILD YOUR PROTOTYPE → */}
            <button
              onClick={handleBuildPrototype}
              onMouseEnter={() => audioEngine.playHover()}
              className="about-card-3 group relative flex flex-col items-start text-left p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-[#DDEBE5] border border-[#6A8E8B] hover:border-[#0E1F21] hover:bg-[#EAF5EF] shadow-2xs hover:shadow-lg hover:-translate-y-1 active:translate-y-0 transition-all duration-200 cursor-pointer"
            >
              <div className="w-full flex items-center justify-between mb-2">
                <OrigamiAirplaneIcon className="w-7 h-7 group-hover:scale-110 group-hover:rotate-6 transition-transform" />
                <ArrowRight className="w-3.5 h-3.5 text-[#0E1F21] group-hover:translate-x-1 transition-transform" />
              </div>
              <h3 className="font-inter font-bold text-xs sm:text-[12.5px] text-[#0E1F21] tracking-wider uppercase mb-1 leading-snug flex items-center space-x-1">
                <span>BUILD YOUR PROTOTYPE</span>
                <span className="text-[#6A8E8B] group-hover:translate-x-0.5 transition-transform">→</span>
              </h3>
              <p className="font-inter text-[10px] sm:text-[11px] text-[#4A5D5A] leading-relaxed">
                Have an idea? Let's turn it into a working MVP
              </p>
            </button>

          </div>

          {/* ============================================================== */}
          {/* 6. BOTTOM RIGHT PHILOSOPHY TAGLINE                             */}
          {/* ============================================================== */}
          <div className="about-tagline w-full flex justify-end items-center space-x-3 pt-2">
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
