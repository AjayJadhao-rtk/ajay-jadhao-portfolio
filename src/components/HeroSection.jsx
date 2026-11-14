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
import SkillsSection from './SkillsSection';
import ContactSection from './ContactSection';
import { useIsMobile } from '../hooks/useIsMobile';
import { audioEngine } from '../utils/audioSystem';

// Register GSAP ScrollTrigger plugin safely
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * HeroSection Component with Integrated Continuous About, Skills & Contact Journey
 * 
 * Cinematic Scroll Orchestration:
 * 1. Home (Hero):
 *    - Character, wheel, building, cloud strips in original right-of-center framing.
 *    - Editorial typography on right ("TURNING IDEAS INTO IMPACT").
 *    - Top-left name "Ajay Jadhao" visible.
 * 2. About:
 *    - Character & environment shift smoothly towards the LEFT.
 *    - Top-left name fades out and disappears.
 *    - About content ("01 // ABOUT", "AJAY JADHAO", bio, 3 interactive cards) fades in seamlessly.
 * 3. Skills:
 *    - Environment shifts further left to the edge, exactly matching "Skill section reference image.png".
 *    - Cloud strips tilt according to reference image.
 *    - 6 modular category cards appear with right-side technical artwork, live Figma link, and custom hovers.
 * 4. Contact:
 *    - Entire environment (character, building, bushes, wheel, and strips) moves COMPLETELY OUT OF FRAME to the left.
 *    - Clean, full-width editorial Contact section reveals ("Let's Build Something Exceptional").
 */
export default function HeroSection({ onOpen3DWorld, currentView = 'hero', onToggleView }) {
  const trackRef = useRef(null);
  const viewportRef = useRef(null);
  const environmentRef = useRef(null);
  const stripsRef = useRef(null);

  const heroContentRef = useRef(null);
  const aboutContentRef = useRef(null);
  const skillsContentRef = useRef(null);
  const contactContentRef = useRef(null);
  const aboutLeftAccentRef = useRef(null);

  const [activeSection, setActiveSection] = useState('Home');
  const activeSectionRef = useRef('Home');
  const isMobile = useIsMobile(1024);

  const handleDownloadResume = () => {
    audioEngine.playClick();
    alert('Opening Resume: Ajay Jadhao — Electronics & Telecommunication Engineer (PDF)');
  };

  const handleNavigate = (id) => {
    audioEngine.playClick();
    if (id === 'projects') {
      if (onOpen3DWorld) onOpen3DWorld();
      return;
    }

    if (!trackRef.current) return;
    const totalScroll = trackRef.current.offsetHeight - window.innerHeight;

    let targetRatio = 0;
    if (id === 'home') targetRatio = 0;
    else if (id === 'about') targetRatio = 0.35;
    else if (id === 'skills') targetRatio = 0.65;
    else if (id === 'contact') targetRatio = 0.95;

    const targetY = trackRef.current.offsetTop + Math.round(totalScroll * targetRatio);
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  };

  // GSAP ScrollTrigger Master 4-Phase Timeline
  useEffect(() => {
    if (!trackRef.current || !environmentRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isNarrow = window.innerWidth < 1024;
    const W = window.innerWidth;
    
    // Calibrated shifts
    const maxShiftAbout = isNarrow
      ? Math.round(W * 0.16)
      : Math.round(Math.min(380, Math.max(240, W * 0.19)));

    const maxShiftSkills = isNarrow
      ? Math.round(W * 0.36)
      : Math.round(Math.min(680, Math.max(460, W * 0.36)));

    // In Contact, environment moves COMPLETELY out of frame to the left
    const maxShiftContact = isNarrow
      ? Math.round(W * 1.35)
      : Math.round(Math.max(W + 500, 1600));

    const ctx = gsap.context(() => {
      // Fluid, responsive scrub (0.25s) for instant tracking with zero sluggish lag
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: trackRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: prefersReducedMotion ? false : 0.25,
          onUpdate: (self) => {
            const p = self.progress;
            let next = 'Home';
            if (p >= 0.80) {
              next = 'Contact';
            } else if (p >= 0.52) {
              next = 'Skills';
            } else if (p >= 0.22) {
              next = 'About';
            }
            if (activeSectionRef.current !== next) {
              activeSectionRef.current = next;
              setActiveSection(next);
            }
          }
        }
      });

      if (!prefersReducedMotion) {
        // =====================================================================
        // 1. ENVIRONMENTAL ARTWORK MOVEMENT (Horizontal Translation)
        // =====================================================================

        // Phase A: Shift to About framing (0.12 -> 0.34)
        tl.to(environmentRef.current, {
          x: -maxShiftAbout,
          ease: 'power1.inOut',
          duration: 0.22
        }, 0.12);

        // Phase B: Shift to Skills framing (0.44 -> 0.64)
        tl.to(environmentRef.current, {
          x: -maxShiftSkills,
          ease: 'power1.inOut',
          duration: 0.20
        }, 0.44);

        // Phase B Tilt: Rectangle strips tilt in Skills section (0.48 -> 0.64)
        if (stripsRef.current) {
          tl.to(stripsRef.current, {
            rotation: -3.8,
            transformOrigin: '15% 50%',
            ease: 'power1.out',
            duration: 0.16
          }, 0.48);
        }

        // Phase C: Move COMPLETELY OUT OF FRAME to the left for Contact (0.74 -> 0.92)
        tl.to(environmentRef.current, {
          x: -maxShiftContact,
          ease: 'power1.inOut',
          duration: 0.20
        }, 0.74);

        // Phase C Untilt: Strips return to neutral when moving out (0.74 -> 0.88)
        if (stripsRef.current) {
          tl.to(stripsRef.current, {
            rotation: 0,
            transformOrigin: '15% 50%',
            ease: 'power1.out',
            duration: 0.14
          }, 0.74);
        }

        // Reveal bottom-left "HARDWARE + SOFTWARE —" in About mode
        if (aboutLeftAccentRef.current) {
          tl.fromTo(aboutLeftAccentRef.current, {
            opacity: 0,
            y: 15
          }, {
            opacity: 1,
            y: 0,
            ease: 'power1.out',
            duration: 0.14
          }, 0.26);

          tl.to(aboutLeftAccentRef.current, {
            opacity: 0,
            y: -10,
            ease: 'power1.in',
            duration: 0.10
          }, 0.46);
        }

        // =====================================================================
        // 2. HERO CONTENT TIMELINE (0.00 -> 0.30)
        // =====================================================================
        tl.to(heroContentRef.current, {
          opacity: 0,
          x: -35,
          y: -8,
          ease: 'power1.out',
          duration: 0.14
        }, 0.16);

        tl.set(heroContentRef.current, { pointerEvents: 'none' }, 0.24);

        // =====================================================================
        // 3. ABOUT CONTENT TIMELINE (0.20 -> 0.58)
        // =====================================================================
        tl.fromTo(aboutContentRef.current, {
          opacity: 0,
          x: 35,
          y: 8,
        }, {
          opacity: 1,
          x: 0,
          y: 0,
          ease: 'power1.out',
          duration: 0.16
        }, 0.20);

        tl.set(aboutContentRef.current, { pointerEvents: 'auto' }, 0.24);

        // Staggered internal entrance for About items
        tl.fromTo('.about-eyebrow, .about-heading', { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.12 }, 0.22);
        tl.fromTo('.about-bio', { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.12 }, 0.26);
        tl.fromTo('.about-meta', { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.12 }, 0.30);
        tl.fromTo('.about-card-1, .about-card-2, .about-card-3', { opacity: 0, y: 15 }, { opacity: 1, y: 0, stagger: 0.03, duration: 0.14 }, 0.32);

        // About exit
        tl.to(aboutContentRef.current, {
          opacity: 0,
          x: -35,
          y: -8,
          ease: 'power1.out',
          duration: 0.12
        }, 0.46);

        tl.set(aboutContentRef.current, { pointerEvents: 'none' }, 0.52);

        // =====================================================================
        // 4. SKILLS CONTENT TIMELINE (0.50 -> 0.86)
        // =====================================================================
        tl.fromTo(skillsContentRef.current, {
          opacity: 0,
          x: 35,
          y: 8,
        }, {
          opacity: 1,
          x: 0,
          y: 0,
          ease: 'power1.out',
          duration: 0.16
        }, 0.50);

        tl.set(skillsContentRef.current, { pointerEvents: 'auto' }, 0.54);

        // Skills exit
        tl.to(skillsContentRef.current, {
          opacity: 0,
          x: -35,
          y: -8,
          ease: 'power1.out',
          duration: 0.12
        }, 0.74);

        tl.set(skillsContentRef.current, { pointerEvents: 'none' }, 0.80);

        // =====================================================================
        // 5. CONTACT CONTENT TIMELINE (0.78 -> 1.00)
        // =====================================================================
        tl.fromTo(contactContentRef.current, {
          opacity: 0,
          x: 35,
          y: 8,
        }, {
          opacity: 1,
          x: 0,
          y: 0,
          ease: 'power1.out',
          duration: 0.16
        }, 0.78);

        tl.set(contactContentRef.current, { pointerEvents: 'auto' }, 0.82);

      } else {
        // Reduced motion fallback: sequential crossfade without large translations
        tl.to(heroContentRef.current, { opacity: 0, duration: 0.15, pointerEvents: 'none' }, 0.15);
        tl.fromTo(aboutContentRef.current, { opacity: 0, pointerEvents: 'none' }, { opacity: 1, duration: 0.15, pointerEvents: 'auto' }, 0.20);
        tl.to(aboutContentRef.current, { opacity: 0, duration: 0.15, pointerEvents: 'none' }, 0.45);
        tl.fromTo(skillsContentRef.current, { opacity: 0, pointerEvents: 'none' }, { opacity: 1, duration: 0.15, pointerEvents: 'auto' }, 0.50);
        tl.to(skillsContentRef.current, { opacity: 0, duration: 0.15, pointerEvents: 'none' }, 0.75);
        tl.fromTo(contactContentRef.current, { opacity: 0, pointerEvents: 'none' }, { opacity: 1, duration: 0.15, pointerEvents: 'auto' }, 0.80);
      }
    }, trackRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="relative w-full bg-[#E9DDC7] text-[#292B27] font-sans select-none">
      
      {/* ========================================================================= */}
      {/* 420VH CONTINUOUS SCROLL TRACK (Tied to GSAP ScrollTrigger)               */}
      {/* ========================================================================= */}
      <div ref={trackRef} className="relative w-full h-[420vh]">
        
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
            {/* Animated Rectangle Cloud Strips (with tilt ref for Skills section) */}
            <div ref={stripsRef} className="absolute inset-0 w-full h-full" style={{ willChange: 'transform' }}>
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

            {/* About Section Far Bottom-Left Technical Accent */}
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

          {/* 5. HERO TYPOGRAPHY LAYER (z-30) */}
          <main
            ref={heroContentRef}
            className="absolute inset-0 pt-20 pb-4 sm:pb-6 px-4 sm:px-6 lg:px-8 z-30 pointer-events-auto flex flex-col justify-between"
          >
            <HeroTypography
              onExploreClick={onOpen3DWorld}
              onAboutClick={() => handleNavigate('about')}
            />
          </main>

          {/* 6. ABOUT SECTION LAYER (z-35) */}
          <section
            id="about"
            ref={aboutContentRef}
            className="absolute inset-0 pt-20 pb-4 sm:pb-6 px-4 sm:px-6 lg:px-8 z-35 pointer-events-none opacity-0 flex flex-col justify-between"
          >
            <AboutSection
              onOpen3DWorld={onOpen3DWorld}
              onExploreClick={onOpen3DWorld}
            />
          </section>

          {/* 7. SKILLS SECTION LAYER (z-40) */}
          <section
            id="skills"
            ref={skillsContentRef}
            className="absolute inset-0 pt-16 sm:pt-20 pb-2 sm:pb-4 px-3 sm:px-6 lg:px-8 z-40 pointer-events-none opacity-0 flex flex-col justify-between"
          >
            <SkillsSection
              onOpen3DWorld={onOpen3DWorld}
            />
          </section>

          {/* 8. CONTACT SECTION LAYER (z-45) */}
          <section
            id="contact"
            ref={contactContentRef}
            className="absolute inset-0 pt-20 pb-4 sm:pb-6 px-4 sm:px-6 lg:px-8 z-45 pointer-events-none opacity-0 flex flex-col justify-between"
          >
            <ContactSection
              onOpen3DWorld={onOpen3DWorld}
              onResumeClick={handleDownloadResume}
            />
          </section>

        </div>
      </div>

    </div>
  );
}
