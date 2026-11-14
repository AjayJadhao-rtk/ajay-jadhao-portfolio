import React from 'react';
import { ArrowRight, X } from 'lucide-react';
import { audioEngine } from '../../utils/audioSystem';

/**
 * WorldHUDOverlay renders the authentic luxury vintage-engineering HUD card
 * that appears whenever the autonomous rover arrives at a lab waypoint station.
 * 
 * - 100% Solid Opaque Parchment (#F4EBDD) with solid 2px charcoal border - ZERO transparency
 * - Compact small footprint (max-w-[275px] on mobile, max-h-[60vh]) floating on the right
 * - Keeps the 3D circuit world, rover, and landscape fully visible
 */
export default function WorldHUDOverlay({ waypoint, onClose, onOpenBlueprint }) {
  if (!waypoint) return null;

  return (
    <aside 
      aria-label="Waypoint Station Telemetry"
      className="absolute top-16 sm:top-20 right-2.5 sm:right-6 left-auto z-30 w-[84vw] max-w-[275px] sm:max-w-[320px] animate-fadeIn select-none pointer-events-auto max-h-[60vh] overflow-y-auto"
    >
      <div
        className="relative bg-[#F4EBDD] border-2 border-[#292B27] rounded-lg shadow-2xl p-3 sm:p-4 text-[#292B27] flex flex-col space-y-2 sm:space-y-2.5"
        style={{
          boxShadow: '0 16px 36px rgba(41, 43, 39, 0.35), inset 0 0 30px rgba(233, 221, 199, 0.4)',
        }}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between pb-1.5 border-b border-[#292B27]/15">
          <div className="flex items-center space-x-1.5">
            <span
              className="w-2 h-2 rounded-full animate-ping"
              style={{ backgroundColor: waypoint.color || '#B17B53' }}
            />
            <span className="font-mono text-[9px] sm:text-[10px] font-bold tracking-widest text-[#89634C] uppercase">
              {waypoint.stationName || `STATION ${waypoint.number}`}
            </span>
          </div>

          <div className="flex items-center space-x-1.5">
            <span className="font-mono text-[8px] sm:text-[9px] text-[#626B50]">
              {waypoint.beaconFrequency || '2.4 GHz'}
            </span>
            <button
              onClick={() => {
                audioEngine.playClick();
                onClose();
              }}
              className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded hover:bg-[#292B27] hover:text-[#F4EBDD] transition-colors cursor-pointer text-[#292B27]"
              aria-label="Dismiss HUD"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Project Title & Category */}
        <div className="space-y-0.5">
          <span className="text-[9px] font-mono uppercase tracking-widest text-[#B17B53] font-bold">
            {waypoint.category}
          </span>
          <h3 className="font-serif text-lg sm:text-xl font-bold tracking-tight text-[#292B27] leading-tight truncate">
            {waypoint.title}
          </h3>
          <p className="font-mono text-[10px] sm:text-[11px] text-[#89634C] font-medium truncate">
            {waypoint.tagline}
          </p>
        </div>

        {/* Project Thumbnail Image with Technical HUD Mask (Solid, Compact) */}
        <div className="relative h-22 sm:h-28 w-full rounded overflow-hidden border border-[#292B27]/40 shadow-xs bg-[#292B27]">
          <img
            src={waypoint.image}
            alt={waypoint.title}
            className="w-full h-full object-cover contrast-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-1.5 left-2 flex items-center space-x-1 text-[8px] sm:text-[9px] font-mono text-emerald-400 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>{waypoint.telemetryStatus || 'ONLINE'}</span>
          </div>
        </div>

        {/* Quick Hardware Specs Matrix (Solid 100% Opaque Boxes) */}
        <div className="grid grid-cols-2 gap-1.5 text-[9.5px] font-mono">
          {waypoint.specs.slice(0, 4).map((item, i) => (
            <div
              key={i}
              className="p-1.5 sm:p-2 rounded bg-[#E9DDC7] border border-[#292B27]/15 flex flex-col"
            >
              <span className="text-[8px] text-[#89634C] uppercase tracking-wider truncate">
                {item.label}
              </span>
              <span className="font-bold text-[#292B27] mt-0.5 truncate text-[9px] sm:text-[10px]">
                {item.val || item.value}
              </span>
            </div>
          ))}
        </div>

        {/* Action Trigger: Launch Blueprint Modal (Solid Charcoal Button) */}
        <button
          onClick={() => {
            audioEngine.playModalOpen();
            onOpenBlueprint(waypoint);
          }}
          className="group w-full flex items-center justify-center space-x-1.5 py-2 sm:py-2.5 px-3 rounded bg-[#292B27] text-[#F4EBDD] hover:bg-[#1E201D] transition-all shadow-md active:translate-y-0.5 font-mono text-[10px] sm:text-xs font-semibold uppercase tracking-wider cursor-pointer"
        >
          <span>Examine Lab Schematic</span>
          <ArrowRight className="w-3 h-3 text-[#B17B53] transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </aside>
  );
}
