import React, { useState } from 'react';
import { Download, Menu, X, Music, Compass, ArrowRight } from 'lucide-react';
import { audioEngine } from '../utils/audioSystem';

/**
 * Navigation Component
 * 
 * Redesigned to match the user's Figma template and Brand Guidelines:
 * 1. Brand Logo: Clean editorial text "Ajay Jadhao" in Inter Bold (#0E1F21).
 * 2. Center Nav Links: Clean unboxed text links. Active tab ("Home") uses the
 *    signature #6A8E8B teal underline accent without any bulky background pills.
 * 3. Right Action Cluster: Features the Figma-style primary pill button "Let's Connect →"
 *    alongside minimal toggles for 3D World exploration and ambient Audio.
 */
export default function Navigation({ onExploreClick, onResumeClick, currentView = 'hero', onToggleView, activeSection = 'Home', onNavigate }) {
  const [activeTab, setActiveTab] = useState(activeSection);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAudioActive, setIsAudioActive] = useState(() => audioEngine.isMusicPlaying);

  React.useEffect(() => {
    setActiveTab(activeSection);
  }, [activeSection]);

  React.useEffect(() => {
    setIsAudioActive(audioEngine.isMusicPlaying);
  }, []);

  const navLinks = [
    { label: 'Home', id: 'home' },
    { label: 'About', id: 'about' },
    { label: 'Projects', id: 'projects' },
    { label: 'Skills', id: 'skills' },
    { label: 'Contact', id: 'contact' },
  ];

  const toggleAudio = () => {
    audioEngine.playClick();
    if (!isAudioActive) {
      audioEngine.startMusic();
      setIsAudioActive(true);
    } else {
      audioEngine.stopMusic();
      setIsAudioActive(false);
    }
  };

  const handleConnectClick = () => {
    audioEngine.playClick();
    if (onNavigate) {
      onNavigate('contact');
    } else {
      const el = document.getElementById('contact');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        alert('Connecting with Ajay Jadhao — Email: rutikjadhao20@gmail.com');
      }
    }
  };

  return (
    <header className="relative z-40 w-full px-4 sm:px-8 lg:px-12 py-4 sm:py-5 flex items-center justify-between border-b border-[#D9E3E1]/70 bg-[#E9DDC7]/40 backdrop-blur-md transition-all duration-300">
      
      {/* BRAND IDENTITY: Clean Modern Text Logo matching Figma "YourName" - Hidden outside Home/Hero */}
      <div
        className={`flex items-center space-x-2 group cursor-pointer select-none whitespace-nowrap flex-shrink-0 transition-all duration-300 ${
          activeTab.toLowerCase() !== 'home'
            ? 'opacity-0 pointer-events-none -translate-x-3'
            : 'opacity-100 translate-x-0'
        }`}
        onMouseEnter={() => audioEngine.playHover()}
        onClick={() => {
          audioEngine.playRadarPing();
          if (onNavigate) onNavigate('home');
        }}
      >
        <span className="font-inter font-bold text-base sm:text-xl md:text-2xl text-[#0E1F21] tracking-tight hover:opacity-85 transition-opacity">
          Ajay Jadhao
        </span>
      </div>

      {/* CENTER NAVIGATION LINKS (Unboxed, Active underline in #6A8E8B) */}
      <nav className="hidden md:flex items-center space-x-7 lg:space-x-10">
        {navLinks.map((item) => {
          const isActive = activeTab.toLowerCase() === item.label.toLowerCase();
          return (
            <button
              key={item.label}
              onMouseEnter={() => audioEngine.playHover()}
              onClick={() => {
                audioEngine.playClick();
                setActiveTab(item.label);
                if (onNavigate) {
                  onNavigate(item.id);
                } else if (item.id === 'projects' && onExploreClick) {
                  onExploreClick();
                } else {
                  const el = document.getElementById(item.id);
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className={`relative py-1 font-inter text-sm sm:text-[15px] transition-colors duration-200 cursor-pointer ${
                isActive
                  ? 'font-semibold text-[#0E1F21] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#6A8E8B]'
                  : 'font-normal text-[#1A2A2D]/75 hover:text-[#0E1F21]'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* RIGHT ACTION CLUSTER: Figma "Let's Connect →" Pill Button + 3D World & Audio Toggles */}
      <div className="flex items-center space-x-2.5 sm:space-x-3.5">
        
        {/* 3D World Mode Switcher Button */}
        {onToggleView && (
          <button
            onClick={() => {
              audioEngine.playClick();
              onToggleView(currentView === 'hero' ? '3d_world' : 'hero');
            }}
            onMouseEnter={() => audioEngine.playHover()}
            className="flex items-center space-x-1.5 px-3 sm:px-3.5 py-1.5 min-h-[38px] rounded-full border border-[#6A8E8B]/40 bg-[#FFFFFF]/70 text-[#1A2A2D] hover:bg-[#0E1F21] hover:text-white transition-all text-xs font-inter cursor-pointer active:scale-95 shadow-2xs"
            title="Toggle between Hero Overview & 3D Circuit World"
          >
            <Compass className="w-3.5 h-3.5 text-[#6A8E8B]" />
            <span className="font-medium tracking-wide hidden min-[440px]:inline">
              {currentView === 'hero' ? '3D World' : 'Hero View'}
            </span>
          </button>
        )}

        {/* Soft Music & Sound Toggle Pill */}
        <button
          onClick={toggleAudio}
          onMouseEnter={() => audioEngine.playHover()}
          className={`flex items-center space-x-1.5 px-3 py-1.5 min-h-[38px] rounded-full border transition-all text-xs font-inter cursor-pointer shadow-2xs active:scale-95 ${
            isAudioActive
              ? 'bg-[#0E1F21] border-[#0E1F21] text-white'
              : 'bg-[#FFFFFF]/70 border-[#D9E3E1] text-[#1A2A2D] hover:bg-[#FFFFFF]'
          }`}
          title={isAudioActive ? 'Mute Music' : 'Play Ambient Music'}
        >
          {isAudioActive ? (
            <div className="flex items-end space-x-0.5 h-3 w-3">
              <span className="w-0.5 bg-[#6A8E8B] h-full animate-pulse rounded-full" />
              <span className="w-0.5 bg-teal-300 h-2/3 animate-ping rounded-full" />
              <span className="w-0.5 bg-[#D9E3E1] h-4/5 animate-pulse rounded-full" />
            </div>
          ) : (
            <Music className="w-3.5 h-3.5 text-[#6B7B7D]" />
          )}
          <span className="font-medium text-[11px] hidden min-[400px]:inline">
            {isAudioActive ? 'AUDIO ON' : 'SOUND'}
          </span>
        </button>

        {/* Primary Figma Pill Button: Let's Connect → */}
        <button
          onClick={handleConnectClick}
          onMouseEnter={() => audioEngine.playHover()}
          className="hidden sm:inline-flex group relative items-center space-x-2 px-5 sm:px-6 py-2 sm:py-2.5 min-h-[38px] rounded-full bg-[#0E1F21] text-white font-inter font-semibold text-xs sm:text-sm hover:bg-[#1A2A2D] shadow-sm hover:shadow-md transition-all active:scale-95 cursor-pointer"
        >
          <span>Let's Connect</span>
          <ArrowRight className="w-3.5 h-3.5 text-white group-hover:translate-x-1 transition-transform duration-200" />
        </button>

        {/* Mobile menu hamburger */}
        <button
          onClick={() => {
            audioEngine.playClick();
            setMobileMenuOpen(!mobileMenuOpen);
          }}
          className="md:hidden flex items-center justify-center min-w-[38px] min-h-[38px] w-9 h-9 rounded-full border border-[#D9E3E1] bg-[#FFFFFF]/80 text-[#0E1F21] cursor-pointer"
          aria-label="Toggle Mobile Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#F4EBDD] border-b border-[#D9E3E1] p-5 shadow-xl flex flex-col space-y-3 z-50 animate-fadeIn">
          {navLinks.map((item) => (
            <button
              key={item.label}
              onMouseEnter={() => audioEngine.playHover()}
              onClick={() => {
                audioEngine.playClick();
                setActiveTab(item.label);
                setMobileMenuOpen(false);
                if (onNavigate) {
                  onNavigate(item.id);
                } else if (item.id === 'projects' && onExploreClick) {
                  onExploreClick();
                } else {
                  const el = document.getElementById(item.id);
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className={`text-left px-4 py-2.5 rounded-lg text-sm font-inter cursor-pointer transition-colors ${
                activeTab === item.label
                  ? 'bg-[#0E1F21] text-white font-semibold'
                  : 'text-[#1A2A2D] hover:bg-[#E9DDC7]'
              }`}
            >
              {item.label}
            </button>
          ))}

          {/* Mobile Let's Connect CTA */}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              handleConnectClick();
            }}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-full bg-[#0E1F21] text-white font-inter text-sm font-semibold cursor-pointer mt-2"
          >
            <span>Let's Connect</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </button>
        </div>
      )}
    </header>
  );
}
