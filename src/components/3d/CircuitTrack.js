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
 * 1. Base dark charcoal road ribbon
 * 2. Glowing copper/gold dual circuit traces running parallel
 * 3. Steampunk track ties / sleeper nodes
 */
export function buildCircuitTrackMesh(curve) {
  const trackGroup = new THREE.Group();
  trackGroup.name = 'CircuitTrack';

  // 1. Base Track Extrusion
  const segments = 400;
  const trackWidth = 3.2;
  const trackThickness = 0.25;

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
    color: 0x222421,
    roughness: 0.7,
    metalness: 0.3,
  });

  const baseMesh = new THREE.Mesh(trackGeom, trackMat);
  baseMesh.receiveShadow = true;
  trackGroup.add(baseMesh);

  // 2. Dual Glowing Copper Circuit Traces
  const traceMat = new THREE.MeshBasicMaterial({
    color: 0xB17B53,
  });

  const traceLeftCurve = new THREE.TubeGeometry(
    new OffsetCurve(curve, 0.9, 0.08),
    300,
    0.05,
    6,
    true
  );
  const traceRightCurve = new THREE.TubeGeometry(
    new OffsetCurve(curve, -0.9, 0.08),
    300,
    0.05,
    6,
    true
  );

  trackGroup.add(new THREE.Mesh(traceLeftCurve, traceMat));
  trackGroup.add(new THREE.Mesh(traceRightCurve, traceMat));

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
