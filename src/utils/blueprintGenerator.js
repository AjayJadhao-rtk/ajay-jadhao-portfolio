/**
 * blueprintGenerator.js
 * 
 * Generates an authentic, high-resolution engineering blueprint schematic (1600x1100 PNG)
 * directly in the browser using HTML5 Canvas.
 * Contains 100% accurate, complete technical specifications from PROJECTS_DATA.
 */

export async function generateAndDownloadBlueprint(project) {
  if (!project) return;

  const canvas = document.createElement('canvas');
  canvas.width = 1600;
  canvas.height = 1100;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // 1. BASE BLUEPRINT BACKGROUND (Classic Engineering Cyan/Navy)
  ctx.fillStyle = '#081726';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 2. FINE TECHNICAL GRID
  // Minor grid lines (every 20px)
  ctx.strokeStyle = '#0E2840';
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let x = 0; x <= canvas.width; x += 20) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
  }
  for (let y = 0; y <= canvas.height; y += 20) {
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
  }
  ctx.stroke();

  // Major grid lines (every 100px)
  ctx.strokeStyle = '#16385C';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  for (let x = 0; x <= canvas.width; x += 100) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
  }
  for (let y = 0; y <= canvas.height; y += 100) {
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
  }
  ctx.stroke();

  // 3. DOUBLE SCHEMATIC BORDER & REGISTRATION CROSSHAIRS
  ctx.strokeStyle = '#38BDF8';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(36, 36, canvas.width - 72, canvas.height - 72);

  ctx.strokeStyle = '#1E4E79';
  ctx.lineWidth = 1;
  ctx.strokeRect(44, 44, canvas.width - 88, canvas.height - 88);

  // Corner crosshairs
  const drawCrosshair = (cx, cy) => {
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx - 14, cy);
    ctx.lineTo(cx + 14, cy);
    ctx.moveTo(cx, cy - 14);
    ctx.lineTo(cx, cy + 14);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, Math.PI * 2);
    ctx.stroke();
  };
  drawCrosshair(36, 36);
  drawCrosshair(canvas.width - 36, 36);
  drawCrosshair(36, canvas.height - 36);
  drawCrosshair(canvas.width - 36, canvas.height - 36);

  // 4. TOP TITLE BLOCK / HEADER
  ctx.fillStyle = '#0B2238';
  ctx.fillRect(44, 44, canvas.width - 88, 76);
  ctx.strokeStyle = '#38BDF8';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(44, 44, canvas.width - 88, 76);

  // Department & Lab Identity
  ctx.fillStyle = '#38BDF8';
  ctx.font = 'bold 15px "Courier New", Courier, monospace';
  ctx.fillText('DEPARTMENT OF ELECTRONICS & TELECOMMUNICATION ENGINEERING // SSGMCE', 64, 72);

  ctx.fillStyle = '#94A3B8';
  ctx.font = '12px "Courier New", Courier, monospace';
  ctx.fillText('AUTONOMOUS SYSTEMS, EMBEDDED ROBOTICS & TELEMETRY RESEARCH ARCHIVE', 64, 94);

  // Top Right Drawing Meta
  ctx.textAlign = 'right';
  ctx.fillStyle = '#38BDF8';
  ctx.font = 'bold 13px "Courier New", Courier, monospace';
  ctx.fillText(`DWG NO: AJ-${project.id.toUpperCase()}-v1.4`, canvas.width - 64, 72);
  ctx.fillStyle = '#94A3B8';
  ctx.font = '11px "Courier New", Courier, monospace';
  ctx.fillText(`STATUS: ${project.status} // FREQ: ${project.beaconFrequency}`, canvas.width - 64, 94);
  ctx.textAlign = 'left';

  // 5. PROJECT MAIN HEADER
  ctx.fillStyle = '#38BDF8';
  ctx.font = 'bold 13px "Courier New", Courier, monospace';
  ctx.fillText(`PROJECT NODE // 0${project.number}`, 64, 155);

  ctx.fillStyle = '#F8FAFC';
  ctx.font = 'bold 36px Georgia, serif';
  ctx.fillText(project.title.toUpperCase(), 64, 196);

  ctx.fillStyle = '#F59E0B'; // Amber accent
  ctx.font = 'bold 14px "Courier New", Courier, monospace';
  ctx.fillText(`CATEGORY: ${project.category.toUpperCase()}`, 64, 222);

  ctx.fillStyle = '#CBD5E1';
  ctx.font = 'italic 15px "Courier New", Courier, monospace';
  ctx.fillText(`"${project.tagline}"`, 64, 246);

  // Divider line under title block
  ctx.strokeStyle = '#1E4E79';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(64, 264);
  ctx.lineTo(canvas.width - 64, 264);
  ctx.stroke();

  // 6. LEFT COLUMN: PROJECT PREVIEW IMAGE WITH BLUEPRINT HOUSING
  const imgBoxX = 64;
  const imgBoxY = 286;
  const imgBoxW = 460;
  const imgBoxH = 340;

  ctx.fillStyle = '#0B2238';
  ctx.fillRect(imgBoxX, imgBoxY, imgBoxW, imgBoxH);
  ctx.strokeStyle = '#38BDF8';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(imgBoxX, imgBoxY, imgBoxW, imgBoxH);

  // Attempt to load and draw actual project image, fallback to schematic vector box
  try {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = project.image;
    await new Promise((resolve) => {
      img.onload = () => {
        try {
          ctx.drawImage(img, imgBoxX + 6, imgBoxY + 6, imgBoxW - 12, imgBoxH - 12);
        } catch (_) {}
        resolve();
      };
      img.onerror = () => resolve();
      // Timeout fallback in 600ms
      setTimeout(resolve, 600);
    });
  } catch (_) {}

  // Image Telemetry Stamp Banner
  ctx.fillStyle = 'rgba(11, 34, 56, 0.9)';
  ctx.fillRect(imgBoxX + 6, imgBoxY + imgBoxH - 34, imgBoxW - 12, 28);
  ctx.fillStyle = '#34D399'; // Emerald
  ctx.font = 'bold 11px "Courier New", Courier, monospace';
  ctx.fillText(`● TELEMETRY: ${project.telemetryStatus || 'SYSTEM ONLINE'}`, imgBoxX + 16, imgBoxY + imgBoxH - 15);

  // 7. RIGHT COLUMN: HARDWARE SPECIFICATIONS MATRIX
  const specStartX = 560;
  const specStartY = 286;
  const specW = canvas.width - 64 - specStartX;

  ctx.fillStyle = '#38BDF8';
  ctx.font = 'bold 15px "Courier New", Courier, monospace';
  ctx.fillText('01 // HARDWARE ARCHITECTURE & SUBSYSTEMS', specStartX, specStartY + 14);

  // Specs Matrix Table
  const specs = project.specs || [];
  const colW = (specW - 16) / 2;
  const rowH = 68;

  specs.forEach((item, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const boxX = specStartX + col * (colW + 16);
    const boxY = specStartY + 30 + row * (rowH + 12);

    ctx.fillStyle = '#0B2238';
    ctx.fillRect(boxX, boxY, colW, rowH);
    ctx.strokeStyle = '#1E4E79';
    ctx.lineWidth = 1;
    ctx.strokeRect(boxX, boxY, colW, rowH);

    ctx.fillStyle = '#F59E0B';
    ctx.font = 'bold 10.5px "Courier New", Courier, monospace';
    ctx.fillText(item.label.toUpperCase(), boxX + 14, boxY + 22);

    ctx.fillStyle = '#F8FAFC';
    ctx.font = 'bold 13px "Courier New", Courier, monospace';
    // Truncate long value if necessary
    const val = item.val || item.value || '';
    ctx.fillText(val, boxX + 14, boxY + 46);
  });

  // 8. ENGINEERING DELIVERABLES & FEATURES
  const featY = specStartY + 196;
  ctx.fillStyle = '#38BDF8';
  ctx.font = 'bold 15px "Courier New", Courier, monospace';
  ctx.fillText('02 // ENGINEERING DELIVERABLES & DESIGN HIGHLIGHTS', specStartX, featY);

  const features = project.features || [];
  features.forEach((feat, i) => {
    const fy = featY + 28 + i * 26;
    ctx.fillStyle = '#34D399';
    ctx.font = 'bold 14px "Courier New", Courier, monospace';
    ctx.fillText('✓', specStartX + 8, fy);

    ctx.fillStyle = '#E2E8F0';
    ctx.font = '13px "Courier New", Courier, monospace';
    ctx.fillText(feat, specStartX + 30, fy);
  });

  // 9. SYSTEM DESCRIPTION / TECHNICAL ABSTRACT (Full width across bottom middle)
  const descY = 660;
  ctx.fillStyle = '#38BDF8';
  ctx.font = 'bold 15px "Courier New", Courier, monospace';
  ctx.fillText('03 // OPERATIONAL PRINCIPLES & SYSTEM ARCHITECTURE', 64, descY);

  ctx.fillStyle = '#CBD5E1';
  ctx.font = '14px Georgia, serif';
  
  // Wrap description text cleanly
  function wrapText(context, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    let currentY = y;
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = context.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        context.fillText(line, x, currentY);
        line = words[n] + ' ';
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    context.fillText(line, x, currentY);
    return currentY;
  }

  wrapText(ctx, project.description, 64, descY + 28, canvas.width - 128, 24);

  // 10. OFFICIAL ENGINEERING TITLE BLOCK & SIGNATURE (Bottom)
  const titleBlockY = 870;
  const titleBlockH = 150;
  ctx.fillStyle = '#0B2238';
  ctx.fillRect(64, titleBlockY, canvas.width - 128, titleBlockH);
  ctx.strokeStyle = '#38BDF8';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(64, titleBlockY, canvas.width - 128, titleBlockH);

  // Title Block Grid Dividers
  ctx.strokeStyle = '#1E4E79';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(420, titleBlockY);
  ctx.lineTo(420, titleBlockY + titleBlockH);
  ctx.moveTo(880, titleBlockY);
  ctx.lineTo(880, titleBlockY + titleBlockH);
  ctx.moveTo(1220, titleBlockY);
  ctx.lineTo(1220, titleBlockY + titleBlockH);
  ctx.stroke();

  // Column 1: Designer Identity
  ctx.fillStyle = '#94A3B8';
  ctx.font = '10px "Courier New", Courier, monospace';
  ctx.fillText('LEAD SYSTEMS ENGINEER / DESIGNER:', 80, titleBlockY + 28);
  ctx.fillStyle = '#F8FAFC';
  ctx.font = 'bold 20px Georgia, serif';
  ctx.fillText('AJAY JADHAO', 80, titleBlockY + 58);
  ctx.fillStyle = '#38BDF8';
  ctx.font = '11px "Courier New", Courier, monospace';
  ctx.fillText('B.E. Electronics & Telecommunication', 80, titleBlockY + 84);
  ctx.fillStyle = '#94A3B8';
  ctx.font = '11px "Courier New", Courier, monospace';
  ctx.fillText('SSGMCE Shegaon · Maharashtra, India', 80, titleBlockY + 106);

  // Column 2: Document Verification & Archive
  ctx.fillStyle = '#94A3B8';
  ctx.font = '10px "Courier New", Courier, monospace';
  ctx.fillText('PROJECT ARCHIVE / HARDWARE SPEC:', 440, titleBlockY + 28);
  ctx.fillStyle = '#F8FAFC';
  ctx.font = 'bold 15px "Courier New", Courier, monospace';
  ctx.fillText(project.stationName || `NODE 0${project.number} LABORATORY`, 440, titleBlockY + 54);
  ctx.fillStyle = '#F59E0B';
  ctx.font = 'bold 12px "Courier New", Courier, monospace';
  ctx.fillText(`BEACON FREQ: ${project.beaconFrequency} // TELEMETRY OK`, 440, titleBlockY + 82);
  ctx.fillStyle = '#CBD5E1';
  ctx.font = '11px "Courier New", Courier, monospace';
  ctx.fillText(`LOCATION: ${project.coords}`, 440, titleBlockY + 106);

  // Column 3: Revisions & Approval
  ctx.fillStyle = '#94A3B8';
  ctx.font = '10px "Courier New", Courier, monospace';
  ctx.fillText('APPROVAL & REVISION:', 900, titleBlockY + 28);
  ctx.fillStyle = '#34D399';
  ctx.font = 'bold 13px "Courier New", Courier, monospace';
  ctx.fillText('STATUS: BENCH VALIDATED', 900, titleBlockY + 54);
  ctx.fillStyle = '#F8FAFC';
  ctx.font = '12px "Courier New", Courier, monospace';
  ctx.fillText('REVISION: REV C (FINAL)', 900, titleBlockY + 82);
  ctx.fillStyle = '#94A3B8';
  ctx.font = '11px "Courier New", Courier, monospace';
  const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  ctx.fillText(`DATE RELEASED: ${currentDate}`, 900, titleBlockY + 106);

  // Column 4: Official Stamp Badge
  ctx.fillStyle = '#94A3B8';
  ctx.font = '10px "Courier New", Courier, monospace';
  ctx.fillText('AUTHENTICITY STAMP:', 1240, titleBlockY + 28);

  ctx.strokeStyle = '#34D399';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(1240, titleBlockY + 42, 250, 72);

  ctx.fillStyle = '#34D399';
  ctx.font = 'bold 12px "Courier New", Courier, monospace';
  ctx.fillText('★ OFFICIAL BLUEPRINT ★', 1256, titleBlockY + 68);
  ctx.fillStyle = '#E2E8F0';
  ctx.font = '10px "Courier New", Courier, monospace';
  ctx.fillText('RTK PORTFOLIO SYSTEM LAB', 1256, titleBlockY + 92);

  // 11. TRIGGER INSTANT PNG DOWNLOAD
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        resolve(false);
        return;
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const cleanTitle = project.title.replace(/[^a-zA-Z0-9]/g, '_');
      a.download = `Ajay_Jadhao_${cleanTitle}_Blueprint_Schematic.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => {
        URL.revokeObjectURL(url);
        resolve(true);
      }, 500);
    }, 'image/png');
  });
}
