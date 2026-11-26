import { useEffect, useState } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react';

const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], [role="tab"], summary, label[for], [data-cursor="interactive"]';

export function CustomCursor() {
  const prefersReducedMotion = useReducedMotion();
  const [isEnabled, setIsEnabled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const rawX = useMotionValue(-100);
  const rawY = useMotionValue(-100);

  const springConfig = prefersReducedMotion
    ? { stiffness: 2000, damping: 100 }
    : { stiffness: 460, damping: 32, mass: 0.35 };

  const ringX = useSpring(rawX, springConfig);
  const ringY = useSpring(rawY, springConfig);

  useEffect(() => {
    const finePointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)');

    const syncPointerCapability = () => {
      const supported = finePointerQuery.matches;
      setIsEnabled(supported);
      if (!supported) {
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

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType && event.pointerType !== 'mouse') return;

      rawX.set(event.clientX);
      rawY.set(event.clientY);

      const target = event.target as Element | null;
      if (target?.tagName === 'IFRAME' || target?.closest('textarea, input')) {
        setIsVisible(false);
        setIsHoveringInteractive(false);
        return;
      }

      setIsVisible(true);
      setIsHoveringInteractive(Boolean(target?.closest(INTERACTIVE_SELECTOR)));
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (event.pointerType && event.pointerType !== 'mouse') return;
      setIsPressed(true);
    };

    const handlePointerUp = () => {
      setIsPressed(false);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
      setIsHoveringInteractive(false);
      setIsPressed(false);
    };

    const handleWindowBlur = () => {
      setIsVisible(false);
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

  const ringScale = isPressed ? 0.85 : isHoveringInteractive ? 1.85 : 1;

  return (
    <>
      {/* Minimalist trailing circular ring */}
      <motion.div
        aria-hidden="true"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          opacity: isVisible ? 1 : 0,
          scale: ringScale,
        }}
        transition={{
          opacity: { duration: 0.16 },
          scale: prefersReducedMotion
            ? { duration: 0 }
            : { type: 'spring', stiffness: 420, damping: 28 },
        }}
        className={`pointer-events-none fixed left-0 top-0 z-[9999] h-7 w-7 rounded-full border-[1.5px] border-white mix-blend-difference transition-colors duration-200 ${
          isHoveringInteractive ? 'bg-white/20' : 'bg-transparent'
        }`}
      />

      {/* Precision center dot */}
      <motion.div
        aria-hidden="true"
        style={{
          x: rawX,
          y: rawY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          opacity: isVisible ? (isHoveringInteractive ? 0 : 1) : 0,
          scale: isPressed ? 0.75 : 1,
        }}
        transition={{ duration: 0.14 }}
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-1.5 w-1.5 rounded-full bg-white mix-blend-difference"
      />
    </>
  );
}
