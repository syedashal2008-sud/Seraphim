import { useEffect, useId, useRef, useState } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react';

const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], [role="tab"], [role="switch"], summary, label[for], [data-cursor="interactive"]';

export function CustomCursor() {
  const prefersReducedMotion = useReducedMotion();
  const uid = useId().replace(/:/g, '');
  const [isEnabled, setIsEnabled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const visibleRef = useRef(false);
  const hoveringRef = useRef(false);

  const rawX = useMotionValue(-100);
  const rawY = useMotionValue(-100);

  const springConfig = prefersReducedMotion
    ? { stiffness: 2000, damping: 100 }
    : { stiffness: 500, damping: 32, mass: 0.3 };

  const orbX = useSpring(rawX, springConfig);
  const orbY = useSpring(rawY, springConfig);

  useEffect(() => {
    const finePointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)');

    const syncPointerCapability = () => {
      const supported = finePointerQuery.matches;
      setIsEnabled(supported);
      if (!supported) {
        visibleRef.current = false;
        setIsVisible(false);
        document.documentElement.classList.remove('custom-cursor-active');
      }
    };

    syncPointerCapability();
    finePointerQuery.addEventListener('change', syncPointerCapability);

    return () => {
      finePointerQuery.removeEventListener('change', syncPointerCapability);
      document.documentElement.classList.remove('custom-cursor-active');
    };
  }, []);

  useEffect(() => {
    if (!isEnabled) return;

    document.documentElement.classList.add('custom-cursor-active');

    const setVisibleIfChanged = (next: boolean) => {
      if (visibleRef.current !== next) {
        visibleRef.current = next;
        setIsVisible(next);
      }
    };

    const setHoveringIfChanged = (next: boolean) => {
      if (hoveringRef.current !== next) {
        hoveringRef.current = next;
        setIsHoveringInteractive(next);
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType && event.pointerType !== 'mouse') return;

      rawX.set(event.clientX);
      rawY.set(event.clientY);

      const target = event.target as Element | null;
      if (target?.tagName === 'IFRAME' || target?.closest('textarea, input, select')) {
        setVisibleIfChanged(false);
        setHoveringIfChanged(false);
        return;
      }

      setVisibleIfChanged(true);
      setHoveringIfChanged(Boolean(target?.closest(INTERACTIVE_SELECTOR)));
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (event.pointerType && event.pointerType !== 'mouse') return;
      setIsPressed(true);
    };

    const handlePointerUp = () => {
      setIsPressed(false);
    };

    const handleMouseLeave = () => {
      setVisibleIfChanged(false);
      setHoveringIfChanged(false);
      setIsPressed(false);
    };

    const handleWindowBlur = () => {
      setVisibleIfChanged(false);
      setIsPressed(false);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('pointerup', handlePointerUp, { passive: true });
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      document.documentElement.classList.remove('custom-cursor-active');
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [isEnabled, rawX, rawY]);

  if (!isEnabled) return null;

  const orbScale = isPressed ? 0.84 : isHoveringInteractive ? 1.24 : 1;

  const sphereClipId = `cursor-sphere-clip-${uid}`;
  const sphereGradId = `cursor-sphere-grad-${uid}`;
  const blueArcGradId = `cursor-blue-arc-${uid}`;
  const warmArcGradId = `cursor-warm-arc-${uid}`;

  return (
    <>
      {/* 3D Holographic Scanline Sphere & Multi-Axis Dotted Orbital Cursor (GPU-composited) */}
      <motion.div
        aria-hidden="true"
        style={{
          x: orbX,
          y: orbY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          opacity: isVisible ? 1 : 0,
          scale: orbScale,
        }}
        transition={{
          opacity: { duration: 0.14 },
          scale: prefersReducedMotion
            ? { duration: 0 }
            : { type: 'spring', stiffness: 420, damping: 28 },
        }}
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-14 w-14 text-[#111115] will-change-transform dark:text-[#f8fafc]"
      >
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full overflow-visible"
        >
          <defs>
            <clipPath id={sphereClipId}>
              <circle cx="32" cy="32" r="9.5" />
            </clipPath>

            <radialGradient id={sphereGradId} cx="38%" cy="30%" r="72%">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.95" />
              <stop offset="55%" stopColor="currentColor" stopOpacity="0.45" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0.08" />
            </radialGradient>

            <linearGradient id={blueArcGradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#93c5fd" stopOpacity="0" />
              <stop offset="45%" stopColor="#3b82f6" stopOpacity="0.95" />
              <stop offset="85%" stopColor="#60a5fa" stopOpacity="1" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>

            <linearGradient id={warmArcGradId} x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
              <stop offset="50%" stopColor="currentColor" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* Back Orbital Ring 1 (Horizontal Equatorial Dotted Ring) */}
          <g className="animate-orbit-cw">
            <g transform="rotate(-14 32 32)">
              <ellipse
                cx="32"
                cy="32"
                rx="23.5"
                ry="8.4"
                stroke="currentColor"
                strokeOpacity="0.7"
                strokeWidth="1.05"
                strokeDasharray="1.1 2.2"
                strokeLinecap="round"
              />
              <ellipse
                cx="32"
                cy="32"
                rx="23.5"
                ry="8.4"
                stroke={`url(#${warmArcGradId})`}
                strokeWidth="1.4"
                strokeDasharray="24 90"
                strokeDashoffset="6"
                strokeLinecap="round"
              />
            </g>
          </g>

          {/* Back Orbital Ring 2 (Lower-Right Sweeping Dotted Orbit) */}
          <g className="animate-orbit-ccw">
            <g transform="rotate(42 32 32)">
              <ellipse
                cx="32"
                cy="32"
                rx="22"
                ry="8.6"
                stroke="currentColor"
                strokeOpacity="0.6"
                strokeWidth="1"
                strokeDasharray="1 2.3"
                strokeLinecap="round"
              />
              <path
                d="M 48.5 26.2 A 22 8.6 0 0 1 51.2 35.8"
                stroke="currentColor"
                strokeOpacity="0.35"
                strokeWidth="2.8"
                strokeLinecap="round"
              />
              <path
                d="M 48.5 26.2 A 22 8.6 0 0 1 51.2 35.8"
                stroke="currentColor"
                strokeOpacity="0.9"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </g>
          </g>

          {/* Holographic Horizontal Scanline Sphere Core */}
          <g clipPath={`url(#${sphereClipId})`}>
            <circle cx="32" cy="32" r="9.5" fill={`url(#${sphereGradId})`} opacity="0.22" />
            {[23.5, 25.3, 27.1, 28.9, 30.7, 32.5, 34.3, 36.1, 37.9, 39.7].map(
              (yPos, idx) => (
                <line
                  key={yPos}
                  x1="21"
                  y1={yPos}
                  x2="43"
                  y2={yPos}
                  stroke="currentColor"
                  strokeWidth={idx < 4 ? '1.15' : '0.85'}
                  strokeOpacity={Math.max(0.24, 0.94 - idx * 0.075)}
                  strokeDasharray={idx % 2 === 0 ? '2.2 1.1' : '1.4 1.2'}
                  strokeLinecap="round"
                />
              )
            )}
          </g>

          {/* Front Orbital Ring 3 (Steep Diagonal Ring with Electric Blue Glow Arc) */}
          <g className="animate-orbit-fast">
            <g transform="rotate(-56 32 32)">
              <ellipse
                cx="32"
                cy="32"
                rx="22.5"
                ry="8.2"
                stroke="currentColor"
                strokeOpacity="0.68"
                strokeWidth="1.05"
                strokeDasharray="1.1 2.2"
                strokeLinecap="round"
              />
              {/* Soft Halo Under-Stroke (Zero Filter Cost) */}
              <path
                d="M 42.5 24.8 A 22.5 8.2 0 0 1 54.4 31.6"
                stroke="#3b82f6"
                strokeOpacity="0.32"
                strokeWidth="4.2"
                strokeLinecap="round"
              />
              {/* Electric Blue Comet Specular Flare */}
              <path
                d="M 42.5 24.8 A 22.5 8.2 0 0 1 54.4 31.6"
                stroke={`url(#${blueArcGradId})`}
                strokeWidth="2.1"
                strokeLinecap="round"
              />
            </g>
          </g>
        </svg>
      </motion.div>

      {/* Precision Center Target Dot (locked to exact pointer coordinates) */}
      <motion.div
        aria-hidden="true"
        style={{
          x: rawX,
          y: rawY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          opacity: isVisible ? 1 : 0,
          scale: isPressed ? 0.7 : isHoveringInteractive ? 1.35 : 1,
        }}
        transition={{ duration: 0.12 }}
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-1.5 w-1.5 rounded-full bg-[#3b82f6] will-change-transform dark:bg-[#93c5fd]"
      />
    </>
  );
}
