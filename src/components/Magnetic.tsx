import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from 'react';
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
  maxOffset = 10,
  disabled = false,
  className = 'inline-flex',
}: MagneticProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const [isMouseCapable, setIsMouseCapable] = useState(false);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const springX = useSpring(rawX, { stiffness: 300, damping: 22, mass: 0.25 });
  const springY = useSpring(rawY, { stiffness: 300, damping: 22, mass: 0.25 });

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
      rectRef.current = null;
    }
  }, [disabled, isMouseCapable, prefersReducedMotion, rawX, rawY]);

  const active = isMouseCapable && !prefersReducedMotion && !disabled;

  const handlePointerEnter = (event: PointerEvent<HTMLDivElement>) => {
    if (!active || (event.pointerType && event.pointerType !== 'mouse')) return;
    if (ref.current) {
      rectRef.current = ref.current.getBoundingClientRect();
    }
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!active || (event.pointerType && event.pointerType !== 'mouse')) return;
    const rect = rectRef.current ?? ref.current?.getBoundingClientRect();
    if (!rect || rect.width === 0 || rect.height === 0) return;

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = event.clientX - centerX;
    const deltaY = event.clientY - centerY;

    const targetX = Math.max(-maxOffset, Math.min(maxOffset, deltaX * strength));
    const targetY = Math.max(-maxOffset, Math.min(maxOffset, deltaY * strength));
    rawX.set(targetX);
    rawY.set(targetY);
  };

  const handlePointerLeave = () => {
    rectRef.current = null;
    rawX.set(0);
    rawY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={prefersReducedMotion ? undefined : { x: springX, y: springY }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
