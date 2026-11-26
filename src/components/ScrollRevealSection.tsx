import type { ReactNode } from 'react';
import { motion } from 'motion/react';

interface ScrollRevealSectionProps {
  id?: string;
  children: ReactNode;
  className?: string;
  delay?: number;
}

const SMOOTH_EASE = [0.16, 1, 0.3, 1] as const;

export function ScrollRevealSection({
  id,
  children,
  className = '',
  delay = 0,
}: ScrollRevealSectionProps) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{
        duration: 0.55,
        delay,
        ease: SMOOTH_EASE,
      }}
      className={className}
    >
      {children}
    </motion.section>
  );
}
