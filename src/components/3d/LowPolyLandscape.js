import * as THREE from 'three';

/**
 * Builds the low-poly isometric vintage-anime style terrain island.
 * Colors strictly adhere to the engineering palette: #E9DDC7, #DACAB0, #626B50, #26352D.
 * 
 * Features:
 * - Faceted low-poly hills and circuit substrate
 * - Distant industrial silhouettes & telecommunication lattice towers on horizon
 * - Warm morning sunlight horizon dome (gradient) preventing abrupt clipping
 * - Low-poly pine trees and rock formations
 */
export function buildLowPolyLandscape() {
  const envGroup = new THREE.Group();
  envGroup.name = 'IsometricIsland';

  // 1. Faceted Low-Poly Terrain Mesh
  const terrainSize = 220;
  const terrainSegments = 50;
  const terrainGeom = new THREE.PlaneGeometry(terrainSize, terrainSize, terrainSegments, terrainSegments);
  terrainGeom.rotateX(-Math.PI / 2);

  const posAttr = terrainGeom.attributes.position;
  for (let i = 0; i < posAttr.count; i++) {
    const x = posAttr.getX(i);
    const z = posAttr.getZ(i);

    const distFromCenter = Math.sqrt(x * x + z * z);
    let y = Math.sin(x * 0.04) * Math.cos(z * 0.04) * 2.8;

    if (distFromCenter > 50) {
      y += (distFromCenter - 50) * 0.22; // Mountain perimeter slopes
    }

    posAttr.setY(i, y - 0.5);
  }

  terrainGeom.computeVertexNormals();

  const terrainMat = new THREE.MeshStandardMaterial({
    color: 0xE9DDC7, // Aged parchment
    roughness: 0.85,
    metalness: 0.05,
    flatShading: true,
  });

  const terrainMesh = new THREE.Mesh(terrainGeom, terrainMat);
  terrainMesh.receiveShadow = true;
  envGroup.add(terrainMesh);

  // 2. Horizon Gradient Skydome (Prevents abrupt clipping with warm morning sunrise glow)
  const domeGeom = new THREE.SphereGeometry(150, 32, 20, 0, Math.PI * 2, 0, Math.PI * 0.5);
  
  // Create Canvas Gradient Texture for authentic anime morning horizon
  const canvas = document.createElement('canvas');
  canvas.width = 16;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, '#F4EBDD');   // Top: Warm ivory
  grad.addColorStop(0.65, '#F3E5CD'); // Mid: Luminous amber sunrise
  grad.addColorStop(0.85, '#E9DDC7'); // Horizon: Aged parchment
  grad.addColorStop(1, '#DACAB0');    // Base: Warm earth
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 16, 512);

  const domeTexture = new THREE.CanvasTexture(canvas);
  domeTexture.wrapS = THREE.ClampToEdgeWrapping;
  domeTexture.wrapT = THREE.ClampToEdgeWrapping;

  const domeMat = new THREE.MeshBasicMaterial({
    map: domeTexture,
    side: THREE.BackSide,
    depthWrite: false,
  });
  const skyDome = new THREE.Mesh(domeGeom, domeMat);
  skyDome.position.y = -10;
  envGroup.add(skyDome);

  // 3. Distant Industrial Silhouettes & Telecommunication Towers (Tokyo-3 / Anime Horizon)
  const horizonGroup = new THREE.Group();
  horizonGroup.name = 'IndustrialHorizon';

  const industrialMat = new THREE.MeshStandardMaterial({
    color: 0x3D403A, // Charcoal industrial silhouette
    roughness: 0.85,
    metalness: 0.3,
    flatShading: true,
  });

  const towerPylonMat = new THREE.MeshStandardMaterial({
    color: 0x292B27, // Dark steel lattice
    roughness: 0.6,
    metalness: 0.6,
  });

  const beaconLightMat = new THREE.MeshBasicMaterial({ color: 0xEF4444 }); // Red aircraft hazard beacon

  // Spawn 14 distant industrial clusters & lattice antennas along perimeter (radius 65 to 110)
  const industrialCount = 14;
  for (let i = 0; i < industrialCount; i++) {
    const angle = (i / industrialCount) * Math.PI * 2 + (Math.random() * 0.2);
    const dist = 70 + (i % 3) * 16;
    const x = Math.cos(angle) * dist;
    const z = Math.sin(angle) * dist;

    const cluster = new THREE.Group();
    cluster.position.set(x, 2 + (dist - 65) * 0.18, z);

    if (i % 2 === 0) {
      // Telecommunication Lattice Transmission Pylon (Vintage Anime Style)
      const pylonHeight = 16 + (i % 4) * 3;
      const legGeom = new THREE.CylinderGeometry(0.12, 0.45, pylonHeight, 4);
      const pylonMesh = new THREE.Mesh(legGeom, towerPylonMat);
      pylonMesh.position.y = pylonHeight / 2;
      pylonMesh.castShadow = true;
      cluster.add(pylonMesh);

      // Crossbars
      [0.35, 0.6, 0.85].forEach((hRatio) => {
        const barGeom = new THREE.BoxGeometry(2.6 * (1 - hRatio * 0.5), 0.15, 0.15);
        const bar = new THREE.Mesh(barGeom, towerPylonMat);
        bar.position.y = pylonHeight * hRatio;
        cluster.add(bar);
      });

      // Flashing Red Hazard Light on Pylon Peak
      const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.25, 6, 6), beaconLightMat);
      beacon.position.y = pylonHeight + 0.3;
      cluster.add(beacon);

    } else {
      // Industrial Complex (Factory Silos & Modular Buildings)
      const bldgW = 4 + (i % 3) * 2;
      const bldgH = 6 + (i % 4) * 2.5;
      const bldgD = 5 + (i % 2) * 2;
      const bldg = new THREE.Mesh(new THREE.BoxGeometry(bldgW, bldgH, bldgD), industrialMat);
      bldg.position.y = bldgH / 2;
      bldg.castShadow = true;
      cluster.add(bldg);

      // Cylindrical Chemical / Fuel Silos
      const silo = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, bldgH * 1.1, 10), industrialMat);
      silo.position.set(bldgW * 0.6, (bldgH * 1.1) / 2, 0);
      silo.castShadow = true;
      cluster.add(silo);
    }

    horizonGroup.add(cluster);
  }
  envGroup.add(horizonGroup);

  // 4. Low-Poly Vintage Anime Trees (Muted Olive & Forest Green)
  const treeCount = 70;
  const foliageMats = [
    new THREE.MeshStandardMaterial({ color: 0x626B50, roughness: 0.8, flatShading: true }),
    new THREE.MeshStandardMaterial({ color: 0x26352D, roughness: 0.8, flatShading: true }),
    new THREE.MeshStandardMaterial({ color: 0x89634C, roughness: 0.8, flatShading: true }),
  ];
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x292B27, roughness: 0.9, flatShading: true });

  const trunkGeom = new THREE.CylinderGeometry(0.2, 0.35, 1.4, 5);
  const foliageGeom = new THREE.ConeGeometry(1.4, 2.8, 5);

  for (let i = 0; i < treeCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const dist = 22 + Math.random() * 45;
    const x = Math.cos(angle) * dist;
    const z = Math.sin(angle) * dist;

    const tree = new THREE.Group();
    tree.position.set(x, 0, z);

    const trunk = new THREE.Mesh(trunkGeom, trunkMat);
    trunk.position.y = 0.7;
    trunk.castShadow = true;
    tree.add(trunk);

    const foliage = new THREE.Mesh(
      foliageGeom,
      foliageMats[Math.floor(Math.random() * foliageMats.length)]
    );
    foliage.position.y = 2.4;
    foliage.castShadow = true;
    tree.add(foliage);

    const scale = 0.7 + Math.random() * 0.6;
    tree.scale.set(scale, scale, scale);
    envGroup.add(tree);
  }

  // 5. Low-Poly Rocks
  const rockGeom = new THREE.DodecahedronGeometry(1.2, 0);
  const rockMat = new THREE.MeshStandardMaterial({
    color: 0x3D403A,
    roughness: 0.9,
    flatShading: true,
  });

  for (let i = 0; i < 35; i++) {
    const angle = Math.random() * Math.PI * 2;
    const dist = 18 + Math.random() * 48;
    const rock = new THREE.Mesh(rockGeom, rockMat);
    rock.position.set(Math.cos(angle) * dist, 0.4, Math.sin(angle) * dist);
    rock.rotation.set(Math.random() * 3, Math.random() * 3, Math.random() * 3);
    const s = 0.5 + Math.random() * 1.2;
    rock.scale.set(s, s * 0.7, s);
    rock.castShadow = true;
    envGroup.add(rock);
  }

  return envGroup;
}
