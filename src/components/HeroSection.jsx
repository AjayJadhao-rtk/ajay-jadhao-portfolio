import React, { useState } from 'react';
import Navigation from './Navigation';
import LeftIntroSection from './LeftIntroSection';
import CenterHeroArtwork from './CenterHeroArtwork';
import ProjectPreviewGrid from './ProjectPreviewGrid';
import ProjectDetailModal from './ProjectDetailModal';
import PaperGrainOverlay from './PaperGrainOverlay';
import FullscreenLivingCanvas from './FullscreenLivingCanvas';

export default function HeroSection({ onOpen3DWorld, currentView = 'hero', onToggleView }) {
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeFrame, setActiveFrame] = useState(1);

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
    <div className="relative min-h-screen w-full bg-[#E9DDC7] text-[#292B27] flex flex-col justify-between overflow-x-hidden overflow-y-auto lg:overflow-hidden font-sans">
      
      {/* 1. FULL-SCREEN LIVING ANIMATION BACKGROUND CANVAS */}
      <FullscreenLivingCanvas onFrameUpdate={(f) => setActiveFrame(f)} />

      {/* 2. Vintage Paper Grain & Noise Overlay */}
      <PaperGrainOverlay />

      {/* 3. TOP NAVIGATION BAR */}
      <Navigation
        onExploreClick={handleExploreProjects}
        onResumeClick={handleDownloadResume}
        currentView={currentView}
        onToggleView={onToggleView}
      />

      {/* 4. MAIN COLLAGE VIEWPORT (Mobile-First: flex-col on mobile, flex-row on desktop) */}
      <main className="relative flex-1 w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-6 flex flex-col lg:flex-row items-stretch justify-between gap-8 lg:gap-0 z-20">
        
        {/* LEFT COLUMN: Editorial Profile & Telemetry Ground Station (Stacked first on mobile) */}
        <section className="w-full lg:w-[28%] xl:w-[27%] flex flex-col justify-between z-25 order-1">
          <LeftIntroSection
            onExploreClick={handleExploreProjects}
            onResumeClick={handleDownloadResume}
          />
        </section>

        {/* CENTER COLUMN: Sky Atmosphere, Rotating Gears, Divergence Coordinates (Stacked second on mobile) */}
        <section className="relative w-full lg:w-[44%] xl:w-[45%] h-[380px] sm:h-[480px] lg:h-auto flex items-end justify-center z-15 order-2 lg:order-2 my-2 lg:my-0">
          <CenterHeroArtwork />
        </section>

        {/* RIGHT COLUMN: Staggered Diagonal Project Preview Panels (Stacked third on mobile) */}
        <section
          id="project-grid-section"
          className="w-full lg:w-[28%] xl:w-[28%] z-25 order-3 lg:order-3 flex flex-col justify-center pb-16 lg:pb-0"
        >
          <div className="relative w-full">
            {/* Corner Decorative Index */}
            <div className="flex items-center justify-between pb-1 px-3 text-[9px] font-mono text-[#626B50]">
              <span>[HARDWARE_MATRIX]</span>
              <button
                onClick={handleExploreProjects}
                className="text-[#89634C] hover:text-[#292B27] font-semibold cursor-pointer underline flex items-center space-x-1 min-h-[44px] py-2"
              >
                <span>5 SYSTEMS · 3D WORLD →</span>
              </button>
            </div>

            {/* The Diagonal Cut-out Panels Grid */}
            <ProjectPreviewGrid onSelectProject={(proj) => setSelectedProject(proj)} />
          </div>
        </section>
      </main>

      {/* Mobile Floating Action Button: Quick 3D World Entry */}
      <div className="lg:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-auto pointer-events-auto">
        <button
          onClick={handleExploreProjects}
          className="flex items-center space-x-2.5 px-6 py-3 min-h-[48px] rounded-full bg-[#292B27]/95 backdrop-blur-md text-[#F4EBDD] border border-[#B17B53]/70 shadow-2xl font-mono text-xs font-bold uppercase tracking-wider active:scale-95 transition-all cursor-pointer"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Enter 3D Circuit World</span>
        </button>
      </div>

      {/* 5. FOOTER BAR: Subtle Engineering Telemetry Timestamp */}
      <footer className="relative z-25 w-full px-6 py-2 border-t border-[#292B27]/10 bg-[#E9DDC7]/70 backdrop-blur-xs flex flex-wrap items-center justify-between text-[9px] font-mono text-[#626B50]">
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
