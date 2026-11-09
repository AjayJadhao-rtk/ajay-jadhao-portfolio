import * as THREE from 'three';

/**
 * RoverVehicle creates an autonomous exploration robot representing Ajay's robotics expertise.
 * Features:
 * - Low-poly faceted engineering chassis in charcoal (#292B27) & copper (#B17B53)
 * - 4 independent wheels that spin based on movement
 * - Rotating top LiDAR/camera sensor mast
 * - Front LED exploration headlights
 */
export class RoverVehicle {
  constructor() {
    this.mesh = new THREE.Group();
    this.mesh.name = 'AutonomousRover';

    this.wheels = [];
    this.turret = null;
    this.headlights = [];

    this.buildRover();
  }

  buildRover() {
    // 1. Main Chassis Box
    const chassisGeom = new THREE.BoxGeometry(1.6, 0.65, 2.4);
    const chassisMat = new THREE.MeshStandardMaterial({
      color: 0x292B27, // Charcoal
      roughness: 0.5,
      metalness: 0.6,
      flatShading: true,
    });
    const chassis = new THREE.Mesh(chassisGeom, chassisMat);
    chassis.position.y = 0.6;
    chassis.castShadow = true;
    this.mesh.add(chassis);

    // 2. Copper Upper Roll Cage & Electronics Deck
    const deckGeom = new THREE.BoxGeometry(1.2, 0.4, 1.6);
    const deckMat = new THREE.MeshStandardMaterial({
      color: 0xB17B53, // Muted Copper
      roughness: 0.4,
      metalness: 0.7,
      flatShading: true,
    });
    const deck = new THREE.Mesh(deckGeom, deckMat);
    deck.position.set(0, 1.0, -0.2);
    deck.castShadow = true;
    this.mesh.add(deck);

    // 3. Rotating LiDAR / Ultrasonic Sensor Mast
    const turretGroup = new THREE.Group();
    turretGroup.position.set(0, 1.35, -0.2);

    const mastGeom = new THREE.CylinderGeometry(0.08, 0.08, 0.4, 8);
    const mastMat = new THREE.MeshStandardMaterial({ color: 0x1E201D });
    const mast = new THREE.Mesh(mastGeom, mastMat);
    turretGroup.add(mast);

    const sensorGeom = new THREE.CylinderGeometry(0.25, 0.25, 0.22, 12);
    const sensorMat = new THREE.MeshStandardMaterial({
      color: 0x3D403A,
      roughness: 0.3,
    });
    const sensorHead = new THREE.Mesh(sensorGeom, sensorMat);
    sensorHead.position.y = 0.25;
    sensorHead.rotation.x = Math.PI / 2;
    turretGroup.add(sensorHead);

    // Glowing sensor optic eye
    const lensGeom = new THREE.SphereGeometry(0.09, 8, 8);
    const lensMat = new THREE.MeshBasicMaterial({ color: 0x4ADE80 }); // Emerald scan
    const lens = new THREE.Mesh(lensGeom, lensMat);
    lens.position.set(0, 0.25, 0.22);
    turretGroup.add(lens);

    this.turret = turretGroup;
    this.mesh.add(turretGroup);

    // 4. Heavy Tread Wheels (4 wheels)
    const wheelGeom = new THREE.CylinderGeometry(0.42, 0.42, 0.35, 14);
    const wheelMat = new THREE.MeshStandardMaterial({
      color: 0x1C2822, // Deep forest charcoal
      roughness: 0.8,
      metalness: 0.2,
      flatShading: true,
    });
    const hubMat = new THREE.MeshStandardMaterial({
      color: 0xD49B55, // Amber gold hub
      metalness: 0.8,
    });
    const hubGeom = new THREE.CylinderGeometry(0.18, 0.18, 0.38, 8);

    const wheelOffsets = [
      { x: -0.95, y: 0.42, z: 0.75 },  // Front Left
      { x: 0.95, y: 0.42, z: 0.75 },   // Front Right
      { x: -0.95, y: 0.42, z: -0.75 }, // Rear Left
      { x: 0.95, y: 0.42, z: -0.75 },  // Rear Right
    ];

    wheelOffsets.forEach((pos) => {
      const wGroup = new THREE.Group();
      wGroup.position.set(pos.x, pos.y, pos.z);

      const tire = new THREE.Mesh(wheelGeom, wheelMat);
      tire.rotation.z = Math.PI / 2;
      tire.castShadow = true;
      wGroup.add(tire);

      const hub = new THREE.Mesh(hubGeom, hubMat);
      hub.rotation.z = Math.PI / 2;
      wGroup.add(hub);

      this.mesh.add(wGroup);
      this.wheels.push(wGroup);
    });

    // 5. Front LED Headlights
    const lightGeom = new THREE.CylinderGeometry(0.12, 0.12, 0.1, 8);
    const lightMat = new THREE.MeshBasicMaterial({ color: 0xFDE047 }); // Warm yellow LED

    [-0.5, 0.5].forEach((lx) => {
      const lamp = new THREE.Mesh(lightGeom, lightMat);
      lamp.position.set(lx, 0.65, 1.22);
      lamp.rotation.x = Math.PI / 2;
      this.mesh.add(lamp);
    });

    // Scale to appropriate proportions on track
    this.mesh.scale.set(0.9, 0.9, 0.9);
  }

  /**
   * Updates rover position and orientation along the curve.
   */
  update(curve, t, delta = 0.016, speed = 0) {
    if (!curve) return;

    // Sample current point and slightly ahead point for look-ahead tangent
    const point = curve.getPointAt(t);
    const aheadT = (t + 0.005) % 1;
    const aheadPoint = curve.getPointAt(aheadT);

    // Position rover on track
    this.mesh.position.copy(point);

    // Orient rover facing the movement direction
    this.mesh.lookAt(aheadPoint);

    // Rotate wheels dynamically based on motion
    this.wheels.forEach((w) => {
      w.rotation.x += speed * 40 * delta;
    });

    // Slowly rotate top LiDAR sensor
    if (this.turret) {
      this.turret.rotation.y += 2.5 * delta;
    }
  }
}
