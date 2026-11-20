import React, { useState, useRef, useCallback, Component } from 'react';
import CircuitWorldCanvas from './3d/CircuitWorldCanvas';
import ProjectDetailModal from './ProjectDetailModal';
import { ArrowLeft, Compass, AlertTriangle, RefreshCw, FileText, Layers, X } from 'lucide-react';
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
    audioEngine.stopRoverEngine();
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
      
      {/* 3D WebGL Circuit Canvas with Integrated Top Controls Bar */}
      <WorldErrorBoundary onReturnToHero={onReturnToHero}>
        <CircuitWorldCanvas
          onWaypointChange={handleWaypointChange}
          onSchematicOpen={handleSchematicOpen}
          currentWaypointId={activeWaypoint?.id}
          onRegisterExitHandler={handleRegisterExitHandler}
          onReturnHome={handleReturn}
          isExiting={isExiting}
        />
      </WorldErrorBoundary>

      {/* Sleek Non-Intrusive Billboard Arrival Pill (100% responsive, never overflows) */}
      {activeWaypoint && !isExiting && (
        <div className="absolute bottom-14 sm:bottom-16 left-1/2 -translate-x-1/2 z-25 flex items-center space-x-2 px-3 py-1.5 rounded-full bg-[#292B27]/95 border-2 border-[#B17B53] shadow-2xl backdrop-blur-md text-[#F4EBDD] font-mono select-none pointer-events-auto max-w-[94vw] animate-fadeIn">
          <span
            className="w-2 h-2 rounded-full animate-ping shrink-0"
            style={{ backgroundColor: activeWaypoint.color || '#B17B53' }}
          />
          <div className="flex items-center space-x-1.5 min-w-0 pr-1">
            <span className="text-[9px] uppercase tracking-wider text-[#B17B53] font-bold shrink-0">
              {activeWaypoint.number || '01'}
            </span>
            <span className="text-[11px] sm:text-xs font-bold text-white truncate max-w-[110px] sm:max-w-[200px]">
              {activeWaypoint.title}
            </span>
          </div>

          <button
            onClick={() => {
              audioEngine.playModalOpen();
              setDetailedProject(activeWaypoint);
            }}
            className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#1A2520] hover:bg-[#24352C] border border-[#B17B53]/50 text-[#F4EBDD] hover:text-white font-mono text-[10px] sm:text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer shadow-sm active:scale-95 shrink-0"
            title="Inspect Full Blueprint Schematic"
          >
            <FileText className="w-3.5 h-3.5 text-[#B17B53]" />
            <span>Blueprint</span>
          </button>

          <button
            onClick={() => {
              audioEngine.playClick();
              setActiveWaypoint(null);
            }}
            className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors cursor-pointer shrink-0"
            aria-label="Dismiss Pill"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
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
