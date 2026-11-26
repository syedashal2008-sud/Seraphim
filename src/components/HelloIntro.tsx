import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface HelloIntroProps {
  onDoorsOpen: () => void;
  onComplete: () => void;
}

const MACINTOSH_HELLO_PATH =
  'M 52 132 C 78 118, 114 70, 120 42 C 123 29, 107 28, 100 42 C 92 60, 86 112, 84 152 C 90 124, 112 104, 128 104 C 144 104, 142 134, 138 146 C 136 155, 145 157, 162 146 C 184 132, 206 118, 202 106 C 198 96, 180 100, 174 116 C 168 134, 176 154, 198 154 C 216 154, 232 138, 246 116 C 264 88, 286 54, 288 40 C 290 28, 274 28, 266 42 C 256 62, 246 116, 248 144 C 250 156, 266 156, 284 138 C 304 116, 336 60, 338 40 C 340 28, 324 28, 316 42 C 306 62, 296 116, 298 144 C 300 156, 318 156, 342 138 C 358 124, 372 106, 392 106 C 368 106, 358 128, 364 144 C 370 158, 398 158, 410 142 C 422 126, 414 104, 392 106 C 380 108, 386 126, 412 126 C 436 126, 462 118, 490 102';

const DOOR_EASE = [0.76, 0, 0.24, 1] as const;

export function HelloIntro({ onDoorsOpen, onComplete }: HelloIntroProps) {
  const prefersReducedMotion = useReducedMotion();
  const [doorsOpen, setDoorsOpen] = useState(false);
  const openedRef = useRef(false);
  const completedRef = useRef(false);

  const doorDurationMs = prefersReducedMotion ? 220 : 550;

  const triggerOpen = useCallback(() => {
    if (openedRef.current) return;
    openedRef.current = true;
    setDoorsOpen(true);
    onDoorsOpen();

    window.setTimeout(() => {
      if (completedRef.current) return;
      completedRef.current = true;
      document.body.style.overflow = '';
      onComplete();
    }, doorDurationMs);
  }, [doorDurationMs, onComplete, onDoorsOpen]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const drawMs = prefersReducedMotion ? 250 : 1750;
    const openTimer = window.setTimeout(triggerOpen, drawMs);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' || event.key === ' ' || event.key === 'Enter') {
        triggerOpen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.clearTimeout(openTimer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [prefersReducedMotion, triggerOpen]);

  const strokeDelay = prefersReducedMotion ? 0 : 0.05;
  const strokeDuration = prefersReducedMotion ? 0.2 : 1.65;
  const doorDuration = doorDurationMs / 1000;

  return (
    <div
      role="presentation"
      aria-label="Opening animation"
      onClick={triggerOpen}
      className={`fixed inset-0 z-[100] overflow-hidden ${
        doorsOpen ? 'pointer-events-none' : 'pointer-events-auto cursor-pointer'
      }`}
    >
      {/* Left Double Door */}
      <motion.div
        initial={{ x: '0%' }}
        animate={{ x: doorsOpen ? '-100%' : '0%' }}
        transition={{ duration: doorDuration, ease: DOOR_EASE }}
        className="absolute inset-y-0 left-0 w-1/2 border-r border-white/15 bg-[#000000] will-change-transform"
      />

      {/* Right Double Door */}
      <motion.div
        initial={{ x: '0%' }}
        animate={{ x: doorsOpen ? '100%' : '0%' }}
        transition={{ duration: doorDuration, ease: DOOR_EASE }}
        className="absolute inset-y-0 right-0 w-1/2 border-l border-white/15 bg-[#000000] will-change-transform"
      />

      {/* Centered Bold Macintosh Skeletal "hello" SVG Stroke Reveal */}
      <motion.div
        initial={{ opacity: 1, scale: 1 }}
        animate={{
          opacity: doorsOpen ? 0 : 1,
          scale: doorsOpen ? 0.96 : 1,
        }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        className="pointer-events-none relative z-10 flex h-full w-full items-center justify-center px-6"
      >
        <svg
          viewBox="0 0 540 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="Hello"
          className="h-auto w-full max-w-[340px] sm:max-w-[440px] md:max-w-[520px]"
        >
          {/* Subtle skeletal blueprint guide in burgundy */}
          <path
            d={MACINTOSH_HELLO_PATH}
            stroke="#880021"
            strokeOpacity="0.7"
            strokeWidth="8.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Bold Primary SVG Stroke Reveal */}
          <motion.path
            d={MACINTOSH_HELLO_PATH}
            stroke="#ffffff"
            strokeWidth="8.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: prefersReducedMotion ? 1 : 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              delay: strokeDelay,
              duration: strokeDuration,
              ease: [0.35, 0, 0.25, 1],
            }}
          />
        </svg>
      </motion.div>
    </div>
  );
}
