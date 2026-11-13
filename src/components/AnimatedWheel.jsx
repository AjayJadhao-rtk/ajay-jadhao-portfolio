import React, { useState, useEffect, useRef } from 'react';

/**
 * AnimatedWheel Component
 * 
 * Features:
 * 1. Clockwise rotation around its exact hub center.
 * 2. Positioned at exact coordinates from "Wheel placement reference image.png" (cx=412, cy=283 in 1451x821 viewBox).
 * 3. Default rotation is majestic and steady.
 * 4. When mouse hovers or moves over the wheel, rotation speed increases smoothly with momentum.
 * 5. When mouse moves out, wheel smoothly returns to default rotation speed with natural deceleration.
 * 6. Includes the delicate technical compass/blueprint orbit rings and crosshair axes behind the wheel.
 * 7. Matches the parallax drift of the cloud strips for locked perspective.
 */
export default function AnimatedWheel() {
  const [isHovered, setIsHovered] = useState(false);
  const [rpmDisplay, setRpmDisplay] = useState('2.5 RPM');
  const [mouseShift, setMouseShift] = useState({ x: 0, y: 0 });

  const wheelGroupRef = useRef(null);
  const angleRef = useRef(0);
  const lastTimeRef = useRef(null);
  const animFrameIdRef = useRef(null);

  // Speed in degrees per millisecond
  const defaultSpeed = 0.022; // ~16.3 seconds per full 360 turn
  const hoverBaseSpeed = 0.15; // ~2.4 seconds per full 360 turn (approx 6.8x faster)
  const currentSpeedRef = useRef(defaultSpeed);
  const targetSpeedRef = useRef(defaultSpeed);
  const isHoveredRef = useRef(false);
  const lastMouseMoveTime = useRef(0);

  // Parallax tracking matching the cloud strips
  useEffect(() => {
    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const xNorm = (e.clientX / innerWidth - 0.5) * 2;
      const yNorm = (e.clientY / innerHeight - 0.5) * 2;
      setMouseShift({
        x: xNorm * 10,
        y: yNorm * 6,
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Butter-smooth continuous rotation loop with momentum physics
  useEffect(() => {
    let rpmThrottleCounter = 0;

    const animateWheel = (time) => {
      if (!lastTimeRef.current) lastTimeRef.current = time;
      const dt = Math.min(64, Math.max(1, time - lastTimeRef.current));
      lastTimeRef.current = time;

      // Smooth inertia lerp
      const lerp = isHoveredRef.current ? 0.08 : 0.035;
      currentSpeedRef.current += (targetSpeedRef.current - currentSpeedRef.current) * lerp;

      // Clockwise rotation
      angleRef.current = (angleRef.current + currentSpeedRef.current * dt) % 360;

      if (wheelGroupRef.current) {
        wheelGroupRef.current.setAttribute(
          'transform',
          `rotate(${angleRef.current.toFixed(2)})`
        );
      }

      // Update RPM display every ~15 frames to prevent React re-render lag
      rpmThrottleCounter++;
      if (rpmThrottleCounter % 15 === 0) {
        const rpm = (currentSpeedRef.current * 1000 / 360 * 60).toFixed(1);
        setRpmDisplay(`${rpm} RPM`);
      }

      animFrameIdRef.current = requestAnimationFrame(animateWheel);
    };

    animFrameIdRef.current = requestAnimationFrame(animateWheel);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, []);

  // Hover handlers
  const handleMouseEnter = () => {
    isHoveredRef.current = true;
    setIsHovered(true);
    targetSpeedRef.current = hoverBaseSpeed;
  };

  const handleMouseMoveOverWheel = (e) => {
    isHoveredRef.current = true;
    // Boost speed based on mouse movement activity
    const now = performance.now();
    const dt = now - lastMouseMoveTime.current;
    lastMouseMoveTime.current = now;

    if (dt > 10 && dt < 200) {
      // Extra dynamic burst on active mouse scrubbing up to 0.28 deg/ms (~1.3s per rotation)
      targetSpeedRef.current = Math.min(0.28, hoverBaseSpeed + 0.08);
    }
  };

  const handleMouseLeave = () => {
    isHoveredRef.current = false;
    setIsHovered(false);
    targetSpeedRef.current = defaultSpeed;
  };

  return (
    <div className="relative w-full h-full max-w-[1920px] mx-auto select-none pointer-events-none overflow-hidden flex items-center justify-start">
      
      {/* Parallax coordinate wrapper matching cloud strips */}
      <div
        className="relative w-full h-full transition-transform duration-500 ease-out flex items-center justify-start"
        style={{
          transform: `translate3d(${mouseShift.x}px, ${mouseShift.y}px, 0)`,
          willChange: 'transform',
        }}
      >
        {/* SVG Stage matching 1451x821 coordinate system */}
        <svg
          viewBox="0 0 1451 821"
          preserveAspectRatio="xMinYMid meet"
          className="w-full h-full overflow-visible pointer-events-none"
        >
          <defs>
            {/* Subtle glow filter on high-speed spin */}
            <filter id="gearGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Master Anchor: positioned exactly at (cx=412, cy=283) */}
          <g transform="translate(412, 283)">

            {/* ================================================================= */}
            {/* 1. TECHNICAL BLUEPRINT COMPASS ORBITS & CROSSHAIRS (Behind Wheel) */}
            {/* ================================================================= */}
            <g className="transition-opacity duration-500" opacity={isHovered ? 0.75 : 0.45}>
              {/* Horizontal Crosshair Line: from x=-120 (x=292) to x=+303 (x=715) */}
              <line
                x1="-120"
                y1="0"
                x2="303"
                y2="0"
                stroke="#2B302E"
                strokeWidth="0.8"
                strokeDasharray="4 2 1 2"
              />
              {/* Terminal dots on horizontal crosshair */}
              <circle cx="-120" cy="0" r="3" fill="#2B302E" />
              <circle cx="303" cy="0" r="3" fill="#2B302E" />

              {/* Vertical Crosshair Line: from y=-195 (y=88) to y=+197 (y=480) */}
              <line
                x1="0"
                y1="-195"
                x2="0"
                y2="197"
                stroke="#2B302E"
                strokeWidth="0.8"
                strokeDasharray="4 2 1 2"
              />
              {/* Terminal dot on bottom vertical crosshair */}
              <circle cx="0" cy="197" r="3" fill="#2B302E" />

              {/* Inner concentric orbit ring (r = 120) */}
              <circle
                cx="0"
                cy="0"
                r="120"
                fill="none"
                stroke="#2B302E"
                strokeWidth="0.75"
                strokeOpacity="0.6"
              />

              {/* Middle concentric compass ring (r = 160) */}
              <circle
                cx="0"
                cy="0"
                r="160"
                fill="none"
                stroke="#2B302E"
                strokeWidth="0.6"
                strokeOpacity="0.4"
              />

              {/* Outer dashed orbit circle (r = 205) */}
              <circle
                cx="0"
                cy="0"
                r="205"
                fill="none"
                stroke="#2B302E"
                strokeWidth="0.75"
                strokeDasharray="3 3"
                strokeOpacity="0.5"
              />

              {/* Extended compass outer arc (r = 240) */}
              <path
                d="M 170 -170 A 240 240 0 0 1 240 0"
                fill="none"
                stroke="#2B302E"
                strokeWidth="0.7"
                strokeOpacity="0.5"
              />

              {/* Diagonal calibration tick and dot at ~45 degrees */}
              <circle cx="-85" cy="-85" r="2" fill="#2B302E" />
              <circle cx="85" cy="85" r="2" fill="#2B302E" />
            </g>

            {/* ================================================================= */}
            {/* 2. ROTATING WHEEL (Clockwise continuous rotation + speed up on hover) */}
            {/* ================================================================= */}
            <g
              ref={wheelGroupRef}
              className="will-change-transform"
              style={{
                transformOrigin: '0px 0px',
              }}
            >
              {/* The high-res isolated wheel asset, perfectly centered at (0, 0) */}
              <image
                href="/assets/Wheel/wheel_isolated.png"
                x="-211"
                y="-211"
                width="422"
                height="422"
                preserveAspectRatio="xMidYMid meet"
                className="pointer-events-none drop-shadow-md select-none"
              />
            </g>

            {/* ================================================================= */}
            {/* 3. CENTER HUB PIN & CALIBRATION ACCENT */}
            {/* ================================================================= */}
            <circle
              cx="0"
              cy="0"
              r="6.5"
              fill="#222624"
              stroke="#D4CEBE"
              strokeWidth="1.5"
              className="pointer-events-none"
            />
            <circle
              cx="0"
              cy="0"
              r="2"
              fill={isHovered ? "#38BDF8" : "#8E948F"}
              className="transition-colors duration-300 pointer-events-none"
            />

            {/* ================================================================= */}
            {/* 4. INTERACTIVE HOVER HITBOX (Covers full wheel disc) */}
            {/* ================================================================= */}
            <circle
              cx="0"
              cy="0"
              r="215"
              fill="rgba(0,0,0,0.001)"
              pointerEvents="all"
              className="cursor-pointer"
              onMouseEnter={handleMouseEnter}
              onMouseMove={handleMouseMoveOverWheel}
              onMouseLeave={handleMouseLeave}
            />

            {/* ================================================================= */}
            {/* 5. TACTILE TELEMETRY CALLOUT (Subtle engineering HUD label on hover) */}
            {/* ================================================================= */}
            <g
              transform="translate(140, -170)"
              className="transition-all duration-300 pointer-events-none select-none font-mono text-[9px]"
              opacity={isHovered ? 1 : 0}
              style={{
                transform: isHovered ? 'translate(140px, -170px)' : 'translate(130px, -160px)',
              }}
            >
              <rect
                x="-8"
                y="-11"
                width="84"
                height="18"
                rx="3"
                fill="#242825"
                fillOpacity="0.92"
                stroke="#38BDF8"
                strokeWidth="0.75"
              />
              <text x="0" y="2" fill="#E2F1EC" fontSize="8" fontWeight="600" letterSpacing="0.08em">
                GEAR // {rpmDisplay}
              </text>
            </g>

          </g>
        </svg>
      </div>

    </div>
  );
}
