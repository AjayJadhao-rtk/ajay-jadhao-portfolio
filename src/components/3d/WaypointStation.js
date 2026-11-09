import * as THREE from 'three';
import { PROJECTS_DATA } from '../../data/projectsData';

/**
 * Procedurally generates physical 3D Lab Stations along the curve for every project in PROJECTS_DATA.
 * Completely scalable: adding new experiments to projectsData.js automatically spawns new stations!
 */
export function spawnWaypointStations(curve, customProjects = null) {
  const projectsData = customProjects || PROJECTS_DATA;
  const stationsGroup = new THREE.Group();
  stationsGroup.name = 'WaypointStations';

  const waypoints = [];
  const total = projectsData.length;
  const up = new THREE.Vector3(0, 1, 0);

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
      color: 0xE9DDC7, // Aged parchment concrete
      roughness: 0.8,
      metalness: 0.1,
      flatShading: true,
    });
    const platform = new THREE.Mesh(hexGeom, hexMat);
    platform.receiveShadow = true;
    stationObj.add(platform);

    // 4. Glowing Circular Circuit Pad
    const padGeom = new THREE.RingGeometry(1.2, 2.8, 32);
    const padMat = new THREE.MeshBasicMaterial({
      color: brandColor,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7,
    });
    const pad = new THREE.Mesh(padGeom, padMat);
    pad.rotation.x = -Math.PI / 2;
    pad.position.y = 0.26;
    stationObj.add(pad);

    // 5. Central Telemetry Pylon / Tower
    const pylonGeom = new THREE.BoxGeometry(0.8, 3.8, 0.8);
    const pylonMat = new THREE.MeshStandardMaterial({
      color: 0x292B27, // Charcoal
      roughness: 0.4,
      metalness: 0.7,
      flatShading: true,
    });
    const pylon = new THREE.Mesh(pylonGeom, pylonMat);
    pylon.position.y = 2.0;
    pylon.castShadow = true;
    stationObj.add(pylon);

    // Solar Wings / Telemetry Antennas
    const solarGeom = new THREE.BoxGeometry(2.4, 0.1, 0.8);
    const solarMat = new THREE.MeshStandardMaterial({
      color: 0x626B50, // Muted olive
      metalness: 0.8,
    });
    const solarWing = new THREE.Mesh(solarGeom, solarMat);
    solarWing.position.y = 3.2;
    stationObj.add(solarWing);

    // 6. Floating Holographic Schematic Core
    const holoGeom = new THREE.IcosahedronGeometry(0.7, 1);
    const holoMat = new THREE.MeshBasicMaterial({
      color: brandColor,
      wireframe: true,
      transparent: true,
      opacity: 0.85,
    });
    const hologram = new THREE.Mesh(holoGeom, holoMat);
    hologram.position.y = 4.6;
    stationObj.add(hologram);

    // Station Beacon Light
    const beaconLight = new THREE.PointLight(brandColor, 1.2, 12);
    beaconLight.position.set(0, 4.6, 0);
    stationObj.add(beaconLight);

    // 7. Ground Circuit Spur connecting Station to Main Track
    const spurGeom = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0.1, 0),
      stationOffset.clone().negate().setY(0.1),
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
      radius: 5.2, // Proximity trigger radius
      hologram,
    });
  });

  return { stationsGroup, waypoints };
}
