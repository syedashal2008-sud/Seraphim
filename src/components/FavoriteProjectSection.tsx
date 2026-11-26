import { useState, type MouseEvent } from 'react';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { GlassRefraction } from './GlassRefraction';
import { Magnetic } from './Magnetic';
import { ScrollRevealSection } from './ScrollRevealSection';
import { SectionHeaderReveal } from './SectionHeaderReveal';

interface StackCardItem {
  index: string;
  title: string;
  caption: string;
  src: string;
  alt: string;
  positionClassName: string;
}

const STACK_CARDS: StackCardItem[] = [
  {
    index: '01',
    title: 'Editorial Lookbook',
    caption: 'Seraphim Lookbook · Editorial Grid',
    src: '/src/assets/images/p3_cms_editorial_1794939907079.jpg',
    alt: 'Seraphim Commerce editorial landing layout displayed on a studio laptop',
    positionClassName: 'right-0 top-0 w-[76%] sm:w-[70%]',
  },
  {
    index: '02',
    title: 'Order & Stock Ledger',
    caption: 'Order Management · Live Fulfillment',
    src: '/src/assets/images/p1_commerce_dashboard_1794939906426.jpg',
    alt: 'Seraphim Commerce order management dashboard on a desktop display',
    positionClassName: 'left-0 top-[20%] w-[76%] sm:w-[70%]',
  },
  {
    index: '03',
    title: 'Monochrome Storefront',
    caption: 'Seraphim Commerce · Storefront Core',
    src: '/src/assets/images/p1_commerce_storefront_1794939906583.jpg',
    alt: 'Seraphim Commerce curated storefront catalog interface on a laptop',
    positionClassName: 'bottom-0 right-[6%] w-[78%] sm:right-[8%] sm:w-[72%]',
  },
];

export function FavoriteProjectSection() {
  const [activeIndex, setActiveIndex] = useState<number>(2);
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});
  const prefersReducedMotion = useReducedMotion();

  const handleScrollToProjects = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const target = document.querySelector('#projects');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <ScrollRevealSection
      id="favorite-project"
      className="relative z-[2] w-full bg-transparent px-6 pb-20 pt-8 text-[#000000] transition-colors duration-300 dark:text-[#ffffff] sm:px-12 sm:pb-28 sm:pt-12 lg:px-20"
    >
      <div className="mx-auto w-full max-w-6xl pt-8 sm:pt-12">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-14">
          {/* Left Column: Editorial Text & Interactive Layer Index */}
          <div className="flex flex-col text-left lg:col-span-5">
            <SectionHeaderReveal
              title="Fav Project"
              subtitle="Seraphim Commerce · Flagship Build"
              titleClassName="font-display text-[clamp(2.15rem,4vw,3.25rem)] font-bold leading-none tracking-[-0.035em] text-[#000000] text-balance dark:text-[#ffffff]"
              subtitleClassName="mt-2 font-serif text-xl font-medium italic leading-snug text-[#880021] dark:text-[#d43b5c] sm:text-2xl"
            />

            <p className="mt-4 font-display text-xs font-medium tracking-wide text-black/60 dark:text-white/65">
              Full-Stack E-Commerce · Laravel · PHP · MySQL · Bootstrap · JS
            </p>

            <p className="mt-5 font-display text-[15px] leading-[1.75] text-black/80 dark:text-white/80">
              Built end-to-end under Seraphim Design, this flagship commerce
              platform pairs minimalist storefront typography with real-time
              stock locking, multi-step checkout flows, and a fast relational
              order ledger engineered for zero inventory conflicts.
            </p>

            {/* Interactive Layer Switcher synced with Stacked Cards */}
            <div className="mt-7 border-t border-black/15 dark:border-white/20">
              {STACK_CARDS.map((card, idx) => {
                const isSelected = activeIndex === idx;
                return (
                  <button
                    key={card.index}
                    type="button"
                    onMouseEnter={() => setActiveIndex(idx)}
                    onFocus={() => setActiveIndex(idx)}
                    onClick={() => setActiveIndex(idx)}
                    className={`group flex w-full cursor-pointer items-center justify-between gap-4 border-b border-black/15 py-3 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#880021] dark:border-white/20 dark:focus-visible:ring-[#d43b5c] ${
                      isSelected ? 'pl-2' : 'hover:pl-2'
                    }`}
                  >
                    <div className="flex items-baseline gap-3">
                      <span
                        className={`font-display text-xs font-bold tabular-nums transition-colors ${
                          isSelected
                            ? 'text-[#880021] dark:text-[#d43b5c]'
                            : 'text-black/45 group-hover:text-[#880021] dark:text-white/45 dark:group-hover:text-[#d43b5c]'
                        }`}
                      >
                        {card.index}
                      </span>
                      <span
                        className={`font-display text-sm font-semibold transition-colors ${
                          isSelected
                            ? 'text-[#000000] dark:text-[#ffffff]'
                            : 'text-black/65 group-hover:text-[#000000] dark:text-white/65 dark:group-hover:text-[#ffffff]'
                        }`}
                      >
                        {card.title}
                      </span>
                    </div>

                    <span
                      className={`font-serif text-sm italic transition-opacity ${
                        isSelected
                          ? 'text-[#880021] opacity-100 dark:text-[#d43b5c]'
                          : 'text-black/40 opacity-0 group-hover:opacity-100 dark:text-white/45'
                      }`}
                    >
                      {isSelected ? 'On top' : 'Bring up'}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Action Links */}
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Magnetic strength={0.34} proximity={40} maxOffset={10}>
                <a
                  href="https://github.com/syedashal2008-sud"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="liquid-glass-btn-accent group inline-flex min-h-[42px] items-center gap-2 px-5 py-2.5 font-display text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#880021] focus-visible:ring-offset-2 dark:focus-visible:ring-[#d43b5c] whitespace-nowrap"
                >
                  <span>View on GitHub</span>
                  <ArrowUpRight
                    className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </a>
              </Magnetic>

              <Magnetic strength={0.3} proximity={34} maxOffset={9}>
                <a
                  href="#projects"
                  onClick={handleScrollToProjects}
                  className="liquid-glass-btn group inline-flex min-h-[42px] items-center gap-2 px-5 py-2.5 font-display text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#880021] dark:focus-visible:ring-[#d43b5c] whitespace-nowrap"
                >
                  <span>All Projects</span>
                  <ArrowDown
                    className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-y-0.5"
                    aria-hidden="true"
                  />
                </a>
              </Magnetic>
            </div>
          </div>

          {/* Right Column: Overlapping Interactive Image Deck */}
          <div className="lg:col-span-7">
            <div
              className="relative mx-auto h-[340px] w-full max-w-[660px] sm:h-[430px] lg:h-[470px]"
              aria-label="Favorite project layered gallery. Hover or select any image to bring it to the front."
            >
              {STACK_CARDS.map((card, idx) => {
                const isActive = activeIndex === idx;
                const inactiveOrder =
                  idx < activeIndex ? idx + 1 : idx === activeIndex ? 30 : idx;
                const zIndex = isActive ? 30 : inactiveOrder * 8;

                return (
                  <motion.button
                    key={card.index}
                    type="button"
                    onMouseEnter={() => setActiveIndex(idx)}
                    onFocus={() => setActiveIndex(idx)}
                    onClick={() => setActiveIndex(idx)}
                    aria-pressed={isActive}
                    aria-label={`${card.caption}. ${
                      isActive
                        ? 'Currently on top.'
                        : 'Hover or click to bring this image to the top.'
                    }`}
                    style={{ zIndex }}
                    initial={false}
                    animate={
                      prefersReducedMotion
                        ? { opacity: isActive ? 1 : 0.86 }
                        : {
                            scale: isActive ? 1.03 : 0.96,
                            y: isActive ? -8 : 0,
                            opacity: isActive ? 1 : 0.88,
                          }
                    }
                    transition={{
                      type: 'spring',
                      stiffness: 260,
                      damping: 24,
                      mass: 0.7,
                    }}
                    className={`glass-card group absolute cursor-pointer overflow-hidden rounded-xl text-left will-change-transform transition-[border-color,box-shadow] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#880021] focus-visible:ring-offset-4 dark:focus-visible:ring-[#d43b5c] ${
                      card.positionClassName
                    } ${
                      isActive
                        ? '!border-[#880021] shadow-[0_28px_64px_-16px_rgba(0,0,0,0.28)] dark:!border-[#d43b5c] dark:shadow-[0_32px_70px_-14px_rgba(0,0,0,0.9)]'
                        : 'hover:border-black/35 dark:hover:border-white/40'
                    }`}
                  >
                    <GlassRefraction subtle />
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#111113]">
                      {!failedImages[idx] ? (
                        <img
                          src={card.src}
                          alt={card.alt}
                          referrerPolicy="no-referrer"
                          loading="lazy"
                          decoding="async"
                          onError={() =>
                            setFailedImages((prev) => ({ ...prev, [idx]: true }))
                          }
                          className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                        />
                      ) : (
                        <div className="flex h-full w-full flex-col items-center justify-center bg-[#0b0b0d] p-6 text-center text-white">
                          <span className="font-display text-base font-bold">
                            {card.title}
                          </span>
                          <span className="mt-1 font-serif text-sm italic text-white/75">
                            {card.caption}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="relative z-10 flex items-center justify-between gap-3 border-t border-black/10 bg-white/65 px-3.5 py-2.5 backdrop-blur-sm dark:border-white/15 dark:bg-black/55 sm:px-4 sm:py-3">
                      <span className="truncate font-mono text-[11px] font-medium tracking-tight text-[#000000] dark:text-white/90 sm:text-xs">
                        {card.caption}
                      </span>
                      <span
                        className={`shrink-0 font-mono text-[11px] font-semibold tabular-nums ${
                          isActive
                            ? 'text-[#880021] dark:text-[#d43b5c]'
                            : 'text-black/45 dark:text-white/45'
                        }`}
                      >
                        {card.index}
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </ScrollRevealSection>
  );
}
