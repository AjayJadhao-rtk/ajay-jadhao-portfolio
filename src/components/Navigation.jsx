import React, { useState } from 'react';
import { Download, Terminal, Menu, X, Music, Compass } from 'lucide-react';
import { audioEngine } from '../utils/audioSystem';

export default function Navigation({ onExploreClick, onResumeClick, currentView = 'hero', onToggleView }) {
  const [activeTab, setActiveTab] = useState('Home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAudioActive, setIsAudioActive] = useState(() => audioEngine.isMusicPlaying);

  // Sync with audio engine state
  React.useEffect(() => {
    setIsAudioActive(audioEngine.isMusicPlaying);
  }, []);

  const navLinks = [
    { label: 'Home', id: 'home' },
    { label: 'About', id: 'about' },
    { label: 'Projects', id: 'projects' },
    { label: 'Experience', id: 'experience' },
    { label: 'Achievements', id: 'achievements' },
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

  return (
    <header className="relative z-30 w-full px-4 sm:px-8 py-3 flex items-center justify-between border-b border-[#292B27]/12 bg-[#E9DDC7]/80 backdrop-blur-sm transition-all duration-300">
      
      {/* BRAND IDENTITY: Engineering Monogram & Lab Status Badge (Deduplicated, name lives in Hero) */}
      <div
        className="flex items-center space-x-2.5 group cursor-pointer select-none"
        onMouseEnter={() => audioEngine.playHover()}
        onClick={() => audioEngine.playRadarPing()}
      >
        <div className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-md bg-[#292B27] text-[#F4EBDD] font-display font-bold text-xs sm:text-sm tracking-wider shadow-sm group-hover:bg-[#B17B53] transition-colors border border-[#292B27]/40">
          AJ
        </div>
        <div className="flex flex-col">
          <div className="flex items-center space-x-1.5">
            <span className="font-mono text-[10px] sm:text-[11px] font-bold tracking-wider text-[#292B27] uppercase">
              ROBOTICS & EMBEDDED
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
          </div>
          <p className="font-mono text-[8px] sm:text-[9px] tracking-widest text-[#89634C] font-semibold uppercase">
            SYSTEMS LAB // 2026
          </p>
        </div>
      </div>

      {/* CENTER NAVIGATION PILL */}
      <nav className="hidden md:flex items-center space-x-1 bg-[#F4EBDD]/70 px-2 py-1 rounded-full border border-[#292B27]/12 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)]">
        {navLinks.map((item) => {
          const isActive = activeTab === item.label;
          return (
            <button
              key={item.label}
              onMouseEnter={() => audioEngine.playHover()}
              onClick={() => {
                audioEngine.playClick();
                setActiveTab(item.label);
                if (item.id === 'projects' && onExploreClick) {
                  onExploreClick();
                }
              }}
              className={`relative px-4 py-1.5 rounded-full text-xs font-mono transition-all duration-200 tracking-tight cursor-pointer ${
                isActive
                  ? 'bg-[#292B27] text-[#F4EBDD] font-semibold shadow-sm shadow-[#292B27]/30'
                  : 'text-[#292B27]/75 hover:text-[#292B27] hover:bg-[#292B27]/5'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* RIGHT ACTION CLUSTER: 3D World Toggle, Audio Toggle, Terminal, Resume CTA */}
      <div className="flex items-center space-x-2 sm:space-x-2.5">
        
        {/* 3D World Mode Switcher Button (Min 44px touch target) */}
        {onToggleView && (
          <button
            onClick={() => {
              audioEngine.playClick();
              onToggleView(currentView === 'hero' ? '3d_world' : 'hero');
            }}
            onMouseEnter={() => audioEngine.playHover()}
            className="flex items-center space-x-1.5 px-3 sm:px-3.5 py-2 min-h-[44px] rounded-full border border-[#B17B53]/50 bg-[#F4EBDD] text-[#292B27] hover:bg-[#292B27] hover:text-[#F4EBDD] transition-all text-xs font-mono shadow-2xs cursor-pointer active:scale-95"
            title="Toggle between Hero Overview & 3D Circuit World"
          >
            <Compass className="w-4 h-4 text-[#B17B53]" />
            <span className="text-[11px] font-bold tracking-wider uppercase hidden min-[440px]:inline">
              {currentView === 'hero' ? '3D World' : 'Hero View'}
            </span>
            <span className="text-[11px] font-bold tracking-wider uppercase min-[440px]:hidden">
              {currentView === 'hero' ? '3D' : 'Hero'}
            </span>
          </button>
        )}

        {/* Soft Music & Sound Effects Pill Button (Min 44px touch target) */}
        <button
          onClick={toggleAudio}
          onMouseEnter={() => audioEngine.playHover()}
          className={`group flex items-center space-x-1.5 sm:space-x-2 px-3 sm:px-3.5 py-2 min-h-[44px] rounded-full border transition-all duration-300 text-xs font-mono cursor-pointer shadow-2xs active:scale-95 ${
            isAudioActive
              ? 'bg-[#292B27] border-[#292B27] text-[#F4EBDD]'
              : 'bg-[#F4EBDD]/80 border-[#292B27]/25 text-[#292B27] hover:bg-[#F4EBDD]'
          }`}
          title={isAudioActive ? 'Mute / Pause Ambient Music' : 'Play Soft Vintage-Anime Ambient Music'}
        >
          {isAudioActive ? (
            <>
              <div className="flex items-end space-x-0.5 h-3.5 w-3.5">
                <span className="w-0.5 bg-[#B17B53] h-full animate-pulse rounded-full" />
                <span className="w-0.5 bg-emerald-400 h-2/3 animate-ping rounded-full" />
                <span className="w-0.5 bg-amber-400 h-4/5 animate-pulse rounded-full" />
              </div>
              <span className="text-[10.5px] font-semibold tracking-wider text-amber-300 hidden min-[400px]:inline">AUDIO ON</span>
            </>
          ) : (
            <>
              <Music className="w-3.5 h-3.5 text-[#89634C] group-hover:text-[#292B27]" />
              <span className="text-[10.5px] font-medium tracking-wider text-[#626B50] hidden min-[400px]:inline">SOUND OFF</span>
            </>
          )}
        </button>

        {/* Terminal Quick Command Icon */}
        <button
          onMouseEnter={() => audioEngine.playHover()}
          onClick={() => audioEngine.playRadarPing()}
          title="Telemetry Terminal Mode"
          className="hidden sm:flex items-center justify-center min-w-[44px] min-h-[44px] w-11 h-11 rounded-md border border-[#292B27]/25 bg-[#F4EBDD]/80 text-[#292B27] hover:bg-[#292B27] hover:text-[#F4EBDD] transition-colors duration-200 font-mono text-xs shadow-xs cursor-pointer"
        >
          <span className="font-mono font-bold text-xs">&gt;_</span>
        </button>

        {/* Resume Download Button (Min 44px touch target) */}
        <button
          onMouseEnter={() => audioEngine.playHover()}
          onClick={() => {
            audioEngine.playClick();
            onResumeClick();
          }}
          className="hidden sm:flex group relative items-center space-x-2 px-4 py-2 min-h-[44px] rounded-md border border-[#292B27] bg-[#F4EBDD] text-[#292B27] hover:bg-[#292B27] hover:text-[#F4EBDD] transition-all duration-200 shadow-sm active:translate-y-0.5 cursor-pointer"
        >
          <span className="font-mono text-xs font-semibold tracking-wider uppercase">Resume</span>
          <Download className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-y-0.5" />
        </button>

        {/* Mobile menu hamburger (Min 44px touch target) */}
        <button
          onClick={() => {
            audioEngine.playClick();
            setMobileMenuOpen(!mobileMenuOpen);
          }}
          className="md:hidden flex items-center justify-center min-w-[44px] min-h-[44px] w-11 h-11 rounded border border-[#292B27]/30 text-[#292B27] cursor-pointer"
          aria-label="Toggle Mobile Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer with 44px+ Tap Targets */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#F4EBDD] border-b-2 border-[#292B27]/30 p-4 shadow-xl flex flex-col space-y-2 z-50 animate-fadeIn">
          {navLinks.map((item) => (
            <button
              key={item.label}
              onMouseEnter={() => audioEngine.playHover()}
              onClick={() => {
                audioEngine.playClick();
                setActiveTab(item.label);
                setMobileMenuOpen(false);
                if (item.id === 'projects' && onExploreClick) {
                  onExploreClick();
                }
              }}
              className={`text-left px-4 py-3 min-h-[44px] flex items-center rounded text-sm font-mono cursor-pointer ${
                activeTab === item.label
                  ? 'bg-[#292B27] text-white font-bold'
                  : 'text-[#292B27] hover:bg-[#E9DDC7]'
              }`}
            >
              {item.label}
            </button>
          ))}

          {/* Mobile Resume CTA */}
          <button
            onClick={() => {
              audioEngine.playClick();
              setMobileMenuOpen(false);
              onResumeClick();
            }}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 min-h-[44px] rounded bg-[#292B27] text-[#F4EBDD] font-mono text-xs font-bold uppercase tracking-wider cursor-pointer mt-2"
          >
            <span>Download Engineering Resume</span>
            <Download className="w-4 h-4" />
          </button>
        </div>
      )}
    </header>
  );
}
