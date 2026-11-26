import { useState } from 'react';
import { RotateCw } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { GlassRefraction } from './GlassRefraction';
import { Magnetic } from './Magnetic';
import { ScrollRevealSection } from './ScrollRevealSection';
import { SectionHeaderReveal } from './SectionHeaderReveal';

interface SpecRow {
  label: string;
  value: string;
}

const PROFILE_SPECS: SpecRow[] = [
  { label: 'Identity', value: 'Seraphim · Seraphim Design' },
  { label: 'Experience', value: '2–3 Years · Frontend & Backend' },
  { label: 'Frontend', value: 'HTML · CSS · JavaScript' },
  { label: 'Backend', value: 'PHP · C#' },
  { label: 'Frameworks', value: 'Bootstrap · ASP.NET Core · Laravel' },
  { label: 'Server & Database', value: 'MySQL' },
];

const DISCIPLINES = [
  {
    index: '01',
    title: 'Frontend Engineering',
    detail:
      'Responsive grid architecture, semantic markup, CSS motion choreography, and accessible client-side interactivity.',
  },
  {
    index: '02',
    title: 'Backend & APIs',
    detail:
      'Structured MVC routing, role-based access control, authentication flows, and server-side validation in Laravel & ASP.NET Core.',
  },
  {
    index: '03',
    title: 'Relational Data & Performance',
    detail:
      'Normalized MySQL schemas, indexed queries, and conflict-free transaction handling engineered for production reliability.',
  },
] as const;

const EDITORIAL_EASE = [0.16, 1, 0.3, 1] as const;

export function AboutSection() {
  const [activeTab, setActiveTab] = useState<'profile' | 'disciplines'>('profile');
  const [isFlipped, setIsFlipped] = useState(false);
  const [frontFailed, setFrontFailed] = useState(false);
  const [backFailed, setBackFailed] = useState(false);

  return (
    <ScrollRevealSection
      id="about"
      className="relative z-[2] w-full bg-transparent px-6 pb-24 pt-12 text-[#000000] transition-colors duration-300 dark:text-[#ffffff] sm:px-12 sm:pb-32 sm:pt-16 lg:px-20"
    >
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-stretch gap-10 md:grid-cols-12 md:gap-12 lg:gap-16">
        {/* Left Column: Editorial Bio + Interactive View Switcher */}
        <div className="flex flex-col justify-between text-left md:col-span-7">
          <div>
            <SectionHeaderReveal
              title="About"
              titleClassName="font-display text-[clamp(2.25rem,4.5vw,3.5rem)] font-bold leading-none tracking-[-0.035em] text-[#000000] text-balance dark:text-[#ffffff]"
              subtitle="Seraphim Design"
              subtitleClassName="mt-2 font-serif text-2xl font-medium italic leading-snug text-[#880021] dark:text-[#d43b5c] sm:text-3xl"
            />

            <p className="mt-6 max-w-xl font-display text-[15px] leading-[1.75] text-black/80 dark:text-white/80 sm:text-base">
              I&apos;m Ashal Abbas, known creatively as{' '}
              <span className="font-semibold text-[#880021] dark:text-[#d43b5c]">Seraphim</span> —
              a Full-Stack Web Developer specializing in both frontend and
              backend engineering. With 2 to 3 years of experience across both
              disciplines, I craft modern, structured web applications under{' '}
              <span className="font-serif text-lg font-medium italic text-[#880021] dark:text-[#d43b5c]">
                Seraphim Design
              </span>
              .
            </p>

            {/* Quick Architectural Metrics Strip */}
            <div className="mt-7 grid grid-cols-3 gap-4 border-y border-black/15 py-4 dark:border-white/20">
              <div>
                <p className="font-display text-xl font-bold tracking-tight tabular-nums text-[#000000] dark:text-[#ffffff] sm:text-2xl">
                  2–3 Yrs
                </p>
                <p className="mt-0.5 font-display text-xs text-black/60 dark:text-white/60">
                  Production Craft
                </p>
              </div>
              <div>
                <p className="font-display text-xl font-bold tracking-tight tabular-nums text-[#880021] dark:text-[#d43b5c] sm:text-2xl">
                  9 Stacks
                </p>
                <p className="mt-0.5 font-display text-xs text-black/60 dark:text-white/60">
                  UI to MySQL
                </p>
              </div>
              <div>
                <p className="font-display text-xl font-bold tracking-tight text-[#000000] dark:text-[#ffffff] sm:text-2xl">
                  Full-Stack
                </p>
                <p className="mt-0.5 font-display text-xs text-black/60 dark:text-white/60">
                  Design &amp; Code
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Tabbed Spec / Disciplines Panel */}
          <div className="mt-8">
            <div
              role="tablist"
              aria-label="About details view"
              className="glass-control mb-4 inline-flex items-center gap-1 rounded-full p-1"
            >
              {[
                { id: 'profile' as const, label: 'Stack Matrix' },
                { id: 'disciplines' as const, label: 'Core Disciplines' },
              ].map((tab) => {
                const isSelected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative cursor-pointer rounded-full px-3.5 py-1.5 font-display text-xs font-medium whitespace-nowrap transition-colors ${
                      isSelected
                        ? 'text-[#ffffff] dark:text-[#ffffff]'
                        : 'text-black/70 hover:text-[#000000] dark:text-white/70 dark:hover:text-[#ffffff]'
                    }`}
                  >
                    {isSelected && (
                      <motion.span
                        layoutId="about-tab-pill"
                        transition={{ duration: 0.25, ease: EDITORIAL_EASE }}
                        aria-hidden="true"
                        className="liquid-glass-btn-accent absolute inset-0"
                      />
                    )}
                    <span className="relative z-10">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'profile' ? (
                <motion.dl
                  key="profile"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25, ease: EDITORIAL_EASE }}
                  className="border-t border-black/15 text-left dark:border-white/20"
                >
                  {PROFILE_SPECS.map((item) => (
                    <div
                      key={item.label}
                      className="group grid grid-cols-1 gap-1 border-b border-black/15 py-3 transition-all duration-200 hover:border-[#880021] hover:pl-2 dark:border-white/20 dark:hover:border-[#d43b5c] sm:grid-cols-12 sm:items-baseline sm:gap-4"
                    >
                      <dt className="font-display text-xs font-medium tracking-wide text-black/60 transition-colors duration-200 group-hover:text-[#880021] dark:text-white/60 dark:group-hover:text-[#d43b5c] sm:col-span-4">
                        {item.label}
                      </dt>
                      <dd className="font-display text-sm font-medium text-[#000000] tabular-nums dark:text-[#ffffff] sm:col-span-8 sm:text-[15px]">
                        {item.value}
                      </dd>
                    </div>
                  ))}
                </motion.dl>
              ) : (
                <motion.div
                  key="disciplines"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25, ease: EDITORIAL_EASE }}
                  className="grid grid-cols-1 gap-3 border-t border-black/15 pt-4 dark:border-white/20"
                >
                  {DISCIPLINES.map((item) => (
                    <div
                      key={item.index}
                      className="glass-card relative overflow-hidden rounded-xl p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#880021] dark:hover:border-[#d43b5c]"
                    >
                      <GlassRefraction subtle />
                      <div className="relative z-10 flex items-baseline gap-2.5">
                        <span className="font-display text-xs font-bold tabular-nums text-[#880021] dark:text-[#d43b5c]">
                          {item.index}.
                        </span>
                        <h3 className="font-display text-sm font-semibold text-[#000000] dark:text-[#ffffff]">
                          {item.title}
                        </h3>
                      </div>
                      <p className="relative z-10 mt-1.5 font-display text-xs leading-relaxed text-black/70 dark:text-white/75 sm:text-[13px]">
                        {item.detail}
                      </p>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Column: Interactive 3D Hover/Tap Flip Portrait with Explicit Switch Control */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.75, delay: 0.12, ease: EDITORIAL_EASE }}
          className="flex flex-col gap-3 md:col-span-5"
        >
          <div
            role="button"
            tabIndex={0}
            data-cursor="interactive"
            aria-pressed={isFlipped}
            aria-label="Ashal Abbas studio portrait. Hover, focus, or click to flip between studio photo and illustrated persona."
            onMouseEnter={() => setIsFlipped(true)}
            onMouseLeave={() => setIsFlipped(false)}
            onFocus={() => setIsFlipped(true)}
            onBlur={() => setIsFlipped(false)}
            onClick={() => setIsFlipped((prev) => !prev)}
            className="aspect-[3/4] w-full flex-1 cursor-pointer transition-transform duration-300 ease-out hover:-translate-y-1 [perspective:1200px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#880021] focus-visible:ring-offset-4 dark:focus-visible:ring-[#d43b5c] md:aspect-auto md:min-h-[480px]"
          >
            <motion.div
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{
                type: 'spring',
                stiffness: 180,
                damping: 24,
                mass: 0.9,
              }}
              style={{ transformStyle: 'preserve-3d' }}
              className="relative h-full w-full will-change-transform"
            >
              {/* FRONT FACE: User-provided front studio portrait */}
              <div
                style={{ backfaceVisibility: 'hidden' }}
                className="glass-card-3d absolute inset-0 h-full w-full overflow-hidden rounded-2xl"
              >
                {!frontFailed ? (
                  <img
                    src="/assets/aistudio/image_6f8ff823.png"
                    alt="Portrait of Ashal Abbas (Seraphim), Full-Stack Web Developer"
                    referrerPolicy="no-referrer"
                    decoding="async"
                    onError={() => setFrontFailed(true)}
                    className="h-full w-full object-cover object-[50%_20%]"
                  />
                ) : (
                  <div className="flex h-full min-h-[400px] w-full flex-col items-center justify-center bg-[#000000] p-8 text-center text-white">
                    <span className="font-display text-xl font-bold tracking-tight">
                      Ashal Abbas
                    </span>
                    <span className="mt-1 font-serif text-lg italic text-white/75">
                      Seraphim Design
                    </span>
                  </div>
                )}
              </div>

              {/* BACK FACE: User-provided illustrated studio portrait */}
              <div
                style={{
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                }}
                className="absolute inset-0 h-full w-full overflow-hidden rounded-2xl border-2 border-[#880021] bg-white shadow-[0_24px_54px_-18px_rgba(136,0,33,0.3)] dark:border-[#d43b5c] dark:bg-[#000000]"
              >
                {!backFailed ? (
                  <img
                    src="/assets/aistudio/image_0dd4ab70.png"
                    alt="Illustrated portrait of Ashal Abbas (Seraphim) — Seraphim Design"
                    referrerPolicy="no-referrer"
                    decoding="async"
                    onError={() => setBackFailed(true)}
                    className="h-full w-full object-cover object-top"
                  />
                ) : (
                  <div className="flex h-full min-h-[400px] w-full flex-col items-center justify-center bg-[#880021] p-8 text-center text-white">
                    <span className="font-display text-xl font-bold tracking-tight">
                      Seraphim Design
                    </span>
                    <span className="mt-1 font-serif text-lg italic text-white/80">
                      Full-Stack Studio
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          <div className="flex items-center justify-between gap-4 border-t border-black/15 pt-2.5 dark:border-white/20">
            <span className="font-display text-xs text-black/60 dark:text-white/60">
              {isFlipped ? 'Illustrated Studio Edition' : 'Editorial Studio Portrait'}
            </span>
            <Magnetic strength={0.32} proximity={30} maxOffset={8}>
              <button
                type="button"
                onClick={() => setIsFlipped((prev) => !prev)}
                className="liquid-glass-btn inline-flex cursor-pointer items-center gap-1.5 px-3.5 py-1.5 font-display text-xs font-semibold !text-[#880021] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#880021] dark:!text-[#d43b5c] dark:focus-visible:ring-[#d43b5c]"
              >
                <RotateCw className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{isFlipped ? 'Show Photo' : 'Flip Persona'}</span>
              </button>
            </Magnetic>
          </div>
        </motion.div>
      </div>
    </ScrollRevealSection>
  );
}
