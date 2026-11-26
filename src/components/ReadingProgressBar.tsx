import { motion, useScroll, useSpring } from 'motion/react';

export function ReadingProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[2px] bg-black/15 transition-colors duration-300 dark:bg-white/15"
    >
      <motion.div
        style={{ scaleX }}
        className="h-full w-full origin-left will-change-transform bg-[#880021] dark:bg-[#d43b5c]"
      />
    </div>
  );
}
