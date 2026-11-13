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
