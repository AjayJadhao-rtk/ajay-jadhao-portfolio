import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Activity, Cpu } from 'lucide-react';
import { PROJECTS_DATA } from '../data/projectsData';
import { audioEngine } from '../utils/audioSystem';

/**
 * ProjectPreviewGrid creates the staggered, diagonal cut-out panels
 * with high-contrast vintage parchment typography matching the reference image.
 */
export default function ProjectPreviewGrid({ onSelectProject }) {
  const [hoveredId, setHoveredId] = useState(null);

  // Waveform canvas animation for oscilloscope shard
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let offset = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = '#4ade80';
      ctx.lineWidth = 1.8;
      ctx.shadowColor = '#22c55e';
      ctx.shadowBlur = 6;
      ctx.beginPath();

      const width = canvas.width;
      const height = canvas.height;
      const mid = height / 2;

      for (let x = 0; x < width; x++) {
        const t = (x + offset) * 0.04;
        let y = Math.sin(t) * 12 + Math.cos(t * 2.3) * 6;
        if ((x + offset * 2) % 180 > 140 && (x + offset * 2) % 180 < 170) {
          y += Math.sin((x % 30) * 0.2) * 28;
        }
        if (x === 0) ctx.moveTo(x, mid + y);
        else ctx.lineTo(x, mid + y);
      }
      ctx.stroke();

      offset += 1.5;
      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const handleCardClick = (project) => {
    audioEngine.playClick();
    onSelectProject(project);
  };

  const handleCardHover = (id) => {
    audioEngine.playHover();
    setHoveredId(id);
  };

  return (
    <div className="relative w-full h-full min-h-[520px] sm:min-h-[580px] p-2 sm:p-4 select-none flex flex-col justify-between overflow-hidden touch-manipulation">
      {/* Background blueprint diagonal lines */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
          <line x1="20" y1="0" x2="80" y2="100" stroke="#292B27" strokeWidth="0.5" />
          <line x1="50" y1="0" x2="100" y2="70" stroke="#89634C" strokeWidth="0.5" />
        </svg>
      </div>

      {/* TOP ROW: Panel 1 (NEX-SHIELD) & Oscilloscope Shard */}
      <div className="relative flex items-start justify-end gap-3 z-20">
        {/* Panel 1: NEX-SHIELD Wearable */}
        <div
          onClick={() => handleCardClick(PROJECTS_DATA[0])}
          onMouseEnter={() => handleCardHover('nex-shield')}
          onMouseLeave={() => setHoveredId(null)}
          className="relative group cursor-pointer w-44 sm:w-52 h-36 sm:h-44 transition-all duration-300 active:scale-98"
          style={{
            clipPath: 'polygon(15% 0%, 100% 0%, 85% 100%, 0% 100%)',
          }}
        >
          <div className="relative w-full h-full overflow-hidden bg-[#292B27] border border-[#292B27]/40 shadow-md group-hover:shadow-xl transition-all duration-300">
            <img
              src="/assets/crops/nex-shield.jpg"
              alt="NEX-SHIELD Women Safety Wearable"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 contrast-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

            <div className="absolute top-2 right-6 px-1.5 py-0.5 rounded bg-red-600/90 text-white font-mono text-[9px] font-bold tracking-widest shadow-[0_0_8px_#ef4444] animate-pulse">
              SOS
            </div>

            <div className="absolute inset-0 bg-[#B17B53]/15 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          {/* Parchment Project Tag with Refined Typography */}
          <div className="absolute -bottom-1 left-2 sm:left-4 z-30 pointer-events-none">
            <div className="px-3 py-1.5 rounded bg-[#F4EBDD] border border-[#292B27] shadow-sm group-hover:border-[#B17B53] group-hover:bg-[#E9DDC7] transition-all flex flex-col">
              <span className="font-mono font-bold text-[11px] text-[#292B27] tracking-wider uppercase leading-tight">
                NEX-SHIELD
              </span>
              <div className="flex items-center space-x-1.5 text-[9px] font-mono text-[#89634C] group-hover:text-[#292B27] font-medium mt-0.5">
                <span>Women Safety Wearable</span>
                <span className="text-[#B17B53] font-bold transition-transform group-hover:translate-x-1">→</span>
              </div>
            </div>
          </div>
        </div>

        {/* Shard: Oscilloscope Telemetry Monitor */}
        <div
          onMouseEnter={() => audioEngine.playRadarPing()}
          className="relative hidden sm:block w-32 h-24 overflow-hidden rounded bg-[#1C2822] border border-[#292B27]/50 shadow-inner cursor-pointer"
          style={{
            clipPath: 'polygon(0% 0%, 100% 0%, 90% 100%, 10% 100%)',
          }}
          title="Telemetry Oscilloscope Stream"
        >
          <div className="absolute top-1 left-2 z-10 flex items-center space-x-1">
            <Activity className="w-2.5 h-2.5 text-emerald-400 animate-pulse" />
            <span className="text-[7.5px] font-mono text-emerald-400/90 font-semibold tracking-wider">
              RF_TELEMETRY
            </span>
          </div>
          <canvas ref={canvasRef} width="130" height="90" className="w-full h-full opacity-90" />
          <div className="absolute bottom-1 right-2 text-[7px] font-mono text-emerald-400/60 font-semibold">
            CH1: 50mV/div
          </div>
        </div>
      </div>

      {/* MIDDLE ROW: Panel 2 (Line Robot) & Panel 3 (Saline Monitor) */}
      <div className="relative flex items-center justify-between gap-3 z-20 my-2">
        {/* Panel 3: Saline Monitoring System */}
        <div
          onClick={() => handleCardClick(PROJECTS_DATA[2])}
          onMouseEnter={() => handleCardHover('saline-monitor')}
          onMouseLeave={() => setHoveredId(null)}
          className="relative group cursor-pointer w-44 sm:w-52 h-40 sm:h-48 transition-all duration-300 active:scale-98"
          style={{
            clipPath: 'polygon(10% 0%, 100% 10%, 90% 100%, 0% 90%)',
          }}
        >
          <div className="relative w-full h-full overflow-hidden bg-[#292B27] border border-[#292B27]/40 shadow-md group-hover:shadow-xl transition-all duration-300">
            <img
              src="/assets/crops/saline-monitor.jpg"
              alt="Saline Monitoring System"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 contrast-115"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

            <div className="absolute top-2 left-4 px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/50 text-emerald-400 font-mono text-[8px] flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>IV FLOW: NORMAL</span>
            </div>
          </div>

          <div className="absolute -bottom-2 right-2 sm:right-4 z-30 pointer-events-none">
            <div className="px-3 py-1.5 rounded bg-[#F4EBDD] border border-[#292B27] shadow-sm group-hover:border-[#B17B53] group-hover:bg-[#E9DDC7] transition-all flex flex-col">
              <span className="font-mono font-bold text-[11px] text-[#292B27] tracking-wider uppercase leading-tight">
                Saline Monitoring
              </span>
              <div className="flex items-center space-x-1.5 text-[9px] font-mono text-[#89634C] group-hover:text-[#292B27] font-medium mt-0.5">
                <span>System</span>
                <span className="text-[#B17B53] font-bold transition-transform group-hover:translate-x-1">→</span>
              </div>
            </div>
          </div>
        </div>

        {/* Panel 2: Line Following Robot */}
        <div
          onClick={() => handleCardClick(PROJECTS_DATA[1])}
          onMouseEnter={() => handleCardHover('line-robot')}
          onMouseLeave={() => setHoveredId(null)}
          className="relative group cursor-pointer w-48 sm:w-56 h-36 sm:h-44 transition-all duration-300 active:scale-98"
          style={{
            clipPath: 'polygon(0% 0%, 90% 0%, 100% 100%, 10% 100%)',
          }}
        >
          <div className="relative w-full h-full overflow-hidden bg-[#292B27] border border-[#292B27]/40 shadow-md group-hover:shadow-xl transition-all duration-300">
            <img
              src="/assets/crops/line-robot.jpg"
              alt="Line Following Robot"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 contrast-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

            <div className="absolute top-2 right-4 px-1.5 py-0.5 rounded bg-[#292B27]/90 text-[#E9DDC7] font-mono text-[8px] border border-[#B17B53]/40">
              PID 200Hz
            </div>
          </div>

          <div className="absolute -bottom-1 left-2 sm:left-4 z-30 pointer-events-none">
            <div className="px-3 py-1.5 rounded bg-[#F4EBDD] border border-[#292B27] shadow-sm group-hover:border-[#B17B53] group-hover:bg-[#E9DDC7] transition-all flex flex-col">
              <span className="font-mono font-bold text-[11px] text-[#292B27] tracking-wider uppercase leading-tight">
                Line Following Robot
              </span>
              <div className="flex items-center space-x-1.5 text-[9px] font-mono text-[#89634C] group-hover:text-[#292B27] font-medium mt-0.5">
                <span>Autonomous Rover</span>
                <span className="text-[#B17B53] font-bold transition-transform group-hover:translate-x-1">→</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM ROW: Panel 4 (Gesture Car) & Panel 5 (Balancing Robot) */}
      <div className="relative flex items-end justify-between gap-3 z-20">
        {/* Panel 4: Gesture Control Car */}
        <div
          onClick={() => handleCardClick(PROJECTS_DATA[3])}
          onMouseEnter={() => handleCardHover('gesture-car')}
          onMouseLeave={() => setHoveredId(null)}
          className="relative group cursor-pointer w-48 sm:w-60 h-36 sm:h-44 transition-all duration-300 active:scale-98"
          style={{
            clipPath: 'polygon(12% 0%, 100% 0%, 88% 100%, 0% 100%)',
          }}
        >
          <div className="relative w-full h-full overflow-hidden bg-[#292B27] border border-[#292B27]/40 shadow-md group-hover:shadow-xl transition-all duration-300">
            <img
              src="/assets/crops/gesture-car.jpg"
              alt="Gesture Control Car with Wearable Sensor Glove"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 contrast-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

            <div className="absolute top-2 right-4 flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              <span className="text-[8px] font-mono text-amber-300 font-bold">2.4GHz RF</span>
            </div>
          </div>

          <div className="absolute -bottom-1 left-3 sm:left-6 z-30 pointer-events-none">
            <div className="px-3 py-1.5 rounded bg-[#F4EBDD] border border-[#292B27] shadow-sm group-hover:border-[#B17B53] group-hover:bg-[#E9DDC7] transition-all flex flex-col">
              <span className="font-mono font-bold text-[11px] text-[#292B27] tracking-wider uppercase leading-tight">
                Gesture Control Car
              </span>
              <div className="flex items-center space-x-1.5 text-[9px] font-mono text-[#89634C] group-hover:text-[#292B27] font-medium mt-0.5">
                <span>Tactile Glove Link</span>
                <span className="text-[#B17B53] font-bold transition-transform group-hover:translate-x-1">→</span>
              </div>
            </div>
          </div>
        </div>

        {/* Panel 5: Self-Balancing Robot */}
        <div
          onClick={() => handleCardClick(PROJECTS_DATA[4])}
          onMouseEnter={() => handleCardHover('balancing-robot')}
          onMouseLeave={() => setHoveredId(null)}
          className="relative group cursor-pointer w-44 sm:w-52 h-44 sm:h-52 transition-all duration-300 active:scale-98"
          style={{
            clipPath: 'polygon(0% 0%, 85% 0%, 100% 100%, 15% 100%)',
          }}
        >
          <div className="relative w-full h-full overflow-hidden bg-[#292B27] border border-[#292B27]/40 shadow-md group-hover:shadow-xl transition-all duration-300">
            <img
              src="/assets/crops/balancing-robot.jpg"
              alt="Two-Wheel Balancing Robot"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 contrast-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30" />

            <div className="absolute top-2 right-4 px-1.5 py-0.5 rounded bg-emerald-900/80 border border-emerald-500/30 text-emerald-300 font-mono text-[8px] font-bold">
              TILT: 0.0°
            </div>
          </div>

          <div className="absolute -bottom-2 right-2 sm:right-4 z-30 pointer-events-none">
            <div className="px-3 py-1.5 rounded bg-[#F4EBDD] border border-[#292B27] shadow-sm group-hover:border-[#B17B53] group-hover:bg-[#E9DDC7] transition-all flex flex-col">
              <span className="font-mono font-bold text-[11px] text-[#292B27] tracking-wider uppercase leading-tight">
                Balancing Robot
              </span>
              <div className="flex items-center space-x-1.5 text-[9px] font-mono text-[#89634C] group-hover:text-[#292B27] font-medium mt-0.5">
                <span>Inverted Pendulum</span>
                <span className="text-[#B17B53] font-bold transition-transform group-hover:translate-x-1">→</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
