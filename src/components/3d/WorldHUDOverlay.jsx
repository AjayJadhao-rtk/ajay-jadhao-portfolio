import React from 'react';
import { Cpu, Activity, ArrowRight, X, ExternalLink, Radio } from 'lucide-react';
import { audioEngine } from '../../utils/audioSystem';

/**
 * WorldHUDOverlay renders a luxury vintage-engineering HUD card
 * that appears whenever the autonomous rover arrives at a lab waypoint station.
 */
export default function WorldHUDOverlay({ waypoint, onClose, onOpenBlueprint }) {
  if (!waypoint) return null;

  return (
    <aside 
      aria-label="Waypoint Station Telemetry"
      className="absolute top-16 sm:top-20 right-3 sm:right-8 left-3 sm:left-auto z-30 w-auto sm:w-full max-w-[350px] sm:max-w-md mx-auto sm:mx-0 animate-fadeIn select-none pointer-events-auto max-h-[80vh] overflow-y-auto"
    >
      <div
        className="relative bg-[#F4EBDD]/95 backdrop-blur-md border-2 border-[#292B27] rounded-lg shadow-2xl p-4 sm:p-5 text-[#292B27] flex flex-col space-y-3.5"
        style={{
          boxShadow: '0 20px 40px rgba(41, 43, 39, 0.35), inset 0 0 30px rgba(233, 221, 199, 0.4)',
        }}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between pb-2.5 border-b border-[#292B27]/15">
          <div className="flex items-center space-x-2">
            <span
              className="w-2.5 h-2.5 rounded-full animate-ping"
              style={{ backgroundColor: waypoint.color || '#B17B53' }}
            />
            <span className="font-mono text-[10px] font-bold tracking-widest text-[#89634C] uppercase">
              {waypoint.stationName || `STATION ${waypoint.number}`}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="font-mono text-[9px] text-[#626B50]">
              {waypoint.beaconFrequency || '2.4 GHz'}
            </span>
            <button
              onClick={() => {
                audioEngine.playClick();
                onClose();
              }}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded hover:bg-[#292B27] hover:text-[#F4EBDD] transition-colors cursor-pointer"
              aria-label="Dismiss HUD"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Project Title & Category */}
        <div className="space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#B17B53] font-bold">
            {waypoint.category}
          </span>
          <h3 className="font-serif text-2xl font-bold tracking-tight text-[#292B27]">
            {waypoint.title}
          </h3>
          <p className="font-mono text-xs text-[#89634C] font-medium">
            {waypoint.tagline}
          </p>
        </div>

        {/* Project Thumbnail Image with Technical HUD Mask */}
        <div className="relative h-32 w-full rounded overflow-hidden border border-[#292B27]/30 shadow-xs">
          <img
            src={waypoint.image}
            alt={waypoint.title}
            className="w-full h-full object-cover contrast-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
          <div className="absolute bottom-2 left-2 flex items-center space-x-1.5 text-[9px] font-mono text-emerald-400 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>{waypoint.telemetryStatus || 'ONLINE'}</span>
          </div>
        </div>

        {/* Quick Hardware Specs Matrix */}
        <div className="grid grid-cols-2 gap-2 text-[10.5px] font-mono">
          {waypoint.specs.slice(0, 4).map((item, i) => (
            <div
              key={i}
              className="p-2 rounded bg-[#E9DDC7]/60 border border-[#292B27]/10 flex flex-col"
            >
              <span className="text-[9px] text-[#89634C] uppercase tracking-wider">
                {item.label}
              </span>
              <span className="font-bold text-[#292B27] mt-0.5 truncate">{item.val || item.value}</span>
            </div>
          ))}
        </div>

        {/* Action Trigger: Launch Blueprint Modal (min 44px+ tap target) */}
        <button
          onClick={() => {
            audioEngine.playModalOpen();
            onOpenBlueprint(waypoint);
          }}
          className="group w-full flex items-center justify-center space-x-2 py-3 min-h-[48px] rounded bg-[#292B27] text-[#F4EBDD] hover:bg-[#1E201D] transition-all shadow-md active:translate-y-0.5 font-mono text-xs font-semibold uppercase tracking-wider cursor-pointer"
        >
          <span>Examine Lab Schematic</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#B17B53] transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </aside>
  );
}
