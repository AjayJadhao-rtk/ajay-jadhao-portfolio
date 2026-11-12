import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { Camera } from 'lucide-react';
import { createCircuitCurve, buildCircuitTrackMesh } from './CircuitTrack';
import { RoverVehicle } from './RoverVehicle';
import { spawnWaypointStations } from './WaypointStation';
import { buildLowPolyLandscape } from './LowPolyLandscape';
import { PROJECTS_DATA } from '../../data/projectsData';
import { audioEngine } from '../../utils/audioSystem';

/**
 * CircuitWorldCanvas manages the realistic 3D WebGL circuit world:
 * - Hand-calibrated low-poly terrain with rich vertex elevation & slope coloring
 * - Seamless Day (Golden Hour Anime) & Night (Cosmic Starlit Midnight) modes
 * - Real dynamic SpotLight headlights on the rover and illuminated track
 * - Dual parallel glowing circuit traces (warm bronze in Day -> electric cyan in Night)
 * - Rotating engineering wind turbines and floating fireflies / data motes
 * - STRICTLY PRESERVES rover movement, CatmullRom spline path, and uniform chase-cam tracking!
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

  // Lighting & Scene Refs for Day/Night interpolation
  const ambientLightRef = useRef(null);
  const hemiLightRef = useRef(null);
  const sunLightRef = useRef(null);
  const moonLightRef = useRef(null);
  const landscapeRef = useRef(null);
  const trackMeshRef = useRef(null);
  const stationsGroupRef = useRef(null);

  // Transition state
  const isTransitioningRef = useRef(true);

  // Navigation progression state
  const progressRef = useRef(0.0);
  const targetProgressRef = useRef(0.0);
  const isDraggingRef = useRef(false);
  const lastPointerXRef = useRef(0);
  const lastPointerYRef = useRef(0);
  const activeStationIdRef = useRef(null);

  // Autopilot cruising state
  const [isCruising, setIsCruising] = useState(false);
  const isCruisingRef = useRef(false);

  // Day / Night Mode State
  const [isNightMode, setIsNightMode] = useState(false);
  const isNightModeRef = useRef(false);
  const nightTransitionRef = useRef({ t: 0.0 }); // 0 = Day, 1 = Night

  // Point of View (POV) Mode: 'chase' (3rd person) | 'cockpit' (front bumper) | 'aerial' (orbit)
  const [povMode, setPovMode] = useState('chase');
  const povModeRef = useRef('chase');
  const camLookAtRef = useRef(new THREE.Vector3(0, 1.2, 0));

  useEffect(() => {
    povModeRef.current = povMode;
  }, [povMode]);

  const cyclePOV = () => {
    audioEngine.playClick();
    setPovMode((prev) => {
      if (prev === 'chase') return 'cockpit';
      if (prev === 'cockpit') return 'aerial';
      return 'chase';
    });
  };

  const onWaypointChangeRef = useRef(onWaypointChange);
  const onRegisterExitHandlerRef = useRef(onRegisterExitHandler);

  useEffect(() => {
    isCruisingRef.current = isCruising;
  }, [isCruising]);

  useEffect(() => {
    isNightModeRef.current = isNightMode;
  }, [isNightMode]);

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

  // Day / Night Mode Smooth Interpolator
  const applyNightTransition = useCallback((t) => {
    if (!sceneRef.current) return;

    // Background & Fog Color Interpolation
    const dayBg = new THREE.Color(0xE9DDC7);
    const nightBg = new THREE.Color(0x0C101B);

    sceneRef.current.background.lerpColors(dayBg, nightBg, t);

    if (sceneRef.current.fog) {
      sceneRef.current.fog.color.lerpColors(dayBg, nightBg, t);
      sceneRef.current.fog.near = THREE.MathUtils.lerp(45, 38, t);
      sceneRef.current.fog.far = THREE.MathUtils.lerp(185, 175, t);
    }

    // Ambient Lighting
    if (ambientLightRef.current) {
      const dayAmb = new THREE.Color(0xF4EBDD);
      const nightAmb = new THREE.Color(0x1E293B);
      ambientLightRef.current.color.lerpColors(dayAmb, nightAmb, t);
      ambientLightRef.current.intensity = THREE.MathUtils.lerp(0.9, 0.35, t);
    }

    // Hemisphere Lighting
    if (hemiLightRef.current) {
      hemiLightRef.current.intensity = THREE.MathUtils.lerp(0.55, 0.32, t);
    }

    // Sun & Moon Directional Lighting
    if (sunLightRef.current) {
      sunLightRef.current.intensity = THREE.MathUtils.lerp(1.45, 0.15, t);
    }
    if (moonLightRef.current) {
      moonLightRef.current.intensity = THREE.MathUtils.lerp(0.0, 0.85, t);
    }

    // Sub-modules Day/Night handlers
    if (landscapeRef.current?.userData?.setNightTransition) {
      landscapeRef.current.userData.setNightTransition(t);
    }
    if (trackMeshRef.current?.userData?.setNightTransition) {
      trackMeshRef.current.userData.setNightTransition(t);
    }
    if (roverRef.current?.setNightTransition) {
      roverRef.current.setNightTransition(t);
    }
    if (stationsGroupRef.current?.userData?.setNightTransition) {
      stationsGroupRef.current.userData.setNightTransition(t);
    }
  }, []);

  // Smoothly Tween Day/Night Mode when State Changes
  useEffect(() => {
    const targetT = isNightMode ? 1.0 : 0.0;
    gsap.to(nightTransitionRef.current, {
      t: targetT,
      duration: 1.2,
      ease: 'power2.inOut',
      onUpdate: () => {
        applyNightTransition(nightTransitionRef.current.t);
      },
    });
  }, [isNightMode, applyNightTransition]);

  const toggleNightMode = () => {
    audioEngine.playClick();
    setIsNightMode((prev) => !prev);
  };

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

    // 2. Mobile-Adaptive Dynamic Camera Framing
    const isMobileInitial = typeof window !== 'undefined' && window.innerWidth < 768;
    const initialFov = isMobileInitial ? 56 : 45;

    const camera = new THREE.PerspectiveCamera(
      initialFov,
      container.clientWidth / container.clientHeight,
      0.5,
      320
    );
    // Initial high-altitude aerial position
    camera.position.set(0, 90, 48);
    cameraRef.current = camera;

    // 3. High-Performance WebGL Renderer with Mobile DPR Clamp (Prevents GPU throttling)
    const maxDpr = isMobileInitial ? 1.5 : 2.0;
    const initialDpr = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, maxDpr);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobileInitial || initialDpr < 2,
      powerPreference: 'high-performance',
      stencil: false,
      depth: true,
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(initialDpr);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = isMobileInitial ? THREE.BasicShadowMap : THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Atmospheric Lighting Setup
    // A. Ambient Light
    const ambientLight = new THREE.AmbientLight(0xF4EBDD, 0.9);
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    // B. Hemisphere Light (Sky & Ground bounce)
    const hemiLight = new THREE.HemisphereLight(0xF4EBDD, 0x626B50, 0.55);
    scene.add(hemiLight);
    hemiLightRef.current = hemiLight;

    // C. Sun Directional Light (Warm Golden Sunlight)
    const sunLight = new THREE.DirectionalLight(0xFDE68A, 1.45);
    sunLight.position.set(45, 65, 35);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = isMobileInitial ? 1024 : 2048;
    sunLight.shadow.mapSize.height = isMobileInitial ? 1024 : 2048;
    sunLight.shadow.camera.near = 10;
    sunLight.shadow.camera.far = 185;
    sunLight.shadow.camera.left = -62;
    sunLight.shadow.camera.right = 62;
    sunLight.shadow.camera.top = 62;
    sunLight.shadow.camera.bottom = -62;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);
    sunLightRef.current = sunLight;

    // D. Moon Directional Light (Cool Midnight Moonlight for Night Mode)
    const moonLight = new THREE.DirectionalLight(0x93C5FD, 0.0);
    moonLight.position.set(-45, 60, -35);
    scene.add(moonLight);
    moonLightRef.current = moonLight;

    // 5. Construct Procedural Circuit World
    const curve = createCircuitCurve(PROJECTS_DATA.length);
    curveRef.current = curve;

    // A. Extruded Circuit Track
    const trackMesh = buildCircuitTrackMesh(curve);
    scene.add(trackMesh);
    trackMeshRef.current = trackMesh;

    // B. Realistic Low-Poly Terrain Island with Rich Vertex Colors, Lake, Turbines & Starfield
    const landscape = buildLowPolyLandscape();
    scene.add(landscape);
    landscapeRef.current = landscape;

    // C. Scalable Waypoint Stations generated dynamically from PROJECTS_DATA
    const { stationsGroup, waypoints } = spawnWaypointStations(curve, PROJECTS_DATA);
    scene.add(stationsGroup);
    stationsGroupRef.current = stationsGroup;
    waypointsRef.current = waypoints;

    // D. Autonomous Explorer Rover with Real Dynamic Spotlights
    const rover = new RoverVehicle();
    scene.add(rover.mesh);
    roverRef.current = rover;

    // Position rover at start
    rover.update(curve, 0, 0.016, 0);
    const startRoverPos = rover.mesh.position;

    // 6. GSAP Camera Entrance Transition (Editorial Overview -> Smooth Chase-Cam Alignment)
    const FOLLOW_DISTANCE = isMobileInitial ? 18.0 : 14.0;
    const CAMERA_HEIGHT = isMobileInitial ? 13.0 : 10.0;

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

    // 7. Touch & Pointer Interaction Event Listeners (Passive & Non-Blocking)
    const handleWheel = (e) => {
      e.preventDefault();
      if (isTransitioningRef.current) return;
      const delta = e.deltaY * 0.00035;
      targetProgressRef.current = (targetProgressRef.current + delta + 10.0) % 1.0;
    };

    const handlePointerDown = (e) => {
      if (isTransitioningRef.current) return;
      isDraggingRef.current = true;
      lastPointerXRef.current = e.clientX;
      lastPointerYRef.current = e.clientY;
      if (e.target && e.target.setPointerCapture) {
        try {
          e.target.setPointerCapture(e.pointerId);
        } catch (_) {}
      }
    };

    const handlePointerMove = (e) => {
      if (!isDraggingRef.current || isTransitioningRef.current) return;
      const dx = e.clientX - lastPointerXRef.current;
      const dy = e.clientY - lastPointerYRef.current;
      lastPointerXRef.current = e.clientX;
      lastPointerYRef.current = e.clientY;

      // Mobile touch-friendly: horizontal drag OR vertical thumb flick
      const dominantDelta = Math.abs(dx) >= Math.abs(dy) ? -dx : dy;
      targetProgressRef.current = (targetProgressRef.current + dominantDelta * 0.0012 + 10.0) % 1.0;
    };

    const handlePointerUp = (e) => {
      isDraggingRef.current = false;
      if (e.target && e.target.releasePointerCapture) {
        try {
          e.target.releasePointerCapture(e.pointerId);
        } catch (_) {}
      }
    };

    const handleKeyDown = (e) => {
      if (isTransitioningRef.current) return;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        targetProgressRef.current = (targetProgressRef.current + 0.015 + 10.0) % 1.0;
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        targetProgressRef.current = (targetProgressRef.current - 0.015 + 10.0) % 1.0;
      }
    };

    const dom = renderer.domElement;
    dom.addEventListener('wheel', handleWheel, { passive: false });
    dom.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerup', handlePointerUp, { passive: true });
    window.addEventListener('pointercancel', handlePointerUp, { passive: true });
    window.addEventListener('keydown', handleKeyDown);

    // 8. Responsive Resizing with Dynamic Mobile FOV & DPR Lock
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const isMobileNow = window.innerWidth < 768;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.fov = isMobileNow ? 56 : 45;
      camera.updateProjectionMatrix();

      const newDpr = Math.min(window.devicePixelRatio || 1, isMobileNow ? 1.5 : 2.0);
      renderer.setPixelRatio(newDpr);
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

      // 1. Uninterrupted continuous cruise along track (STRICTLY PRESERVED MOTION)
      if (isCruisingRef.current && !isTransitioningRef.current) {
        targetProgressRef.current = (targetProgressRef.current + delta * 0.025) % 1.0;
      }

      // Smooth progress lerping with seamless loop wrap handling
      let diff = targetProgressRef.current - progressRef.current;
      if (diff > 0.5) diff -= 1.0;
      if (diff < -0.5) diff += 1.0;
      progressRef.current = (progressRef.current + diff * 0.08 + 10.0) % 1.0;

      const currentSpeed = Math.abs(diff);

      // 2. Update Rover on Track (Motion logic preserved)
      rover.update(curve, progressRef.current, delta, currentSpeed);

      // 3. Dynamic Camera POV Controller (Chase / Cockpit / Aerial)
      const roverPos = rover.mesh.position;
      const tangent = curve.getTangentAt(progressRef.current).normalize();
      const tangentXZ = new THREE.Vector3(tangent.x, 0, tangent.z);
      if (tangentXZ.lengthSq() > 0.0001) tangentXZ.normalize();
      else tangentXZ.set(0, 0, -1);

      const camTargetPos = new THREE.Vector3();
      const targetLookAt = new THREE.Vector3();

      if (povModeRef.current === 'cockpit') {
        // Cockpit / Bumper POV: Mounted right on rover's front deck looking ahead
        camTargetPos.set(
          roverPos.x + tangentXZ.x * 0.95,
          roverPos.y + 1.35,
          roverPos.z + tangentXZ.z * 0.95
        );
        targetLookAt.set(
          roverPos.x + tangentXZ.x * 16.0,
          roverPos.y + 1.1,
          roverPos.z + tangentXZ.z * 16.0
        );
      } else if (povModeRef.current === 'aerial') {
        // Aerial / Drone Orbit POV: Elevated diorama angle
        camTargetPos.set(
          roverPos.x - 22.0,
          roverPos.y + 25.0,
          roverPos.z + 24.0
        );
        targetLookAt.set(roverPos.x, roverPos.y + 0.8, roverPos.z);
      } else {
        // Uniform Chase-Cam POV (Default)
        camTargetPos.set(
          roverPos.x - tangentXZ.x * FOLLOW_DISTANCE,
          roverPos.y + CAMERA_HEIGHT,
          roverPos.z - tangentXZ.z * FOLLOW_DISTANCE
        );
        targetLookAt.set(roverPos.x, roverPos.y + 1.2, roverPos.z);
      }

      if (!isTransitioningRef.current) {
        const lerpSpeed = povModeRef.current === 'cockpit' ? 0.35 : 0.08;
        camera.position.lerp(camTargetPos, lerpSpeed);
        camLookAtRef.current.lerp(targetLookAt, lerpSpeed);
        camera.lookAt(camLookAtRef.current);
      }

      // 4. Update Realistic Landscape Animations (Wind Turbines & Fireflies)
      if (landscapeRef.current?.userData?.update) {
        landscapeRef.current.userData.update(delta);
      }

      // 5. Rotate holographic waypoints
      waypoints.forEach((wp) => {
        if (wp.hologram) {
          wp.hologram.rotation.y += delta * 1.5;
          wp.hologram.rotation.x += delta * 0.8;
        }
      });

      // 6. Waypoint Proximity Detection with Hysteresis Dead-Band
      let matchedStation = null;
      for (let wp of waypoints) {
        let distProgress = Math.abs(progressRef.current - wp.progress);
        if (distProgress > 0.5) distProgress = 1.0 - distProgress;

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
      window.removeEventListener('pointercancel', handlePointerUp);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);

      if (renderer.domElement) {
        renderer.domElement.remove();
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-full select-none overflow-hidden touch-none">
      {/* Three.js Canvas Container with touch-action: none */}
      <div 
        ref={containerRef} 
        className="w-full h-full cursor-grab active:cursor-grabbing touch-none select-none" 
        style={{ touchAction: 'none' }}
      />

      {/* Awwwards-Level Floating Island Control Capsule */}
      <div className="absolute top-3.5 right-3.5 sm:top-4 sm:left-1/2 sm:-translate-x-1/2 sm:right-auto z-35 pointer-events-auto flex items-center gap-1 sm:gap-1.5 bg-[#0A0D14]/90 backdrop-blur-2xl p-1.5 rounded-full border border-white/[0.12] shadow-[0_25px_60px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.15)] text-xs font-mono transition-all duration-500">
        
        {/* Flagship Brand / Telemetry LED Pill */}
        <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06]">
          <span className={`w-2 h-2 rounded-full animate-ping ${isNightMode ? 'bg-cyan-400' : 'bg-emerald-400'}`} />
          <span className="font-semibold tracking-[0.16em] text-[10px] text-white/90 uppercase">
            {isNightMode ? 'LUNAR SIM' : 'SOLAR SIM'}
          </span>
        </div>

        <div className="w-[1px] h-4 bg-white/10 hidden sm:block" />

        {/* 1. Environment Lighting Button (Day / Night) */}
        <button
          onClick={toggleNightMode}
          onMouseEnter={() => audioEngine.playHover()}
          className={`group relative px-3 sm:px-3.5 py-2 min-h-[42px] flex items-center space-x-2 rounded-full text-[10.5px] uppercase font-bold tracking-wider transition-all duration-300 cursor-pointer active:scale-95 ${
            isNightMode
              ? 'bg-gradient-to-r from-blue-950/80 to-indigo-950/80 text-cyan-300 border border-cyan-400/50 shadow-[0_0_15px_rgba(56,189,248,0.35),inset_0_1px_1px_rgba(255,255,255,0.1)] hover:border-cyan-300'
              : 'bg-gradient-to-r from-amber-950/40 to-yellow-950/30 text-amber-200 border border-amber-400/40 shadow-[0_0_15px_rgba(251,191,36,0.25),inset_0_1px_1px_rgba(255,255,255,0.1)] hover:border-amber-300'
          }`}
          title={isNightMode ? 'Switch to Solar Dawn (Day Lighting)' : 'Switch to Lunar Obsidian (Night Lighting)'}
        >
          <span className="text-xs transition-transform group-hover:scale-110">
            {isNightMode ? '🌙' : '☀️'}
          </span>
          <span className="hidden min-[480px]:inline font-mono">
            {isNightMode ? 'LUNAR 6500K' : 'SOLAR 2400K'}
          </span>
          <span className="min-[480px]:hidden font-mono">
            {isNightMode ? 'NIGHT' : 'DAY'}
          </span>
        </button>

        {/* 2. Camera Optics POV Switcher Button */}
        <button
          onClick={cyclePOV}
          onMouseEnter={() => audioEngine.playHover()}
          className={`group relative px-3 sm:px-3.5 py-2 min-h-[42px] flex items-center space-x-2 rounded-full text-[10.5px] uppercase font-bold tracking-wider transition-all duration-300 cursor-pointer active:scale-95 ${
            povMode === 'cockpit'
              ? 'bg-gradient-to-r from-rose-950/80 to-red-950/80 text-rose-200 border border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.35)]'
              : povMode === 'aerial'
              ? 'bg-gradient-to-r from-purple-950/80 to-indigo-950/80 text-purple-200 border border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.35)]'
              : 'bg-white/[0.06] hover:bg-white/[0.12] text-white/90 border border-white/[0.1] hover:border-white/20'
          }`}
          title="Cycle Camera Optics (Chase Trajectory -> Cockpit Bumper -> Satellite Orbit)"
        >
          <Camera className="w-3.5 h-3.5 transition-transform group-hover:scale-110" />
          <span className="hidden min-[520px]:inline font-mono">
            {povMode === 'chase' ? 'OPTICS // CHASE' : povMode === 'cockpit' ? 'OPTICS // COCKPIT' : 'OPTICS // ORBIT'}
          </span>
          <span className="min-[520px]:hidden font-mono">
            {povMode === 'chase' ? 'CHASE' : povMode === 'cockpit' ? 'BUMPER' : 'ORBIT'}
          </span>
        </button>

        {/* 3. Autonomous Cruise Propulsion Button */}
        <button
          onClick={() => {
            audioEngine.playClick();
            setIsCruising(!isCruising);
          }}
          onMouseEnter={() => audioEngine.playHover()}
          className={`group px-3.5 sm:px-4 py-2 min-h-[42px] flex items-center space-x-2 rounded-full text-[10.5px] uppercase font-bold tracking-wider transition-all duration-300 cursor-pointer active:scale-95 ${
            isCruising
              ? (isNightMode 
                  ? 'bg-cyan-400 text-slate-950 shadow-[0_0_20px_rgba(56,189,248,0.5)] border border-cyan-300' 
                  : 'bg-[#B17B53] text-[#F4EBDD] shadow-[0_0_20px_rgba(177,123,83,0.4)] border border-amber-300/40')
              : 'bg-white/[0.06] hover:bg-white/[0.12] text-white/90 border border-white/[0.1] hover:border-white/20'
          }`}
          title={isCruising ? 'Pause Autonomous Cruising' : 'Engage Autonomous Autopilot Cruise'}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${isCruising ? (isNightMode ? 'bg-slate-950 animate-ping' : 'bg-white animate-ping') : 'bg-emerald-400'}`} />
          <span>{isCruising ? 'CRUISE // ACTIVE' : 'AUTOPILOT // OFF'}</span>
        </button>
      </div>

      {/* Apple-Style Flagship Glass Dock: Waypoint Station Selector */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 sm:gap-2 bg-[#0A0D14]/90 backdrop-blur-2xl p-2 rounded-2xl border border-white/[0.12] shadow-[0_25px_60px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.15)] text-xs font-mono max-w-[95vw] overflow-x-auto scrollbar-none touch-pan-x transition-all duration-500">
        
        {/* Terminal Header Tag */}
        <div className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-white/[0.04] text-[9.5px] font-mono tracking-widest text-white/60 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="hidden sm:inline">NODES:</span>
          <span className="text-white font-bold">05</span>
        </div>

        <div className="w-[1px] h-4 bg-white/10 shrink-0" />

        {/* 5 Flagship Waypoint Stations */}
        {PROJECTS_DATA.map((p, idx) => {
          const isActive = currentWaypointId === p.id;
          return (
            <button
              key={p.id}
              onClick={() => jumpToWaypoint(idx)}
              onMouseEnter={() => audioEngine.playHover()}
              className={`group relative px-3.5 py-2 min-h-[44px] flex items-center space-x-2 rounded-xl transition-all duration-300 cursor-pointer font-mono shrink-0 active:scale-95 ${
                isActive
                  ? 'bg-gradient-to-r from-white/[0.15] to-white/[0.08] text-white border border-white/30 shadow-[0_0_20px_rgba(255,255,255,0.15),inset_0_1px_1px_rgba(255,255,255,0.2)] scale-[1.03] font-bold'
                  : 'bg-white/[0.03] hover:bg-white/[0.08] text-white/70 hover:text-white border border-transparent hover:border-white/10'
              }`}
            >
              {/* Laser-etched Node Index */}
              <span
                className="w-2 h-2 rounded-full shrink-0 transition-transform group-hover:scale-125"
                style={{
                  backgroundColor: p.color || '#B17B53',
                  boxShadow: isActive ? `0 0 10px ${p.color || '#B17B53'}` : 'none',
                }}
              />
              <span className="text-[10px] text-white/50 group-hover:text-white/80 font-semibold">
                {p.number}
              </span>
              <span className="text-[11px] tracking-wide whitespace-nowrap">
                {p.title}
              </span>

              {/* Active Indicator Underline */}
              {isActive && (
                <span
                  className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full"
                  style={{
                    backgroundColor: p.color || '#B17B53',
                    boxShadow: `0 0 8px ${p.color || '#B17B53'}`,
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Navigation Telemetry Hint */}
      <div className="absolute bottom-5 right-5 z-20 hidden md:flex items-center space-x-2.5 bg-[#0A0D14]/85 backdrop-blur-xl px-4 py-2 rounded-full border border-white/[0.1] shadow-xl text-[9.5px] font-mono tracking-widest text-white/70 pointer-events-none">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        <span className="text-white/40">NAV:</span>
        <span>DRAG · WHEEL · ARROWS</span>
      </div>
    </div>
  );
}
