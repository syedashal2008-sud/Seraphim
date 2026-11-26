import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react';

interface MagneticProps {
  children: ReactNode;
  strength?: number;
  proximity?: number;
  maxOffset?: number;
  disabled?: boolean;
  className?: string;
}

export function Magnetic({
  children,
  strength = 0.32,
  proximity = 32,
  maxOffset = 10,
  disabled = false,
  className = 'inline-flex',
}: MagneticProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const [isMouseCapable, setIsMouseCapable] = useState(false);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const springX = useSpring(rawX, { stiffness: 280, damping: 20, mass: 0.25 });
  const springY = useSpring(rawY, { stiffness: 280, damping: 20, mass: 0.25 });

  useEffect(() => {
    const query = window.matchMedia('(hover: hover) and (pointer: fine)');
    const sync = () => setIsMouseCapable(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    if (!isMouseCapable || prefersReducedMotion || disabled) {
      rawX.set(0);
      rawY.set(0);
      return;
    }

    const reset = () => {
      rawX.set(0);
      rawY.set(0);
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType && event.pointerType !== 'mouse') return;
      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      if (
        rect.width === 0 ||
        rect.height === 0 ||
        rect.bottom < -proximity ||
        rect.top > window.innerHeight + proximity
      ) {
        reset();
        return;
      }

      const clampedX = Math.max(rect.left, Math.min(event.clientX, rect.right));
      const clampedY = Math.max(rect.top, Math.min(event.clientY, rect.bottom));
      const edgeDistance = Math.hypot(event.clientX - clampedX, event.clientY - clampedY);

      if (edgeDistance <= proximity) {
        const falloff = 1 - edgeDistance / proximity;
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = event.clientX - centerX;
        const deltaY = event.clientY - centerY;

        const targetX = Math.max(-maxOffset, Math.min(maxOffset, deltaX * strength * falloff));
        const targetY = Math.max(-maxOffset, Math.min(maxOffset, deltaY * strength * falloff));
        rawX.set(targetX);
        rawY.set(targetY);
      } else {
        reset();
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('scroll', reset, { passive: true });
    window.addEventListener('blur', reset);
    document.documentElement.addEventListener('mouseleave', reset);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('scroll', reset);
      window.removeEventListener('blur', reset);
      document.documentElement.removeEventListener('mouseleave', reset);
    };
  }, [disabled, isMouseCapable, maxOffset, prefersReducedMotion, proximity, rawX, rawY, strength]);

  return (
    <motion.div
      ref={ref}
      style={prefersReducedMotion ? undefined : { x: springX, y: springY }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
