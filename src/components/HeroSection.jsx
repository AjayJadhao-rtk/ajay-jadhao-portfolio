import React, { useRef } from 'react';
import Navigation from './Navigation';
import AnimatedCloudStrips from './AnimatedCloudStrips';
import AnimatedWheel from './AnimatedWheel';
import SurfaceElasticBender from './SurfaceElasticBender';

// ARCHIVED COMPONENTS PRESERVED SAFELY IN THE CODEBASE:
// - LeftIntroSection: src/components/LeftIntroSection.jsx
// - CenterHeroArtwork: src/components/CenterHeroArtwork.jsx
// - ProjectPreviewGrid: src/components/ProjectPreviewGrid.jsx
// - FullscreenLivingCanvas: src/components/FullscreenLivingCanvas.jsx
// - 3D Circuit World: src/components/WorldExplorationView.jsx & src/components/3d/*

export default function HeroSection({ onOpen3DWorld, currentView = 'hero', onToggleView }) {
  const mainContentRef = useRef(null);

  const handleDownloadResume = () => {
    alert('Opening Resume: Ajay Jadhao — Electronics & Telecommunication Engineer (PDF)');
  };

  return (
    <div className="relative min-h-screen w-full bg-[#E9DDC7] text-[#292B27] flex flex-col justify-between overflow-x-hidden font-sans select-none">
      
      {/* 1. FULL-SCREEN BACKGROUND IMAGE (From Figma Template) */}
      <div className="fixed inset-0 w-full h-full pointer-events-none select-none z-0 overflow-hidden">
        <img
          src="/assets/hero-bg-figma.jpg"
          alt="Portfolio Background"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* 2. ANIMATED RECTANGLE CLOUD STRIPS (01_strip, 02_strip, 03_strip) */}
      <div className="fixed inset-0 w-full h-full pointer-events-none select-none z-10 overflow-hidden">
        <AnimatedCloudStrips />
      </div>

      {/* 3. ROTATING GEAR WHEEL (Clockwise spin + speed up on mouse interaction - In front of strips) */}
      <div className="fixed inset-0 w-full h-full pointer-events-none select-none z-20 overflow-hidden">
        <AnimatedWheel />
      </div>

      {/* 4. TACTILE SURFACE ELASTIC BENDER (Depression ripple & flex on click/tap) */}
      <SurfaceElasticBender containerRef={mainContentRef} />

      {/* 5. TOP NAVIGATION BAR */}
      <div className="relative z-40">
        <Navigation
          onExploreClick={onOpen3DWorld}
          onResumeClick={handleDownloadResume}
          currentView={currentView}
          onToggleView={onToggleView}
        />
      </div>

      {/* 6. MAIN STAGE (Clean slate ready for adding Figma template components one by one) */}
      <main
        ref={mainContentRef}
        className="relative flex-1 w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-6 z-30 pointer-events-none"
      >
        {/* Hero stage content cleared as requested — adding elements one by one */}
      </main>
    </div>
  );
}
