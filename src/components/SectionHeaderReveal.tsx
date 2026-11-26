import { useRef, type ReactNode } from 'react';
import { motion, useInView, useReducedMotion, type Variants } from 'motion/react';

interface SectionHeaderRevealProps {
  title: string;
  subtitle?: ReactNode;
  layout?: 'stack' | 'split';
  withDivider?: boolean;
  titleClassName?: string;
  subtitleClassName?: string;
  className?: string;
  dividerClassName?: string;
}

const EDITORIAL_EASE = [0.16, 1, 0.3, 1] as const;

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const wordGroupVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.065,
    },
  },
};

const wordVariants: Variants = {
  hidden: {
    y: '112%',
    opacity: 0,
  },
  visible: {
    y: '0%',
    opacity: 1,
    transition: {
      duration: 0.65,
      ease: EDITORIAL_EASE,
    },
  },
};

const subtitleVariants: Variants = {
  hidden: {
    y: 14,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.58,
      ease: EDITORIAL_EASE,
    },
  },
};

const dividerVariants: Variants = {
  hidden: {
    scaleX: 0,
    opacity: 0,
  },
  visible: {
    scaleX: 1,
    opacity: 1,
    transition: {
      duration: 0.72,
      ease: EDITORIAL_EASE,
    },
  },
};

export function SectionHeaderReveal({
  title,
  subtitle,
  layout = 'stack',
  withDivider = false,
  titleClassName = '',
  subtitleClassName = '',
  className = '',
  dividerClassName = 'bg-black/15 dark:bg-white/20',
}: SectionHeaderRevealProps) {
  const headerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(headerRef, { once: true, amount: 0.3 });
  const prefersReducedMotion = useReducedMotion();

  const words = title.split(' ');
  const activeState = isInView || prefersReducedMotion ? 'visible' : 'hidden';

  return (
    <motion.div
      ref={headerRef}
      initial={prefersReducedMotion ? 'visible' : 'hidden'}
      animate={activeState}
      variants={containerVariants}
      className={className}
    >
      <div
        className={
          layout === 'split'
            ? 'flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2'
            : 'flex flex-col'
        }
      >
        <motion.h2 variants={wordGroupVariants} className={titleClassName}>
          {words.map((word, index) => (
            <span
              key={`${word}-${index}`}
              className="inline-block overflow-hidden align-bottom pb-[0.08em] -mb-[0.08em] pr-[0.22em] last:pr-0"
            >
              <motion.span
                variants={prefersReducedMotion ? undefined : wordVariants}
                className="inline-block"
              >
                {word}
              </motion.span>
            </span>
          ))}
        </motion.h2>

        {subtitle && (
          <motion.div
            variants={prefersReducedMotion ? undefined : subtitleVariants}
            className={subtitleClassName}
          >
            {subtitle}
          </motion.div>
        )}
      </div>

      {withDivider && (
        <motion.div
          aria-hidden="true"
          variants={prefersReducedMotion ? undefined : dividerVariants}
          className={`mt-5 h-px w-full origin-left ${dividerClassName}`}
        />
      )}
    </motion.div>
  );
}
