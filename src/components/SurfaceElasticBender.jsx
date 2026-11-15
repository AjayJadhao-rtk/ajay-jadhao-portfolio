import React, { useEffect, useRef } from 'react';
import { audioEngine } from '../utils/audioSystem';

/**
 * SurfaceElasticBender creates a tactile physical surface bending response.
 * When the user taps or clicks anywhere on the screen:
 * 1. The surface around the tap coordinate physically bends inward with an elastic indentation.
 * 2. An expanding radial refraction wave (light rim + shadow rim) propagates outward.
 * 3. The surface spring-rebounds back to rest in ~450ms.
 * 4. Accompanied by a subtle acoustic surface-tap tactile haptic tone.
 * 
 * Entirely non-blocking (pointer-events-none), zero impact on scrolling or links.
 */
export default function SurfaceElasticBender({ containerRef }) {
  const canvasRef = useRef(null);
  const ripplesRef = useRef([]);
  const animIdRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // High DPI Retina Support
    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });

    // Render loop for elastic surface bending
    const render = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      const now = performance.now();
      const activeRipples = [];

      for (let i = 0; i < ripplesRef.current.length; i++) {
        const ripple = ripplesRef.current[i];
        const elapsed = (now - ripple.startTime) / 1000; // in seconds
        const duration = 0.52; // 520ms elastic rebound

        if (elapsed < duration) {
          activeRipples.push(ripple);

          const progress = elapsed / duration;
          // Elastic spring decay curve: f(t) = exp(-5t) * sin(12t)
          const decay = Math.exp(-progress * 5.0);
          const oscillation = Math.sin(progress * Math.PI * 3.5);

          // Significantly reduced area, especially compact and tight on mobile
          const isMobileViewport = window.innerWidth < 768;
          const maxSpread = isMobileViewport ? 36 : 68;
          const currentRadius = 8 + progress * maxSpread;
          const amplitude = decay * (1 - progress);

          if (amplitude > 0.01) {
            ctx.save();
            ctx.translate(ripple.x, ripple.y);

            // 1. Central subtle surface depression core (inward bend)
            const coreRadius = Math.max(6, currentRadius * 0.45);
            const coreGradient = ctx.createRadialGradient(
              0,
              0,
              0,
              0,
              0,
              coreRadius
            );
            // Inward shadow gives the visual depth of the surface dipping down
            coreGradient.addColorStop(
              0,
              `rgba(41, 43, 39, ${0.14 * amplitude * (oscillation < 0 ? 0.3 : 1)})`
            );
            coreGradient.addColorStop(
              0.6,
              `rgba(41, 43, 39, ${0.05 * amplitude})`
            );
            coreGradient.addColorStop(1, 'rgba(41, 43, 39, 0)');

            ctx.fillStyle = coreGradient;
            ctx.beginPath();
            ctx.arc(0, 0, coreRadius, 0, Math.PI * 2);
            ctx.fill();

            // 2. Refractive Elastic Wave Front (Subtle compact rim)
            const ringWidth = Math.max(1.5, (isMobileViewport ? 5 : 8) * decay);

            // Upper-left illuminated rim (warm ivory glow)
            ctx.beginPath();
            ctx.arc(0, 0, currentRadius, Math.PI * 0.75, Math.PI * 1.85);
            ctx.strokeStyle = `rgba(255, 250, 240, ${0.38 * amplitude})`;
            ctx.lineWidth = ringWidth;
            ctx.lineCap = 'round';
            ctx.stroke();

            // Bottom-right shadowed rim (tactile indentation crease)
            ctx.beginPath();
            ctx.arc(0, 0, currentRadius, Math.PI * 1.85, Math.PI * 2.75);
            ctx.strokeStyle = `rgba(38, 53, 45, ${0.24 * amplitude})`;
            ctx.lineWidth = ringWidth * 0.85;
            ctx.lineCap = 'round';
            ctx.stroke();

            // 3. Secondary subtle inner rebound ring (elastic recoil)
            if (currentRadius > 22) {
              const innerRadius = currentRadius * 0.55;
              ctx.beginPath();
              ctx.arc(0, 0, innerRadius, 0, Math.PI * 2);
              ctx.strokeStyle = `rgba(177, 123, 83, ${0.12 * amplitude})`;
              ctx.lineWidth = Math.max(1, ringWidth * 0.4);
              ctx.stroke();
            }

            ctx.restore();
          }
        }
      }

      ripplesRef.current = activeRipples;

      if (activeRipples.length > 0) {
        animIdRef.current = requestAnimationFrame(render);
      } else {
        animIdRef.current = null;
      }
    };

    // Handle touch/tap/click globally
    const handlePointerDown = (e) => {
      // Ignore right clicks
      if (e.button && e.button !== 0) return;

      const x = e.clientX;
      const y = e.clientY;

      // Add new elastic bend wave
      ripplesRef.current.push({
        x,
        y,
        startTime: performance.now(),
      });

      // Play soft acoustic surface-tap tactile sound
      audioEngine.playSurfaceBend();

      // Start render loop for canvas ripple if not running
      if (!animIdRef.current) {
        animIdRef.current = requestAnimationFrame(render);
      }
    };

    window.addEventListener('pointerdown', handlePointerDown, { passive: true });

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('pointerdown', handlePointerDown);
      if (animIdRef.current) {
        cancelAnimationFrame(animIdRef.current);
      }
    };
  }, [containerRef]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-50 select-none"
      style={{ willChange: 'transform' }}
    />
  );
}
