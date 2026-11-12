import React, { useState, useRef, useCallback, Component } from 'react';
import CircuitWorldCanvas from './3d/CircuitWorldCanvas';
import WorldHUDOverlay from './3d/WorldHUDOverlay';
import ProjectDetailModal from './ProjectDetailModal';
import { ArrowLeft, Compass, AlertTriangle, RefreshCw } from 'lucide-react';
import { audioEngine } from '../utils/audioSystem';

/**
 * Robust Error Boundary to catch any WebGL context failure gracefully
 */
class WorldErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('3D World Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#E9DDC7] text-[#292B27]">
          <div className="p-4 rounded-full bg-[#DACAB0] mb-4">
            <AlertTriangle className="w-8 h-8 text-[#B17B53]" />
          </div>
          <h2 className="font-serif text-2xl font-bold mb-2">3D Circuit Engine Paused</h2>
          <p className="font-mono text-xs text-[#626B50] max-w-md mb-6 leading-relaxed">
            WebGL encountered a temporary context reset. You can reload the 3D scene or return to the editorial hero view.
          </p>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => this.setState({ hasError: false })}
              className="flex items-center space-x-2 px-4 py-2 rounded bg-[#292B27] text-[#F4EBDD] font-mono text-xs cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry 3D World</span>
            </button>
            <button
              onClick={this.props.onReturnToHero}
              className="flex items-center space-x-2 px-4 py-2 rounded border border-[#292B27] bg-[#F4EBDD] font-mono text-xs cursor-pointer"
            >
              <span>Return to Hero</span>
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

/**
 * WorldExplorationView encapsulates the 3D WebGL circuit world,
 * interactive rover camera tracking, GSAP camera exit transition, and HUD.
 */
export default function WorldExplorationView({ onReturnToHero }) {
  const [activeWaypoint, setActiveWaypoint] = useState(null);
  const [detailedProject, setDetailedProject] = useState(null);
  const [isExiting, setIsExiting] = useState(false);
  const exitHandlerRef = useRef(null);

  const handleWaypointChange = useCallback((project) => {
    setActiveWaypoint(project);
  }, []);

  const handleSchematicOpen = useCallback((p) => {
    setDetailedProject(p);
  }, []);

  const handleRegisterExitHandler = useCallback((fn) => {
    exitHandlerRef.current = fn;
  }, []);

  const handleReturn = () => {
    if (isExiting) return;
    setIsExiting(true);
    audioEngine.playClick();

    // Trigger smooth GSAP camera ascent before unmounting
    if (exitHandlerRef.current) {
      exitHandlerRef.current(() => {
        onReturnToHero();
      });
    } else {
      onReturnToHero();
    }
  };

  return (
    <div className="relative w-full h-screen bg-[#E9DDC7] text-[#292B27] overflow-hidden select-none">
      
      {/* 3D WebGL Circuit Canvas */}
      <WorldErrorBoundary onReturnToHero={onReturnToHero}>
        <CircuitWorldCanvas
          onWaypointChange={handleWaypointChange}
          onSchematicOpen={handleSchematicOpen}
          currentWaypointId={activeWaypoint?.id}
          onRegisterExitHandler={handleRegisterExitHandler}
        />
      </WorldErrorBoundary>

      {/* Top Left Navigation Back to Hero Section with GSAP Ascent */}
      <div className="absolute top-4 left-4 z-30 flex items-center space-x-3 pointer-events-auto">
        <button
          onClick={handleReturn}
          disabled={isExiting}
          onMouseEnter={() => audioEngine.playHover()}
          className="group flex items-center space-x-2.5 px-4 sm:px-5 py-2.5 min-h-[44px] rounded-full bg-[#0A0D14]/90 backdrop-blur-2xl text-white/90 hover:text-white border border-white/[0.12] hover:border-white/30 shadow-[0_15px_35px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.15)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.25)] transition-all duration-300 active:scale-95 font-mono text-xs font-semibold cursor-pointer disabled:opacity-50"
        >
          <div className="w-5 h-5 rounded-full bg-white/10 group-hover:bg-white/20 flex items-center justify-center transition-colors">
            <ArrowLeft className="w-3 h-3 text-[#B17B53] group-hover:text-amber-300 transition-all group-hover:-translate-x-0.5" />
          </div>
          <span className="hidden min-[440px]:inline tracking-wider uppercase text-[11px]">
            {isExiting ? 'Ascending...' : 'OVERVIEW // EXIT PROVING GROUND'}
          </span>
          <span className="min-[440px]:hidden tracking-wider uppercase text-[11px]">
            {isExiting ? 'Ascending...' : 'OVERVIEW'}
          </span>
        </button>

        <div className="hidden xl:flex items-center space-x-2 text-[10px] font-mono tracking-widest text-white/70 bg-[#0A0D14]/70 backdrop-blur-xl px-3 py-2 rounded-full border border-white/[0.08] shadow-lg">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>PROVING GROUND // TELEMETRY LINKED</span>
        </div>
      </div>

      {/* Waypoint Arrival HUD Card */}
      {activeWaypoint && !isExiting && (
        <WorldHUDOverlay
          waypoint={activeWaypoint}
          onClose={() => setActiveWaypoint(null)}
          onOpenBlueprint={(p) => setDetailedProject(p)}
        />
      )}

      {/* Full Detailed Schematic Modal */}
      {detailedProject && (
        <ProjectDetailModal
          project={detailedProject}
          onClose={() => setDetailedProject(null)}
        />
      )}
    </div>
  );
}
