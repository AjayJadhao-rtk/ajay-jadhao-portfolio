import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navigation from './Navigation';
import AnimatedCloudStrips from './AnimatedCloudStrips';
import AnimatedWheel from './AnimatedWheel';
import BuildingGrassLayer from './BuildingGrassLayer';
import AnimatedCharacter from './AnimatedCharacter';
import SurfaceElasticBender from './SurfaceElasticBender';
import HeroTypography from './HeroTypography';
import AboutSection from './AboutSection';
import { useIsMobile } from '../hooks/useIsMobile';
import { audioEngine } from '../utils/audioSystem';

// Register GSAP ScrollTrigger plugin safely
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * HeroSection Component with Integrated Continuous About Section
 * 
 * Features:
 * 1. Cinematic Continuous Scroll Experience:
 *    - Pinned viewport container inside a 220vh scroll track.
 *    - Environmental artwork (Character, Wheel, Building/Trees, Cloud Strips) progressively
 *      shifts towards the LEFT as user scrolls from Hero into About.
 *    - Relative visual positions are 100% maintained in lockstep.
 *    - Hero typography fades out on the right as the About section content reveals.
 * 2. GPU Accelerated:
 *    - Pure transform: translate3d(-xShift, 0, 0) with willChange: transform.
 *    - Smooth 0.8s scrub physics for liquid responsiveness.
 * 3. Dynamic Navigation:
 *    - Active tab automatically transitions between "Home" and "About" based on scroll position.
 *    - Clicking "About" or "About Me" smoothly scrolls to the About section.
 *    - Clicking "Home" smoothly returns to the Hero section.
 * 4. Responsive & Accessible:
 *    - Dynamic shift calibration for mobile viewports.
 *    - Reduced-motion fallback for accessibility.
 */
export default function HeroSection({ onOpen3DWorld, currentView = 'hero', onToggleView }) {
  const trackRef = useRef(null);
  const viewportRef = useRef(null);
  const environmentRef = useRef(null);
  const heroContentRef = useRef(null);
  const aboutContentRef = useRef(null);
  const aboutLeftAccentRef = useRef(null);

  const [activeSection, setActiveSection] = useState('Home');
  const isMobile = useIsMobile(1024);

  const handleDownloadResume = () => {
    audioEngine.playClick();
    alert('Opening Resume: Ajay Jadhao — Electronics & Telecommunication Engineer (PDF)');
  };

  const scrollToAbout = () => {
    audioEngine.playClick();
    if (trackRef.current) {
      const target = trackRef.current.offsetTop + trackRef.current.offsetHeight - window.innerHeight;
      window.scrollTo({ top: target, behavior: 'smooth' });
    }
  };

  const scrollToHome = () => {
    audioEngine.playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (id) => {
    if (id === 'about') {
      scrollToAbout();
    } else if (id === 'home') {
      scrollToHome();
    } else if (id === 'projects') {
      if (onOpen3DWorld) onOpen3DWorld();
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // GSAP ScrollTrigger Master Timeline
  useEffect(() => {
    if (!trackRef.current || !environmentRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isNarrow = window.innerWidth < 1024;
    const W = window.innerWidth;
    
    // Calibrated horizontal shift so character, wheel & building shift left matching reference image
    const maxShiftX = isNarrow
      ? Math.round(W * 0.16)
      : Math.round(Math.min(380, Math.max(240, W * 0.19)));

    const ctx = gsap.context(() => {
      // Scrubbed master timeline tied to the 220vh track scroll
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: trackRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: prefersReducedMotion ? false : 0.8,
          onUpdate: (self) => {
            const p = self.progress;
            if (p > 0.45) {
              setActiveSection('About');
            } else {
              setActiveSection('Home');
            }
          }
        }
      });

      if (!prefersReducedMotion) {
        // 1. Progressively shift the entire environment towards the LEFT
        tl.to(environmentRef.current, {
          x: -maxShiftX,
          ease: 'power1.inOut',
          duration: 1
        }, 0);

        // 2. Fade out Hero typography on the right
        tl.to(heroContentRef.current, {
          opacity: 0,
          x: -45,
          y: -15,
          ease: 'power1.out',
          duration: 0.45,
          pointerEvents: 'none'
        }, 0);

        // 3. Fade in and reveal About section content on the right
        tl.fromTo(aboutContentRef.current, {
          opacity: 0,
          x: 45,
          y: 15,
          pointerEvents: 'none'
        }, {
          opacity: 1,
          x: 0,
          y: 0,
          ease: 'power1.out',
          duration: 0.55,
          pointerEvents: 'auto'
        }, 0.45);

        // 4. Reveal bottom-left "HARDWARE + SOFTWARE —" in About mode
        if (aboutLeftAccentRef.current) {
          tl.fromTo(aboutLeftAccentRef.current, {
            opacity: 0,
            y: 15
          }, {
            opacity: 1,
            y: 0,
            ease: 'power1.out',
            duration: 0.4
          }, 0.55);
        }
      } else {
        // Reduced motion: simple crossfade without rapid translation
        tl.to(heroContentRef.current, {
          opacity: 0,
          duration: 0.45,
          pointerEvents: 'none'
        }, 0);
        tl.fromTo(aboutContentRef.current, {
          opacity: 0,
          pointerEvents: 'none'
        }, {
          opacity: 1,
          duration: 0.55,
          pointerEvents: 'auto'
        }, 0.45);
      }
    }, trackRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="relative w-full bg-[#E9DDC7] text-[#292B27] font-sans select-none">
      
      {/* ========================================================================= */}
      {/* 220VH CONTINUOUS SCROLL TRACK (Tied to GSAP ScrollTrigger)               */}
      {/* ========================================================================= */}
      <div ref={trackRef} className="relative w-full h-[220vh]">
        
        {/* PINNED VIEWPORT STAGE (Sticky at top: 0, height: 100vh) */}
        <div
          ref={viewportRef}
          className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between"
        >
          {/* 1. FULL-SCREEN BACKGROUND IMAGE (Warm Paper Texture) */}
          <div className="fixed inset-0 w-full h-full pointer-events-none select-none z-0 overflow-hidden">
            <img
              src="/assets/hero-bg-figma.jpg"
              alt="Portfolio Background"
              className="w-full h-full object-cover object-center"
            />
          </div>

          {/* 2. COORDINATED ENVIRONMENTAL ARTWORK CONTAINER (Shifts Left on Scroll) */}
          <div
            ref={environmentRef}
            className="fixed inset-0 w-full h-full pointer-events-none select-none z-20 overflow-hidden"
            style={{ willChange: 'transform' }}
          >
            {/* Animated Rectangle Cloud Strips */}
            <div className="absolute inset-0 w-full h-full">
              <AnimatedCloudStrips />
            </div>

            {/* Rotating Gear Wheel */}
            <div className="absolute inset-0 w-full h-full">
              <AnimatedWheel />
            </div>

            {/* Stationary Building & Waving Grass/Trees */}
            <div className="absolute inset-0 w-full h-full">
              <BuildingGrassLayer />
            </div>

            {/* 100-Frame Ultra-Smooth Character Engine */}
            <div className="absolute inset-0 w-full h-full">
              <AnimatedCharacter />
            </div>

            {/* About Section Far Bottom-Left Technical Accent (From Reference Image) */}
            <div
              ref={aboutLeftAccentRef}
              className="hidden lg:flex flex-col items-start absolute left-6 xl:left-12 bottom-10 z-30 pointer-events-none select-none text-[#1A2A2D] font-mono opacity-0"
            >
              <div className="space-y-1 text-[11px] xl:text-xs tracking-[0.25em] uppercase font-bold text-[#0E1F21]">
                <p>HARDWARE</p>
                <p className="text-[#6A8E8B] text-center font-bold">+</p>
                <p>SOFTWARE</p>
              </div>
              <div className="w-8 h-[1.5px] bg-[#0E1F21] mt-2" />
            </div>
          </div>

          {/* 3. TACTILE SURFACE ELASTIC BENDER */}
          <SurfaceElasticBender containerRef={viewportRef} />

          {/* 4. TOP NAVIGATION BAR (Always accessible at z-50) */}
          <div className="relative z-50">
            <Navigation
              onExploreClick={onOpen3DWorld}
              onResumeClick={handleDownloadResume}
              currentView={currentView}
              onToggleView={onToggleView}
              activeSection={activeSection}
              onNavigate={handleNavigate}
            />
          </div>

          {/* 5. HERO TYPOGRAPHY LAYER (z-30, fades out as user scrolls down) */}
          <main
            ref={heroContentRef}
            className="absolute inset-0 pt-20 pb-4 sm:pb-6 px-4 sm:px-6 lg:px-8 z-30 pointer-events-auto flex flex-col justify-between"
          >
            <HeroTypography
              onExploreClick={onOpen3DWorld}
              onAboutClick={scrollToAbout}
            />
          </main>

          {/* 6. ABOUT SECTION LAYER (z-40, reveals on right as environment shifts left) */}
          <section
            id="about"
            ref={aboutContentRef}
            className="absolute inset-0 pt-20 pb-4 sm:pb-6 px-4 sm:px-6 lg:px-8 z-40 pointer-events-none opacity-0 flex flex-col justify-between"
          >
            <AboutSection
              onOpen3DWorld={onOpen3DWorld}
              onExploreClick={onOpen3DWorld}
            />
          </section>

        </div>
      </div>

    </div>
  );
}
