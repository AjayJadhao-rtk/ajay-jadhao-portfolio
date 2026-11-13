import React, { useState, useRef } from 'react';
import Navigation from './Navigation';
import LeftIntroSection from './LeftIntroSection';
import CenterHeroArtwork from './CenterHeroArtwork';
import ProjectPreviewGrid from './ProjectPreviewGrid';
import ProjectDetailModal from './ProjectDetailModal';
import PaperGrainOverlay from './PaperGrainOverlay';
import FullscreenLivingCanvas from './FullscreenLivingCanvas';
import SurfaceElasticBender from './SurfaceElasticBender';

export default function HeroSection({ onOpen3DWorld, currentView = 'hero', onToggleView }) {
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeFrame, setActiveFrame] = useState(1);
  const mainContentRef = useRef(null);

  const handleExploreProjects = () => {
    if (onOpen3DWorld) {
      onOpen3DWorld();
    } else {
      const el = document.getElementById('project-grid-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleDownloadResume = () => {
    alert('Opening Resume: Ajay Jadhao — Electronics & Telecommunication Engineer (PDF)');
  };

  return (
    <div className="relative min-h-screen w-full bg-[#E9DDC7] text-[#292B27] flex flex-col justify-between overflow-x-hidden overflow-y-auto lg:overflow-hidden font-sans select-none">
      
      {/* 1. FULL-SCREEN LIVING ANIMATION BACKGROUND CANVAS WITH FIXED SKY ARTWORK */}
      <FullscreenLivingCanvas onFrameUpdate={(f) => setActiveFrame(f)}>
        {/* Fixed atmospheric artwork in sky (Gears, Divergence coordinates, floating particles) */}
        <div className="absolute inset-0 pointer-events-none select-none z-10 hidden lg:block">
          <CenterHeroArtwork />
        </div>
      </FullscreenLivingCanvas>

      {/* 2. TACTILE SURFACE ELASTIC BENDER (Depression ripple & flex on click/tap) */}
      <SurfaceElasticBender containerRef={mainContentRef} />

      {/* 3. Vintage Paper Grain & Noise Overlay */}
      <PaperGrainOverlay />

      {/* 4. TOP NAVIGATION BAR */}
      <Navigation
        onExploreClick={handleExploreProjects}
        onResumeClick={handleDownloadResume}
        currentView={currentView}
        onToggleView={onToggleView}
      />

      {/* 5. MAIN COLLAGE VIEWPORT (Responsive: Staggered flow on mobile, 3-column panoramic on desktop) */}
      <main
        ref={mainContentRef}
        className="relative flex-1 w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-6 flex flex-col lg:flex-row items-stretch justify-between gap-8 lg:gap-0 z-20 transition-transform"
      >
        
        {/* LEFT COLUMN: Editorial Profile & Ground Station (Order 1) */}
        <section className="w-full lg:w-[28%] xl:w-[27%] flex flex-col justify-between z-25 order-1">
          <LeftIntroSection
            onExploreClick={handleExploreProjects}
            onResumeClick={handleDownloadResume}
          />
        </section>

        {/* CENTER COLUMN: Atmospheric Negative Space on Desktop (Characters breathes through from background) */}
        <section className="hidden lg:flex w-full lg:w-[44%] xl:w-[45%] pointer-events-none z-15 order-2" />

        {/* RIGHT COLUMN: Staggered Hardware Matrix Projects (Order 2 on mobile, Order 3 on desktop) */}
        <section
          id="project-grid-section"
          className="w-full lg:w-[28%] xl:w-[28%] z-25 order-2 lg:order-3 flex flex-col justify-center pb-12 lg:pb-0"
        >
          <div className="relative w-full">
            {/* Corner Decorative Index */}
            <div className="flex items-center justify-between pb-1.5 px-3 text-[9.5px] font-mono text-[#626B50]">
              <span className="font-bold tracking-wider">[HARDWARE_MATRIX]</span>
              <button
                onClick={handleExploreProjects}
                className="text-[#89634C] hover:text-[#292B27] font-semibold cursor-pointer underline flex items-center space-x-1 min-h-[44px] py-2 transition-colors"
              >
                <span>5 SYSTEMS · 3D WORLD →</span>
              </button>
            </div>

            {/* The Cut-out Project Panels Grid with Choreographed Scroll Animations */}
            <ProjectPreviewGrid onSelectProject={(proj) => setSelectedProject(proj)} />
          </div>
        </section>
      </main>

      {/* 6. FOOTER BAR: Subtle Engineering Telemetry Timestamp */}
      <footer className="relative z-25 w-full px-4 sm:px-6 py-2 border-t border-[#292B27]/10 bg-[#E9DDC7]/80 backdrop-blur-xs flex flex-wrap items-center justify-between gap-1 text-[9px] font-mono text-[#626B50]">
        <div className="flex items-center space-x-3">
          <span>LAT 18.5204° N · LON 73.8567° E</span>
          <span className="hidden sm:inline">|</span>
          <span className="hidden sm:inline">CORE FREQ: 240 MHz</span>
          <span className="hidden sm:inline">|</span>
          <span className="text-[#89634C] font-semibold flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping inline-block" />
            <span>ANIM_SYNC: 30 FPS · FRM {String(activeFrame).padStart(3, '0')}/299</span>
          </span>
        </div>
        <div>
          <span>© {new Date().getFullYear()} AJAY JADHAO · ALL CIRCUITS RESERVED</span>
        </div>
      </footer>

      {/* Interactive Blueprint Modal */}
      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
}
