import React, { useState } from 'react';
import { Mail, Copy, Check, ArrowUpRight, MapPin, Sparkles, Send, Github, Linkedin, ExternalLink } from 'lucide-react';
import { audioEngine } from '../utils/audioSystem';

export default function ContactSection({ onOpen3DWorld, onResumeClick }) {
  const [copied, setCopied] = useState(false);

  const EMAIL = "rutikjadhao20@gmail.com";
  const GITHUB_URL = "https://github.com/AjayJadhao-rtk";
  const FIGMA_URL = "https://www.figma.com/design/998ew7eGo5JNZVyIvjnCHG/Untitled?node-id=0-1&t=0B5KIEru0l8EEztt-1";

  const handleCopyEmail = (e) => {
    e.stopPropagation();
    audioEngine.playClick();
    navigator.clipboard.writeText(EMAIL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleEmailClick = () => {
    audioEngine.playClick();
    window.location.href = `mailto:${EMAIL}?subject=Engineering%20Collaboration%20Inquiry&body=Hello%20Ajay,%0D%0A%0D%0AI%20would%20like%20to%20discuss%20a%20project%20with%20you.%0D%0A%0D%0ABest%20regards,`;
  };

  const handlePrototypeClick = () => {
    audioEngine.playClick();
    const subject = encodeURIComponent("Prototype Development Inquiry");
    const body = encodeURIComponent(
      "Hello Ajay,\n\nI'm interested in building a prototype with you.\n\nHere are some initial details about my idea:\nProject / Prototype Name: \nBrief Description of the Idea: \nKey Features or Requirements: \nTarget Timeline: \nEstimated Budget (optional): \n\nLooking forward to hearing from you!\n\nBest regards,\n[Your Name]"
    );
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between py-2 sm:py-4 px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto select-none">
      
      {/* ========================================================================= */}
      {/* HEADER: Section Eyebrow & Display Title                                  */}
      {/* ========================================================================= */}
      <div className="w-full flex flex-col items-start space-y-1 sm:space-y-2 pt-2">
        {/* Section Eyebrow */}
        <div className="flex items-center space-x-2 text-[10px] sm:text-xs font-mono tracking-[0.25em] text-[#1E3A32] uppercase font-bold">
          <span className="w-2 h-2 rounded-full bg-[#1E3A32] inline-block animate-ping" />
          <span>04 // CONTACT &amp; COLLABORATION &mdash;&mdash;&mdash;&mdash;&mdash;</span>
        </div>

        {/* Display Heading */}
        <h2 className="font-serif italic font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#0E1F21] tracking-tight leading-none">
          Let&rsquo;s Build Something <span className="text-[#27433B] not-italic">Exceptional.</span>
        </h2>

        {/* Philosophy Intro */}
        <p className="text-xs sm:text-sm md:text-base font-sans text-[#292B27]/85 max-w-2xl font-normal leading-relaxed pt-1">
          Whether you need a custom robotics prototype, embedded firmware architecture,
          or an interactive web experience &mdash; I&rsquo;m ready to turn your ambitious engineering ideas into tangible reality.
        </p>
      </div>

      {/* ========================================================================= */}
      {/* 3 INTERACTIVE CONTACT CARDS                                              */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 my-2 sm:my-4">
        
        {/* CARD 01: Direct Email Inquiry */}
        <div
          onClick={handleEmailClick}
          onMouseEnter={() => audioEngine.playHover()}
          className="group relative flex flex-col justify-between p-4 sm:p-5 bg-[#F8F3EA]/95 hover:bg-[#FAF6EF] border border-[#2C3835]/30 hover:border-[#1E3A32] rounded-[4px] shadow-[0_2px_8px_rgba(41,43,39,0.06)] hover:shadow-[0_6px_20px_rgba(41,43,39,0.14)] hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden"
        >
          <div>
            <div className="flex items-center justify-between text-[#1E3A32] mb-3">
              <span className="font-mono text-[10px] tracking-widest uppercase font-bold bg-[#1E3A32]/10 px-2 py-0.5 rounded">
                CHANNEL 01
              </span>
              <div className="w-8 h-8 rounded-full bg-[#1E3A32] text-[#F4ECE1] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Mail className="w-4 h-4" />
              </div>
            </div>

            <h3 className="font-serif font-bold text-base sm:text-lg text-[#0E1F21] mb-1">
              Direct Email
            </h3>
            <p className="text-xs text-[#292B27]/80 leading-relaxed mb-3">
              Fastest response for technical inquiries, consulting, and collaboration opportunities.
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#2C3835]/15">
            <span className="font-mono text-[11px] sm:text-xs text-[#1E3A32] font-semibold truncate pr-2">
              {EMAIL}
            </span>
            <button
              onClick={handleCopyEmail}
              className="flex items-center space-x-1 px-2 py-1 rounded bg-[#1E3A32]/10 hover:bg-[#1E3A32] text-[#1E3A32] hover:text-[#F4ECE1] text-[10px] font-mono transition-colors"
              title="Copy email to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span>COPIED</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>COPY</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* CARD 02: Rapid Prototype Inquiry */}
        <div
          onClick={handlePrototypeClick}
          onMouseEnter={() => audioEngine.playHover()}
          className="group relative flex flex-col justify-between p-4 sm:p-5 bg-[#1E3A32] text-[#F4ECE1] hover:bg-[#27433B] border border-[#1E3A32] rounded-[4px] shadow-[0_4px_14px_rgba(30,58,50,0.2)] hover:shadow-[0_8px_24px_rgba(30,58,50,0.3)] hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden"
        >
          <div>
            <div className="flex items-center justify-between mb-3 text-[#A5F3FC]">
              <span className="font-mono text-[10px] tracking-widest uppercase font-bold bg-white/10 px-2 py-0.5 rounded">
                CHANNEL 02 &bull; HIGH PRIORITY
              </span>
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Send className="w-4 h-4 text-[#A5F3FC]" />
              </div>
            </div>

            <h3 className="font-serif font-bold text-base sm:text-lg text-[#F4ECE1] mb-1">
              Build Your Prototype &rarr;
            </h3>
            <p className="text-xs text-[#F4ECE1]/80 leading-relaxed mb-3">
              Have a hardware or software concept? Open our structured project brief template to kick off rapid prototyping.
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-white/20 text-[#A5F3FC] text-xs font-mono font-semibold">
            <span>INITIATE PROJECT BRIEF</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>

        {/* CARD 03: Studio & Worldwide Collaboration */}
        <div
          onMouseEnter={() => audioEngine.playHover()}
          className="group relative flex flex-col justify-between p-4 sm:p-5 bg-[#F8F3EA]/95 hover:bg-[#FAF6EF] border border-[#2C3835]/30 hover:border-[#1E3A32] rounded-[4px] shadow-[0_2px_8px_rgba(41,43,39,0.06)] hover:shadow-[0_6px_20px_rgba(41,43,39,0.14)] hover:-translate-y-1 transition-all duration-300 overflow-hidden"
        >
          <div>
            <div className="flex items-center justify-between text-[#1E3A32] mb-3">
              <span className="font-mono text-[10px] tracking-widest uppercase font-bold bg-[#1E3A32]/10 px-2 py-0.5 rounded">
                LOCATION &bull; REMOTE
              </span>
              <div className="w-8 h-8 rounded-full bg-[#1E3A32] text-[#F4ECE1] flex items-center justify-center group-hover:scale-110 transition-transform">
                <MapPin className="w-4 h-4" />
              </div>
            </div>

            <h3 className="font-serif font-bold text-base sm:text-lg text-[#0E1F21] mb-1">
              Studio &amp; Availability
            </h3>
            <p className="text-xs text-[#292B27]/80 leading-relaxed mb-3">
              Based in Maharashtra, India. Open for remote engineering contracts &amp; select on-site deployments worldwide.
            </p>
          </div>

          <div className="flex items-center space-x-2 pt-2 border-t border-[#2C3835]/15 text-[11px] font-mono text-[#1E3A32] font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>OPEN FOR NEW PROJECTS &bull; 2026</span>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* FOOTER BAR: Social Links, Figma Design Link & Signature                  */}
      {/* ========================================================================= */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between py-2 sm:py-3 border-t border-[#2C3835]/20 gap-2 sm:gap-0">
        
        {/* External Social Profiles & Figma File */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => audioEngine.playHover()}
            className="flex items-center space-x-1.5 text-xs font-mono text-[#1E3A32] hover:text-[#0E1F21] font-semibold transition-colors"
          >
            <Github className="w-4 h-4" />
            <span>GitHub</span>
          </a>

          <span className="text-[#2C3835]/30">&bull;</span>

          <a
            href={FIGMA_URL}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => audioEngine.playHover()}
            className="flex items-center space-x-1.5 text-xs font-mono text-[#8B5CF6] hover:text-[#6D28D9] font-bold transition-colors"
          >
            <span>Figma Design System</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Signature Tagline */}
        <div className="text-[10px] sm:text-xs font-mono text-[#5A6966] tracking-wider uppercase text-center sm:text-right">
          <span>&copy; {new Date().getFullYear()} AJAY JADHAO &bull; ALL RIGHTS RESERVED</span>
        </div>

      </div>

    </div>
  );
}
