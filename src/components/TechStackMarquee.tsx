import { useReducedMotion } from 'motion/react';

const TECH_STACK = [
  'HTML',
  'CSS',
  'JavaScript',
  'PHP',
  'C#',
  'Bootstrap',
  'ASP.NET Core',
  'Laravel',
  'MySQL',
] as const;

function MarqueeStrip({ hidden = false }: { hidden?: boolean }) {
  return (
    <div
      aria-hidden={hidden || undefined}
      className="flex shrink-0 items-center gap-8 pr-8 sm:gap-12 sm:pr-12"
    >
      {TECH_STACK.map((item, idx) => (
        <div key={`${item}-${idx}`} className="flex items-center gap-8 sm:gap-12">
          <span
            className={
              idx % 2 === 0
                ? 'inline-block font-display text-sm font-medium tracking-[0.04em] text-[#ffffff] transition-all duration-300 hover:-translate-y-0.5 hover:underline hover:decoration-[#880021] hover:decoration-2 hover:underline-offset-4 sm:text-base whitespace-nowrap'
                : 'inline-block font-serif text-lg font-medium italic text-white/85 transition-all duration-300 hover:-translate-y-0.5 hover:scale-105 hover:text-[#ffffff] sm:text-xl whitespace-nowrap'
            }
          >
            {item}
          </span>
          <span aria-hidden="true" className="text-white/40 select-none">
            ·
          </span>
        </div>
      ))}
    </div>
  );
}

export function TechStackMarquee() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      aria-label="Technology Stack"
      className="relative z-[2] w-full overflow-hidden border-y-2 border-[#880021] bg-[#000000] py-5 text-[#ffffff] transition-colors duration-300 dark:border-[#d43b5c] dark:bg-[#0a0a0a] sm:py-6"
    >
      {prefersReducedMotion ? (
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-6 gap-y-2 px-6">
          {TECH_STACK.map((item, idx) => (
            <span
              key={item}
              className="flex items-center gap-6 font-display text-sm font-medium text-[#ffffff]"
            >
              <span>{item}</span>
              {idx < TECH_STACK.length - 1 && (
                <span aria-hidden="true" className="text-white/40">
                  ·
                </span>
              )}
            </span>
          ))}
        </div>
      ) : (
        <div className="group relative flex w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          <div className="animate-marquee flex w-max items-center will-change-transform group-hover:[animation-play-state:paused]">
            <MarqueeStrip />
            <MarqueeStrip hidden />
          </div>
        </div>
      )}
    </section>
  );
}
