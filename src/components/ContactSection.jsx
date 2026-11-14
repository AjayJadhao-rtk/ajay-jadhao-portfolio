import React, { useState } from 'react';
import { Mail, MapPin, Linkedin, Github, Instagram, Twitter, ArrowUp, Send, Check, X, ChevronRight, User, Tag, MessageSquare, ArrowRight } from 'lucide-react';
import { audioEngine } from '../utils/audioSystem';

export default function ContactSection({ onScrollToTop, onNavigate }) {
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: "Hi Ajay,\nI'd love to discuss a potential project opportunity with you. Looking forward to hearing from you!"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [copiedCard, setCopiedCard] = useState(null);

  const EMAIL_ADDRESS = "rutikjadhao20@gmail.com";
  const GITHUB_URL = "https://github.com/AjayJadhao-rtk";
  const LINKEDIN_URL = "https://www.linkedin.com/in/ajayjadhao";
  const INSTAGRAM_URL = "https://instagram.com/ajayjadhao";
  const TWITTER_URL = "https://twitter.com";

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCardClick = (type, value, link) => {
    audioEngine.playClick();
    if (type === 'email') {
      // Trigger mailto and copy
      navigator.clipboard.writeText(value);
      setCopiedCard('email');
      setTimeout(() => setCopiedCard(null), 2500);
      window.location.href = `mailto:${value}?subject=Collaboration%20Inquiry&body=Hello%20Ajay,%0D%0A%0D%0A`;
    } else if (link) {
      window.open(link, '_blank', 'noopener,noreferrer');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    audioEngine.playClick();
    setIsSubmitting(true);

    // Simulate sending message with sound feedback and realistic dispatch
    setTimeout(() => {
      setIsSubmitting(false);
      setShowToast(true);
      audioEngine.playRadarPing();

      // Open mailto fallback prefilled with user inputs
      const subject = encodeURIComponent(formData.subject || "Portfolio Contact Inquiry");
      const body = encodeURIComponent(
        `Name: ${formData.name || 'Visitor'}\nEmail: ${formData.email || 'Not provided'}\n\nMessage:\n${formData.message}`
      );
      window.location.href = `mailto:${EMAIL_ADDRESS}?subject=${subject}&body=${body}`;

      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: "Hi Ajay,\nI'd love to discuss a potential project opportunity with you. Looking forward to hearing from you!"
      });
    }, 700);
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between py-1 sm:py-2 select-none">
      
      {/* ========================================================================= */}
      {/* SUCCESS NOTIFICATION TOAST (Matches Green Banner in Reference Image)      */}
      {/* ========================================================================= */}
      {showToast && (
        <div className="fixed top-20 right-6 sm:right-12 z-50 flex items-center space-x-3 bg-[#E8F8F0] border border-[#27AE60]/40 text-[#1E3A32] px-4 py-3 rounded-lg shadow-xl animate-slideInRight max-w-sm">
          <div className="w-7 h-7 rounded-full bg-[#27AE60] text-white flex items-center justify-center flex-shrink-0">
            <Check className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div className="flex-1 pr-1">
            <h4 className="font-sans font-bold text-xs text-[#0E1F21]">Message sent!</h4>
            <p className="font-sans text-[11px] text-[#292B27]/80 leading-tight">
              Thanks for reaching out. I&rsquo;ll get back to you soon!
            </p>
          </div>
          <button
            onClick={() => setShowToast(false)}
            className="text-[#1E3A32]/60 hover:text-[#0E1F21] p-1 rounded transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* LEFT TECHNICAL OVERLAY (Matches Compass Radar & Annotations in Reference) */}
      {/* ========================================================================= */}
      <div className="hidden lg:block absolute left-2 xl:left-6 top-8 bottom-12 pointer-events-none select-none z-10 w-44">
        {/* Top Annotation */}
        <div className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#1E3A32]/85 font-semibold leading-relaxed">
          <p>TECHNOLOGY</p>
          <p>PEOPLE</p>
          <p>A BETTER TOMORROW</p>
          <div className="w-6 h-[1.5px] bg-[#1E3A32]/70 mt-1" />
        </div>

        {/* Circular Compass Radar Graphic (From Reference) */}
        <div className="relative my-8 w-36 h-36 opacity-35">
          <svg viewBox="0 0 100 100" className="w-full h-full stroke-[#1E3A32] fill-none">
            <circle cx="50" cy="50" r="45" strokeWidth="0.75" strokeDasharray="3 3" />
            <circle cx="50" cy="50" r="30" strokeWidth="0.75" />
            <circle cx="50" cy="50" r="16" strokeWidth="0.75" strokeDasharray="2 2" />
            <circle cx="50" cy="50" r="4" fill="#1E3A32" />
            <line x1="50" y1="5" x2="50" y2="95" strokeWidth="0.75" />
            <line x1="5" y1="50" x2="95" y2="50" strokeWidth="0.75" />
            <line x1="18" y1="18" x2="82" y2="82" strokeWidth="0.5" strokeDasharray="2 2" />
            <line x1="18" y1="82" x2="82" y2="18" strokeWidth="0.5" strokeDasharray="2 2" />
          </svg>
        </div>

        {/* Bottom Annotation */}
        <div className="absolute bottom-4 left-0 text-[10px] font-mono tracking-[0.2em] uppercase text-[#1E3A32]/85 font-semibold leading-relaxed">
          <p>LET&rsquo;S BUILD</p>
          <p>WHAT&rsquo;S NEXT</p>
          <div className="w-6 h-[1.5px] bg-[#1E3A32]/70 mt-1" />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MAIN CONTENT AREA: Leaves left open for rectangle strips & building       */}
      {/* ========================================================================= */}
      <div className="w-full flex-1 flex flex-col justify-between pl-0 lg:pl-36 xl:pl-48 pr-2 sm:pr-8 max-w-[1720px] mx-auto overflow-y-auto max-h-[calc(100vh-130px)] lg:max-h-none scrollbar-thin">
        
        {/* Section Header */}
        <div className="flex flex-col items-start space-y-1 mb-2 sm:mb-3">
          {/* Eyebrow */}
          <div className="flex items-center space-x-2 text-[10px] sm:text-xs font-mono tracking-[0.25em] text-[#1E3A32] uppercase font-bold">
            <span>04 // CONTACT</span>
            <span className="w-24 sm:w-48 h-[1px] bg-[#2C3835]/25 inline-block" />
          </div>

          {/* Large Title: "LET'S CONNECT" */}
          <h2 className="font-serif font-black text-3xl sm:text-4xl md:text-5xl lg:text-[54px] tracking-tight leading-none">
            <span className="text-[#0E1F21]">LET&rsquo;S </span>
            <span className="text-[#1E4E49] italic">CONNECT</span>
          </h2>

          {/* Subtitle */}
          <p className="text-xs sm:text-[13px] md:text-sm font-sans text-[#292B27]/85 max-w-3xl leading-relaxed pt-0.5">
            Have a project idea, collaboration opportunity, or just want to say hi?{' '}
            I&rsquo;d love to hear from you. Let&rsquo;s turn ideas into{' '}
            <strong className="text-[#1E4E49] font-bold">real-world solutions.</strong>
          </p>
        </div>

        {/* ======================================================================= */}
        {/* TWO-COLUMN GRID: 5 Contact Cards (Left) + Send Message Form (Right)      */}
        {/* ======================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 xl:gap-6 items-start my-auto">
          
          {/* --------------------------------------------------------------------- */}
          {/* LEFT: 5 Contact Cards (2 Columns Grid matching Reference Image)       */}
          {/* --------------------------------------------------------------------- */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
            
            {/* Card 1: EMAIL */}
            <div
              onClick={() => handleCardClick('email', EMAIL_ADDRESS)}
              onMouseEnter={() => audioEngine.playHover()}
              className="group relative flex items-center justify-between p-3 sm:p-3.5 bg-[#FAF6EE]/95 hover:bg-[#FFFFFF] border border-[#2C3835]/20 hover:border-[#1E4E49] rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-[#1E4E49] text-white flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="font-mono text-[10px] tracking-wider uppercase font-bold text-[#1E3A32]">
                    EMAIL
                  </span>
                  <span className="font-sans font-semibold text-xs sm:text-[13px] text-[#0E1F21] group-hover:text-[#1E4E49] transition-colors truncate max-w-[170px]">
                    {copiedCard === 'email' ? 'Copied to clipboard!' : EMAIL_ADDRESS}
                  </span>
                  <span className="text-[10px] text-[#5A6966] leading-tight">
                    Drop me a message anytime.
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#1E4E49]/60 group-hover:translate-x-0.5 transition-transform" />
            </div>

            {/* Card 2: LOCATION */}
            <div
              onMouseEnter={() => audioEngine.playHover()}
              className="group relative flex items-center justify-between p-3 sm:p-3.5 bg-[#FAF6EE]/95 hover:bg-[#FFFFFF] border border-[#2C3835]/20 hover:border-[#1E4E49] rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-[#D4C3A3] text-[#0E1F21] flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="font-mono text-[10px] tracking-wider uppercase font-bold text-[#1E3A32]">
                    LOCATION
                  </span>
                  <span className="font-sans font-semibold text-xs sm:text-[13px] text-[#0E1F21]">
                    Maharashtra, India
                  </span>
                  <span className="text-[10px] text-[#5A6966] leading-tight">
                    Open to remote opportunities worldwide.
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#1E4E49]/60 group-hover:translate-x-0.5 transition-transform" />
            </div>

            {/* Card 3: LINKEDIN */}
            <div
              onClick={() => handleCardClick('link', 'LinkedIn', LINKEDIN_URL)}
              onMouseEnter={() => audioEngine.playHover()}
              className="group relative flex items-center justify-between p-3 sm:p-3.5 bg-[#FAF6EE]/95 hover:bg-[#FFFFFF] border border-[#2C3835]/20 hover:border-[#0A66C2] rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-[#0A66C2] text-white flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                  <Linkedin className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="font-mono text-[10px] tracking-wider uppercase font-bold text-[#1E3A32]">
                    LINKEDIN
                  </span>
                  <span className="font-sans font-semibold text-xs sm:text-[13px] text-[#0E1F21] group-hover:text-[#0A66C2] transition-colors">
                    linkedin.com/in/ajayjadhao
                  </span>
                  <span className="text-[10px] text-[#5A6966] leading-tight">
                    Let&rsquo;s connect professionally.
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#0A66C2]/60 group-hover:translate-x-0.5 transition-transform" />
            </div>

            {/* Card 4: GITHUB */}
            <div
              onClick={() => handleCardClick('link', 'GitHub', GITHUB_URL)}
              onMouseEnter={() => audioEngine.playHover()}
              className="group relative flex items-center justify-between p-3 sm:p-3.5 bg-[#FAF6EE]/95 hover:bg-[#FFFFFF] border border-[#2C3835]/20 hover:border-[#0E1F21] rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-[#E5DCD0] text-[#0E1F21] flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                  <Github className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="font-mono text-[10px] tracking-wider uppercase font-bold text-[#1E3A32]">
                    GITHUB
                  </span>
                  <span className="font-sans font-semibold text-xs sm:text-[13px] text-[#0E1F21] group-hover:text-[#1E4E49] transition-colors">
                    github.com/ajayjadhao
                  </span>
                  <span className="text-[10px] text-[#5A6966] leading-tight">
                    Check out my projects.
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#0E1F21]/60 group-hover:translate-x-0.5 transition-transform" />
            </div>

            {/* Card 5: INSTAGRAM */}
            <div
              onClick={() => handleCardClick('link', 'Instagram', INSTAGRAM_URL)}
              onMouseEnter={() => audioEngine.playHover()}
              className="group relative flex items-center justify-between p-3 sm:p-3.5 bg-[#FAF6EE]/95 hover:bg-[#FFFFFF] border border-[#2C3835]/20 hover:border-[#E1306C] rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer sm:col-span-2"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#FD1D1D] via-[#E1306C] to-[#833AB4] text-white flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                  <Instagram className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="font-mono text-[10px] tracking-wider uppercase font-bold text-[#1E3A32]">
                    INSTAGRAM
                  </span>
                  <span className="font-sans font-semibold text-xs sm:text-[13px] text-[#0E1F21] group-hover:text-[#E1306C] transition-colors">
                    instagram.com/ajayjadhao
                  </span>
                  <span className="text-[10px] text-[#5A6966] leading-tight">
                    Behind the scenes &amp; more.
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#E1306C]/60 group-hover:translate-x-0.5 transition-transform" />
            </div>

          </div>

          {/* --------------------------------------------------------------------- */}
          {/* RIGHT: "SEND A MESSAGE" Form (Matches Right Column in Reference)      */}
          {/* --------------------------------------------------------------------- */}
          <div className="lg:col-span-5 bg-[#FAF6EE]/95 border border-[#2C3835]/20 rounded-xl p-3.5 sm:p-4 shadow-sm flex flex-col justify-between">
            <div>
              {/* Form Header */}
              <div className="flex items-center space-x-2 text-[10px] font-mono tracking-widest uppercase font-bold text-[#1E3A32] border-b border-[#2C3835]/15 pb-2 mb-3">
                <span>SEND A MESSAGE</span>
                <span className="flex-1 h-[1px] bg-[#2C3835]/15" />
              </div>

              {/* Form Fields */}
              <form onSubmit={handleSubmit} className="space-y-2">
                {/* Row 1: Name and Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {/* Name Input */}
                  <div className="flex items-center space-x-2 px-2.5 py-1.5 bg-white border border-[#2C3835]/20 rounded-md focus-within:border-[#1E4E49] focus-within:ring-1 focus-within:ring-[#1E4E49] transition-all">
                    <User className="w-3.5 h-3.5 text-[#5A6966]" />
                    <input
                      type="text"
                      name="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full text-xs font-sans text-[#0E1F21] bg-transparent outline-none placeholder:text-[#5A6966]/60"
                    />
                  </div>

                  {/* Email Input */}
                  <div className="flex items-center space-x-2 px-2.5 py-1.5 bg-white border border-[#2C3835]/20 rounded-md focus-within:border-[#1E4E49] focus-within:ring-1 focus-within:ring-[#1E4E49] transition-all">
                    <Mail className="w-3.5 h-3.5 text-[#5A6966]" />
                    <input
                      type="email"
                      name="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full text-xs font-sans text-[#0E1F21] bg-transparent outline-none placeholder:text-[#5A6966]/60"
                    />
                  </div>
                </div>

                {/* Row 2: Subject */}
                <div className="flex items-center space-x-2 px-2.5 py-1.5 bg-white border border-[#2C3835]/20 rounded-md focus-within:border-[#1E4E49] focus-within:ring-1 focus-within:ring-[#1E4E49] transition-all">
                  <Tag className="w-3.5 h-3.5 text-[#5A6966]" />
                  <input
                    type="text"
                    name="subject"
                    placeholder="Project Collaboration"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full text-xs font-sans text-[#0E1F21] bg-transparent outline-none placeholder:text-[#5A6966]/60"
                  />
                </div>

                {/* Row 3: Message Textarea */}
                <div className="flex items-start space-x-2 px-2.5 py-2 bg-white border border-[#2C3835]/20 rounded-md focus-within:border-[#1E4E49] focus-within:ring-1 focus-within:ring-[#1E4E49] transition-all">
                  <MessageSquare className="w-3.5 h-3.5 text-[#5A6966] mt-0.5" />
                  <textarea
                    name="message"
                    rows="3"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    className="w-full text-xs font-sans text-[#0E1F21] bg-transparent outline-none resize-none placeholder:text-[#5A6966]/60 leading-relaxed"
                  />
                </div>

                {/* Submit Pill Button (Matches Reference) */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  onMouseEnter={() => audioEngine.playHover()}
                  className="w-full flex items-center justify-center space-x-2 py-2 sm:py-2.5 px-4 bg-[#0E1F21] hover:bg-[#1E4E49] active:scale-[0.99] text-[#FAF6EE] rounded-full font-sans font-semibold text-xs sm:text-[13px] tracking-wide transition-all shadow-md cursor-pointer group"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Send Message</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      <Send className="w-3.5 h-3.5 ml-1 opacity-80" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Response Time Subtext */}
            <p className="text-[10px] font-sans text-[#5A6966] text-center mt-2">
              I usually respond within 24&ndash;48 hours.
            </p>
          </div>

        </div>

        {/* ======================================================================= */}
        {/* FOOTER BAR: Matches Bottom of Reference Image                           */}
        {/* ======================================================================= */}
        <div className="w-full pt-2 border-t border-[#2C3835]/20 mt-2">
          {/* Centered Tagline Divider */}
          <div className="flex items-center justify-center space-x-3 mb-1.5 text-[9px] font-mono tracking-[0.25em] text-[#1E3A32]/80 uppercase font-semibold">
            <span className="w-12 sm:w-24 h-[1px] bg-[#2C3835]/20" />
            <span>IDEAS INTO REAL-WORLD SOLUTIONS</span>
            <span className="w-12 sm:w-24 h-[1px] bg-[#2C3835]/20" />
          </div>

          <div className="flex items-center justify-between text-[#292B27]">
            {/* Copyright */}
            <p className="text-[10px] font-sans text-[#5A6966]">
              &copy; {new Date().getFullYear()} Ajay Jadhao. All rights reserved.
            </p>

            {/* Social Icons + Scroll-To-Top Button */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => audioEngine.playHover()}
                className="text-[#1E3A32] hover:text-[#0A66C2] transition-colors"
                title="LinkedIn"
              >
                <Linkedin className="w-3.5 h-3.5" />
              </a>

              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => audioEngine.playHover()}
                className="text-[#1E3A32] hover:text-[#0E1F21] transition-colors"
                title="GitHub"
              >
                <Github className="w-3.5 h-3.5" />
              </a>

              <a
                href={TWITTER_URL}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => audioEngine.playHover()}
                className="text-[#1E3A32] hover:text-[#0E1F21] transition-colors"
                title="Twitter"
              >
                <Twitter className="w-3.5 h-3.5" />
              </a>

              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => audioEngine.playHover()}
                className="text-[#1E3A32] hover:text-[#E1306C] transition-colors"
                title="Instagram"
              >
                <Instagram className="w-3.5 h-3.5" />
              </a>

              {/* Scroll-To-Top Circular Button (From Reference) */}
              <button
                onClick={() => {
                  audioEngine.playClick();
                  if (onScrollToTop) {
                    onScrollToTop();
                  } else {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                onMouseEnter={() => audioEngine.playHover()}
                className="w-6 h-6 rounded-full bg-[#0E1F21] hover:bg-[#1E4E49] text-white flex items-center justify-center transition-all shadow-sm hover:scale-110 cursor-pointer ml-1"
                title="Return to top"
              >
                <ArrowUp className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
