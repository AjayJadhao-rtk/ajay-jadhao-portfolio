import React, { useState } from 'react';
import { Download, Terminal, Menu, X, Music, Compass } from 'lucide-react';
import { audioEngine } from '../utils/audioSystem';

export default function Navigation({ onExploreClick, onResumeClick, currentView = 'hero', onToggleView }) {
  const [activeTab, setActiveTab] = useState('Home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAudioActive, setIsAudioActive] = useState(false);

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
      
      {/* BRAND IDENTITY: Logo with Technical Viewfinder Crop Marks */}
      <div
        className="flex items-center space-x-3 group cursor-pointer"
        onMouseEnter={() => audioEngine.playHover()}
        onClick={() => audioEngine.playRadarPing()}
      >
        <div className="relative pl-3 border-l-2 border-[#292B27]/70 py-0.5">
          <div className="flex items-center space-x-1.5">
            <span className="text-[11px] font-mono text-[#89634C] font-bold">┌</span>
            <span className="font-editorial text-lg sm:text-xl font-bold tracking-[0.14em] text-[#292B27] uppercase">
              AJAY JADHAO
            </span>
          </div>
          <p className="font-mono text-[9px] sm:text-[10px] tracking-wider text-[#626B50] font-medium flex items-center space-x-1 mt-0.5">
            <span>Electronics & Telecommunication Engineer</span>
            <span className="text-[#89634C] font-bold">]</span>
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
      <div className="flex items-center space-x-2.5">
        
        {/* 3D World Mode Switcher Button */}
        {onToggleView && (
          <button
            onClick={() => {
              audioEngine.playClick();
              onToggleView(currentView === 'hero' ? '3d_world' : 'hero');
            }}
            onMouseEnter={() => audioEngine.playHover()}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full border border-[#B17B53]/50 bg-[#F4EBDD] text-[#292B27] hover:bg-[#292B27] hover:text-[#F4EBDD] transition-all text-xs font-mono shadow-2xs cursor-pointer"
            title="Toggle between Hero Overview & 3D Circuit World"
          >
            <Compass className="w-3.5 h-3.5 text-[#B17B53]" />
            <span className="text-[10px] font-bold tracking-wider uppercase">
              {currentView === 'hero' ? '3D World' : 'Hero View'}
            </span>
          </button>
        )}

        {/* Soft Music & Sound Effects Pill Button */}
        <button
          onClick={toggleAudio}
          onMouseEnter={() => audioEngine.playHover()}
          className={`group flex items-center space-x-2 px-3 py-1.5 rounded-full border transition-all duration-300 text-xs font-mono cursor-pointer shadow-2xs ${
            isAudioActive
              ? 'bg-[#292B27] border-[#292B27] text-[#F4EBDD]'
              : 'bg-[#F4EBDD]/80 border-[#292B27]/25 text-[#292B27] hover:bg-[#F4EBDD]'
          }`}
          title={isAudioActive ? 'Mute / Pause Ambient Music' : 'Play Soft Vintage-Anime Ambient Music'}
        >
          {isAudioActive ? (
            <>
              <div className="flex items-end space-x-0.5 h-3 w-3">
                <span className="w-0.5 bg-[#B17B53] h-full animate-pulse rounded-full" />
                <span className="w-0.5 bg-emerald-400 h-2/3 animate-ping rounded-full" />
                <span className="w-0.5 bg-amber-400 h-4/5 animate-pulse rounded-full" />
              </div>
              <span className="text-[10px] font-semibold tracking-wider text-amber-300">AUDIO ON</span>
            </>
          ) : (
            <>
              <Music className="w-3 h-3 text-[#89634C] group-hover:text-[#292B27]" />
              <span className="text-[10px] font-medium tracking-wider text-[#626B50]">SOUND OFF</span>
            </>
          )}
        </button>

        {/* Terminal Quick Command Icon */}
        <button
          onMouseEnter={() => audioEngine.playHover()}
          onClick={() => audioEngine.playRadarPing()}
          title="Telemetry Terminal Mode"
          className="hidden sm:flex items-center justify-center w-8 h-8 rounded-md border border-[#292B27]/25 bg-[#F4EBDD]/80 text-[#292B27] hover:bg-[#292B27] hover:text-[#F4EBDD] transition-colors duration-200 font-mono text-xs shadow-xs cursor-pointer"
        >
          <span className="font-mono font-bold text-[11px]">&gt;_</span>
        </button>

        {/* Resume Download Button */}
        <button
          onMouseEnter={() => audioEngine.playHover()}
          onClick={() => {
            audioEngine.playClick();
            onResumeClick();
          }}
          className="group relative flex items-center space-x-2 px-3.5 py-1.5 rounded-md border border-[#292B27] bg-[#F4EBDD] text-[#292B27] hover:bg-[#292B27] hover:text-[#F4EBDD] transition-all duration-200 shadow-sm active:translate-y-0.5 cursor-pointer"
        >
          <span className="font-mono text-xs font-semibold tracking-wider uppercase">Resume</span>
          <Download className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-y-0.5" />
        </button>

        {/* Mobile menu hamburger */}
        <button
          onClick={() => {
            audioEngine.playClick();
            setMobileMenuOpen(!mobileMenuOpen);
          }}
          className="md:hidden flex items-center justify-center w-8 h-8 rounded border border-[#292B27]/30 text-[#292B27]"
        >
          {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#F4EBDD] border-b border-[#292B27]/20 p-4 shadow-lg flex flex-col space-y-2 z-50">
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
              className={`text-left px-4 py-2 rounded text-xs font-mono ${
                activeTab === item.label
                  ? 'bg-[#292B27] text-white font-bold'
                  : 'text-[#292B27] hover:bg-[#E9DDC7]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
