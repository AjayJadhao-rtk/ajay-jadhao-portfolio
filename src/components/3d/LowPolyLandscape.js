import * as THREE from 'three';

/**
 * Builds the realistic low-poly vintage-anime terrain island with:
 * - Hand-calibrated vertex colors (lush meadows, sandy water banks, cliff strata)
 * - Reflective mountain lake reflecting sky & moon
 * - Rotating engineering wind turbines on the ridge
 * - Dual Day/Night Skydome + Twinkling 600-star cosmic starfield + Glowing 3D Moon
 * - Distant telecommunication pylons with flashing red aviation beacons
 * - Low-poly pine & deciduous trees and granite boulders
 * - Floating atmospheric fireflies / data motes
 */
export function buildLowPolyLandscape() {
  const envGroup = new THREE.Group();
  envGroup.name = 'IsometricIsland';

  const animatedTurbineRotors = [];
  const animatedKoiFish = [];
  let starfieldPoints = null;
  let moonMesh = null;
  let waterMesh = null;
  let dayDomeMesh = null;
  let nightDomeMesh = null;
  let firefliesMesh = null;
  let fireflyPositions = [];

  // 1. Faceted Low-Poly Terrain Mesh with Rich Vertex Coloring
  const terrainSize = 230;
  const terrainSegments = 55;
  const terrainGeom = new THREE.PlaneGeometry(terrainSize, terrainSize, terrainSegments, terrainSegments);
  terrainGeom.rotateX(-Math.PI / 2);

  const posAttr = terrainGeom.attributes.position;
  const vertexCount = posAttr.count;
  const colors = new Float32Array(vertexCount * 3);

  // Pre-define color palette for vertex elevation & slope blending
  const colorWaterBank = new THREE.Color(0xD4C4A8); // Wet sandy earth
  const colorMeadowLow = new THREE.Color(0x567146);  // Deep lush meadow green
  const colorMeadowMid = new THREE.Color(0x6E8557);  // Warm anime grassy slope
  const colorMeadowHigh = new THREE.Color(0x869469); // Sunlit plateau green
  const colorCliffLow = new THREE.Color(0x4B5245);   // Weathered rock face
  const colorCliffHigh = new THREE.Color(0x353A32);  // Dark basalt peak
  const colorParchmentRidge = new THREE.Color(0xDFD2BC); // Warm chalk crest

  // Lake center coordinates for basin hollow near NEX-SHIELD station
  const lakeX = -18;
  const lakeZ = 15;
  const pondRadius = 13.5;

  for (let i = 0; i < vertexCount; i++) {
    const x = posAttr.getX(i);
    const z = posAttr.getZ(i);

    const distFromCenter = Math.sqrt(x * x + z * z);
    
    // Base rolling landscape wave
    let y = Math.sin(x * 0.038) * Math.cos(z * 0.038) * 3.2 
          + Math.sin(x * 0.09 + z * 0.07) * 1.1;

    // Carve a natural bowl for the mountain lake
    const distToLake = Math.sqrt((x - lakeX) ** 2 + (z - lakeZ) ** 2);
    if (distToLake < 19) {
      const lakeDepression = Math.cos((distToLake / 19) * (Math.PI / 2)) * 1.9;
      y -= lakeDepression;
    }

    // Mountain perimeter ridges
    if (distFromCenter > 48) {
      y += (distFromCenter - 48) * 0.28;
    }

    posAttr.setY(i, y - 0.4);
  }

  terrainGeom.computeVertexNormals();
  const normalAttr = terrainGeom.attributes.normal;

  // Assign vertex colors based on height and surface normal slope
  const tempColor = new THREE.Color();
  for (let i = 0; i < vertexCount; i++) {
    const x = posAttr.getX(i);
    const z = posAttr.getZ(i);
    const y = posAttr.getY(i);
    const ny = normalAttr.getY(i); // Vertical component of normal (1 = flat ground, 0 = vertical cliff)

    const distToLake = Math.sqrt((x - lakeX) ** 2 + (z - lakeZ) ** 2);

    if (distToLake < 16) {
      // Golden sunlit sand and turquoise shallows underneath blue water
      const shoreT = distToLake / 16;
      tempColor.lerpColors(new THREE.Color(0x93C5FD), new THREE.Color(0xE8D7B8), shoreT);
    } else if (y < 0.2) {
      // Near or under water level
      tempColor.copy(colorWaterBank);
    } else if (ny < 0.65) {
      // Steep slope = exposed rock cliff
      tempColor.lerpColors(colorCliffHigh, colorCliffLow, ny / 0.65);
    } else if (y < 2.5) {
      // Lower meadow
      tempColor.lerpColors(colorMeadowLow, colorMeadowMid, y / 2.5);
    } else if (y < 6.5) {
      // Upper green terrace
      tempColor.lerpColors(colorMeadowMid, colorMeadowHigh, (y - 2.5) / 4.0);
    } else if (y < 11.0) {
      // Highland plateau
      tempColor.lerpColors(colorMeadowHigh, colorParchmentRidge, (y - 6.5) / 4.5);
    } else {
      // High mountain rim
      tempColor.copy(colorCliffHigh);
    }

    // Add subtle procedural variation so facets have rich individual contrast
    const jitter = ((i * 73) % 19 - 9) * 0.003;
    tempColor.r = Math.min(1, Math.max(0, tempColor.r + jitter));
    tempColor.g = Math.min(1, Math.max(0, tempColor.g + jitter));
    tempColor.b = Math.min(1, Math.max(0, tempColor.b + jitter));

    colors[i * 3] = tempColor.r;
    colors[i * 3 + 1] = tempColor.g;
    colors[i * 3 + 2] = tempColor.b;
  }

  terrainGeom.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

  const terrainMat = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.82,
    metalness: 0.06,
    flatShading: true,
  });

  const terrainMesh = new THREE.Mesh(terrainGeom, terrainMat);
  terrainMesh.receiveShadow = true;
  envGroup.add(terrainMesh);

  // 2. Realistic Crystal-Blue Water Pond (Concentric Segmented Disk with Wave Ripples)
  const pondGeom = new THREE.RingGeometry(0.001, pondRadius, 44, 12);
  pondGeom.rotateX(-Math.PI / 2);

  const waterMat = new THREE.MeshStandardMaterial({
    color: 0x38BDF8, // Vibrant crystal sky blue (replaces dark/black pond)
    emissive: 0x0284C7, // Luminous depth cyan (prevents it from ever appearing black)
    emissiveIntensity: 0.28,
    roughness: 0.1, // Smooth, glistening water surface
    metalness: 0.04, // Low metalness ensures rich blue daylight reflection
    transparent: true,
    opacity: 0.88,
    side: THREE.DoubleSide,
  });

  waterMesh = new THREE.Mesh(pondGeom, waterMat);
  waterMesh.position.set(lakeX, 0.08, lakeZ);
  waterMesh.receiveShadow = true;
  waterMesh.userData = { isPond: true, pondCenter: new THREE.Vector3(lakeX, 0.08, lakeZ) };
  envGroup.add(waterMesh);

  // Sandy Shoreline Beach Ring
  const sandRingGeom = new THREE.RingGeometry(pondRadius - 0.4, pondRadius + 2.2, 44, 2);
  sandRingGeom.rotateX(-Math.PI / 2);
  const sandRingMat = new THREE.MeshStandardMaterial({
    color: 0xE8D7B8, // Warm golden anime beach sand
    roughness: 0.9,
    flatShading: true,
  });
  const sandRing = new THREE.Mesh(sandRingGeom, sandRingMat);
  sandRing.position.set(lakeX, 0.05, lakeZ);
  sandRing.receiveShadow = true;
  sandRing.userData = { isPond: true, pondCenter: new THREE.Vector3(lakeX, 0.08, lakeZ) };
  envGroup.add(sandRing);

  // Translucent Frothy Water Foam Edge
  const foamGeom = new THREE.RingGeometry(pondRadius - 0.6, pondRadius + 0.1, 44, 1);
  foamGeom.rotateX(-Math.PI / 2);
  const foamMat = new THREE.MeshBasicMaterial({
    color: 0xE0F2FE, // Pure light water foam
    transparent: true,
    opacity: 0.65,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const foamMesh = new THREE.Mesh(foamGeom, foamMat);
  foamMesh.position.set(lakeX, 0.11, lakeZ);
  foamMesh.userData = { isPond: true, pondCenter: new THREE.Vector3(lakeX, 0.08, lakeZ) };
  envGroup.add(foamMesh);

  // Dedicated touch & raycast hit collider covering the entire pond and its shoreline
  const pondHitGeom = new THREE.CircleGeometry(pondRadius + 2.5, 36);
  pondHitGeom.rotateX(-Math.PI / 2);
  const pondHitMat = new THREE.MeshBasicMaterial({ visible: false });
  const pondHitMesh = new THREE.Mesh(pondHitGeom, pondHitMat);
  pondHitMesh.position.set(lakeX, 0.22, lakeZ);
  pondHitMesh.userData = { isPond: true, pondCenter: new THREE.Vector3(lakeX, 0.08, lakeZ) };
  envGroup.add(pondHitMesh);

  // Floating Water Lilies & Lotus Blossoms on the Pond
  const pondDecorGroup = new THREE.Group();
  pondDecorGroup.position.set(lakeX, 0.12, lakeZ);

  const lilyPadGeom = new THREE.CylinderGeometry(0.75, 0.75, 0.02, 8);
  const lilyPadMat = new THREE.MeshStandardMaterial({
    color: 0x22C55E, // Vibrant lotus green
    roughness: 0.6,
  });

  const lotusPetalGeom = new THREE.ConeGeometry(0.18, 0.32, 5);
  const lotusPetalMat = new THREE.MeshBasicMaterial({ color: 0xF472B6 }); // Sakura pink
  const lotusCoreMat = new THREE.MeshBasicMaterial({ color: 0xFBBF24 }); // Golden stamen

  const lilyOffsets = [
    { x: -3.5, z: 2.5, r: 0.8 },
    { x: -4.2, z: 3.8, r: 0.65 },
    { x: 3.0, z: -2.8, r: 0.9, hasFlower: true },
    { x: 4.2, z: -1.6, r: 0.7 },
    { x: -1.8, z: -4.5, r: 0.85, hasFlower: true },
    { x: 1.5, z: 4.8, r: 0.75, hasFlower: true },
  ];

  lilyOffsets.forEach((lp) => {
    const pad = new THREE.Mesh(lilyPadGeom, lilyPadMat);
    pad.position.set(lp.x, 0, lp.z);
    pad.scale.set(lp.r, 1, lp.r);
    pondDecorGroup.add(pad);

    if (lp.hasFlower) {
      const flower = new THREE.Group();
      flower.position.set(lp.x, 0.12, lp.z);

      const core = new THREE.Mesh(new THREE.SphereGeometry(0.11, 6, 6), lotusCoreMat);
      flower.add(core);

      for (let p = 0; p < 6; p++) {
        const petal = new THREE.Mesh(lotusPetalGeom, lotusPetalMat);
        const angle = (p * Math.PI * 2) / 6;
        petal.position.set(Math.cos(angle) * 0.15, 0.08, Math.sin(angle) * 0.15);
        petal.rotation.x = 0.3;
        petal.rotation.y = angle;
        flower.add(petal);
      }
      pondDecorGroup.add(flower);
    }
  });

  // Clustered shoreline reeds & cattails along water perimeter
  const reedStemGeom = new THREE.CylinderGeometry(0.04, 0.06, 1.8, 4);
  const reedStemMat = new THREE.MeshStandardMaterial({ color: 0x65A30D, roughness: 0.8 });
  const reedHeadGeom = new THREE.CylinderGeometry(0.09, 0.09, 0.45, 5);
  const reedHeadMat = new THREE.MeshStandardMaterial({ color: 0x78350F, roughness: 0.9 });

  const reedClusters = [
    { angle: 0.3, dist: pondRadius + 0.5 },
    { angle: 0.42, dist: pondRadius + 0.9 },
    { angle: 0.52, dist: pondRadius + 0.6 },
    { angle: 2.1, dist: pondRadius + 0.4 },
    { angle: 2.22, dist: pondRadius + 0.8 },
    { angle: 4.25, dist: pondRadius + 0.5 },
    { angle: 4.38, dist: pondRadius + 0.9 },
  ];

  reedClusters.forEach((rc) => {
    const rx = Math.cos(rc.angle) * rc.dist;
    const rz = Math.sin(rc.angle) * rc.dist;

    const stem = new THREE.Mesh(reedStemGeom, reedStemMat);
    stem.position.set(rx, 0.8, rz);
    stem.rotation.z = (Math.random() - 0.5) * 0.2;
    stem.rotation.x = (Math.random() - 0.5) * 0.2;
    pondDecorGroup.add(stem);

    const head = new THREE.Mesh(reedHeadGeom, reedHeadMat);
    head.position.set(rx, 1.45, rz);
    pondDecorGroup.add(head);
  });

  envGroup.add(pondDecorGroup);

  // =========================================================================
  // 2b. ANIMATED KOI FISH SWIMMING IN THE POND
  // Low-poly Japanese Kohaku & Yamabuki Koi with articulated wagging tails
  // =========================================================================
  const fishSchoolGroup = new THREE.Group();
  fishSchoolGroup.name = 'KoiFishSchool';
  envGroup.add(fishSchoolGroup);

  const koiConfigs = [
    { baseColor: 0xEA580C, emissive: 0x9A3412, radius: 4.2, speed: 0.36, phase: 0.0, scale: 1.0 },
    { baseColor: 0xF59E0B, emissive: 0xB45309, radius: 6.5, speed: -0.28, phase: 1.8, scale: 0.9 },
    { baseColor: 0xDC2626, emissive: 0x991B1B, radius: 3.2, speed: 0.42, phase: 3.2, scale: 0.8 },
    { baseColor: 0xFB923C, emissive: 0xC2410C, radius: 8.2, speed: -0.22, phase: 4.5, scale: 1.15 },
    { baseColor: 0xFBBF24, emissive: 0xD97706, radius: 5.4, speed: 0.31, phase: 2.3, scale: 0.85 },
    { baseColor: 0xE11D48, emissive: 0xBE123C, radius: 7.0, speed: -0.25, phase: 5.7, scale: 0.95 },
  ];

  // Geometries for low-poly fish body and articulated fins
  const fishBodyGeom = new THREE.ConeGeometry(0.24, 0.95, 6);
  fishBodyGeom.rotateX(Math.PI / 2); // align forward along Z

  const fishTailGeom = new THREE.BufferGeometry();
  const tailVerts = new Float32Array([
    0, 0, 0,
    0, 0.22, 0.42,
    0, -0.22, 0.42,
    0, 0, 0,
    0, -0.22, 0.42,
    0, 0.22, 0.42,
  ]);
  fishTailGeom.setAttribute('position', new THREE.BufferAttribute(tailVerts, 3));
  fishTailGeom.computeVertexNormals();

  const pectoralFinGeom = new THREE.BufferGeometry();
  const finVerts = new Float32Array([
    0, 0, 0,
    0.28, -0.05, 0.2,
    0.1, -0.05, 0.32,
    0, 0, 0,
    -0.28, -0.05, 0.2,
    -0.1, -0.05, 0.32,
  ]);
  pectoralFinGeom.setAttribute('position', new THREE.BufferAttribute(finVerts, 3));
  pectoralFinGeom.computeVertexNormals();

  koiConfigs.forEach((cfg, idx) => {
    const kGroup = new THREE.Group();

    const fishMat = new THREE.MeshStandardMaterial({
      color: cfg.baseColor,
      emissive: cfg.emissive,
      emissiveIntensity: 0.45,
      roughness: 0.25,
      metalness: 0.15,
      flatShading: true,
    });

    const body = new THREE.Mesh(fishBodyGeom, fishMat);
    body.position.z = 0.15;
    kGroup.add(body);

    // Articulated wagging tail group
    const tailGroup = new THREE.Group();
    tailGroup.position.set(0, 0, -0.32);

    const tailFinMat = new THREE.MeshStandardMaterial({
      color: cfg.baseColor,
      emissive: cfg.emissive,
      emissiveIntensity: 0.5,
      roughness: 0.3,
      side: THREE.DoubleSide,
      flatShading: true,
    });
    const tailFin = new THREE.Mesh(fishTailGeom, tailFinMat);
    tailGroup.add(tailFin);
    kGroup.add(tailGroup);

    // Pectoral side fins
    const finMesh = new THREE.Mesh(pectoralFinGeom, tailFinMat);
    finMesh.position.set(0, -0.02, 0.1);
    kGroup.add(finMesh);

    // Scale
    kGroup.scale.setScalar(cfg.scale);

    fishSchoolGroup.add(kGroup);

    animatedKoiFish.push({
      group: kGroup,
      tailGroup: tailGroup,
      baseRadius: cfg.radius,
      speed: cfg.speed,
      phase: cfg.phase,
      scale: cfg.scale,
      index: idx,
    });
  });

  // =========================================================================
  // 2c. ANIMATED LOW-POLY WILDLIFE (Deer Family, Hopping Bunnies & Pond Ducks)
  // =========================================================================
  const animatedAnimals = [];
  const animalsGroup = new THREE.Group();
  animalsGroup.name = 'LowPolyWildlife';
  envGroup.add(animalsGroup);

  // 1. DEER FAMILY (Buck with branching antlers, Doe, and playful Fawn)
  function createDeer(type = 'buck', scale = 1.0, posX = 0, posZ = 0, rotY = 0) {
    const deer = new THREE.Group();
    deer.position.set(posX, 0.2, posZ);
    deer.rotation.y = rotY;
    deer.scale.setScalar(scale);

    const bodyMat = new THREE.MeshStandardMaterial({
      color: type === 'buck' ? 0x8C522B : type === 'doe' ? 0xA0683A : 0xB88052,
      roughness: 0.85,
      flatShading: true,
    });
    const bellyMat = new THREE.MeshStandardMaterial({
      color: 0xE8D5C0,
      roughness: 0.9,
      flatShading: true,
    });
    const darkMat = new THREE.MeshStandardMaterial({
      color: 0x3D2415,
      roughness: 0.9,
      flatShading: true,
    });
    const antlerMat = new THREE.MeshStandardMaterial({
      color: 0xD6C4AD,
      roughness: 0.8,
      flatShading: true,
    });

    // Main Torso / Body (tapered box)
    const torsoGeom = new THREE.BoxGeometry(0.72, 0.82, 1.45);
    const torso = new THREE.Mesh(torsoGeom, bodyMat);
    torso.position.y = 1.25;
    torso.castShadow = true;
    deer.add(torso);

    // Chest & Rump contouring
    const chestGeom = new THREE.BoxGeometry(0.68, 0.75, 0.5);
    const chest = new THREE.Mesh(chestGeom, bellyMat);
    chest.position.set(0, 1.15, 0.55);
    chest.castShadow = true;
    deer.add(chest);

    // 4 Articulated Slender Legs with Hooves
    const legGeom = new THREE.CylinderGeometry(0.065, 0.045, 1.1, 4);
    const hoofGeom = new THREE.BoxGeometry(0.09, 0.12, 0.11);

    const legOffsets = [
      [-0.26, 0.52], [0.26, 0.52],
      [-0.26, -0.52], [0.26, -0.52],
    ];

    legOffsets.forEach(([lx, lz]) => {
      const leg = new THREE.Mesh(legGeom, bodyMat);
      leg.position.set(lx, 0.55, lz);
      leg.castShadow = true;
      deer.add(leg);

      const hoof = new THREE.Mesh(hoofGeom, darkMat);
      hoof.position.set(lx, 0.06, lz + 0.02);
      deer.add(hoof);
    });

    // Neck & Head Group (allows animated grazing / looking around)
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 1.5, 0.65);

    const neckGeom = new THREE.CylinderGeometry(0.18, 0.28, 0.9, 5);
    neckGeom.rotateX(0.5);
    const neck = new THREE.Mesh(neckGeom, bodyMat);
    neck.position.set(0, 0.35, 0.18);
    neck.castShadow = true;
    headGroup.add(neck);

    const headGeom = new THREE.BoxGeometry(0.3, 0.32, 0.56);
    const head = new THREE.Mesh(headGeom, bodyMat);
    head.position.set(0, 0.72, 0.42);
    head.castShadow = true;
    headGroup.add(head);

    // Dark Snout & Muzzle
    const snoutGeom = new THREE.BoxGeometry(0.2, 0.2, 0.24);
    const snout = new THREE.Mesh(snoutGeom, darkMat);
    snout.position.set(0, 0.66, 0.74);
    headGroup.add(snout);

    // Pointy Ears
    const earGeom = new THREE.ConeGeometry(0.08, 0.28, 4);
    const leftEar = new THREE.Mesh(earGeom, bodyMat);
    leftEar.position.set(-0.16, 0.92, 0.28);
    leftEar.rotation.set(-0.3, 0, -0.4);
    headGroup.add(leftEar);

    const rightEar = new THREE.Mesh(earGeom, bodyMat);
    rightEar.position.set(0.16, 0.92, 0.28);
    rightEar.rotation.set(-0.3, 0, 0.4);
    headGroup.add(rightEar);

    // Branching Antlers for Buck
    if (type === 'buck') {
      const beamGeom = new THREE.CylinderGeometry(0.04, 0.055, 0.75, 4);
      const tineGeom = new THREE.CylinderGeometry(0.025, 0.035, 0.35, 4);

      [-0.14, 0.14].forEach((ax) => {
        const beam = new THREE.Mesh(beamGeom, antlerMat);
        beam.position.set(ax, 1.15, 0.3);
        beam.rotation.set(-0.4, 0, ax < 0 ? -0.45 : 0.45);
        headGroup.add(beam);

        const tine1 = new THREE.Mesh(tineGeom, antlerMat);
        tine1.position.set(ax * 1.6, 1.25, 0.38);
        tine1.rotation.set(-0.1, 0, ax < 0 ? -0.9 : 0.9);
        headGroup.add(tine1);

        const tine2 = new THREE.Mesh(tineGeom, antlerMat);
        tine2.position.set(ax * 1.3, 1.45, 0.2);
        tine2.rotation.set(-0.7, 0, ax < 0 ? -0.3 : 0.3);
        headGroup.add(tine2);
      });
    }

    deer.add(headGroup);

    // Fluffy tail
    const tailGeom = new THREE.BoxGeometry(0.14, 0.2, 0.12);
    const tail = new THREE.Mesh(tailGeom, bellyMat);
    tail.position.set(0, 1.5, -0.76);
    tail.rotation.x = -0.4;
    deer.add(tail);

    animalsGroup.add(deer);

    animatedAnimals.push({
      kind: 'deer',
      group: deer,
      headGroup: headGroup,
      type: type,
      baseY: 0.2,
      baseRotY: rotY,
    });
  }

  // Spawn Deer Family in the sunny meadow grove
  createDeer('buck', 1.05, 18, -26, -0.6);
  createDeer('doe', 0.95, 21.5, -24, 0.8);
  createDeer('fawn', 0.58, 20.2, -27.5, -0.2);

  // 2. CUTE LOW-POLY SHORELINE RABBITS (Hopping & Ear-Wiggling)
  function createRabbit(posX, posZ, rotY, scale = 0.55, furHex = 0xEDE0D4) {
    const rabbit = new THREE.Group();
    rabbit.position.set(posX, 0.15, posZ);
    rabbit.rotation.y = rotY;
    rabbit.scale.setScalar(scale);

    const furMat = new THREE.MeshStandardMaterial({ color: furHex, roughness: 0.85, flatShading: true });
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.9, flatShading: true });
    const pinkMat = new THREE.MeshStandardMaterial({ color: 0xF9A8D4, roughness: 0.8 });

    // Round Torso
    const bodyGeom = new THREE.DodecahedronGeometry(0.38, 0);
    const body = new THREE.Mesh(bodyGeom, furMat);
    body.position.set(0, 0.34, 0);
    body.scale.set(0.9, 0.85, 1.25);
    body.castShadow = true;
    rabbit.add(body);

    // Head
    const headGeom = new THREE.DodecahedronGeometry(0.24, 0);
    const head = new THREE.Mesh(headGeom, furMat);
    head.position.set(0, 0.48, 0.36);
    head.castShadow = true;
    rabbit.add(head);

    // Nose
    const nose = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.05, 0.06), pinkMat);
    nose.position.set(0, 0.45, 0.56);
    rabbit.add(nose);

    // Tall Wiggling Ears
    const earGeom = new THREE.ConeGeometry(0.07, 0.45, 4);
    const earL = new THREE.Mesh(earGeom, furMat);
    earL.position.set(-0.11, 0.78, 0.28);
    earL.rotation.set(-0.2, 0, -0.15);
    rabbit.add(earL);

    const earR = new THREE.Mesh(earGeom, furMat);
    earR.position.set(0.11, 0.78, 0.28);
    earR.rotation.set(-0.2, 0, 0.15);
    rabbit.add(earR);

    // Fluffy Cotton Tail
    const tail = new THREE.Mesh(new THREE.DodecahedronGeometry(0.12, 0), whiteMat);
    tail.position.set(0, 0.38, -0.42);
    rabbit.add(tail);

    animalsGroup.add(rabbit);

    animatedAnimals.push({
      kind: 'rabbit',
      group: rabbit,
      earL: earL,
      earR: earR,
      originX: posX,
      originZ: posZ,
      hopRadius: 1.8 + Math.random() * 1.5,
      hopSpeed: 0.35 + Math.random() * 0.2,
      phase: Math.random() * Math.PI * 2,
    });
  }

  // 4 Rabbits along shoreline and meadows
  createRabbit(lakeX + 7, lakeZ + 11, 0.4, 0.58, 0xEDE0D4);
  createRabbit(lakeX - 11, lakeZ + 8, -1.2, 0.52, 0xC49A6C);
  createRabbit(lakeX - 8, lakeZ - 9, 2.1, 0.55, 0xF8F5EE);
  createRabbit(14, -16, -0.5, 0.6, 0xD4B895);

  // 3. LOW-POLY POND DUCKS (Swimming & Bobbing among Water Lilies)
  function createDuck(startX, startZ, angle, isMallard = true) {
    const duck = new THREE.Group();
    duck.position.set(startX, 0.10, startZ);
    duck.rotation.y = angle;
    duck.scale.setScalar(0.72);

    const bodyMat = new THREE.MeshStandardMaterial({
      color: isMallard ? 0x6E4C2E : 0xF8FAFC,
      roughness: 0.8,
      flatShading: true,
    });
    const headMat = new THREE.MeshStandardMaterial({
      color: isMallard ? 0x15803D : 0xF1F5F9,
      roughness: 0.5,
      flatShading: true,
    });
    const beakMat = new THREE.MeshStandardMaterial({
      color: 0xF59E0B,
      roughness: 0.4,
      flatShading: true,
    });

    // Body
    const bodyGeom = new THREE.DodecahedronGeometry(0.36, 0);
    const body = new THREE.Mesh(bodyGeom, bodyMat);
    body.scale.set(0.85, 0.65, 1.25);
    duck.add(body);

    // Neck & Head
    const headGeom = new THREE.DodecahedronGeometry(0.19, 0);
    const head = new THREE.Mesh(headGeom, headMat);
    head.position.set(0, 0.32, 0.28);
    duck.add(head);

    // Beak
    const beakGeom = new THREE.ConeGeometry(0.08, 0.22, 4);
    beakGeom.rotateX(Math.PI / 2);
    const beak = new THREE.Mesh(beakGeom, beakMat);
    beak.position.set(0, 0.28, 0.48);
    duck.add(beak);

    // Tail feathers
    const tailGeom = new THREE.ConeGeometry(0.12, 0.24, 4);
    tailGeom.rotateX(-Math.PI / 3);
    const tail = new THREE.Mesh(tailGeom, bodyMat);
    tail.position.set(0, 0.18, -0.42);
    duck.add(tail);

    animalsGroup.add(duck);

    animatedAnimals.push({
      kind: 'duck',
      group: duck,
      lakeX: lakeX,
      lakeZ: lakeZ,
      orbitR: 4.8 + Math.random() * 3.5,
      speed: isMallard ? 0.22 : -0.18,
      phase: angle,
    });
  }

  // 3 ducks in the pond
  createDuck(lakeX + 3.5, lakeZ - 3.5, 0.5, true);
  createDuck(lakeX - 4.2, lakeZ + 2.0, 2.4, false);
  createDuck(lakeX + 1.2, lakeZ + 4.8, 4.1, true);

  // 3. Day Skydome (Warm Golden Anime Morning Sunrise)
  const domeGeom = new THREE.SphereGeometry(155, 32, 20, 0, Math.PI * 2, 0, Math.PI * 0.5);
  
  const dayCanvas = document.createElement('canvas');
  dayCanvas.width = 16;
  dayCanvas.height = 512;
  const dayCtx = dayCanvas.getContext('2d');
  const dayGrad = dayCtx.createLinearGradient(0, 0, 0, 512);
  dayGrad.addColorStop(0, '#F5EDE0');    // Top: Warm ivory
  dayGrad.addColorStop(0.55, '#F8E6C8'); // Mid: Luminous amber sunrise
  dayGrad.addColorStop(0.82, '#E9DDC7'); // Horizon: Soft aged parchment
  dayGrad.addColorStop(1, '#DACAB0');    // Ground base
  dayCtx.fillStyle = dayGrad;
  dayCtx.fillRect(0, 0, 16, 512);

  const dayTexture = new THREE.CanvasTexture(dayCanvas);
  const dayDomeMat = new THREE.MeshBasicMaterial({
    map: dayTexture,
    side: THREE.BackSide,
    depthWrite: false,
    transparent: true,
    opacity: 1.0,
  });
  dayDomeMesh = new THREE.Mesh(domeGeom, dayDomeMat);
  dayDomeMesh.position.y = -10;
  envGroup.add(dayDomeMesh);

  // 4. Night Skydome (Deep Cosmic Indigo & Twilight Gradient)
  const nightCanvas = document.createElement('canvas');
  nightCanvas.width = 16;
  nightCanvas.height = 512;
  const nightCtx = nightCanvas.getContext('2d');
  const nightGrad = nightCtx.createLinearGradient(0, 0, 0, 512);
  nightGrad.addColorStop(0, '#060911');    // Deep midnight zenith
  nightGrad.addColorStop(0.45, '#0C1322'); // Dark cosmic sapphire
  nightGrad.addColorStop(0.78, '#131D35'); // Deep twilight haze
  nightGrad.addColorStop(1, '#1A233A');    // Horizon rim
  nightCtx.fillStyle = nightGrad;
  nightCtx.fillRect(0, 0, 16, 512);

  const nightTexture = new THREE.CanvasTexture(nightCanvas);
  const nightDomeMat = new THREE.MeshBasicMaterial({
    map: nightTexture,
    side: THREE.BackSide,
    depthWrite: false,
    transparent: true,
    opacity: 0.0, // Hidden by default (fades in on Night Mode)
  });
  nightDomeMesh = new THREE.Mesh(domeGeom, nightDomeMat);
  nightDomeMesh.position.y = -10;
  envGroup.add(nightDomeMesh);

  // 5. Twinkling Starfield (600 Celestial Stars for Night Mode)
  const starCount = 600;
  const starGeom = new THREE.BufferGeometry();
  const starPositions = new Float32Array(starCount * 3);
  const starColors = new Float32Array(starCount * 3);

  const starColorPalette = [
    new THREE.Color(0xFFFFFF), // Crisp white
    new THREE.Color(0x93C5FD), // Soft celestial cyan
    new THREE.Color(0xFDE68A), // Amber spark
    new THREE.Color(0xE0E7FF), // Lavender silver
  ];

  for (let i = 0; i < starCount; i++) {
    // Distribute on upper dome
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(0.1 + Math.random() * 0.9); // Mostly above horizon
    const radius = 142 + Math.random() * 8;

    starPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    starPositions[i * 3 + 1] = radius * Math.cos(phi) - 4;
    starPositions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);

    const c = starColorPalette[Math.floor(Math.random() * starColorPalette.length)];
    starColors[i * 3] = c.r;
    starColors[i * 3 + 1] = c.g;
    starColors[i * 3 + 2] = c.b;
  }

  starGeom.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
  starGeom.setAttribute('color', new THREE.Float32BufferAttribute(starColors, 3));

  const starMat = new THREE.PointsMaterial({
    size: 1.4,
    vertexColors: true,
    transparent: true,
    opacity: 0.0, // Fades in on night mode
    depthWrite: false,
  });

  starfieldPoints = new THREE.Points(starGeom, starMat);
  envGroup.add(starfieldPoints);

  // 6. Glowing Stylized Crescent Moon (Night Mode)
  const moonGroup = new THREE.Group();
  moonGroup.position.set(-52, 68, -48);

  const moonGeom = new THREE.SphereGeometry(3.6, 16, 16);
  const moonMat = new THREE.MeshBasicMaterial({
    color: 0xF1F5F9,
  });
  const moonBody = new THREE.Mesh(moonGeom, moonMat);
  moonGroup.add(moonBody);

  // Soft Outer Moonlight Halo
  const haloGeom = new THREE.RingGeometry(3.8, 7.5, 32);
  const haloMat = new THREE.MeshBasicMaterial({
    color: 0x93C5FD,
    transparent: true,
    opacity: 0.28,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const moonHalo = new THREE.Mesh(haloGeom, haloMat);
  moonHalo.lookAt(0, 0, 0);
  moonGroup.add(moonHalo);

  moonGroup.visible = false; // Hidden in day
  moonMesh = moonGroup;
  envGroup.add(moonGroup);

  // 7. Rotating Telecommunication Wind Turbines on the Ridge (Engineering Aesthetic)
  const turbineMat = new THREE.MeshStandardMaterial({
    color: 0xE2E8F0, // Clean industrial white
    roughness: 0.35,
    metalness: 0.4,
  });
  const turbineBeaconMat = new THREE.MeshBasicMaterial({ color: 0xEF4444 });

  const turbinePositions = [
    { x: -50, z: -35, y: 14.5, scale: 1.0 },
    { x: 38, z: -48, y: 15.8, scale: 0.95 },
    { x: -58, z: 20, y: 13.2, scale: 0.9 },
  ];

  turbinePositions.forEach((tp) => {
    const turbine = new THREE.Group();
    turbine.position.set(tp.x, tp.y, tp.z);
    turbine.scale.set(tp.scale, tp.scale, tp.scale);

    // Mast
    const towerGeom = new THREE.CylinderGeometry(0.35, 0.65, 18, 8);
    const tower = new THREE.Mesh(towerGeom, turbineMat);
    tower.position.y = 9;
    tower.castShadow = true;
    turbine.add(tower);

    // Nacelle
    const nacelleGeom = new THREE.BoxGeometry(1.2, 1.2, 2.6);
    const nacelle = new THREE.Mesh(nacelleGeom, turbineMat);
    nacelle.position.set(0, 18, 0);
    turbine.add(nacelle);

    // Beacon on nacelle top
    const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.2, 6, 6), turbineBeaconMat);
    beacon.position.set(0, 18.8, 0);
    turbine.add(beacon);

    // 3-Blade Rotor Hub
    const rotorGroup = new THREE.Group();
    rotorGroup.position.set(0, 18, 1.3);

    const hubGeom = new THREE.CylinderGeometry(0.5, 0.5, 0.6, 8);
    hubGeom.rotateX(Math.PI / 2);
    const hub = new THREE.Mesh(hubGeom, turbineMat);
    rotorGroup.add(hub);

    // 3 Rotor Blades
    for (let b = 0; b < 3; b++) {
      const bladeGeom = new THREE.BoxGeometry(0.25, 8.5, 0.08);
      const blade = new THREE.Mesh(bladeGeom, turbineMat);
      blade.position.y = 4.2;
      const bladePivot = new THREE.Group();
      bladePivot.rotation.z = (b * Math.PI * 2) / 3;
      bladePivot.add(blade);
      rotorGroup.add(bladePivot);
    }

    turbine.add(rotorGroup);
    animatedTurbineRotors.push(rotorGroup);

    envGroup.add(turbine);
  });

  // 8. Distant Telecommunication Pylons & Industrial Silos along Horizon
  const horizonGroup = new THREE.Group();
  horizonGroup.name = 'IndustrialHorizon';

  const industrialMat = new THREE.MeshStandardMaterial({
    color: 0x333731, // Charcoal industrial silhouette
    roughness: 0.8,
    metalness: 0.35,
    flatShading: true,
  });

  const towerPylonMat = new THREE.MeshStandardMaterial({
    color: 0x242823, // Dark steel lattice
    roughness: 0.5,
    metalness: 0.65,
  });

  const beaconLightMat = new THREE.MeshBasicMaterial({ color: 0xEF4444 });

  const industrialCount = 14;
  for (let i = 0; i < industrialCount; i++) {
    const angle = (i / industrialCount) * Math.PI * 2 + (Math.random() * 0.15);
    const dist = 72 + (i % 3) * 16;
    const x = Math.cos(angle) * dist;
    const z = Math.sin(angle) * dist;

    const cluster = new THREE.Group();
    cluster.position.set(x, 2 + (dist - 65) * 0.2, z);

    if (i % 2 === 0) {
      // Telecommunication Lattice Transmission Pylon
      const pylonHeight = 17 + (i % 4) * 3;
      const legGeom = new THREE.CylinderGeometry(0.12, 0.45, pylonHeight, 4);
      const pylonMesh = new THREE.Mesh(legGeom, towerPylonMat);
      pylonMesh.position.y = pylonHeight / 2;
      pylonMesh.castShadow = true;
      cluster.add(pylonMesh);

      [0.35, 0.6, 0.85].forEach((hRatio) => {
        const barGeom = new THREE.BoxGeometry(2.8 * (1 - hRatio * 0.5), 0.15, 0.15);
        const bar = new THREE.Mesh(barGeom, towerPylonMat);
        bar.position.y = pylonHeight * hRatio;
        cluster.add(bar);
      });

      const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.28, 6, 6), beaconLightMat);
      beacon.position.y = pylonHeight + 0.3;
      cluster.add(beacon);
    } else {
      // Industrial Modular Facility
      const bldgW = 4.5 + (i % 3) * 2;
      const bldgH = 6.5 + (i % 4) * 2.5;
      const bldgD = 5 + (i % 2) * 2;
      const bldg = new THREE.Mesh(new THREE.BoxGeometry(bldgW, bldgH, bldgD), industrialMat);
      bldg.position.y = bldgH / 2;
      bldg.castShadow = true;
      cluster.add(bldg);

      const silo = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, bldgH * 1.15, 10), industrialMat);
      silo.position.set(bldgW * 0.65, (bldgH * 1.15) / 2, 0);
      silo.castShadow = true;
      cluster.add(silo);
    }

    horizonGroup.add(cluster);
  }
  envGroup.add(horizonGroup);

  // 9. Low-Poly Trees (Conifers & Deciduous)
  const treeCount = 85;
  const pineMats = [
    new THREE.MeshStandardMaterial({ color: 0x355338, roughness: 0.75, flatShading: true }), // Forest spruce
    new THREE.MeshStandardMaterial({ color: 0x4D6B42, roughness: 0.75, flatShading: true }), // Spring moss
    new THREE.MeshStandardMaterial({ color: 0x2A412D, roughness: 0.8, flatShading: true }),  // Deep pine
  ];
  const deciduousMat = new THREE.MeshStandardMaterial({ color: 0x6E8552, roughness: 0.8, flatShading: true });
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x26231E, roughness: 0.9, flatShading: true });

  const trunkGeom = new THREE.CylinderGeometry(0.2, 0.36, 1.5, 5);
  const pineGeom = new THREE.ConeGeometry(1.4, 3.2, 5);
  const decGeom = new THREE.DodecahedronGeometry(1.5, 0);

  for (let i = 0; i < treeCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const dist = 22 + Math.random() * 46;
    const x = Math.cos(angle) * dist;
    const z = Math.sin(angle) * dist;

    // Avoid lake surface
    const dLake = Math.sqrt((x - lakeX) ** 2 + (z - lakeZ) ** 2);
    if (dLake < 17) continue;

    const tree = new THREE.Group();
    tree.position.set(x, 0.2, z);

    const trunk = new THREE.Mesh(trunkGeom, trunkMat);
    trunk.position.y = 0.75;
    trunk.castShadow = true;
    tree.add(trunk);

    if (i % 4 === 0) {
      // Deciduous broadleaf
      const canopy = new THREE.Mesh(decGeom, deciduousMat);
      canopy.position.y = 2.4;
      canopy.scale.set(1.1, 0.9, 1.1);
      canopy.castShadow = true;
      tree.add(canopy);
    } else {
      // Conifer pine
      const foliage = new THREE.Mesh(pineGeom, pineMats[i % pineMats.length]);
      foliage.position.y = 2.6;
      foliage.castShadow = true;
      tree.add(foliage);
    }

    const scale = 0.65 + Math.random() * 0.65;
    tree.scale.set(scale, scale, scale);
    envGroup.add(tree);
  }

  // 10. Low-Poly Weathered Granite Rocks
  const rockGeom = new THREE.DodecahedronGeometry(1.3, 0);
  const rockMat = new THREE.MeshStandardMaterial({
    color: 0x3A3F36,
    roughness: 0.92,
    metalness: 0.08,
    flatShading: true,
  });

  for (let i = 0; i < 40; i++) {
    const angle = Math.random() * Math.PI * 2;
    const dist = 18 + Math.random() * 48;
    const rock = new THREE.Mesh(rockGeom, rockMat);
    rock.position.set(Math.cos(angle) * dist, 0.35, Math.sin(angle) * dist);
    rock.rotation.set(Math.random() * 3, Math.random() * 3, Math.random() * 3);
    const s = 0.5 + Math.random() * 1.3;
    rock.scale.set(s, s * 0.65, s);
    rock.castShadow = true;
    envGroup.add(rock);
  }

  // 11. Floating Atmospheric Fireflies / Data Motes
  const fireflyCount = 40;
  const fireflyGeom = new THREE.BufferGeometry();
  fireflyPositions = new Float32Array(fireflyCount * 3);

  for (let i = 0; i < fireflyCount; i++) {
    fireflyPositions[i * 3] = (Math.random() - 0.5) * 80;
    fireflyPositions[i * 3 + 1] = 1.0 + Math.random() * 4.0;
    fireflyPositions[i * 3 + 2] = (Math.random() - 0.5) * 80;
  }

  fireflyGeom.setAttribute('position', new THREE.Float32BufferAttribute(fireflyPositions, 3));

  const fireflyMat = new THREE.PointsMaterial({
    size: 0.9,
    color: 0x4ADE80, // Luminous emerald glow
    transparent: true,
    opacity: 0.7,
    depthWrite: false,
  });

  firefliesMesh = new THREE.Points(fireflyGeom, fireflyMat);
  envGroup.add(firefliesMesh);

  // Expose update and time of day controllers
  envGroup.userData = {
    update: (delta) => {
      // Spin wind turbine rotors smoothly
      animatedTurbineRotors.forEach((rotor) => {
        rotor.rotation.z += 1.4 * delta;
      });

      // Animate real physical water wave ripples on the blue pond
      if (waterMesh) {
        const time = performance.now() * 0.0022;
        const pos = waterMesh.geometry.attributes.position;
        for (let i = 0; i < pos.count; i++) {
          const px = pos.getX(i);
          const pz = pos.getZ(i);
          const r = Math.sqrt(px * px + pz * pz);
          if (r < pondRadius - 0.2) {
            const wave = Math.sin(r * 0.75 - time * 2.6) * 0.07
                       + Math.cos(px * 0.4 + time * 1.8) * 0.035
                       + Math.sin(pz * 0.4 + time * 1.5) * 0.035;
            pos.setY(i, wave);
          }
        }
        pos.needsUpdate = true;
        waterMesh.geometry.computeVertexNormals();
      }

      // Gentle floating dance of fireflies
      if (firefliesMesh) {
        const pos = firefliesMesh.geometry.attributes.position;
        const time = performance.now() * 0.001;
        for (let i = 0; i < fireflyCount; i++) {
          let y = pos.getY(i) + Math.sin(time * 1.5 + i) * 0.006;
          if (y < 0.6) y = 0.6;
          if (y > 5.5) y = 5.5;
          pos.setY(i, y);
        }
        pos.needsUpdate = true;
      }

      // Animate Swimming Koi Fish in the Pond
      if (animatedKoiFish.length > 0) {
        const time = performance.now() * 0.001;

        animatedKoiFish.forEach((fish) => {
          // Current orbital angle
          const angle = fish.phase + time * fish.speed;

          // Gentle wandering radius oscillation
          const rOffset = Math.sin(time * 0.45 + fish.phase * 2) * 1.5;
          const currentR = Math.max(2.2, Math.min(pondRadius - 2.0, fish.baseRadius + rOffset));

          const curX = lakeX + Math.cos(angle) * currentR;
          const curZ = lakeZ + Math.sin(angle) * currentR;

          // Bobbing slightly under water surface (water is at y: 0.08)
          const curY = -0.04 + Math.sin(time * 1.6 + fish.index) * 0.035;

          fish.group.position.set(curX, curY, curZ);

          // Calculate point ahead along movement tangent to face forward
          const aheadAngle = angle + (fish.speed >= 0 ? 0.06 : -0.06);
          const aheadX = lakeX + Math.cos(aheadAngle) * currentR;
          const aheadZ = lakeZ + Math.sin(aheadAngle) * currentR;

          fish.group.lookAt(aheadX, curY, aheadZ);

          // Articulated fish tail wagging with sinusoidal speed
          fish.tailGroup.rotation.y = Math.sin(time * 7.5 + fish.index * 1.8) * 0.42;

          // Subtle body roll undulation while turning
          fish.group.rotation.z = Math.sin(time * 3.8 + fish.phase) * 0.12;
        });
      }

      // Animate Low-Poly Wildlife (Deer Family, Hopping Bunnies & Pond Ducks)
      if (animatedAnimals.length > 0) {
        const time = performance.now() * 0.001;

        animatedAnimals.forEach((anim) => {
          if (anim.kind === 'deer') {
            if (anim.type === 'buck') {
              // Proud stance with gentle scanning look left and right
              anim.headGroup.rotation.y = Math.sin(time * 0.65) * 0.35;
              anim.headGroup.rotation.x = Math.sin(time * 0.4) * 0.1;
            } else if (anim.type === 'doe') {
              // Peaceful grazing: dipping head down to chew grass
              anim.headGroup.rotation.x = 0.52 + Math.sin(time * 0.55) * 0.32;
              anim.headGroup.rotation.y = Math.sin(time * 0.8) * 0.12;
            } else {
              // Fawn bobbing playfully near mother
              anim.headGroup.rotation.x = 0.25 + Math.sin(time * 1.2) * 0.2;
              anim.group.position.y = anim.baseY + Math.abs(Math.sin(time * 1.8)) * 0.08;
            }
          } else if (anim.kind === 'rabbit') {
            // Realistic hopping along a gentle circular territory
            const hopAngle = anim.phase + time * anim.hopSpeed;
            const hopCycle = (time * 4.2 + anim.phase * 3.0) % (Math.PI * 2);
            const isJumping = Math.sin(hopCycle) > 0;
            const jumpHeight = isJumping ? Math.sin(hopCycle) * 0.38 : 0;

            const rx = anim.originX + Math.cos(hopAngle) * anim.hopRadius;
            const rz = anim.originZ + Math.sin(hopAngle) * anim.hopRadius;

            anim.group.position.set(rx, 0.15 + jumpHeight, rz);

            // Orient rabbit in direction of hop movement
            const nextAngle = hopAngle + (isJumping ? 0.08 : 0.0);
            anim.group.lookAt(
              anim.originX + Math.cos(nextAngle) * anim.hopRadius,
              0.15 + jumpHeight,
              anim.originZ + Math.sin(nextAngle) * anim.hopRadius
            );

            // Ear wiggling
            anim.earL.rotation.z = -0.15 + Math.sin(time * 7.5 + anim.phase) * 0.15;
            anim.earR.rotation.z = 0.15 + Math.sin(time * 7.5 + anim.phase + 1.2) * 0.15;
          } else if (anim.kind === 'duck') {
            // Smooth leisurely paddling around the pond
            const curAngle = anim.phase + time * anim.speed;
            const curR = anim.orbitR + Math.sin(time * 0.3 + anim.phase) * 0.8;
            const dx = anim.lakeX + Math.cos(curAngle) * curR;
            const dz = anim.lakeZ + Math.sin(curAngle) * curR;
            const dy = 0.10 + Math.sin(time * 2.2 + anim.phase) * 0.035;

            anim.group.position.set(dx, dy, dz);

            // Look forward along circle tangent
            const aheadAngle = curAngle + (anim.speed >= 0 ? 0.08 : -0.08);
            anim.group.lookAt(
              anim.lakeX + Math.cos(aheadAngle) * curR,
              dy,
              anim.lakeZ + Math.sin(aheadAngle) * curR
            );

            // Gentle body roll
            anim.group.rotation.z = Math.sin(time * 1.8 + anim.phase) * 0.06;
          }
        });
      }
    },

    pondCenter: new THREE.Vector3(lakeX, 0.08, lakeZ),
    pondRadius: pondRadius,

    setNightTransition: (nightT) => {
      // nightT ranges from 0 (Day) to 1 (Night)
      if (dayDomeMesh) {
        dayDomeMesh.material.opacity = Math.max(0, 1.0 - nightT);
      }
      if (nightDomeMesh) {
        nightDomeMesh.material.opacity = Math.min(1, nightT);
      }
      if (starfieldPoints) {
        starfieldPoints.material.opacity = Math.min(1, nightT * 0.95);
      }
      if (moonMesh) {
        moonMesh.visible = nightT > 0.05;
        moonMesh.position.y = 50 + nightT * 18;
      }
      if (waterMesh) {
        // Shift water from crystal sky blue to luminous moonlit sapphire blue (Never black!)
        const dayWater = new THREE.Color(0x38BDF8); // Crystal sky blue
        const nightWater = new THREE.Color(0x2563EB); // Deep sapphire blue

        const dayEmissive = new THREE.Color(0x0284C7);
        const nightEmissive = new THREE.Color(0x1D4ED8);

        waterMesh.material.color.lerpColors(dayWater, nightWater, nightT);
        waterMesh.material.emissive.lerpColors(dayEmissive, nightEmissive, nightT);
        waterMesh.material.emissiveIntensity = 0.28 + nightT * 0.35;
      }
      if (firefliesMesh) {
        // Shift fireflies to electric cyan/lime at night
        firefliesMesh.material.color.lerpColors(
          new THREE.Color(0xFDE68A),
          new THREE.Color(0x38BDF8),
          nightT
        );
        firefliesMesh.material.size = 0.8 + nightT * 0.5;
        firefliesMesh.material.opacity = 0.5 + nightT * 0.45;
      }
    },
  };

  return envGroup;
}
