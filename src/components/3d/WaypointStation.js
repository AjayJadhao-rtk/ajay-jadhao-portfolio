import * as THREE from 'three';
import { PROJECTS_DATA } from '../../data/projectsData';

/**
 * Procedurally creates a high-resolution, luxury vintage-engineering
 * Advertisement Billboard Poster Texture on an HTML5 canvas (1280 x 760).
 *
 * Displays:
 * - Real project photo (loaded asynchronously and redrawn onto canvas)
 * - Millimeter technical engineering grid & corner architectural crosshairs
 * - Project number, category badge, and bold title
 * - Slogan / tagline and key hardware specifications matrix
 * - Authentic industrial prototype stamp & interactive CTA
 */
function createBillboardPosterTexture(project, index) {
  const canvas = document.createElement('canvas');
  canvas.width = 1280;
  canvas.height = 760;
  const ctx = canvas.getContext('2d');

  const brandHex = project.color || '#B17B53';

  function renderPoster(img = null) {
    // 1. Dark Blueprint Slate Background
    const bgGrad = ctx.createLinearGradient(0, 0, 1280, 760);
    bgGrad.addColorStop(0, '#0F1311');
    bgGrad.addColorStop(0.5, '#171E1A');
    bgGrad.addColorStop(1, '#111613');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1280, 760);

    // 2. Millimeter Engineering Grid
    ctx.strokeStyle = 'rgba(78, 108, 92, 0.2)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= 1280; x += 32) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 760);
      ctx.stroke();
    }
    for (let y = 0; y <= 760; y += 32) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1280, y);
      ctx.stroke();
    }

    // Outer Blueprint Border Frame
    ctx.strokeStyle = 'rgba(233, 221, 199, 0.4)';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(22, 22, 1236, 716);

    // Architectural Corner Crosshairs
    const corners = [
      [22, 22],
      [1258, 22],
      [22, 738],
      [1258, 738],
    ];
    ctx.strokeStyle = brandHex;
    ctx.lineWidth = 3;
    corners.forEach(([cx, cy]) => {
      ctx.beginPath();
      ctx.moveTo(cx - 14, cy);
      ctx.lineTo(cx + 14, cy);
      ctx.moveTo(cx, cy - 14);
      ctx.lineTo(cx, cy + 14);
      ctx.stroke();
    });

    // 3. Left Side: Project Image Display Frame (x: 48, y: 50, w: 560, h: 660)
    const imgX = 48;
    const imgY = 50;
    const imgW = 560;
    const imgH = 660;

    ctx.fillStyle = '#090D0B';
    ctx.fillRect(imgX, imgY, imgW, imgH);
    ctx.strokeStyle = 'rgba(233, 221, 199, 0.5)';
    ctx.lineWidth = 2;
    ctx.strokeRect(imgX, imgY, imgW, imgH);

    if (img) {
      try {
        ctx.drawImage(img, imgX + 8, imgY + 8, imgW - 16, imgH - 16);

        // Gradient vignette overlay at bottom of photo
        const vig = ctx.createLinearGradient(imgX, imgY + imgH - 160, imgX, imgY + imgH);
        vig.addColorStop(0, 'rgba(9, 13, 11, 0)');
        vig.addColorStop(1, 'rgba(9, 13, 11, 0.94)');
        ctx.fillStyle = vig;
        ctx.fillRect(imgX + 8, imgY + imgH - 160, imgW - 16, 160);
      } catch (e) {
        // Fallback handled below
      }
    } else {
      // High-tech schematic vector fallback while loading
      ctx.fillStyle = '#141E18';
      ctx.fillRect(imgX + 8, imgY + 8, imgW - 16, imgH - 16);

      ctx.strokeStyle = brandHex;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(imgX + imgW / 2, imgY + 260, 60, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = brandHex;
      ctx.font = 'bold 24px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('[ HARDWARE PROTOTYPE ]', imgX + imgW / 2, imgY + 360);
      ctx.fillStyle = 'rgba(244, 235, 221, 0.75)';
      ctx.font = '16px monospace';
      ctx.fillText(project.title, imgX + imgW / 2, imgY + 395);
      ctx.textAlign = 'left';
    }

    // Telemetry Status Badge inside Photo
    ctx.fillStyle = 'rgba(9, 13, 11, 0.92)';
    ctx.fillRect(imgX + 16, imgY + imgH - 52, 330, 36);
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.5)';
    ctx.lineWidth = 1.2;
    ctx.strokeRect(imgX + 16, imgY + imgH - 52, 330, 36);

    ctx.fillStyle = '#10B981';
    ctx.beginPath();
    ctx.arc(imgX + 34, imgY + imgH - 34, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#F4EBDD';
    ctx.font = 'bold 12.5px monospace';
    ctx.fillText(project.telemetryStatus || 'SYSTEM ACTIVE // 240MHz', imgX + 50, imgY + imgH - 30);

    // 4. Right Side: Advertising Copy & Hardware Specs
    const rightX = 648;

    // Node & Category Tag
    ctx.fillStyle = brandHex;
    ctx.font = 'bold 18px monospace';
    ctx.fillText(`PROJECT 0${index + 1} // ${project.category.toUpperCase()}`, rightX, 86);

    // Main Project Headline (Large & Bold)
    ctx.fillStyle = '#F4EBDD';
    ctx.font = 'bold 50px "Playfair Display", "Cinzel", Georgia, serif';
    ctx.fillText(project.title, rightX, 148);

    // Tagline in warm copper
    ctx.fillStyle = '#B17B53';
    ctx.font = 'italic 18px "JetBrains Mono", monospace';
    ctx.fillText(project.tagline, rightX, 192, 580);

    // Separator line
    ctx.strokeStyle = 'rgba(177, 123, 83, 0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(rightX, 214);
    ctx.lineTo(rightX + 580, 214);
    ctx.stroke();

    // Hardware Specs Matrix (4 framed rows)
    const specs = (project.specs || []).slice(0, 4);
    let curY = 236;
    specs.forEach((s) => {
      // Row box
      ctx.fillStyle = 'rgba(233, 221, 199, 0.08)';
      ctx.fillRect(rightX, curY, 580, 52);
      ctx.strokeStyle = 'rgba(233, 221, 199, 0.18)';
      ctx.lineWidth = 1.2;
      ctx.strokeRect(rightX, curY, 580, 52);

      // Label
      ctx.fillStyle = 'rgba(218, 202, 176, 0.85)';
      ctx.font = 'bold 12px monospace';
      ctx.fillText(s.label.toUpperCase(), rightX + 16, curY + 22);

      // Value
      ctx.fillStyle = '#F4EBDD';
      ctx.font = 'bold 15.5px monospace';
      ctx.fillText(s.val || s.value || 'N/A', rightX + 16, curY + 42, 548);

      curY += 62;
    });

    // Interactive CTA Banner (looks like an illuminated advertisement billboard prompt)
    const ctaY = 510;
    ctx.fillStyle = brandHex;
    ctx.fillRect(rightX, ctaY, 580, 58);
    ctx.fillStyle = '#0F1311';
    ctx.font = 'bold 17px monospace';
    ctx.fillText('⚡ OFFICIAL PROTOTYPE · TAP TO INSPECT ⚡', rightX + 46, ctaY + 36);

    // Engineering Lab Footer Info
    ctx.fillStyle = 'rgba(244, 235, 221, 0.58)';
    ctx.font = '12px monospace';
    ctx.fillText('DEPT OF ELECTRONICS & TELECOMMUNICATION', rightX, 620);
    ctx.fillText(`TELEMETRY COORDS: ${project.coords || '18.52° N / 73.85° E'}`, rightX, 646);
  }

  // Draw initial placeholder
  renderPoster(null);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;

  // Asynchronously load real project photo and repaint
  if (project.image) {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = project.image;
    img.onload = () => {
      renderPoster(img);
      texture.needsUpdate = true;
    };
  }

  return texture;
}

/**
 * Procedurally creates a high-res crisp button texture for interactive 3D billboard controls
 */
function createBillboardButtonTexture(label, brandHex) {
  const canvas = document.createElement('canvas');
  canvas.width = 320;
  canvas.height = 80;
  const ctx = canvas.getContext('2d');

  // Obsidian dark plate background
  ctx.fillStyle = '#161A18';
  ctx.fillRect(0, 0, 320, 80);

  // Subtle clean engineering border
  ctx.strokeStyle = brandHex;
  ctx.lineWidth = 2.5;
  ctx.strokeRect(5, 5, 310, 70);

  // Precision corner notches
  ctx.fillStyle = brandHex;
  ctx.fillRect(5, 5, 5, 5);
  ctx.fillRect(310, 5, 5, 5);
  ctx.fillRect(5, 70, 5, 5);
  ctx.fillRect(310, 70, 5, 5);

  // Label text with clean, crisp, professional typography
  ctx.fillStyle = '#F4EBDD';
  ctx.font = 'bold 18px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, 160, 40);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Procedurally generates physical 3D Advertisement Billboards along the circuit track
 * for every project in PROJECTS_DATA.
 *
 * Real-Life Billboard Architecture:
 * - Substantially BIGGER scale (Width: 6.4, Height: 3.8)
 * - Dual reinforced steel support columns with concrete foundation footings
 * - Rear structural cross bracing (X-truss)
 * - Dynamic Hovering: When rover is at exact station front point, billboard detaches and hovers upward with gentle organic float!
 * - Full Board Highlight: Poster face brightens with white backlight highlight, neon borders pulse with high radiance, and overhead floodlights blaze!
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
  let currentNightT = 0;

  projectsData.forEach((project, idx) => {
    // 1. Calculate progression along track dynamically
    const progress = (idx / total) % 1;
    const trackPoint = curve.getPointAt(progress);
    const tangent = curve.getTangentAt(progress).normalize();
    const normal = new THREE.Vector3().crossVectors(tangent, up).normalize();

    // Alternate sides of the track (left/right) for visual balance
    const side = idx % 2 === 0 ? 1 : -1;
    const stationOffset = normal.clone().multiplyScalar(side * 5.6);
    const stationPos = trackPoint.clone().add(stationOffset);

    // 2. Create Station 3D Container
    const stationObj = new THREE.Group();
    stationObj.position.copy(stationPos);
    stationObj.position.y = trackPoint.y;

    const brandColor = new THREE.Color(project.color || 0xB17B53);

    // 3. Hexagonal Foundation Platform (Expanded Plaza for bigger board)
    const hexGeom = new THREE.CylinderGeometry(4.2, 4.6, 0.5, 6);
    const hexMat = new THREE.MeshStandardMaterial({
      color: 0xE2D6C0, // Aged parchment concrete
      roughness: 0.75,
      metalness: 0.15,
      flatShading: true,
    });
    const platform = new THREE.Mesh(hexGeom, hexMat);
    platform.receiveShadow = true;
    stationObj.add(platform);

    // 4. Glowing Circular Circuit Pad (Dynamically highlights when active)
    const padGeom = new THREE.RingGeometry(1.4, 3.8, 32);
    const padMat = new THREE.MeshStandardMaterial({
      color: brandColor,
      emissive: brandColor,
      emissiveIntensity: 0.45,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
    });
    const pad = new THREE.Mesh(padGeom, padMat);
    pad.rotation.x = -Math.PI / 2;
    pad.position.y = 0.26;
    stationObj.add(pad);

    // 5. Ground Circuit Spur connecting Station to Main Track
    const spurGeom = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0.12, 0),
      stationOffset.clone().negate().setY(0.12),
    ]);
    const spurMat = new THREE.LineBasicMaterial({
      color: brandColor,
      linewidth: 2,
    });
    stationObj.add(new THREE.Line(spurGeom, spurMat));

    // -------------------------------------------------------------
    // 6. REAL-LIFE ADVERTISEMENT BILLBOARD STRUCTURE (SUBSTANTIALLY BIGGER)
    // -------------------------------------------------------------
    const billboardGroup = new THREE.Group();
    billboardGroup.name = `Billboard_${project.id}`;

    // Sturdy structural dark steel material
    const steelMat = new THREE.MeshStandardMaterial({
      color: 0x222623,
      metalness: 0.85,
      roughness: 0.35,
    });

    const concreteMat = new THREE.MeshStandardMaterial({
      color: 0xC8BCA7,
      roughness: 0.85,
      metalness: 0.1,
    });

    // A. Dual Support Columns & Footings (Anchored into Ground Plaza, strictly BEHIND board)
    const pillarGeom = new THREE.BoxGeometry(0.24, 5.8, 0.24);
    const footingGeom = new THREE.BoxGeometry(0.55, 0.32, 0.55);
    const pillarSpacing = 2.4; // Footprint behind billboard
    const pillarZ = -0.32; // Strictly behind board panel (z <= -0.20), zero intersection with poster!

    [-pillarSpacing, pillarSpacing].forEach((px) => {
      // Concrete Footing
      const footing = new THREE.Mesh(footingGeom, concreteMat);
      footing.position.set(px, 0.28, pillarZ);
      footing.castShadow = true;
      footing.receiveShadow = true;
      billboardGroup.add(footing);

      // Vertical Steel Column
      const pillar = new THREE.Mesh(pillarGeom, steelMat);
      pillar.position.set(px, 2.9, pillarZ);
      pillar.castShadow = true;
      billboardGroup.add(pillar);

      // Rear Horizontal Mounting Brackets (holding billboard frame from behind)
      [2.2, 4.0].forEach((by) => {
        const bracketGeom = new THREE.BoxGeometry(0.18, 0.14, 0.22);
        const bracket = new THREE.Mesh(bracketGeom, steelMat);
        bracket.position.set(px, by, -0.20);
        billboardGroup.add(bracket);
      });
    });

    // B. Rear Structural Cross Bracing (X-Truss behind columns)
    const trussPoints1 = [new THREE.Vector3(-pillarSpacing, 1.0, pillarZ), new THREE.Vector3(pillarSpacing, 4.8, pillarZ)];
    const trussPoints2 = [new THREE.Vector3(-pillarSpacing, 4.8, pillarZ), new THREE.Vector3(pillarSpacing, 1.0, pillarZ)];
    const trussMat = new THREE.LineBasicMaterial({ color: 0x4B544B, linewidth: 2 });
    billboardGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(trussPoints1), trussMat));
    billboardGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(trussPoints2), trussMat));

    // -------------------------------------------------------------
    // C. HOVERING BOARD HOUSING (Floats & Highlights on Arrival!)
    // -------------------------------------------------------------
    // Dimensions: Substantially bigger board (Width: 6.4, Height: 3.8)
    const boardW = 6.4;
    const boardH = 3.8;
    const baseBoardY = 3.35;

    const boardHousing = new THREE.Group();
    boardHousing.position.set(0, baseBoardY, 0);

    // Rear Billboard Panel Enclosure
    const backGeom = new THREE.BoxGeometry(boardW + 0.22, boardH + 0.22, 0.14);
    const backPanel = new THREE.Mesh(backGeom, steelMat);
    backPanel.position.set(0, 0, 0);
    backPanel.castShadow = true;
    boardHousing.add(backPanel);

    // Front Advertisement Poster Face (Dynamic canvas texture - Crisp, Dark, High-Contrast)
    const posterTexture = createBillboardPosterTexture(project, idx);
    const posterGeom = new THREE.PlaneGeometry(boardW, boardH);
    const posterMat = new THREE.MeshStandardMaterial({
      map: posterTexture,
      roughness: 0.85, // Matte finish: completely eliminates specular white glare
      metalness: 0.0,
      emissive: new THREE.Color(0x000000), // Pure black: ensures poster remains crystal clear & deep
      emissiveIntensity: 0.0,
    });
    const posterMesh = new THREE.Mesh(posterGeom, posterMat);
    posterMesh.position.set(0, 0, 0.075);
    posterMesh.receiveShadow = true;

    // Attach metadata for Raycasting / click detection
    posterMesh.userData = {
      isBillboard: true,
      waypointProject: project,
      waypointId: project.id,
    };
    boardHousing.add(posterMesh);

    // -------------------------------------------------------------
    // D. GLOWING BORDER FRAME (Top, Bottom, Left, Right Neon Bars)
    // -------------------------------------------------------------
    // Dedicated tubular neon border material around the perimeter (NOT covering poster)
    const borderMat = new THREE.MeshStandardMaterial({
      color: brandColor,
      emissive: brandColor,
      emissiveIntensity: 0.4, // Idle intensity
      roughness: 0.15,
      metalness: 0.9,
      toneMapped: false, // Ensures vivid bloom glow
    });

    const borderWidth = 0.15;
    const borderDepth = 0.22;

    // Top Border
    const topGeom = new THREE.BoxGeometry(boardW + 0.36, borderWidth, borderDepth);
    const topBorder = new THREE.Mesh(topGeom, borderMat);
    topBorder.position.set(0, boardH / 2 + borderWidth / 2, 0.08);
    boardHousing.add(topBorder);

    // Bottom Border
    const bottomGeom = new THREE.BoxGeometry(boardW + 0.36, borderWidth, borderDepth);
    const bottomBorder = new THREE.Mesh(bottomGeom, borderMat);
    bottomBorder.position.set(0, -boardH / 2 - borderWidth / 2, 0.08);
    boardHousing.add(bottomBorder);

    // Left Border
    const sideGeom = new THREE.BoxGeometry(borderWidth, boardH + borderWidth * 2, borderDepth);
    const leftBorder = new THREE.Mesh(sideGeom, borderMat);
    leftBorder.position.set(-boardW / 2 - borderWidth / 2, 0, 0.08);
    boardHousing.add(leftBorder);

    // Right Border
    const rightBorder = new THREE.Mesh(sideGeom, borderMat);
    rightBorder.position.set(boardW / 2 + borderWidth / 2, 0, 0.08);
    boardHousing.add(rightBorder);

    // 4 Corner LED Accent Caps
    const cornerCapGeom = new THREE.BoxGeometry(0.28, 0.28, 0.24);
    [
      [-boardW / 2 - borderWidth / 2, boardH / 2 + borderWidth / 2],
      [boardW / 2 + borderWidth / 2, boardH / 2 + borderWidth / 2],
      [-boardW / 2 - borderWidth / 2, -boardH / 2 - borderWidth / 2],
      [boardW / 2 + borderWidth / 2, -boardH / 2 - borderWidth / 2],
    ].forEach(([cx, cy]) => {
      const cap = new THREE.Mesh(cornerCapGeom, borderMat);
      cap.position.set(cx, cy, 0.09);
      boardHousing.add(cap);
    });

    // -------------------------------------------------------------
    // E. 4 OVERHEAD GOOSENECK FLOODLIGHT FIXTURES
    // -------------------------------------------------------------
    const armGeom = new THREE.BoxGeometry(0.06, 0.06, 0.85);
    const hoodGeom = new THREE.CylinderGeometry(0.16, 0.22, 0.24, 12);
    const lensMat = new THREE.MeshBasicMaterial({ color: 0xFFFBEB });

    [-2.1, -0.7, 0.7, 2.1].forEach((fx) => {
      // Horizontal gooseneck arm projecting forward from top of billboard
      const arm = new THREE.Mesh(armGeom, steelMat);
      arm.position.set(fx, boardH / 2 + 0.14, 0.45);
      boardHousing.add(arm);

      // Angled light fixture hood pointing down onto the billboard poster
      const hood = new THREE.Mesh(hoodGeom, steelMat);
      hood.rotation.x = Math.PI / 4;
      hood.position.set(fx, boardH / 2 + 0.12, 0.88);
      boardHousing.add(hood);

      // Glowing lens inside hood
      const lens = new THREE.Mesh(new THREE.CircleGeometry(0.15, 12), lensMat);
      lens.rotation.x = Math.PI / 4;
      lens.position.set(fx, boardH / 2 + 0.1, 0.89);
      boardHousing.add(lens);
    });

    // Dedicated Billboard Floodlight PointLight (Warm soft downward light, no wash-out)
    const billboardLight = new THREE.PointLight(0xFFE8C8, 0.35, 14, 1.8);
    billboardLight.position.set(0, boardH / 2 + 0.45, 1.2);
    boardHousing.add(billboardLight);
    pointLights.push(billboardLight);

    // -------------------------------------------------------------
    // F. 3 INTERACTIVE 3D ACTION BUTTONS (Clickable with Hover Feedback)
    // -------------------------------------------------------------
    const interactiveButtons = [];
    const buttonConfigs = [
      { id: 'blueprint', label: 'BLUEPRINT', x: -1.9, action: 'blueprint' },
      { id: 'focus', label: 'INSPECT', x: 0.0, action: 'focus' },
      { id: 'specs', label: 'SPECS', x: 1.9, action: 'specs' },
    ];

    const btnGeom = new THREE.BoxGeometry(1.72, 0.42, 0.12);
    const btnY = -boardH / 2 - 0.44;

    buttonConfigs.forEach((cfg) => {
      const btnTex = createBillboardButtonTexture(cfg.label, project.color || '#B17B53');
      const btnMat = new THREE.MeshStandardMaterial({
        map: btnTex,
        color: 0x1E2420,
        emissive: brandColor,
        emissiveIntensity: 0.25,
        roughness: 0.45,
        metalness: 0.2,
      });

      const btnMesh = new THREE.Mesh(btnGeom, btnMat);
      btnMesh.position.set(cfg.x, btnY, 0.12);
      btnMesh.castShadow = true;

      btnMesh.userData = {
        isInteractiveButton: true,
        action: cfg.action,
        project: project,
        waypointId: project.id,
        isHovered: false,
        setHovered: function (h) {
          this.isHovered = h;
        },
      };

      boardHousing.add(btnMesh);
      interactiveButtons.push(btnMesh);
    });

    billboardGroup.add(boardHousing);

    // -------------------------------------------------------------
    // F. BILLBOARD ORIENTATION: Face towards oncoming rover & parked camera
    // -------------------------------------------------------------
    // In Chase view, the camera is behind the rover along -tangent.
    // Orient the billboard so its front face (+Z) points towards the oncoming camera & rover:
    const lookTarget = trackPoint.clone().sub(tangent.clone().multiplyScalar(4.5));
    const localTarget = stationObj.worldToLocal(lookTarget);
    billboardGroup.lookAt(localTarget.x, baseBoardY, localTarget.z);

    stationObj.add(billboardGroup);

    // 7. Vertical Sci-Fi Sky Beacon Beam (Positioned strictly BEHIND billboard)
    const beamGeom = new THREE.CylinderGeometry(0.5, 1.8, 28, 16, 1, true);
    const beamMat = new THREE.MeshBasicMaterial({
      color: brandColor,
      transparent: true,
      opacity: 0.12,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const beam = new THREE.Mesh(beamGeom, beamMat);
    beam.position.set(0, 16, -3.2); // Anchored in billboardGroup, strictly behind the billboard
    billboardGroup.add(beam);
    beaconBeams.push(beam);

    stationsGroup.add(stationObj);

    // Dynamic glow, hover, and highlight state variables
    let currentGlow = 0.4;
    let currentLight = 0.35;
    let currentPadGlow = 0.45;

    // Store metadata for distance testing, HUD interaction, HOVERING & HIGHLIGHT
    waypoints.push({
      id: project.id,
      index: idx,
      progress,
      project,
      position: stationPos,
      radius: 5.8,
      billboardGroup,
      boardHousing,
      posterMesh,
      interactiveButtons,
      updateGlow: (isActive, delta, time) => {
        // 1. HOVER ANIMATION: Board lifts up and gently floats when rover is in front!
        const targetHoverY = isActive
          ? (baseBoardY + 0.65 + Math.sin(time * 2.8) * 0.16)
          : baseBoardY;
        boardHousing.position.y = THREE.MathUtils.lerp(boardHousing.position.y, targetHoverY, delta * 4.5);

        // Subtle organic levitation tilt
        const targetTiltZ = isActive ? (Math.sin(time * 2.0) * 0.018) : 0;
        boardHousing.rotation.z = THREE.MathUtils.lerp(boardHousing.rotation.z, targetTiltZ, delta * 4.0);

        // Subtle scale pop into focus on hover
        const targetScale = isActive ? 1.05 : 1.0;
        boardHousing.scale.setScalar(
          THREE.MathUtils.lerp(boardHousing.scale.x, targetScale, delta * 5.0)
        );

        // 2. POSTER FACE: Kept 100% dark, crisp and clear at all times (no white wash-out)

        // 3. GLOWING BORDER HIGHLIGHT: High-intensity animated breathing neon pulse
        const isPosterHovered = posterMesh.userData?.isHovered;
        const targetGlow = isActive
          ? (isPosterHovered ? 4.8 : (3.5 + 1.2 * Math.sin(time * 6.0)))
          : (isPosterHovered ? 2.5 : 0.4);
        currentGlow = THREE.MathUtils.lerp(currentGlow, targetGlow, delta * 7.0);
        borderMat.emissiveIntensity = currentGlow;

        // 4. INTERACTIVE 3D BUTTONS HOVER ANIMATION: Subtle scale pop & refined industrial glow
        interactiveButtons.forEach((btnMesh) => {
          const isHov = btnMesh.userData.isHovered;
          const targetBtnScale = isHov ? 1.08 : 1.0;
          btnMesh.scale.setScalar(
            THREE.MathUtils.lerp(btnMesh.scale.x, targetBtnScale, delta * 12.0)
          );

          const targetBtnEmissive = isHov ? 0.95 : (isActive ? 0.5 : 0.2);
          btnMesh.material.emissiveIntensity = THREE.MathUtils.lerp(
            btnMesh.material.emissiveIntensity,
            targetBtnEmissive,
            delta * 10.0
          );
        });

        // Floodlight illumination highlight (soft warm architectural spotlighting, no over-exposure)
        const targetLight = isActive ? 0.9 : 0.35;
        currentLight = THREE.MathUtils.lerp(currentLight, targetLight, delta * 6.0);
        billboardLight.intensity = currentLight;

        // Ground Platform Circuit Pad highlight
        const targetPadGlow = isActive ? 1.4 : 0.45;
        currentPadGlow = THREE.MathUtils.lerp(currentPadGlow, targetPadGlow, delta * 5.0);
        padMat.emissiveIntensity = currentPadGlow;

        // Fade out sky beacon when rover arrives at station so the billboard is 100% unobstructed & clear
        const targetBeamOpacity = isActive ? 0.0 : (0.12 + currentNightT * 0.38);
        beamMat.opacity = THREE.MathUtils.lerp(beamMat.opacity, targetBeamOpacity, delta * 6.0);
      },
    });
  });

  // Collect all interactive objects (posters + 3D buttons) across all waypoints
  const allInteractiveObjects = [];
  waypoints.forEach((wp) => {
    if (wp.posterMesh) allInteractiveObjects.push(wp.posterMesh);
    if (wp.interactiveButtons) {
      allInteractiveObjects.push(...wp.interactiveButtons);
    }
  });

  // Time of Day transition handler & exposed interactive targets
  stationsGroup.userData = {
    interactiveObjects: allInteractiveObjects,
    setNightTransition: (nightT) => {
      currentNightT = nightT;
      // In night mode, warm billboard floodlights adjust subtly
      pointLights.forEach((light) => {
        light.intensity = 0.35 + nightT * 0.45;
        light.distance = 14 + nightT * 4;
      });
    },
  };

  return { stationsGroup, waypoints };
}
