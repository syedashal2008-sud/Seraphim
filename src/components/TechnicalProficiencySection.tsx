import { useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react';
import { ScrollRevealSection } from './ScrollRevealSection';
import { SectionHeaderReveal } from './SectionHeaderReveal';

type SkillCategory = 'All' | 'Frontend' | 'Backend' | 'Framework' | 'Server & Database';

interface SkillBar {
  name: string;
  category: Exclude<SkillCategory, 'All'>;
  level: number;
}

const SKILL_CATEGORIES: SkillCategory[] = [
  'All',
  'Frontend',
  'Backend',
  'Framework',
  'Server & Database',
];

const SKILL_BARS: SkillBar[] = [
  { name: 'HTML', category: 'Frontend', level: 95 },
  { name: 'CSS', category: 'Frontend', level: 92 },
  { name: 'JavaScript', category: 'Frontend', level: 86 },
  { name: 'PHP', category: 'Backend', level: 88 },
  { name: 'C#', category: 'Backend', level: 84 },
  { name: 'Bootstrap', category: 'Framework', level: 90 },
  { name: 'ASP.NET Core', category: 'Framework', level: 82 },
  { name: 'Laravel', category: 'Framework', level: 85 },
  { name: 'MySQL', category: 'Server & Database', level: 88 },
];

const EDITORIAL_EASE = [0.16, 1, 0.3, 1] as const;

export function TechnicalProficiencySection() {
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory>('All');
  const gridRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(gridRef, { once: true, amount: 0.08 });
  const prefersReducedMotion = useReducedMotion();
  const shouldReveal = isInView || Boolean(prefersReducedMotion);

  const filteredSkills =
    selectedCategory === 'All'
      ? SKILL_BARS
      : SKILL_BARS.filter((skill) => skill.category === selectedCategory);

  return (
    <ScrollRevealSection
      id="skills"
      className="relative z-[2] w-full bg-transparent px-6 pb-20 pt-10 text-[#000000] transition-colors duration-300 dark:text-[#ffffff] sm:px-12 sm:pb-24 sm:pt-14 lg:px-20"
    >
      <div className="mx-auto w-full max-w-6xl border-t border-black/15 pt-12 dark:border-white/20 sm:pt-16">
        <SectionHeaderReveal
          title="Technical Proficiency"
          subtitle="2–3 Years Experience"
          layout="split"
          className="mb-8"
          titleClassName="font-display text-[clamp(1.75rem,3.5vw,2.75rem)] font-bold leading-none tracking-[-0.03em] text-[#000000] dark:text-[#ffffff]"
          subtitleClassName="font-serif text-lg font-medium italic text-[#880021] dark:text-[#d43b5c] sm:text-xl"
        />

        {/* Interactive Skill Category Filter */}
        <div
          role="tablist"
          aria-label="Filter skills by discipline"
          className="mb-8 inline-flex flex-wrap items-center gap-1 rounded-xl border border-black/12 bg-black/[0.03] p-1 dark:border-white/15 dark:bg-white/[0.04]"
        >
          {SKILL_CATEGORIES.map((category) => {
            const isActive = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setSelectedCategory(category)}
                className={`relative cursor-pointer rounded-lg px-3 py-1.5 font-display text-xs font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? 'text-[#ffffff] dark:text-[#000000]'
                    : 'text-black/70 hover:text-[#000000] dark:text-white/70 dark:hover:text-[#ffffff]'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="skills-filter-pill"
                    transition={{ duration: 0.25, ease: EDITORIAL_EASE }}
                    aria-hidden="true"
                    className="absolute inset-0 rounded-lg bg-[#000000] dark:bg-[#ffffff]"
                  />
                )}
                <span className="relative z-10">{category}</span>
              </button>
            );
          })}
        </div>

        <motion.div
          ref={gridRef}
          layout
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filteredSkills.map((skill, idx) => (
              <motion.div
                key={skill.name}
                layout
                initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
                animate={shouldReveal ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{
                  duration: prefersReducedMotion ? 0 : 0.45,
                  delay: prefersReducedMotion ? 0 : idx * 0.03,
                  ease: EDITORIAL_EASE,
                }}
                className="group flex flex-col gap-3 rounded-xl border border-black/12 bg-[#ffffff]/75 p-4 shadow-[0_12px_32px_-18px_rgba(0,0,0,0.12)] backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#880021] hover:shadow-[0_18px_38px_-18px_rgba(136,0,33,0.22)] dark:border-white/15 dark:bg-white/[0.03] dark:hover:border-[#d43b5c]"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-display text-sm font-semibold text-[#000000] transition-transform duration-200 group-hover:translate-x-0.5 dark:text-[#ffffff] sm:text-[15px]">
                    {skill.name}
                  </span>
                  <span className="flex items-center gap-2 font-display text-xs text-black/60 tabular-nums whitespace-nowrap dark:text-white/65">
                    <span>{skill.category}</span>
                    <span aria-hidden="true" className="font-bold text-[#880021] dark:text-[#d43b5c]">·</span>
                    <span className="font-bold text-[#880021] transition-transform duration-200 group-hover:scale-105 dark:text-[#d43b5c]">
                      {skill.level}%
                    </span>
                  </span>
                </div>

                <div
                  role="progressbar"
                  aria-label={`${skill.name} proficiency`}
                  aria-valuenow={skill.level}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  className="h-[4px] w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/15"
                >
                  <motion.div
                    initial={
                      prefersReducedMotion
                        ? { scaleX: skill.level / 100 }
                        : { scaleX: 0 }
                    }
                    animate={{
                      scaleX: shouldReveal ? skill.level / 100 : 0,
                    }}
                    transition={{
                      duration: prefersReducedMotion ? 0 : 0.85,
                      delay: prefersReducedMotion ? 0 : 0.06 + idx * 0.04,
                      ease: EDITORIAL_EASE,
                    }}
                    className="h-full w-full origin-left rounded-full bg-[#880021] shadow-[0_0_10px_rgba(136,0,33,0.35)] dark:bg-[#d43b5c]"
                  />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </ScrollRevealSection>
  );
}
