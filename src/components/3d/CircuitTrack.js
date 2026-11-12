import * as THREE from 'three';

/**
 * Creates the continuous 3D Catmull-Rom spline circuit track.
 * The curve winds through the landscape with gentle loops and elevation contours.
 */
export function createCircuitCurve(waypointCount = 5) {
  // Key control points forming a continuous, organic circuit loop
  const points = [
    new THREE.Vector3(0, 0.4, 0),
    new THREE.Vector3(25, 1.2, 18),
    new THREE.Vector3(42, 2.5, -8),
    new THREE.Vector3(28, 3.8, -38),
    new THREE.Vector3(-10, 2.8, -50),
    new THREE.Vector3(-45, 1.6, -32),
    new THREE.Vector3(-55, 0.8, 8),
    new THREE.Vector3(-35, 1.5, 38),
    new THREE.Vector3(-5, 0.6, 32),
  ];

  // Catmull-Rom spline with closed loop
  const curve = new THREE.CatmullRomCurve3(points, true, 'centripetal', 0.5);
  return curve;
}

/**
 * Builds the visual 3D mesh representation of the circuit track:
 * 1. Base dark charcoal road ribbon with curb bevels
 * 2. Dual Parallel Circuit Traces (Warm bronze in Day -> Luminous Cyan in Night)
 * 3. Proving Ground Reflectors along track curves
 */
export function buildCircuitTrackMesh(curve) {
  const trackGroup = new THREE.Group();
  trackGroup.name = 'CircuitTrack';

  // 1. Base Track Extrusion
  const segments = 400;
  const trackWidth = 3.4;

  const points = curve.getSpacedPoints(segments);
  const trackGeom = new THREE.BufferGeometry();

  const vertices = [];
  const indices = [];
  const uvs = [];

  const up = new THREE.Vector3(0, 1, 0);

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const pt = curve.getPointAt(t);
    const tangent = curve.getTangentAt(t).normalize();
    const normal = new THREE.Vector3().crossVectors(tangent, up).normalize();

    // Left and right track edge
    const leftPt = new THREE.Vector3().addVectors(pt, normal.clone().multiplyScalar(trackWidth / 2));
    const rightPt = new THREE.Vector3().addVectors(pt, normal.clone().multiplyScalar(-trackWidth / 2));

    vertices.push(leftPt.x, leftPt.y, leftPt.z);
    vertices.push(rightPt.x, rightPt.y, rightPt.z);

    uvs.push(0, t * 20);
    uvs.push(1, t * 20);

    if (i < segments) {
      const idx = i * 2;
      indices.push(idx, idx + 1, idx + 2);
      indices.push(idx + 1, idx + 3, idx + 2);
    }
  }

  trackGeom.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  trackGeom.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  trackGeom.setIndex(indices);
  trackGeom.computeVertexNormals();

  // Dark charcoal asphalt/circuit board substrate
  const trackMat = new THREE.MeshStandardMaterial({
    color: 0x1E201D,
    roughness: 0.65,
    metalness: 0.25,
  });

  const baseMesh = new THREE.Mesh(trackGeom, trackMat);
  baseMesh.receiveShadow = true;
  trackGroup.add(baseMesh);

  // 2. Dual Glowing Circuit Traces (Responsive to Day / Night)
  const traceMat = new THREE.MeshStandardMaterial({
    color: 0xB17B53, // Warm bronze
    emissive: 0xB17B53,
    emissiveIntensity: 0.4,
    roughness: 0.3,
    metalness: 0.8,
  });

  const traceLeftCurve = new THREE.TubeGeometry(
    new OffsetCurve(curve, 1.0, 0.08),
    300,
    0.055,
    6,
    true
  );
  const traceRightCurve = new THREE.TubeGeometry(
    new OffsetCurve(curve, -1.0, 0.08),
    300,
    0.055,
    6,
    true
  );

  const leftTraceMesh = new THREE.Mesh(traceLeftCurve, traceMat);
  const rightTraceMesh = new THREE.Mesh(traceRightCurve, traceMat);

  trackGroup.add(leftTraceMesh);
  trackGroup.add(rightTraceMesh);

  // 3. Track Edge Retroreflectors at regular intervals
  const reflectorCount = 36;
  const reflectorGeom = new THREE.CylinderGeometry(0.08, 0.08, 0.4, 6);
  const reflectorMat = new THREE.MeshStandardMaterial({
    color: 0xD97706, // Amber reflector
    emissive: 0xD97706,
    emissiveIntensity: 0.3,
    roughness: 0.2,
  });

  for (let r = 0; r < reflectorCount; r++) {
    const t = r / reflectorCount;
    const pt = curve.getPointAt(t);
    const tangent = curve.getTangentAt(t).normalize();
    const normal = new THREE.Vector3().crossVectors(tangent, up).normalize();

    // Alternate left and right edge
    const side = r % 2 === 0 ? 1 : -1;
    const pos = pt.clone().add(normal.clone().multiplyScalar(side * (trackWidth / 2 + 0.15)));

    const post = new THREE.Mesh(reflectorGeom, reflectorMat);
    post.position.set(pos.x, pos.y + 0.2, pos.z);
    trackGroup.add(post);
  }

  // Time of Day transition handler
  trackGroup.userData = {
    setNightTransition: (nightT) => {
      // Shift trace material from warm bronze to electric cyan glow in Night Mode
      const dayColor = new THREE.Color(0xB17B53);
      const nightColor = new THREE.Color(0x38BDF8); // Electric cyan

      traceMat.color.lerpColors(dayColor, nightColor, nightT);
      traceMat.emissive.lerpColors(dayColor, nightColor, nightT);
      traceMat.emissiveIntensity = 0.4 + nightT * 1.4;

      reflectorMat.emissiveIntensity = 0.3 + nightT * 0.9;
    },
  };

  return trackGroup;
}

/**
 * Helper class to calculate parallel offset curves for circuit traces
 */
class OffsetCurve extends THREE.Curve {
  constructor(baseCurve, offsetDistance, yOffset = 0) {
    super();
    this.baseCurve = baseCurve;
    this.offsetDistance = offsetDistance;
    this.yOffset = yOffset;
    this.up = new THREE.Vector3(0, 1, 0);
  }

  getPoint(t) {
    const pt = this.baseCurve.getPoint(t);
    const tangent = this.baseCurve.getTangent(t).normalize();
    const normal = new THREE.Vector3().crossVectors(tangent, this.up).normalize();
    const offset = normal.multiplyScalar(this.offsetDistance);
    return new THREE.Vector3(pt.x + offset.x, pt.y + this.yOffset, pt.z + offset.z);
  }
}
