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
  const activeSectionRef = useRef('Home');
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

  // GSAP ScrollTrigger Master Timeline with Seamless Hero-to-About Overlap & 0.25s Responsive Scrub
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
      // Fluid, responsive scrub (0.25s) for instant tracking with zero sluggish lag
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: trackRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: prefersReducedMotion ? false : 0.25,
          onUpdate: (self) => {
            const next = self.progress > 0.48 ? 'About' : 'Home';
            if (activeSectionRef.current !== next) {
              activeSectionRef.current = next;
              setActiveSection(next);
            }
          }
        }
      });

      if (!prefersReducedMotion) {
        // 1. Progressively shift the entire illustrated environment towards the LEFT (0.0 -> 1.0)
        tl.to(environmentRef.current, {
          x: -maxShiftX,
          ease: 'power1.inOut',
          duration: 1
        }, 0);

        // 2. HERO EXIT (0.18 -> 0.58)
        // Holds full visibility for first 18% of scroll, then gracefully fades out while About enters
        tl.to(heroContentRef.current, {
          opacity: 0,
          x: -40,
          y: -10,
          ease: 'power1.out',
          duration: 0.40
        }, 0.18);

        // Switch pointer-events at midpoint
        tl.set(heroContentRef.current, { pointerEvents: 'none' }, 0.48);
        tl.set(aboutContentRef.current, { pointerEvents: 'auto' }, 0.48);

        // 3. ABOUT ENTRANCE WITH CONTROLLED OVERLAP (0.28 -> 0.78)
        // Starts entering at 0.28 while Hero is still ~70% visible, eliminating ANY blank space!
        tl.fromTo(aboutContentRef.current, {
          opacity: 0,
          x: 40,
          y: 10,
        }, {
          opacity: 1,
          x: 0,
          y: 0,
          ease: 'power1.out',
          duration: 0.45
        }, 0.28);

        // Staggered internal entrance for cinematic polish
        // Eyebrow & Heading
        tl.fromTo('.about-eyebrow, .about-heading', {
          opacity: 0,
          y: 20
        }, {
          opacity: 1,
          y: 0,
          ease: 'power1.out',
          duration: 0.32
        }, 0.30);

        // Bio paragraph
        tl.fromTo('.about-bio', {
          opacity: 0,
          y: 18
        }, {
          opacity: 1,
          y: 0,
          ease: 'power1.out',
          duration: 0.30
        }, 0.38);

        // Profile metadata row
        tl.fromTo('.about-meta', {
          opacity: 0,
          y: 18
        }, {
          opacity: 1,
          y: 0,
          ease: 'power1.out',
          duration: 0.30
        }, 0.44);

        // Three Interactive Cards (staggered)
        tl.fromTo('.about-card-1, .about-card-2, .about-card-3', {
          opacity: 0,
          y: 20
        }, {
          opacity: 1,
          y: 0,
          stagger: 0.05,
          ease: 'power1.out',
          duration: 0.32
        }, 0.50);

        // Tagline
        tl.fromTo('.about-tagline', {
          opacity: 0,
          y: 10
        }, {
          opacity: 1,
          y: 0,
          ease: 'power1.out',
          duration: 0.25
        }, 0.60);

        // 4. Reveal bottom-left "HARDWARE + SOFTWARE —" in About mode
        if (aboutLeftAccentRef.current) {
          tl.fromTo(aboutLeftAccentRef.current, {
            opacity: 0,
            y: 15
          }, {
            opacity: 1,
            y: 0,
            ease: 'power1.out',
            duration: 0.35
          }, 0.45);
        }
      } else {
        // Reduced motion fallback: gentle crossfade
        tl.to(heroContentRef.current, {
          opacity: 0,
          duration: 0.40,
          pointerEvents: 'none'
        }, 0.20);
        tl.fromTo(aboutContentRef.current, {
          opacity: 0,
          pointerEvents: 'none'
        }, {
          opacity: 1,
          duration: 0.45,
          pointerEvents: 'auto'
        }, 0.28);
      }
    }, trackRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="relative w-full bg-[#E9DDC7] text-[#292B27] font-sans select-none">
      
      {/* ========================================================================= */}
      {/* 200VH CONTINUOUS SCROLL TRACK (Tied to GSAP ScrollTrigger)               */}
      {/* ========================================================================= */}
      <div ref={trackRef} className="relative w-full h-[200vh]">
        
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
