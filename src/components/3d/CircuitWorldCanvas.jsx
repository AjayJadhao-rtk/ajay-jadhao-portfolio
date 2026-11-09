import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { createCircuitCurve, buildCircuitTrackMesh } from './CircuitTrack';
import { RoverVehicle } from './RoverVehicle';
import { spawnWaypointStations } from './WaypointStation';
import { buildLowPolyLandscape } from './LowPolyLandscape';
import { PROJECTS_DATA } from '../../data/projectsData';
import { audioEngine } from '../../utils/audioSystem';

/**
 * CircuitWorldCanvas manages the Three.js WebGL scene, smooth GSAP camera transitions,
 * extended linear fog with morning horizon gradient, and scalable waypoint integration.
 */
export default function CircuitWorldCanvas({
  onWaypointChange,
  onSchematicOpen,
  currentWaypointId,
  onRegisterExitHandler,
}) {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const roverRef = useRef(null);
  const curveRef = useRef(null);
  const waypointsRef = useRef([]);

  // Transition state
  const isTransitioningRef = useRef(true);

  // Navigation progression state
  const progressRef = useRef(0.0);
  const targetProgressRef = useRef(0.0);
  const isDraggingRef = useRef(false);
  const lastMouseXRef = useRef(0);
  const activeStationIdRef = useRef(null);

  // Autopilot cruising state
  const [isCruising, setIsCruising] = useState(false);
  const isCruisingRef = useRef(false);
  const onWaypointChangeRef = useRef(onWaypointChange);
  const onRegisterExitHandlerRef = useRef(onRegisterExitHandler);

  useEffect(() => {
    isCruisingRef.current = isCruising;
  }, [isCruising]);

  useEffect(() => {
    onWaypointChangeRef.current = onWaypointChange;
  }, [onWaypointChange]);

  useEffect(() => {
    onRegisterExitHandlerRef.current = onRegisterExitHandler;
  }, [onRegisterExitHandler]);

  // Direct Jump to a Waypoint
  const jumpToWaypoint = useCallback((index) => {
    if (!waypointsRef.current || waypointsRef.current.length === 0) return;
    const targetWp = waypointsRef.current[index];
    if (targetWp) {
      targetProgressRef.current = targetWp.progress;
      audioEngine.playClick();
    }
  }, []);

  useEffect(() => {
    window.__jumpToWaypoint = jumpToWaypoint;
    return () => {
      delete window.__jumpToWaypoint;
    };
  }, [jumpToWaypoint]);

  // Main Scene Lifecycle (Runs ONCE on mount)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene & Calibrated Linear Fog
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xE9DDC7);
    
    // LINEAR FOG: Extended graceful view distance (45 to 185) eliminating abrupt clipping
    scene.fog = new THREE.Fog(0xE9DDC7, 45, 185);
    sceneRef.current = scene;

    // 2. Perspective Camera (starts at high-altitude editorial overview)
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.5,
      300
    );
    // Initial high-altitude aerial position
    camera.position.set(0, 90, 48);
    cameraRef.current = camera;

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Atmospheric Lighting (Warm Morning Golden Sunlight)
    const ambientLight = new THREE.AmbientLight(0xF4EBDD, 0.9);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xF4EBDD, 0x626B50, 0.55);
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(0xFDE68A, 1.45);
    sunLight.position.set(45, 65, 35);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 10;
    sunLight.shadow.camera.far = 180;
    sunLight.shadow.camera.left = -60;
    sunLight.shadow.camera.right = 60;
    sunLight.shadow.camera.top = 60;
    sunLight.shadow.camera.bottom = -60;
    scene.add(sunLight);

    // 5. Construct Procedural Circuit World
    const curve = createCircuitCurve(PROJECTS_DATA.length);
    curveRef.current = curve;

    // A. Extruded Circuit Track
    const trackMesh = buildCircuitTrackMesh(curve);
    scene.add(trackMesh);

    // B. Low-Poly Terrain Island with Distant Industrial Towers & Morning Horizon Gradient
    const landscape = buildLowPolyLandscape();
    scene.add(landscape);

    // C. Scalable Waypoint Stations generated dynamically from PROJECTS_DATA
    const { stationsGroup, waypoints } = spawnWaypointStations(curve, PROJECTS_DATA);
    scene.add(stationsGroup);
    waypointsRef.current = waypoints;

    // D. Autonomous Explorer Rover
    const rover = new RoverVehicle();
    scene.add(rover.mesh);
    roverRef.current = rover;

    // Position rover at start
    rover.update(curve, 0, 0.016, 0);
    const startRoverPos = rover.mesh.position;

    // 6. GSAP Camera Entrance Transition (Editorial Overview -> Smooth Chase-Cam Alignment)
    const FOLLOW_DISTANCE = 14.0;
    const CAMERA_HEIGHT = 10.0;

    const startTangent = curve.getTangentAt(0).normalize();
    const startTangentXZ = new THREE.Vector3(startTangent.x, 0, startTangent.z);
    if (startTangentXZ.lengthSq() > 0.0001) startTangentXZ.normalize();
    else startTangentXZ.set(0, 0, -1);

    const targetCamX = startRoverPos.x - startTangentXZ.x * FOLLOW_DISTANCE;
    const targetCamY = startRoverPos.y + CAMERA_HEIGHT;
    const targetCamZ = startRoverPos.z - startTangentXZ.z * FOLLOW_DISTANCE;

    isTransitioningRef.current = true;
    camera.lookAt(startRoverPos.x, startRoverPos.y + 1.2, startRoverPos.z);

    gsap.fromTo(
      camera.position,
      { x: 0, y: 90, z: 48 },
      {
        x: targetCamX,
        y: targetCamY,
        z: targetCamZ,
        duration: 2.0,
        ease: 'power3.inOut',
        onComplete: () => {
          isTransitioningRef.current = false;
        },
      }
    );

    // Register exit handler for smooth return to hero
    if (onRegisterExitHandlerRef.current) {
      onRegisterExitHandlerRef.current((onFinish) => {
        isTransitioningRef.current = true;
        audioEngine.playClick();
        gsap.to(camera.position, {
          x: 0,
          y: 90,
          z: 48,
          duration: 1.4,
          ease: 'power3.inOut',
          onComplete: () => {
            if (onFinish) onFinish();
          },
        });
      });
    }

    // 7. Interaction Event Listeners (Scroll & Drag)
    const handleWheel = (e) => {
      e.preventDefault();
      if (isTransitioningRef.current) return;
      const delta = e.deltaY * 0.00035;
      targetProgressRef.current = (targetProgressRef.current + delta + 10) % 1;
    };

    const handlePointerDown = (e) => {
      if (isTransitioningRef.current) return;
      isDraggingRef.current = true;
      lastMouseXRef.current = e.clientX;
    };

    const handlePointerMove = (e) => {
      if (!isDraggingRef.current || isTransitioningRef.current) return;
      const dx = e.clientX - lastMouseXRef.current;
      lastMouseXRef.current = e.clientX;
      targetProgressRef.current = (targetProgressRef.current - dx * 0.001 + 10) % 1;
    };

    const handlePointerUp = () => {
      isDraggingRef.current = false;
    };

    const handleKeyDown = (e) => {
      if (isTransitioningRef.current) return;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        targetProgressRef.current = (targetProgressRef.current + 0.015 + 10) % 1;
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        targetProgressRef.current = (targetProgressRef.current - 0.015 + 10) % 1;
      }
    };

    const dom = renderer.domElement;
    dom.addEventListener('wheel', handleWheel, { passive: false });
    dom.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('keydown', handleKeyDown);

    // 8. Responsive Resizing with Locked FOV
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.fov = 45;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // 9. High-Precision Render Loop
    let animationFrameId;
    let lastTime = performance.now();

    const render = (currentTime) => {
      const now = currentTime || performance.now();
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // 1. Uninterrupted continuous cruise along track
      if (isCruisingRef.current && !isTransitioningRef.current) {
        targetProgressRef.current = (targetProgressRef.current + delta * 0.025) % 1.0;
      }

      // Smooth progress lerping with seamless loop wrap handling
      let diff = targetProgressRef.current - progressRef.current;
      if (diff > 0.5) diff -= 1.0;
      if (diff < -0.5) diff += 1.0;
      progressRef.current = (progressRef.current + diff * 0.08 + 10.0) % 1.0;

      const currentSpeed = Math.abs(diff);

      // 2. Update Rover on Track
      rover.update(curve, progressRef.current, delta, currentSpeed);

      // 3. Uniform Chase-Cam Controller: Strict uniform offset behind rover along CatmullRom path
      const roverPos = rover.mesh.position;
      const tangent = curve.getTangentAt(progressRef.current).normalize();
      const tangentXZ = new THREE.Vector3(tangent.x, 0, tangent.z);
      if (tangentXZ.lengthSq() > 0.0001) tangentXZ.normalize();
      else tangentXZ.set(0, 0, -1);

      if (!isTransitioningRef.current) {
        const camTargetPos = new THREE.Vector3(
          roverPos.x - tangentXZ.x * FOLLOW_DISTANCE,
          roverPos.y + CAMERA_HEIGHT,
          roverPos.z - tangentXZ.z * FOLLOW_DISTANCE
        );
        camera.position.lerp(camTargetPos, 0.08);
      }

      // CRITICAL: Force camera.lookAt(roverPos) every single frame so camera never tilts or shifts POV
      camera.lookAt(roverPos.x, roverPos.y + 1.2, roverPos.z);

      // 4. Rotate holographic waypoints
      waypoints.forEach((wp) => {
        if (wp.hologram) {
          wp.hologram.rotation.y += delta * 1.5;
          wp.hologram.rotation.x += delta * 0.8;
        }
      });

      // 5. Waypoint Proximity Detection with Hysteresis Dead-Band
      let matchedStation = null;
      for (let wp of waypoints) {
        let distProgress = Math.abs(progressRef.current - wp.progress);
        if (distProgress > 0.5) distProgress = 1.0 - distProgress;

        // Enter threshold = 0.045, Exit threshold = 0.080
        const threshold = (activeStationIdRef.current === wp.id) ? 0.080 : 0.045;
        if (distProgress < threshold) {
          matchedStation = wp;
          break;
        }
      }

      if (matchedStation) {
        if (activeStationIdRef.current !== matchedStation.id) {
          activeStationIdRef.current = matchedStation.id;
          audioEngine.playRadarPing();
          if (onWaypointChangeRef.current) {
            onWaypointChangeRef.current(matchedStation.project);
          }
        }
      } else {
        if (activeStationIdRef.current !== null) {
          activeStationIdRef.current = null;
          if (onWaypointChangeRef.current) {
            onWaypointChangeRef.current(null);
          }
        }
      }

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    // 10. Clean Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      dom.removeEventListener('wheel', handleWheel);
      dom.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);

      if (renderer.domElement) {
        renderer.domElement.remove();
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-full select-none overflow-hidden">
      {/* Three.js Canvas Container */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating Travel Controls Bar */}
      <div className="absolute top-4 left-4 z-20 flex items-center space-x-2 bg-[#292B27]/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#B17B53]/40 shadow-lg text-xs font-mono text-[#F4EBDD]">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        <span className="font-semibold tracking-wider text-[10px]">3D CIRCUIT WORLD</span>
        <span className="text-white/30">|</span>
        <button
          onClick={() => setIsCruising(!isCruising)}
          className={`px-2 py-0.5 rounded text-[9.5px] uppercase font-bold transition-colors cursor-pointer ${
            isCruising ? 'bg-[#B17B53] text-[#292B27]' : 'hover:text-[#B17B53] text-white/70'
          }`}
        >
          {isCruising ? '■ PAUSE CRUISE' : '► AUTOPILOT'}
        </button>
      </div>

      {/* Interactive Track Station Quick-Jump Pills (Scalable from PROJECTS_DATA) */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-1.5 bg-[#F4EBDD]/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#292B27]/30 shadow-lg text-[10px] font-mono text-[#292B27] max-w-[90vw] overflow-x-auto">
        <span className="text-[9px] text-[#89634C] font-bold mr-1 uppercase shrink-0">WAYPOINTS:</span>
        {PROJECTS_DATA.map((p, idx) => (
          <button
            key={p.id}
            onClick={() => jumpToWaypoint(idx)}
            className={`px-2.5 py-1 rounded-full transition-all cursor-pointer font-semibold shrink-0 ${
              currentWaypointId === p.id
                ? 'bg-[#292B27] text-[#F4EBDD] shadow-sm scale-105'
                : 'hover:bg-[#292B27]/10 text-[#292B27]/80'
            }`}
          >
            {p.number}. {p.title}
          </button>
        ))}
      </div>

      {/* Navigation Hint */}
      <div className="absolute bottom-5 right-5 z-20 hidden md:flex items-center space-x-2 bg-[#292B27]/75 backdrop-blur-xs px-3 py-1 rounded-md text-[9px] font-mono text-[#E9DDC7] border border-[#292B27]/40 pointer-events-none">
        <span>SCROLL / DRAG / ARROW KEYS TO NAVIGATE ROVER</span>
      </div>
    </div>
  );
}
