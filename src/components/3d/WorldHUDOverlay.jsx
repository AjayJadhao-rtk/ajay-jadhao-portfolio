import React from 'react';
import { Cpu, Activity, ArrowRight, X, ExternalLink, Radio } from 'lucide-react';
import { audioEngine } from '../../utils/audioSystem';

/**
 * WorldHUDOverlay renders a compact, luxury vintage-engineering HUD card
 * that appears when arriving at a lab waypoint station.
 * Calibrated to be small and elegant so the 3D circuit world remains fully visible.
 */
export default function WorldHUDOverlay({ waypoint, onClose, onOpenBlueprint }) {
  if (!waypoint) return null;

  return (
    <aside 
      aria-label="Waypoint Station Telemetry"
      className="absolute top-14 sm:top-18 right-2.5 sm:right-6 left-auto z-30 w-[82vw] max-w-[260px] sm:max-w-[310px] animate-fadeIn select-none pointer-events-auto max-h-[52vh] sm:max-h-[62vh] overflow-y-auto"
    >
      <div
        className="relative bg-[#FAF6EE]/94 backdrop-blur-md border border-[#292B27]/40 rounded-xl shadow-xl p-3 sm:p-3.5 text-[#292B27] flex flex-col space-y-2 sm:space-y-2.5"
        style={{
          boxShadow: '0 12px 30px rgba(41, 43, 39, 0.28), inset 0 0 20px rgba(233, 221, 199, 0.3)',
        }}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between pb-1.5 border-b border-[#292B27]/15">
          <div className="flex items-center space-x-1.5">
            <span
              className="w-2 h-2 rounded-full animate-ping"
              style={{ backgroundColor: waypoint.color || '#B17B53' }}
            />
            <span className="font-mono text-[9px] font-bold tracking-widest text-[#89634C] uppercase">
              {waypoint.stationName || `NODE 0${waypoint.number}`}
            </span>
          </div>

          <div className="flex items-center space-x-1.5">
            <span className="font-mono text-[8px] text-[#626B50]">
              {waypoint.beaconFrequency || '2.4 GHz'}
            </span>
            <button
              onClick={() => {
                audioEngine.playClick();
                onClose();
              }}
              className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-[#292B27] hover:text-[#F4EBDD] transition-colors cursor-pointer text-[#292B27]/70 hover:text-[#F4EBDD]"
              aria-label="Dismiss HUD"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Project Title & Category */}
        <div className="space-y-0.5">
          <span className="text-[8.5px] font-mono uppercase tracking-widest text-[#B17B53] font-bold">
            {waypoint.category}
          </span>
          <h3 className="font-serif text-base sm:text-lg font-bold tracking-tight text-[#292B27] leading-tight truncate">
            {waypoint.title}
          </h3>
          <p className="font-mono text-[9.5px] text-[#89634C] font-medium truncate">
            {waypoint.tagline}
          </p>
        </div>

        {/* Project Thumbnail Image with Technical HUD Mask (Compact Height) */}
        <div className="relative h-20 sm:h-24 w-full rounded-md overflow-hidden border border-[#292B27]/25 shadow-xs">
          <img
            src={waypoint.image}
            alt={waypoint.title}
            className="w-full h-full object-cover contrast-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <div className="absolute bottom-1.5 left-2 flex items-center space-x-1 text-[8px] font-mono text-emerald-400 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>{waypoint.telemetryStatus || 'ONLINE'}</span>
          </div>
        </div>

        {/* Quick Hardware Specs Matrix (Compact 2x2 grid) */}
        <div className="grid grid-cols-2 gap-1.5 text-[9px] font-mono">
          {waypoint.specs.slice(0, 4).map((item, i) => (
            <div
              key={i}
              className="p-1.5 rounded bg-[#E9DDC7]/55 border border-[#292B27]/10 flex flex-col"
            >
              <span className="text-[7.5px] text-[#89634C] uppercase tracking-wider truncate">
                {item.label}
              </span>
              <span className="font-bold text-[#292B27] mt-0.5 truncate text-[8.5px] sm:text-[9px]">
                {item.val || item.value}
              </span>
            </div>
          ))}
        </div>

        {/* Action Trigger: Launch Blueprint Modal (Compact button) */}
        <button
          onClick={() => {
            audioEngine.playModalOpen();
            onOpenBlueprint(waypoint);
          }}
          className="group w-full flex items-center justify-center space-x-1.5 py-2 px-2.5 min-h-[36px] rounded-md bg-[#292B27] text-[#F4EBDD] hover:bg-[#1E201D] transition-all shadow-md active:translate-y-0.5 font-mono text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider cursor-pointer"
        >
          <span>Examine Schematic</span>
          <ArrowRight className="w-3 h-3 text-[#B17B53] transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </aside>
  );
}
