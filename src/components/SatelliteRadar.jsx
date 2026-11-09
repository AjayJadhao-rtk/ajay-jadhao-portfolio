import React from 'react';
import { audioEngine } from '../utils/audioSystem';

/**
 * SatelliteRadar renders the bottom-left telecommunication station
 * with a vintage parabolic dish antenna overlooking cityscape skyline
 * and animated concentric radio wave pulses transmitting signals.
 */
export default function SatelliteRadar() {
  return (
    <div
      className="relative w-full max-w-[280px] sm:max-w-[340px] mt-4 pt-2 select-none group cursor-pointer"
      onMouseEnter={() => audioEngine.playRadarPing()}
      onClick={() => audioEngine.playRadarPing()}
      title="Click to pulse radar transmission"
    >
      {/* Cityscape Skyline & Antenna Container */}
      <div className="relative overflow-hidden rounded-lg border border-[#292B27]/15 bg-[#E9DDC7]/60 shadow-sm backdrop-blur-[1px]">
        {/* Sky/building background preview */}
        <div className="relative h-28 sm:h-32 w-full overflow-hidden bg-gradient-to-t from-[#DACAB0] via-[#E9DDC7] to-transparent">
          <img
            src="/assets/crops/satellite-dish.jpg"
            alt="Telecommunication Satellite Ground Station"
            className="w-full h-full object-cover object-center grayscale contrast-125 opacity-70 group-hover:scale-105 transition-transform duration-700 mix-blend-multiply"
          />

          {/* Animated Radio Frequency Pulse Rings radiating from feedhorn */}
          <div className="absolute top-[38%] left-[42%] -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            {/* Core feedhorn transmitter dot */}
            <div className="w-2.5 h-2.5 rounded-full bg-[#B17B53] shadow-[0_0_8px_#B17B53] animate-pulse" />

            {/* Pulse Ring 1 */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#B17B53]/70 animate-radar-ping"
              style={{ width: '36px', height: '36px', animationDelay: '0s' }}
            />
            {/* Pulse Ring 2 */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#626B50]/60 animate-radar-ping"
              style={{ width: '64px', height: '64px', animationDelay: '1s' }}
            />
            {/* Pulse Ring 3 */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#89634C]/50 animate-radar-ping"
              style={{ width: '92px', height: '92px', animationDelay: '2s' }}
            />
          </div>

          {/* Overlay Grid lines for blueprint feel */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#292B2708_1px,transparent_1px),linear-gradient(to_bottom,#292B2708_1px,transparent_1px)] bg-[size:12px_12px] pointer-events-none" />
        </div>

        {/* Telemetry Status Bar */}
        <div className="px-3 py-1.5 bg-[#F4EBDD]/90 border-t border-[#292B27]/15 flex items-center justify-between text-[9px] font-mono text-[#292B27]">
          <div className="flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 animate-ping" />
            <span className="font-semibold tracking-wider text-[#26352D]">STATION 04 // ACTIVE</span>
          </div>
          <div className="flex items-center space-x-2 text-[#89634C]">
            <span>1420.4 MHz</span>
            <span>AZ: 242°</span>
          </div>
        </div>
      </div>
    </div>
  );
}
