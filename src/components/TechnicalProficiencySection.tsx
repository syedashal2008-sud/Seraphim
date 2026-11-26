import { useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react';
import { GlassRefraction } from './GlassRefraction';
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
  const isInView = useInView(gridRef, { once: true, amount: 0.02 });
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
          className="glass-control mb-8 inline-flex flex-wrap items-center gap-1 rounded-full p-1"
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
                className={`relative cursor-pointer rounded-full px-3.5 py-1.5 font-display text-xs font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? 'text-[#ffffff]'
                    : 'text-black/70 hover:text-[#000000] dark:text-white/70 dark:hover:text-[#ffffff]'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="skills-filter-pill"
                    transition={{ duration: 0.25, ease: EDITORIAL_EASE }}
                    aria-hidden="true"
                    className="liquid-glass-btn-accent absolute inset-0"
                  />
                )}
                <span className="relative z-10">{category}</span>
              </button>
            );
          })}
        </div>

        <div ref={gridRef}>
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCategory}
              initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              animate={shouldReveal ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.25,
                ease: EDITORIAL_EASE,
              }}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              {filteredSkills.map((skill, idx) => (
                <div
                  key={skill.name}
                  className="glass-card group relative flex flex-col gap-3 overflow-hidden rounded-xl p-4 transition-[transform,border-color,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-[#880021] hover:shadow-[0_18px_38px_-18px_rgba(136,0,33,0.22)] dark:hover:border-[#d43b5c]"
                >
                  <GlassRefraction subtle />
                  <div className="relative z-10 flex items-baseline justify-between gap-4">
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
                    className="relative z-10 h-[4px] w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/15"
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
                        duration: prefersReducedMotion ? 0 : 0.7,
                        delay: prefersReducedMotion ? 0 : 0.04 + idx * 0.03,
                        ease: EDITORIAL_EASE,
                      }}
                      className="h-full w-full origin-left rounded-full bg-[#880021] shadow-[0_0_10px_rgba(136,0,33,0.35)] dark:bg-[#d43b5c]"
                    />
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </ScrollRevealSection>
  );
}
