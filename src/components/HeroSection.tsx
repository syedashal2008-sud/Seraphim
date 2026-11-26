import { useState, type MouseEvent } from 'react';
import { ArrowDown, Check, FileDown, Handshake } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { Magnetic } from './Magnetic';

const PORTFOLIO_LETTERS = ['P', 'O', 'R', 'T', 'F', 'O', 'L', 'I', 'O'] as const;

const HERO_JUMP_LINKS = [
  { index: '01', label: 'About', href: '#about' },
  { index: '02', label: 'Projects', href: '#projects' },
  { index: '03', label: 'Skills', href: '#skills' },
  { index: '04', label: 'Playground', href: '#sandbox' },
] as const;

const EDITORIAL_EASE = [0.16, 1, 0.3, 1] as const;

export function HeroSection() {
  const prefersReducedMotion = useReducedMotion();
  const [resumeDownloaded, setResumeDownloaded] = useState(false);

  const handleJump = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    event.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleResumeDownload = () => {
    setResumeDownloaded(true);
    window.setTimeout(() => setResumeDownloaded(false), 1800);
  };

  return (
    <section
      id="hero"
      aria-label="Hero"
      className="relative z-[2] flex min-h-dvh w-full flex-col justify-between overflow-hidden bg-transparent px-6 py-8 text-[#000000] transition-colors duration-300 dark:text-[#ffffff] sm:px-12 sm:py-10 lg:px-20"
    >
      {/* Subtle Ambient Radial Spotlight behind Hero Typography */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_48%,rgba(136,0,33,0.06),transparent_64%)] dark:bg-[radial-gradient(ellipse_at_50%_48%,rgba(136,0,33,0.22),transparent_64%)]"
      />

      {/* Top Architectural Index Bar */}
      <motion.div
        initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15, ease: EDITORIAL_EASE }}
        className="relative z-[1] mx-auto flex w-full max-w-6xl items-center justify-between gap-4 border-b border-black/10 pb-4 font-display text-xs text-black/65 dark:border-white/15 dark:text-white/70"
      >
        <div className="flex items-center gap-2 whitespace-nowrap">
          <span className="font-semibold text-[#000000] dark:text-[#ffffff]">
            Seraphim Design
          </span>
          <span aria-hidden="true" className="text-[#880021] dark:text-[#d43b5c]">
            ·
          </span>
          <span className="hidden sm:inline">Full-Stack Web Engineering</span>
        </div>

        <div className="flex items-center gap-2.5 whitespace-nowrap tabular-nums">
          <span>2–3 Years Experience</span>
          <span aria-hidden="true" className="text-[#880021] dark:text-[#d43b5c]">
            ·
          </span>
          <div className="flex items-center gap-2">
            <Magnetic strength={0.35} proximity={34} maxOffset={9}>
              <a
                href="#contact"
                onClick={(e) => handleJump(e, '#contact')}
                aria-label="Collaborate — Jump to contact"
                title="Collaborate"
                className="group relative inline-flex h-9 w-9 items-center justify-center rounded-xl border border-black/15 bg-black/[0.02] text-[#880021] transition-all duration-200 hover:border-[#880021] hover:bg-[#880021] hover:text-[#ffffff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#880021] focus-visible:ring-offset-2 dark:border-white/20 dark:bg-white/[0.04] dark:text-[#d43b5c] dark:hover:border-[#d43b5c] dark:hover:bg-[#880021] dark:hover:text-[#ffffff] dark:focus-visible:ring-[#d43b5c]"
              >
                <Handshake
                  className="h-4 w-4 transition-transform duration-200 group-hover:scale-110"
                  aria-hidden="true"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute right-0 top-full z-20 mt-2 rounded-lg border border-black/10 bg-[#000000] px-2.5 py-1 font-display text-[11px] font-medium text-[#ffffff] opacity-0 shadow-lg transition-all duration-150 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:opacity-100 dark:border-white/15 dark:bg-[#ffffff] dark:text-[#000000]"
                >
                  Collaborate
                </span>
              </a>
            </Magnetic>

            <Magnetic strength={0.35} proximity={34} maxOffset={9}>
              <a
                href="/assets/aistudio/ashal_CV_37b68b7b.pdf"
                download="Ashal_Abbas_CV.pdf"
                onClick={handleResumeDownload}
                aria-label="Download Resume (PDF)"
                title="Download Resume (PDF)"
                className="group relative inline-flex h-9 w-9 items-center justify-center rounded-xl border border-black/15 bg-black/[0.02] text-[#000000] transition-all duration-200 hover:border-[#880021] hover:bg-[#880021] hover:text-[#ffffff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#880021] focus-visible:ring-offset-2 dark:border-white/20 dark:bg-white/[0.04] dark:text-[#ffffff] dark:hover:border-[#d43b5c] dark:hover:bg-[#880021] dark:hover:text-[#ffffff] dark:focus-visible:ring-[#d43b5c]"
              >
                {resumeDownloaded ? (
                  <Check className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <FileDown
                    className="h-4 w-4 transition-transform duration-200 group-hover:translate-y-0.5"
                    aria-hidden="true"
                  />
                )}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute right-0 top-full z-20 mt-2 rounded-lg border border-black/10 bg-[#000000] px-2.5 py-1 font-display text-[11px] font-medium text-[#ffffff] opacity-0 shadow-lg transition-all duration-150 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:opacity-100 dark:border-white/15 dark:bg-[#ffffff] dark:text-[#000000]"
                >
                  {resumeDownloaded ? 'Resume Downloaded' : 'Download Resume'}
                </span>
              </a>
            </Magnetic>
          </div>
        </div>
      </motion.div>

      {/* Centerpiece: Tall Condensed PORTFOLIO + Enlarged Semibold Italic Signature */}
      <div className="relative z-[1] my-auto flex w-full items-center justify-center py-8">
        <div className="inline-flex max-w-full flex-col items-end">
          <h1
            aria-label="Portfolio"
            className="my-[0.11em] flex origin-center scale-y-[1.28] select-none items-baseline font-poster text-[clamp(4rem,17.5vw,16.5rem)] font-normal uppercase leading-[0.86] tracking-[0.035em] text-[#6d001a] transition-colors duration-300 dark:text-[#ffffff]"
          >
            {PORTFOLIO_LETTERS.map((letter, index) => (
              <span
                key={index}
                className="inline-block overflow-hidden px-[0.14em] -mx-[0.14em] pt-[0.12em] -mt-[0.12em] pb-[0.26em] -mb-[0.26em]"
              >
                <motion.span
                  initial={
                    prefersReducedMotion
                      ? { opacity: 0 }
                      : { y: '115%', opacity: 0 }
                  }
                  animate={{ y: '0%', opacity: 1 }}
                  transition={{
                    duration: 0.72,
                    delay: 0.08 + index * 0.075,
                    ease: EDITORIAL_EASE,
                  }}
                  className="inline-block [text-shadow:0_6px_14px_rgba(0,0,0,0.55),0_18px_36px_rgba(0,0,0,0.35)] dark:[text-shadow:0_6px_18px_rgba(136,0,33,0.8),0_18px_42px_rgba(136,0,33,0.45)]"
                >
                  {letter}
                </motion.span>
              </span>
            ))}
          </h1>

          {/* High-contrast editorial serif signature anchored at right-bottom */}
          <div className="group mt-6 flex items-center justify-end gap-3 self-end sm:mt-8 sm:gap-4 md:mt-10">
            <motion.span
              aria-hidden="true"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{
                duration: 0.6,
                delay: 0.84,
                ease: EDITORIAL_EASE,
              }}
              className="block h-[2px] w-8 origin-left bg-[#880021] transition-all duration-500 ease-out group-hover:w-12 dark:bg-[#d43b5c] sm:w-14 sm:group-hover:w-20 md:w-20 md:group-hover:w-28"
            />
            <div className="overflow-hidden py-1.5 -my-1.5">
              <motion.p
                initial={{ y: '115%', opacity: 0 }}
                animate={{ y: '0%', opacity: 1 }}
                transition={{
                  duration: 0.75,
                  delay: 0.92,
                  ease: EDITORIAL_EASE,
                }}
                className="font-serif text-[clamp(1.65rem,4.1vw,3.5rem)] font-semibold italic leading-none tracking-[-0.01em] whitespace-nowrap text-[#000000] transition-all duration-300 ease-out group-hover:translate-x-1 dark:text-[#ffffff]"
              >
                Ashal Abbas
              </motion.p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Interactive Section Quick-Jump & Scroll Cue */}
      <motion.div
        initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, delay: 1.0, ease: EDITORIAL_EASE }}
        className="relative z-[1] mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 border-t border-black/10 pt-4 dark:border-white/15"
      >
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          {HERO_JUMP_LINKS.map((item) => (
            <Magnetic key={item.href} strength={0.28} proximity={20} maxOffset={7}>
              <a
                href={item.href}
                onClick={(e) => handleJump(e, item.href)}
                className="group relative inline-flex items-baseline gap-1.5 py-0.5 whitespace-nowrap font-display text-xs text-black/65 transition-colors hover:text-[#880021] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#880021] dark:text-white/65 dark:hover:text-[#d43b5c] dark:focus-visible:ring-[#d43b5c]"
              >
                <span className="font-semibold tabular-nums text-[#880021] dark:text-[#d43b5c]">
                  {item.index}
                </span>
                <span className="font-medium text-[#000000] transition-transform duration-200 group-hover:translate-x-0.5 dark:text-[#ffffff]">
                  {item.label}
                </span>
              </a>
            </Magnetic>
          ))}
        </div>

        <Magnetic strength={0.35} proximity={42} maxOffset={11}>
          <a
            href="#connect"
            onClick={(e) => handleJump(e, '#connect')}
            className="group inline-flex items-center gap-2 rounded-lg border border-black/12 bg-black/[0.02] px-3.5 py-1.5 whitespace-nowrap font-display text-xs font-medium text-[#000000] transition-all duration-200 hover:border-[#880021] hover:text-[#880021] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#880021] dark:border-white/15 dark:bg-white/[0.03] dark:text-[#ffffff] dark:hover:border-[#d43b5c] dark:hover:text-[#d43b5c] dark:focus-visible:ring-[#d43b5c]"
          >
            <span>Explore Portfolio</span>
            <ArrowDown
              className="h-3.5 w-3.5 text-[#880021] transition-transform duration-200 group-hover:translate-y-0.5 dark:text-[#d43b5c]"
              aria-hidden="true"
            />
          </a>
        </Magnetic>
      </motion.div>
    </section>
  );
}
