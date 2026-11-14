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
          const decay = Math.exp(-progress * 4.5);
          const oscillation = Math.sin(progress * Math.PI * 3.5);
          const currentRadius = 15 + progress * 220; // Expands outward from tap
          const amplitude = decay * (1 - progress);

          if (amplitude > 0.01) {
            ctx.save();
            ctx.translate(ripple.x, ripple.y);

            // 1. Central surface depression core (inward bend)
            const coreGradient = ctx.createRadialGradient(
              0,
              0,
              0,
              0,
              0,
              Math.max(10, currentRadius * 0.75)
            );
            // Inward shadow gives the visual depth of the surface dipping down
            coreGradient.addColorStop(
              0,
              `rgba(41, 43, 39, ${0.18 * amplitude * (oscillation < 0 ? 0.3 : 1)})`
            );
            coreGradient.addColorStop(
              0.5,
              `rgba(41, 43, 39, ${0.08 * amplitude})`
            );
            coreGradient.addColorStop(1, 'rgba(41, 43, 39, 0)');

            ctx.fillStyle = coreGradient;
            ctx.beginPath();
            ctx.arc(0, 0, Math.max(10, currentRadius * 0.75), 0, Math.PI * 2);
            ctx.fill();

            // 2. Refractive Elastic Wave Front (Light highlight on top-left, shadow on bottom-right)
            // Light source: Sun angle (-45 deg = 135 deg in canvas radians)
            const ringWidth = Math.max(4, 18 * decay);

            // Upper-left illuminated rim (warm ivory glow)
            ctx.beginPath();
            ctx.arc(0, 0, currentRadius, Math.PI * 0.75, Math.PI * 1.85);
            ctx.strokeStyle = `rgba(255, 250, 240, ${0.45 * amplitude})`;
            ctx.lineWidth = ringWidth;
            ctx.lineCap = 'round';
            ctx.shadowColor = 'rgba(255, 245, 225, 0.6)';
            ctx.shadowBlur = 6 * amplitude;
            ctx.stroke();

            // Bottom-right shadowed rim (tactile indentation crease)
            ctx.beginPath();
            ctx.arc(0, 0, currentRadius, Math.PI * 1.85, Math.PI * 2.75);
            ctx.strokeStyle = `rgba(38, 53, 45, ${0.32 * amplitude})`;
            ctx.lineWidth = ringWidth * 0.9;
            ctx.lineCap = 'round';
            ctx.shadowBlur = 0;
            ctx.stroke();

            // 3. Secondary subtle inner rebound ring (elastic recoil)
            if (currentRadius > 35) {
              const innerRadius = currentRadius * 0.55;
              ctx.beginPath();
              ctx.arc(0, 0, innerRadius, 0, Math.PI * 2);
              ctx.strokeStyle = `rgba(177, 123, 83, ${0.16 * amplitude})`;
              ctx.lineWidth = Math.max(1.5, ringWidth * 0.5);
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
