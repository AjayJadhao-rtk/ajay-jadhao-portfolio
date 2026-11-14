import React, { useEffect } from 'react';
import { X, Cpu, Layers, Activity, Radio, CheckCircle, ExternalLink } from 'lucide-react';
import { audioEngine } from '../utils/audioSystem';

/**
 * ProjectDetailModal presents a luxury vintage engineering schematic sheet
 * with acoustic blueprint unfolding chime and compact, responsive layout.
 */
export default function ProjectDetailModal({ project, onClose }) {
  useEffect(() => {
    if (project) {
      audioEngine.playModalOpen();
    }
  }, [project]);

  if (!project) return null;

  const handleClose = () => {
    audioEngine.playModalClose();
    onClose();
  };

  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#292B27]/75 backdrop-blur-sm animate-fadeIn"
    >
      {/* Blueprint Container */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-[#FAF6EE] border-2 border-[#292B27] rounded-xl shadow-2xl overflow-hidden text-[#292B27] flex flex-col max-h-[78vh] sm:max-h-[85vh]"
        style={{
          boxShadow: '0 20px 50px rgba(41, 43, 39, 0.4), inset 0 0 100px rgba(233, 221, 199, 0.4)',
        }}
      >
        {/* Top Blueprint Header Bar */}
        <div className="px-4 py-2.5 bg-[#E9DDC7] border-b border-[#292B27]/30 flex items-center justify-between select-none">
          <div className="flex items-center space-x-2">
            <span className="font-mono text-[10px] sm:text-xs font-bold text-[#89634C] bg-[#DACAB0] px-2 py-0.5 rounded">
              PROJECT {project.number}
            </span>
            <span className="text-[10px] sm:text-xs font-mono text-[#626B50] font-semibold">
              // SCHEMATIC_DOC.v1.4
            </span>
          </div>

          <div className="flex items-center space-x-2.5">
            <div className="hidden sm:flex items-center space-x-1.5 text-[9px] font-mono text-[#26352D]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
              <span>{project.status}</span>
            </div>
            <button
              onClick={handleClose}
              onMouseEnter={() => audioEngine.playHover()}
              className="p-1 rounded-md hover:bg-[#292B27] hover:text-[#F4EBDD] transition-colors cursor-pointer text-[#292B27]"
              aria-label="Close Modal"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-3.5 sm:p-5 overflow-y-auto space-y-3.5">
          {/* Hero Banner with Image & Quick Identity */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 items-center pb-3 border-b border-[#292B27]/15">
            <div className="sm:col-span-5 relative h-28 sm:h-36 rounded-lg overflow-hidden border border-[#292B27]/40 shadow-xs">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover contrast-110"
              />
              <div className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-[#292B27]/90 text-[#F4EBDD] font-mono text-[8px]">
                {project.coords}
              </div>
            </div>

            <div className="sm:col-span-7 space-y-1">
              <span className="text-[9px] font-mono uppercase tracking-widest text-[#B17B53] font-bold">
                {project.category}
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#292B27] leading-tight">
                {project.title}
              </h3>
              <p className="text-[11px] font-mono text-[#89634C] font-medium">
                {project.tagline}
              </p>
              <p className="text-[11px] text-[#292B27]/85 font-mono leading-relaxed pt-0.5 line-clamp-3">
                {project.description}
              </p>
            </div>
          </div>

          {/* Technical Specifications Matrix */}
          <div>
            <h4 className="font-mono text-[11px] font-bold tracking-wider text-[#26352D] uppercase flex items-center space-x-1.5 mb-2">
              <Cpu className="w-3 h-3 text-[#B17B53]" />
              <span>Hardware Architecture & Specifications</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[10.5px] font-mono">
              {project.specs.map((item, i) => (
                <div
                  key={i}
                  onMouseEnter={() => audioEngine.playHover()}
                  className="p-2 rounded bg-[#E9DDC7] border border-[#292B27]/15 flex flex-col transition-colors hover:border-[#B17B53]/50"
                >
                  <span className="text-[8.5px] text-[#89634C] uppercase tracking-wider">
                    {item.label}
                  </span>
                  <span className="font-semibold text-[#292B27] mt-0.5 text-[10px] sm:text-[11px]">{item.val || item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Key Engineering Features */}
          <div>
            <h4 className="font-mono text-[11px] font-bold tracking-wider text-[#26352D] uppercase flex items-center space-x-1.5 mb-1.5">
              <Layers className="w-3 h-3 text-[#626B50]" />
              <span>Engineering Deliverables & Subsystems</span>
            </h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {project.features.map((feat, idx) => (
                <li
                  key={idx}
                  className="flex items-start space-x-1.5 text-[10.5px] font-mono text-[#292B27]/90"
                >
                  <CheckCircle className="w-3 h-3 text-[#626B50] shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-2.5 bg-[#E9DDC7] border-t border-[#292B27]/20 flex items-center justify-between text-[10px] font-mono select-none">
          <span className="text-[#626B50]">
            DEPT OF E&TC // HARDWARE LAB ARCHIVE
          </span>
          <button
            onClick={handleClose}
            className="px-2.5 py-1 rounded bg-[#292B27] text-[#F4EBDD] hover:bg-[#1E201D] text-[9.5px] font-mono uppercase tracking-wider cursor-pointer"
          >
            Close Blueprint
          </button>
        </div>
      </div>
    </div>
  );
}
