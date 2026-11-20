import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { Camera, Sun, Moon, Play, Pause, Home, MapPin, Compass, HelpCircle, MoveHorizontal, X, ArrowLeft, Eye } from 'lucide-react';
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
  onReturnHome,
  isExiting = false,
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

  // Mobile & Interactive Navigation Instruction Overlay State
  const [showNavInstruction, setShowNavInstruction] = useState(false);
  const showNavInstructionRef = useRef(false);

  const dismissInstruction = useCallback(() => {
    setShowNavInstruction(false);
    showNavInstructionRef.current = false;
    audioEngine.playClick();
  }, []);

  // Show intuitive guide for mobile users shortly after entering 3D world, then auto-fade
  useEffect(() => {
    const showTimer = setTimeout(() => {
      setShowNavInstruction(true);
      showNavInstructionRef.current = true;
    }, 700);

    const autoDismissTimer = setTimeout(() => {
      setShowNavInstruction(false);
      showNavInstructionRef.current = false;
    }, 5500);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(autoDismissTimer);
    };
  }, []);

  // Pond Observation View Mode State & Ref
  const [isPondView, setIsPondView] = useState(false);
  const isPondViewRef = useRef(false);

  // Close-up Billboard Inspection Mode State & Ref
  const [focusedBillboard, setFocusedBillboard] = useState(null);
  const focusedBillboardRef = useRef(null);

  const hoveredObjectRef = useRef(null);
  const clickableTargetsRef = useRef([]);

  const onWaypointChangeRef = useRef(onWaypointChange);
  const onSchematicOpenRef = useRef(onSchematicOpen);
  const onRegisterExitHandlerRef = useRef(onRegisterExitHandler);
  const clickableBillboardsRef = useRef([]);
  const pointerDownPosRef = useRef({ x: 0, y: 0 });

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
    onSchematicOpenRef.current = onSchematicOpen;
  }, [onSchematicOpen]);

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
    clickableBillboardsRef.current = waypoints.map((w) => w.posterMesh).filter(Boolean);

    // Collect all raycast targets: billboard posters, interactive 3D buttons, and pond
    const allRaycastTargets = [];
    if (stationsGroup.userData?.interactiveObjects) {
      allRaycastTargets.push(...stationsGroup.userData.interactiveObjects);
    } else {
      waypoints.forEach((w) => {
        if (w.posterMesh) allRaycastTargets.push(w.posterMesh);
        if (w.interactiveButtons) allRaycastTargets.push(...w.interactiveButtons);
      });
    }
    landscape.traverse((obj) => {
      if (obj.userData?.isPond) allRaycastTargets.push(obj);
    });
    clickableTargetsRef.current = allRaycastTargets;

    // D. Autonomous Explorer Rover with Real Dynamic Spotlights
    const rover = new RoverVehicle();
    scene.add(rover.mesh);
    roverRef.current = rover;

    // Position rover at start
    rover.update(curve, 0, 0.016, 0);
    const startRoverPos = rover.mesh.position;

    // 6. GSAP Camera Entrance Transition (Silky-Smooth Cinematic Chase-Cam Alignment)
    // Calibrated closer follow distance for mobile view so billboards are large and clear
    const FOLLOW_DISTANCE = isMobileInitial ? 11.5 : 13.5;
    const CAMERA_HEIGHT = isMobileInitial ? 7.5 : 9.5;

    const startTangent = curve.getTangentAt(0).normalize();
    const startTangentXZ = new THREE.Vector3(startTangent.x, 0, startTangent.z);
    if (startTangentXZ.lengthSq() > 0.0001) startTangentXZ.normalize();
    else startTangentXZ.set(0, 0, -1);

    const targetCamX = startRoverPos.x - startTangentXZ.x * FOLLOW_DISTANCE;
    const targetCamY = startRoverPos.y + CAMERA_HEIGHT;
    const targetCamZ = startRoverPos.z - startTangentXZ.z * FOLLOW_DISTANCE;

    // Elevated cinematic vantage point tracking the rover from behind
    const entryDist = FOLLOW_DISTANCE * 1.8;
    const entryHeight = targetCamY + (isMobileInitial ? 14.0 : 11.0);
    const initialCamX = startRoverPos.x - startTangentXZ.x * entryDist;
    const initialCamY = entryHeight;
    const initialCamZ = startRoverPos.z - startTangentXZ.z * entryDist;

    camera.position.set(initialCamX, initialCamY, initialCamZ);
    camLookAtRef.current.set(startRoverPos.x, startRoverPos.y + 1.2, startRoverPos.z);
    camera.lookAt(camLookAtRef.current);

    // Warm up and precompile all WebGL shader programs so the first render frame never hitches
    try {
      renderer.compile(scene, camera);
    } catch (_) {}

    isTransitioningRef.current = true;

    gsap.to(camera.position, {
      x: targetCamX,
      y: targetCamY,
      z: targetCamZ,
      duration: 1.15,
      ease: 'power2.out',
      onUpdate: () => {
        camera.lookAt(startRoverPos.x, startRoverPos.y + 1.2, startRoverPos.z);
      },
      onComplete: () => {
        isTransitioningRef.current = false;
        camLookAtRef.current.set(startRoverPos.x, startRoverPos.y + 1.2, startRoverPos.z);
      },
    });

    // Register exit handler for swift, fluid return to hero
    if (onRegisterExitHandlerRef.current) {
      onRegisterExitHandlerRef.current((onFinish) => {
        isTransitioningRef.current = true;
        audioEngine.stopRoverEngine();
        audioEngine.playClick();
        gsap.to(camera.position, {
          y: camera.position.y + 8,
          duration: 0.45,
          ease: 'power2.in',
          onUpdate: () => {
            camera.lookAt(rover.mesh.position.x, rover.mesh.position.y + 1.2, rover.mesh.position.z);
          },
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
      if (showNavInstructionRef.current) {
        setShowNavInstruction(false);
        showNavInstructionRef.current = false;
      }
      if (isTransitioningRef.current) return;
      isDraggingRef.current = true;
      lastPointerXRef.current = e.clientX;
      lastPointerYRef.current = e.clientY;
      pointerDownPosRef.current = { x: e.clientX, y: e.clientY };
      if (e.target && e.target.setPointerCapture) {
        try {
          e.target.setPointerCapture(e.pointerId);
        } catch (_) {}
      }
    };

    const handlePointerMove = (e) => {
      if (isDraggingRef.current && !isTransitioningRef.current) {
        if (focusedBillboardRef.current) {
          setFocusedBillboard(null);
          focusedBillboardRef.current = null;
        }
        if (isPondViewRef.current) {
          setIsPondView(false);
          isPondViewRef.current = false;
        }
        const dx = e.clientX - lastPointerXRef.current;
        const dy = e.clientY - lastPointerYRef.current;
        lastPointerXRef.current = e.clientX;
        lastPointerYRef.current = e.clientY;

        // Mobile touch-friendly: horizontal drag OR vertical thumb flick
        const dominantDelta = Math.abs(dx) >= Math.abs(dy) ? -dx : dy;
        targetProgressRef.current = (targetProgressRef.current + dominantDelta * 0.0012 + 10.0) % 1.0;
        return;
      }

      // Mouse Hover Detection when not dragging (for interactive billboard buttons, poster and pond)
      if (!isDraggingRef.current && !isTransitioningRef.current && renderer && camera) {
        const rect = renderer.domElement.getBoundingClientRect();
        const mouse = new THREE.Vector2(
          ((e.clientX - rect.left) / rect.width) * 2 - 1,
          -((e.clientY - rect.top) / rect.height) * 2 + 1
        );
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);

        const targets = clickableTargetsRef.current || [];
        const intersects = raycaster.intersectObjects(targets, true);

        let hitInteractive = null;
        if (intersects.length > 0) {
          let hit = intersects[0].object;
          while (hit && !hit.userData?.isInteractiveButton && !hit.userData?.isBillboard && !hit.userData?.isPond) {
            hit = hit.parent;
          }
          if (hit && (hit.userData?.isInteractiveButton || hit.userData?.isBillboard || hit.userData?.isPond)) {
            hitInteractive = hit;
          }
        }

        if (hitInteractive !== hoveredObjectRef.current) {
          if (hoveredObjectRef.current && hoveredObjectRef.current.userData?.setHovered) {
            hoveredObjectRef.current.userData.setHovered(false);
          }
          hoveredObjectRef.current = hitInteractive;
          if (hitInteractive) {
            dom.style.cursor = 'pointer';
            if (hitInteractive.userData?.setHovered) {
              hitInteractive.userData.setHovered(true);
              audioEngine.playHover();
            }
          } else {
            dom.style.cursor = 'grab';
          }
        }
      }
    };

    const handlePointerUp = (e) => {
      isDraggingRef.current = false;
      if (e.target && e.target.releasePointerCapture) {
        try {
          e.target.releasePointerCapture(e.pointerId);
        } catch (_) {}
      }

      // Tap / Click detection: handles interactive billboard buttons, poster taps, and pond touch
      const moveDist = Math.hypot(
        e.clientX - pointerDownPosRef.current.x,
        e.clientY - pointerDownPosRef.current.y
      );
      if (moveDist < 12 && !isTransitioningRef.current && renderer && camera) {
        const rect = renderer.domElement.getBoundingClientRect();
        const mouse = new THREE.Vector2(
          ((e.clientX - rect.left) / rect.width) * 2 - 1,
          -((e.clientY - rect.top) / rect.height) * 2 + 1
        );
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);
        const targets = clickableTargetsRef.current || [];
        const intersects = raycaster.intersectObjects(targets, true);

        if (intersects.length > 0) {
          let hit = intersects[0].object;
          while (hit && !hit.userData?.isInteractiveButton && !hit.userData?.isBillboard && !hit.userData?.isPond) {
            hit = hit.parent;
          }

          if (hit) {
            if (hit.userData?.isPond) {
              // User tapped the pond! Seamlessly glide camera to the Koi Pond sanctuary
              audioEngine.playWaterSplash();
              setIsPondView(true);
              isPondViewRef.current = true;
              setFocusedBillboard(null);
              focusedBillboardRef.current = null;
              if (onWaypointChangeRef.current) {
                onWaypointChangeRef.current(null);
              }
            } else if (hit.userData?.isInteractiveButton) {
              const action = hit.userData.action;
              const proj = hit.userData.project;
              if (action === 'blueprint' || action === 'specs') {
                audioEngine.playModalOpen();
                if (onSchematicOpenRef.current) {
                  onSchematicOpenRef.current(proj);
                }
              } else if (action === 'focus') {
                audioEngine.playClick();
                const wp = waypointsRef.current.find((w) => w.id === proj.id);
                if (wp) {
                  const isAlreadyFocused = focusedBillboardRef.current?.id === wp.id;
                  const nextFocus = isAlreadyFocused ? null : wp;
                  setFocusedBillboard(nextFocus);
                  focusedBillboardRef.current = nextFocus;
                  setIsPondView(false);
                  isPondViewRef.current = false;
                }
              }
            } else if (hit.userData?.waypointProject || hit.userData?.isBillboard) {
              let proj = hit.userData.waypointProject;
              if (!proj) {
                const wp = waypointsRef.current.find((w) => w.id === hit.userData.waypointId);
                proj = wp?.project;
              }
              if (proj) {
                audioEngine.playModalOpen();
                if (onSchematicOpenRef.current) {
                  onSchematicOpenRef.current(proj);
                }
              }
            }
          }
        }
      }
    };

    const handleKeyDown = (e) => {
      if (isTransitioningRef.current) return;
      if (focusedBillboardRef.current) {
        setFocusedBillboard(null);
        focusedBillboardRef.current = null;
      }
      if (isPondViewRef.current) {
        setIsPondView(false);
        isPondViewRef.current = false;
      }
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

      // 2b. Rover Driving Sound: Modulate electric engine sound based on driving motion
      audioEngine.updateRoverEngine(currentSpeed);

      // 2c. Waypoint Proximity Detection with Hysteresis Dead-Band
      let matchedStation = null;
      for (let wp of waypoints) {
        let distProgress = Math.abs(progressRef.current - wp.progress);
        if (distProgress > 0.5) distProgress = 1.0 - distProgress;

        const threshold = activeStationIdRef.current === wp.id ? 0.080 : 0.045;
        if (distProgress < threshold) {
          matchedStation = wp;
          break;
        }
      }

      if (matchedStation && !isPondViewRef.current) {
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

      // 3. Dynamic Camera POV Controller (Pond Sanctuary / Billboard Focus / Chase / Cockpit / Aerial)
      const roverPos = rover.mesh.position;
      const tangent = curve.getTangentAt(progressRef.current).normalize();
      const tangentXZ = new THREE.Vector3(tangent.x, 0, tangent.z);
      if (tangentXZ.lengthSq() > 0.0001) tangentXZ.normalize();
      else tangentXZ.set(0, 0, -1);

      const camTargetPos = new THREE.Vector3();
      const targetLookAt = new THREE.Vector3();

      if (isPondViewRef.current) {
        // Dedicated Koi Pond Observation Sanctuary View
        const lakeX = -18;
        const lakeZ = 15;
        const isMob = window.innerWidth < 768;
        camTargetPos.set(
          lakeX + (isMob ? 8.2 : 11.2),
          isMob ? 4.2 : 5.0,
          lakeZ + (isMob ? 8.8 : 11.8)
        );
        targetLookAt.set(lakeX - 1.2, 0.25, lakeZ - 1.2);
      } else if (focusedBillboardRef.current) {
        // Dedicated Billboard Close-Up Focus Mode
        const wp = focusedBillboardRef.current;
        const isMob = window.innerWidth < 768;
        const boardQuat = wp.billboardGroup.quaternion;
        const boardFront = new THREE.Vector3(0, 0, 1).applyQuaternion(boardQuat).normalize();
        camTargetPos
          .copy(wp.position)
          .add(boardFront.multiplyScalar(isMob ? 5.2 : 6.8))
          .setY(wp.position.y + 3.4);
        targetLookAt.copy(wp.position).setY(wp.position.y + 3.4);
      } else if (povModeRef.current === 'cockpit') {
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
        camTargetPos.set(roverPos.x - 22.0, roverPos.y + 25.0, roverPos.z + 24.0);
        targetLookAt.set(roverPos.x, roverPos.y + 0.8, roverPos.z);
      } else {
        // Uniform Chase-Cam POV: 100% Rock-solid, consistent height & follow distance (Zero POV dipping!)
        const isMob = window.innerWidth < 768;
        const followDist = isMob ? 11.5 : 13.5;
        const camHeight = isMob ? 7.5 : 9.5;

        camTargetPos.set(
          roverPos.x - tangentXZ.x * followDist,
          roverPos.y + camHeight,
          roverPos.z - tangentXZ.z * followDist
        );
        targetLookAt.set(roverPos.x, roverPos.y + 1.2, roverPos.z);
      }

      if (isTransitioningRef.current) {
        camera.lookAt(roverPos.x, roverPos.y + 1.2, roverPos.z);
      } else {
        const lerpSpeed =
          isPondViewRef.current || focusedBillboardRef.current
            ? 0.05
            : povModeRef.current === 'cockpit'
            ? 0.35
            : 0.10;
        camera.position.lerp(camTargetPos, lerpSpeed);
        camLookAtRef.current.lerp(targetLookAt, lerpSpeed);
        camera.lookAt(camLookAtRef.current);
      }

      // 4. Update Realistic Landscape Animations (Wind Turbines, Fireflies, Wildlife & Pond)
      if (landscapeRef.current?.userData?.update) {
        landscapeRef.current.userData.update(delta);
      }

      // 6. Update 3D Advertisement Billboards: Borders glow when rover arrives!
      const timeSec = now * 0.001;
      waypoints.forEach((wp) => {
        const isActive = (activeStationIdRef.current === wp.id);
        if (wp.updateGlow) {
          wp.updateGlow(isActive, delta, timeSec);
        }
      });

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    // 10. Clean Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      audioEngine.stopRoverEngine();
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

      {/* UNIFIED TOP TELEMETRY & CONTROLS HEADER (Zero collision on all viewports) */}
      <header className="absolute top-2 sm:top-4 inset-x-2 sm:inset-x-6 z-35 pointer-events-auto flex items-center justify-between gap-1.5 sm:gap-2 max-w-[1920px] mx-auto select-none">
        
        {/* Left: Home Button (Replaces "Hero View" with clean "Home" + Home icon) */}
        {onReturnHome && (
          <button
            onClick={onReturnHome}
            disabled={isExiting}
            className={`group flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 min-h-[34px] sm:min-h-[38px] rounded-full backdrop-blur-md shadow-lg active:scale-95 transition-all font-mono text-[11px] sm:text-xs font-bold cursor-pointer disabled:opacity-50 shrink-0 border ${
              isNightMode
                ? 'bg-[#0E1626]/90 border-cyan-500/40 text-cyan-200 hover:bg-[#15233D]'
                : 'bg-[#292B27]/95 border-[#B17B53]/50 text-[#F4EBDD] hover:bg-[#1E201D]'
            }`}
            title="Return to Portfolio Home"
          >
            <Home className="w-3.5 h-3.5 text-[#B17B53] transition-transform group-hover:scale-110" />
            <span className="tracking-wider uppercase text-[10.5px] sm:text-xs">
              {isExiting ? '...' : 'Home'}
            </span>
          </button>
        )}

        {/* Center: System Status Badge (Hidden on mobile to keep bar spacious) */}
        <div className={`hidden md:flex items-center space-x-2 backdrop-blur-md px-3 py-1.5 rounded-full border shadow-sm text-[10px] font-mono transition-colors ${
          isNightMode
            ? 'bg-[#0E1626]/85 border-cyan-500/30 text-cyan-200'
            : 'bg-[#F4EBDD]/85 border-[#292B27]/15 text-[#292B27]'
        }`}>
          <Compass className="w-3 h-3 text-[#B17B53]" />
          <span className="font-semibold tracking-wider">
            {isNightMode ? 'NIGHT PROVING GROUND // ACTIVE' : '3D CIRCUIT WORLD // 240 MHz'}
          </span>
        </div>

        {/* Right: Sleek, Responsive Controls Cluster with High-Quality Vector Icons */}
        <div className={`flex items-center space-x-1 sm:space-x-2 backdrop-blur-md px-1.5 sm:px-2.5 py-0.5 sm:py-1 min-h-[34px] sm:min-h-[38px] rounded-full border shadow-lg text-xs font-mono transition-colors shrink-0 max-w-full ${
          isNightMode
            ? 'bg-[#0E1626]/90 border-cyan-400/40 text-[#F1F5F9]'
            : 'bg-[#292B27]/90 border-[#B17B53]/50 text-[#F4EBDD]'
        }`}>
          
          {/* Day / Night Mode Switcher with High-Quality Sun / Moon Icons */}
          <button
            onClick={toggleNightMode}
            className={`w-7 h-7 sm:w-8.5 sm:h-8.5 flex items-center justify-center rounded-full transition-all cursor-pointer active:scale-90 shrink-0 ${
              isNightMode
                ? 'bg-blue-950/80 text-cyan-300 border border-cyan-400/60 shadow-[0_0_8px_rgba(56,189,248,0.4)]'
                : 'bg-amber-500/20 text-amber-300 border border-amber-400/50 hover:bg-amber-500/30'
            }`}
            title={isNightMode ? 'Switch to Warm Golden Day Mode' : 'Switch to Starlit Midnight Mode'}
          >
            {isNightMode ? (
              <Moon className="w-3.5 h-3.5 fill-cyan-300/30" />
            ) : (
              <Sun className="w-3.5 h-3.5 fill-amber-400/30" />
            )}
          </button>

          <span className="text-white/20 text-[10px] select-none">|</span>

          {/* POV Camera Mode Switcher (Fully responsive on mobile, high quality Camera icon) */}
          <button
            onClick={cyclePOV}
            className={`flex items-center space-x-1 px-1.5 sm:px-2.5 py-1 min-h-[28px] sm:min-h-[32px] rounded-full text-[9px] sm:text-[10px] uppercase font-bold tracking-wider transition-all cursor-pointer active:scale-90 shrink-0 ${
              povMode === 'cockpit'
                ? 'bg-rose-900/70 text-rose-200 border border-rose-400/60'
                : povMode === 'aerial'
                ? 'bg-purple-900/70 text-purple-200 border border-purple-400/60'
                : 'bg-white/10 text-[#F4EBDD] border border-white/20 hover:bg-white/20'
            }`}
            title="Cycle Camera View: Chase -> Cockpit -> Aerial"
          >
            <Camera className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#B17B53]" />
            <span className="text-[9px] sm:text-[9.5px]">
              {povMode === 'chase' ? 'CHASE' : povMode === 'cockpit' ? 'HOOD' : 'ORBIT'}
            </span>
          </button>

          <span className="text-white/20 text-[10px] select-none">|</span>

          {/* Autopilot Cruise Button (Fully responsive on mobile, high quality Play / Pause icon) */}
          <button
            onClick={() => setIsCruising(!isCruising)}
            className={`flex items-center space-x-1 px-1.5 sm:px-2.5 py-1 min-h-[28px] sm:min-h-[32px] rounded-full text-[9px] sm:text-[10px] uppercase font-bold tracking-wider transition-all cursor-pointer active:scale-90 shrink-0 ${
              isCruising 
                ? (isNightMode ? 'bg-cyan-400 text-slate-950 shadow-sm font-extrabold' : 'bg-[#B17B53] text-[#292B27] shadow-sm font-extrabold')
                : 'text-white/80 bg-white/10 hover:text-white hover:bg-white/20'
            }`}
            title={isCruising ? 'Pause Autonomous Rover' : 'Start Autonomous Rover Cruise'}
          >
            {isCruising ? (
              <Pause className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current" />
            ) : (
              <Play className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current ml-0.5" />
            )}
            <span className="text-[9px] sm:text-[9.5px]">{isCruising ? 'PAUSE' : 'AUTO'}</span>
          </button>

          {/* Help & Instruction Trigger (Hidden on ultra-narrow mobile to prioritize core driving controls) */}
          <span className="hidden sm:inline text-white/20 text-[10px] select-none">|</span>
          <button
            onClick={() => {
              audioEngine.playClick();
              setShowNavInstruction((prev) => !prev);
            }}
            className={`hidden sm:flex w-7 h-7 sm:w-8 sm:h-8 items-center justify-center rounded-full transition-all cursor-pointer active:scale-90 shrink-0 ${
              showNavInstruction
                ? 'bg-amber-400 text-slate-950 font-bold'
                : 'text-white/80 bg-white/10 hover:text-white hover:bg-white/20'
            }`}
            title="Show Mobile Navigation Guide"
            aria-label="Navigation Guide"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* PROFESSIONAL, SLEEK & MINIMAL "BACK TO ROVER" BUTTON */}
      {(isPondView || focusedBillboard) && (
        <button
          onClick={() => {
            audioEngine.playClick();
            if (isPondView) {
              setIsPondView(false);
              isPondViewRef.current = false;
            }
            if (focusedBillboard) {
              setFocusedBillboard(null);
              focusedBillboardRef.current = null;
            }
          }}
          className={`absolute top-14 sm:top-18 left-1/2 -translate-x-1/2 z-35 flex items-center space-x-1.5 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full backdrop-blur-md shadow-xl border transition-all duration-200 cursor-pointer font-mono text-[11px] sm:text-xs font-semibold tracking-wider uppercase active:scale-95 pointer-events-auto group ${
            isNightMode
              ? 'bg-[#0E1626]/95 border-cyan-500/50 text-cyan-200 hover:bg-[#15233D] hover:border-cyan-400'
              : 'bg-[#292B27]/95 border-[#B17B53]/60 text-[#F4EBDD] hover:bg-[#1E201D] hover:border-[#B17B53]'
          }`}
          title="Return Camera to Rover"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#B17B53] transition-transform group-hover:-translate-x-0.5" />
          <span>Back to Rover</span>
        </button>
      )}

      {/* COMPACT WAYPOINT QUICK-JUMP CAPSULE (Significantly reduced width, zero scrollbar) */}
      <div className={`absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-1 sm:space-x-1.5 backdrop-blur-md px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full border shadow-xl text-xs font-mono max-w-[92vw] sm:max-w-fit overflow-x-auto transition-colors duration-500 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ${
        isNightMode
          ? 'bg-[#0E1626]/95 border-cyan-500/30 text-[#F1F5F9]'
          : 'bg-[#F4EBDD]/95 border-[#292B27]/25 text-[#292B27]'
      }`}>
        <div className="flex items-center space-x-1 px-1 shrink-0">
          <MapPin className={`w-3 h-3 ${isNightMode ? 'text-cyan-400' : 'text-[#B17B53]'}`} />
          <span className={`text-[9.5px] font-bold uppercase tracking-wider hidden xs:inline ${isNightMode ? 'text-cyan-400' : 'text-[#89634C]'}`}>
            WAYPOINTS:
          </span>
        </div>

        {PROJECTS_DATA.map((p, idx) => {
          const isActive = currentWaypointId === p.id;
          return (
            <button
              key={p.id}
              onClick={() => jumpToWaypoint(idx)}
              className={`px-2.5 py-1 min-h-[32px] sm:min-h-[34px] flex items-center justify-center rounded-full transition-all cursor-pointer font-bold shrink-0 text-[10px] sm:text-[11px] active:scale-95 ${
                isActive
                  ? (isNightMode ? 'bg-cyan-400 text-slate-950 shadow-sm font-extrabold' : 'bg-[#292B27] text-[#F4EBDD] shadow-sm font-extrabold')
                  : (isNightMode ? 'hover:bg-cyan-400/10 text-slate-300 bg-white/5' : 'hover:bg-[#292B27]/10 text-[#292B27]/75 bg-[#292B27]/5')
              }`}
              title={p.title}
            >
              {isActive ? (
                <span className="flex items-center space-x-1">
                  <span>{p.number}.</span>
                  <span className="hidden sm:inline">{p.title}</span>
                  <span className="sm:hidden">{p.title.split(' ')[0]}</span>
                </span>
              ) : (
                <span>{p.number}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Navigation Hint - Hidden when at a waypoint to keep bottom clean and zero overlap */}
      {!currentWaypointId && (
        <div className={`absolute bottom-16 sm:bottom-5 right-1/2 translate-x-1/2 sm:translate-x-0 sm:right-5 z-20 flex items-center space-x-1.5 backdrop-blur-xs px-2.5 py-1 rounded-md text-[9px] font-mono border pointer-events-none transition-colors duration-500 whitespace-nowrap shadow-sm ${
          isNightMode
            ? 'bg-[#0E1626]/85 text-cyan-300 border-cyan-500/30'
            : 'bg-[#292B27]/80 text-[#E9DDC7] border-[#292B27]/40'
        }`}>
          <MoveHorizontal className="w-3 h-3 text-[#B17B53]" />
          <span className="hidden sm:inline">SWIPE / DRAG / SCROLL TO NAVIGATE ROVER</span>
          <span className="sm:hidden">SWIPE TO STEER ROVER</span>
        </div>
      )}

      {/* MOBILE & INTERACTIVE NAVIGATION INSTRUCTION OVERLAY (Auto-fades in 4.8s or dismisses on swipe/tap) */}
      {showNavInstruction && (
        <div 
          onClick={dismissInstruction}
          className="absolute inset-0 z-40 flex items-center justify-center p-4 pointer-events-auto bg-black/35 backdrop-blur-[2px] animate-fadeIn transition-opacity select-none"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-[290px] sm:max-w-[340px] w-full bg-[#F4EBDD] border-2 border-[#292B27] rounded-xl p-4 sm:p-5 shadow-2xl text-[#292B27] text-center"
            style={{
              boxShadow: '0 20px 45px rgba(41, 43, 39, 0.45), inset 0 0 30px rgba(233, 221, 199, 0.5)',
            }}
          >
            <button
              onClick={dismissInstruction}
              className="absolute top-2.5 right-2.5 w-6 h-6 flex items-center justify-center rounded-md hover:bg-[#292B27] hover:text-[#F4EBDD] transition-colors text-[#292B27] cursor-pointer"
              aria-label="Close guide"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            {/* Pulsing Animated Gesture Icon */}
            <div className="mx-auto w-11 h-11 rounded-full bg-[#E9DDC7] border border-[#292B27]/25 flex items-center justify-center mb-2.5 shadow-inner">
              <MoveHorizontal className="w-5 h-5 text-[#B17B53] animate-pulse" />
            </div>

            <span className="font-mono text-[9px] uppercase tracking-widest text-[#89634C] font-bold">
              ROVER CONTROL // MANUAL
            </span>
            <h4 className="font-serif text-lg font-bold text-[#292B27] mt-0.5 mb-2.5">
              3D Circuit World
            </h4>

            <div className="space-y-2 text-[10.5px] font-mono text-left bg-[#E9DDC7]/80 p-2.5 rounded-lg border border-[#292B27]/20">
              <div className="flex items-start space-x-2">
                <span className="w-4.5 h-4.5 rounded bg-[#292B27] text-[#F4EBDD] flex items-center justify-center font-bold text-[9px] shrink-0 mt-0.5">1</span>
                <p className="leading-tight">
                  <strong className="text-[#292B27]">Swipe / Drag</strong> anywhere on screen to steer the rover along the circuit track.
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <span className="w-4.5 h-4.5 rounded bg-[#292B27] text-[#F4EBDD] flex items-center justify-center font-bold text-[9px] shrink-0 mt-0.5">2</span>
                <p className="leading-tight">
                  <strong className="text-[#292B27]">Tap Waypoint (01–05)</strong> at bottom to instantly jump to each engineering lab station.
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <span className="w-4.5 h-4.5 rounded bg-[#292B27] text-[#F4EBDD] flex items-center justify-center font-bold text-[9px] shrink-0 mt-0.5">3</span>
                <p className="leading-tight">
                  <strong className="text-[#292B27]">Download Blueprint</strong> on any project card to export full technical specs.
                </p>
              </div>
            </div>

            <button
              onClick={dismissInstruction}
              className="mt-3.5 w-full py-2 px-3 rounded bg-[#292B27] text-[#F4EBDD] hover:bg-[#1E201D] font-mono text-[11px] font-bold uppercase tracking-wider transition-transform active:scale-95 cursor-pointer shadow-sm"
            >
              Start Exploring →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
