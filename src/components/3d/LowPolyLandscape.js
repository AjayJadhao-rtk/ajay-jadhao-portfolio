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

  // Lake center coordinates for basin hollow
  const lakeX = -16;
  const lakeZ = 14;

  for (let i = 0; i < vertexCount; i++) {
    const x = posAttr.getX(i);
    const z = posAttr.getZ(i);

    const distFromCenter = Math.sqrt(x * x + z * z);
    
    // Base rolling landscape wave
    let y = Math.sin(x * 0.038) * Math.cos(z * 0.038) * 3.2 
          + Math.sin(x * 0.09 + z * 0.07) * 1.1;

    // Carve a natural bowl for the mountain lake
    const distToLake = Math.sqrt((x - lakeX) ** 2 + (z - lakeZ) ** 2);
    if (distToLake < 22) {
      const lakeDepression = Math.cos((distToLake / 22) * (Math.PI / 2)) * 2.2;
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
    const y = posAttr.getY(i);
    const ny = normalAttr.getY(i); // Vertical component of normal (1 = flat ground, 0 = vertical cliff)

    if (y < 0.2) {
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

  // 2. Reflective Mountain Lake
  const lakeGeom = new THREE.CircleGeometry(16, 28);
  lakeGeom.rotateX(-Math.PI / 2);
  const lakeMat = new THREE.MeshStandardMaterial({
    color: 0x224D52, // Serene alpine teal
    roughness: 0.15,
    metalness: 0.85,
    transparent: true,
    opacity: 0.84,
  });
  waterMesh = new THREE.Mesh(lakeGeom, lakeMat);
  waterMesh.position.set(lakeX, -0.05, lakeZ);
  waterMesh.receiveShadow = true;
  envGroup.add(waterMesh);

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
    },

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
        // Shift water from daytime alpine teal to deep night indigo
        waterMesh.material.color.lerpColors(
          new THREE.Color(0x224D52),
          new THREE.Color(0x0C2028),
          nightT
        );
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
