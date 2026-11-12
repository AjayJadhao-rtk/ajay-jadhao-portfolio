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
      className="absolute top-18 sm:top-20 right-2 sm:right-8 left-2 sm:left-auto z-30 w-auto sm:w-full max-w-sm sm:max-w-md animate-fadeIn select-none pointer-events-auto max-h-[82vh] overflow-y-auto"
    >
      <div
        className="relative bg-[#0A0D14]/92 backdrop-blur-2xl border border-white/[0.15] rounded-2xl shadow-[0_30px_80px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.2)] p-4 sm:p-5 text-white flex flex-col space-y-4"
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.1]">
          <div className="flex items-center space-x-2.5">
            <span
              className="w-2.5 h-2.5 rounded-full animate-ping"
              style={{ backgroundColor: waypoint.color || '#B17B53', boxShadow: `0 0 10px ${waypoint.color || '#B17B53'}` }}
            />
            <span className="font-mono text-[10px] font-bold tracking-[0.18em] text-white/90 uppercase">
              {waypoint.stationName || `STATION ${waypoint.number}`}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="font-mono text-[9px] text-white/50 tracking-wider">
              {waypoint.beaconFrequency || '2.4 GHz'}
            </span>
            <button
              onClick={() => {
                audioEngine.playClick();
                onClose();
              }}
              onMouseEnter={() => audioEngine.playHover()}
              className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-full bg-white/[0.06] hover:bg-white/[0.15] text-white/70 hover:text-white transition-all cursor-pointer"
              aria-label="Dismiss HUD"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Project Title & Category */}
        <div className="space-y-1">
          <span className="text-[9.5px] font-mono uppercase tracking-[0.2em] text-[#B17B53] font-bold">
            {waypoint.category}
          </span>
          <h3 className="font-serif text-2xl font-bold tracking-tight text-white">
            {waypoint.title}
          </h3>
          <p className="font-mono text-xs text-white/70 font-medium">
            {waypoint.tagline}
          </p>
        </div>

        {/* Project Thumbnail Image with Technical HUD Mask */}
        <div className="relative h-36 w-full rounded-xl overflow-hidden border border-white/[0.12] shadow-md bg-black/60">
          <img
            src={waypoint.image}
            alt={waypoint.title}
            className="w-full h-full object-cover contrast-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
          <div className="absolute bottom-2.5 left-2.5 flex items-center space-x-2 text-[9px] font-mono text-emerald-400 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>{waypoint.telemetryStatus || 'ONLINE'}</span>
          </div>
        </div>

        {/* Quick Hardware Specs Matrix */}
        <div className="grid grid-cols-2 gap-2 text-[10.5px] font-mono">
          {waypoint.specs.slice(0, 4).map((item, i) => (
            <div
              key={i}
              className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] flex flex-col"
            >
              <span className="text-[8.5px] text-white/50 uppercase tracking-widest font-mono">
                {item.label}
              </span>
              <span className="font-bold text-white mt-0.5 truncate">{item.val || item.value}</span>
            </div>
          ))}
        </div>

        {/* Action Trigger: Launch Blueprint Modal (min 48px tap target) */}
        <button
          onClick={() => {
            audioEngine.playModalOpen();
            onOpenBlueprint(waypoint);
          }}
          onMouseEnter={() => audioEngine.playHover()}
          className="group w-full flex items-center justify-center space-x-2.5 py-3.5 min-h-[48px] rounded-xl bg-gradient-to-r from-[#B17B53] via-amber-600 to-[#89634C] hover:from-amber-600 hover:to-amber-500 text-white font-mono text-xs font-bold uppercase tracking-[0.16em] shadow-[0_10px_25px_rgba(177,123,83,0.35)] hover:shadow-[0_15px_35px_rgba(245,158,11,0.5)] active:scale-[0.98] transition-all cursor-pointer"
        >
          <span>EXAMINE LAB SCHEMATIC</span>
          <ArrowRight className="w-3.5 h-3.5 text-white transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </aside>
  );
}
