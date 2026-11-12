import * as THREE from 'three';
import { PROJECTS_DATA } from '../../data/projectsData';

/**
 * Procedurally generates physical 3D Lab Stations along the curve for every project in PROJECTS_DATA.
 * Features:
 * - Hexagonal engineering platform with glowing circuit perimeter ring
 * - Central Telemetry Pylon with solar wings
 * - Floating Holographic Schematic Core
 * - Vertical Sci-Fi Hologram Sky Beacon (Dramatically illuminates night sky)
 * - Seamless Day / Night mode transition
 */
export function spawnWaypointStations(curve, customProjects = null) {
  const projectsData = customProjects || PROJECTS_DATA;
  const stationsGroup = new THREE.Group();
  stationsGroup.name = 'WaypointStations';

  const waypoints = [];
  const total = projectsData.length;
  const up = new THREE.Vector3(0, 1, 0);

  const beaconBeams = [];
  const pointLights = [];
  const holograms = [];

  projectsData.forEach((project, idx) => {
    // 1. Calculate progression along track dynamically
    const progress = (idx / total) % 1;
    const trackPoint = curve.getPointAt(progress);
    const tangent = curve.getTangentAt(progress).normalize();
    const normal = new THREE.Vector3().crossVectors(tangent, up).normalize();

    // Alternate sides of the track (left/right) for visual balance
    const side = idx % 2 === 0 ? 1 : -1;
    const stationOffset = normal.clone().multiplyScalar(side * 5.4);
    const stationPos = trackPoint.clone().add(stationOffset);

    // 2. Create Station 3D Container
    const stationObj = new THREE.Group();
    stationObj.position.copy(stationPos);
    stationObj.position.y = trackPoint.y;

    const brandColor = new THREE.Color(project.color || 0xB17B53);

    // 3. Hexagonal Foundation Platform
    const hexGeom = new THREE.CylinderGeometry(3.2, 3.6, 0.5, 6);
    const hexMat = new THREE.MeshStandardMaterial({
      color: 0xE2D6C0, // Aged parchment concrete
      roughness: 0.75,
      metalness: 0.15,
      flatShading: true,
    });
    const platform = new THREE.Mesh(hexGeom, hexMat);
    platform.receiveShadow = true;
    stationObj.add(platform);

    // 4. Glowing Circular Circuit Pad
    const padGeom = new THREE.RingGeometry(1.2, 2.9, 32);
    const padMat = new THREE.MeshStandardMaterial({
      color: brandColor,
      emissive: brandColor,
      emissiveIntensity: 0.5,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8,
    });
    const pad = new THREE.Mesh(padGeom, padMat);
    pad.rotation.x = -Math.PI / 2;
    pad.position.y = 0.26;
    stationObj.add(pad);

    // 5. Central Telemetry Pylon / Tower
    const pylonGeom = new THREE.BoxGeometry(0.85, 4.0, 0.85);
    const pylonMat = new THREE.MeshStandardMaterial({
      color: 0x242823, // Deep charcoal steel
      roughness: 0.4,
      metalness: 0.75,
      flatShading: true,
    });
    const pylon = new THREE.Mesh(pylonGeom, pylonMat);
    pylon.position.y = 2.0;
    pylon.castShadow = true;
    stationObj.add(pylon);

    // Solar Wings / Telemetry Antennas
    const solarGeom = new THREE.BoxGeometry(2.6, 0.12, 0.85);
    const solarMat = new THREE.MeshStandardMaterial({
      color: 0x556045, // Muted olive solar cell
      metalness: 0.85,
    });
    const solarWing = new THREE.Mesh(solarGeom, solarMat);
    solarWing.position.y = 3.3;
    stationObj.add(solarWing);

    // 6. Floating Holographic Schematic Core
    const holoGeom = new THREE.IcosahedronGeometry(0.75, 1);
    const holoMat = new THREE.MeshBasicMaterial({
      color: brandColor,
      wireframe: true,
      transparent: true,
      opacity: 0.85,
    });
    const hologram = new THREE.Mesh(holoGeom, holoMat);
    hologram.position.y = 4.8;
    stationObj.add(hologram);
    holograms.push(hologram);

    // Station Local PointLight
    const beaconLight = new THREE.PointLight(brandColor, 1.2, 14, 1.2);
    beaconLight.position.set(0, 4.8, 0);
    stationObj.add(beaconLight);
    pointLights.push(beaconLight);

    // 7. Vertical Sci-Fi Sky Beacon Beam
    const beamGeom = new THREE.CylinderGeometry(0.6, 1.8, 28, 16, 1, true);
    const beamMat = new THREE.MeshBasicMaterial({
      color: brandColor,
      transparent: true,
      opacity: 0.12,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const beam = new THREE.Mesh(beamGeom, beamMat);
    beam.position.y = 14;
    stationObj.add(beam);
    beaconBeams.push(beam);

    // 8. Ground Circuit Spur connecting Station to Main Track
    const spurGeom = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0.12, 0),
      stationOffset.clone().negate().setY(0.12),
    ]);
    const spurMat = new THREE.LineBasicMaterial({
      color: brandColor,
      linewidth: 2,
    });
    stationObj.add(new THREE.Line(spurGeom, spurMat));

    stationsGroup.add(stationObj);

    // Store metadata for distance testing and HUD interaction
    waypoints.push({
      id: project.id,
      index: idx,
      progress,
      project,
      position: stationPos,
      radius: 5.2,
      hologram,
    });
  });

  // Time of Day transition handler
  stationsGroup.userData = {
    setNightTransition: (nightT) => {
      // Light up beacons and sky beams in Night Mode
      pointLights.forEach((light) => {
        light.intensity = 1.0 + nightT * 1.5;
        light.distance = 14 + nightT * 6;
      });

      beaconBeams.forEach((beam) => {
        beam.material.opacity = 0.1 + nightT * 0.35;
      });

      holograms.forEach((holo) => {
        holo.material.opacity = 0.7 + nightT * 0.3;
      });
    },
  };

  return { stationsGroup, waypoints };
}
