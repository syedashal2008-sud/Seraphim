import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { BrandLogo } from './BrandLogo';
import { Magnetic } from './Magnetic';
import { ThemeToggle } from './ThemeToggle';

interface NavLinkItem {
  label: string;
  href: string;
}

const NAV_LINKS: NavLinkItem[] = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Fav Project', href: '#favorite-project' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Playground', href: '#sandbox' },
  { label: 'Contact', href: '#contact' },
];

const EDITORIAL_EASE = [0.16, 1, 0.3, 1] as const;
const NAVBAR_SCROLL_OFFSET = 88;
const SHOW_AFTER_SCROLL_PX = 180;

export function Navbar() {
  const headerRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('#about');

  useEffect(() => {
    let rafId: number | null = null;

    const updateNavState = () => {
      rafId = null;
      const scrollY = window.scrollY;
      const shouldShow = scrollY > SHOW_AFTER_SCROLL_PX;
      setIsVisible(shouldShow);
      if (!shouldShow) {
        setIsMobileOpen(false);
      }

      const nearBottom =
        window.innerHeight + scrollY >= document.documentElement.scrollHeight - 40;
      if (nearBottom) {
        setActiveSection('#contact');
        return;
      }

      let currentActive = NAV_LINKS[0].href;
      for (const link of NAV_LINKS) {
        const el = document.getElementById(link.href.slice(1));
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top <= NAVBAR_SCROLL_OFFSET + 64) {
          currentActive = link.href;
        }
      }
      setActiveSection(currentActive);
    };

    const scheduleUpdate = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(updateNavState);
    };

    updateNavState();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate, { passive: true });

    return () => {
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, []);

  useEffect(() => {
    if (!isMobileOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileOpen(false);
      }
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setIsMobileOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('pointerdown', handlePointerDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [isMobileOpen]);

  const handleNavigate = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    event.preventDefault();
    setIsMobileOpen(false);

    if (href === '#hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setActiveSection(href);
    const target = document.getElementById(href.slice(1));
    if (target) {
      const targetTop = Math.max(
        0,
        target.getBoundingClientRect().top + window.scrollY - NAVBAR_SCROLL_OFFSET
      );
      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    }
  };

  return (
    <motion.header
      ref={headerRef}
      initial={false}
      animate={{
        opacity: isVisible ? 1 : 0,
        y: isVisible ? 0 : -18,
      }}
      transition={{ duration: 0.28, ease: EDITORIAL_EASE }}
      aria-hidden={!isVisible}
      className={`fixed inset-x-0 top-3 z-40 px-4 sm:px-8 lg:px-12 ${
        isVisible ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
    >
      <div className="glass-surface relative mx-auto w-full max-w-6xl overflow-hidden rounded-xl text-[#000000] transition-colors duration-300 dark:text-[#ffffff]">
        {/* Specular glass rim & zero-cost refracted depth orbs */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/85 to-transparent dark:via-white/55"
        />
        <span
          aria-hidden="true"
          style={{
            background:
              'radial-gradient(circle, rgba(255,255,255,0.45) 0%, transparent 70%)',
          }}
          className="pointer-events-none absolute -top-14 left-6 h-32 w-52 rounded-full dark:opacity-25"
        />
        <span
          aria-hidden="true"
          style={{
            background:
              'radial-gradient(circle, rgba(136,0,33,0.12) 0%, transparent 70%)',
          }}
          className="pointer-events-none absolute -bottom-14 right-14 h-32 w-60 rounded-full"
        />

        <nav
          aria-label="Primary navigation"
          className="relative z-10 flex h-[60px] w-full items-center justify-between gap-4 px-5 sm:px-6"
        >
          {/* Minimalist Brand Mark: logo-only in compact view, logo + wordmark when expanded */}
          <Magnetic strength={0.28} proximity={24} maxOffset={8} disabled={!isVisible}>
            <a
              href="#hero"
              tabIndex={isVisible ? 0 : -1}
              onClick={(e) => handleNavigate(e, '#hero')}
              aria-label="Ashal Abbas · Seraphim — Back to top"
              className="inline-flex shrink-0 items-center gap-2.5 whitespace-nowrap text-[#000000] transition-opacity duration-200 hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#880021] focus-visible:ring-offset-4 dark:text-[#ffffff] dark:focus-visible:ring-[#d43b5c]"
            >
              <BrandLogo className="h-10 w-10 shrink-0 lg:h-9 lg:w-9" />
              <span className="hidden items-baseline gap-2 lg:inline-flex">
                <span className="font-display text-sm font-bold tracking-[-0.02em] sm:text-[15px]">
                  Ashal Abbas
                </span>
                <span aria-hidden="true" className="font-bold text-[#880021] dark:text-[#d43b5c]">
                  ·
                </span>
                <span className="font-serif text-base italic text-[#880021] dark:text-[#d43b5c] sm:text-lg">
                  Seraphim
                </span>
              </span>
            </a>
          </Magnetic>

          {/* Desktop Links with Active ScrollSpy Indicator */}
          <ul className="hidden items-center gap-4 lg:flex xl:gap-6">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.href;
              return (
                <li key={link.href}>
                  <Magnetic strength={0.32} proximity={22} maxOffset={7} disabled={!isVisible}>
                    <a
                      href={link.href}
                      tabIndex={isVisible ? 0 : -1}
                      onClick={(e) => handleNavigate(e, link.href)}
                      aria-current={isActive ? 'location' : undefined}
                      className={`group relative inline-block whitespace-nowrap py-1.5 font-display text-[13px] font-medium tracking-tight transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#880021] focus-visible:ring-offset-4 dark:focus-visible:ring-[#d43b5c] ${
                        isActive
                          ? 'text-[#880021] dark:text-[#ffffff]'
                          : 'text-black/70 hover:text-[#880021] dark:text-white/70 dark:hover:text-[#ffffff]'
                      }`}
                    >
                      <span>{link.label}</span>
                      {isActive ? (
                        <motion.span
                          layoutId="navbar-active-underline"
                          transition={{ duration: 0.28, ease: EDITORIAL_EASE }}
                          aria-hidden="true"
                          className="absolute inset-x-0 bottom-0 h-[2px] rounded-full bg-[#880021] dark:bg-[#d43b5c]"
                        />
                      ) : (
                        <span
                          aria-hidden="true"
                          className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 rounded-full bg-[#880021]/60 transition-transform duration-200 ease-out group-hover:scale-x-100 dark:bg-[#d43b5c]/60"
                        />
                      )}
                    </a>
                  </Magnetic>
                </li>
              );
            })}
          </ul>

          {/* Right Zone: Theme Toggle + Mobile/Tablet Menu Toggle */}
          <div className="flex shrink-0 items-center gap-2">
            <Magnetic strength={0.32} proximity={28} maxOffset={8} disabled={!isVisible}>
              <ThemeToggle tabIndex={isVisible ? 0 : -1} />
            </Magnetic>

            <button
              type="button"
              tabIndex={isVisible ? 0 : -1}
              onClick={() => setIsMobileOpen((prev) => !prev)}
              aria-expanded={isMobileOpen}
              aria-controls="mobile-navigation-drawer"
              aria-label={isMobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="liquid-glass-btn inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#880021] dark:focus-visible:ring-[#d43b5c] lg:hidden"
            >
              {isMobileOpen ? (
                <X className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Menu className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </div>
        </nav>

        {/* Translucent Mobile & Tablet Drawer */}
        <AnimatePresence>
          {isMobileOpen && isVisible && (
            <motion.div
              id="mobile-navigation-drawer"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.24, ease: EDITORIAL_EASE }}
              className="relative z-10 overflow-hidden border-t border-black/10 dark:border-white/15 lg:hidden"
            >
              <ul className="flex flex-col px-5 py-3">
                {NAV_LINKS.map((link) => {
                  const isActive = activeSection === link.href;
                  return (
                    <li
                      key={link.href}
                      className="border-b border-black/10 last:border-b-0 dark:border-white/10"
                    >
                      <a
                        href={link.href}
                        onClick={(e) => handleNavigate(e, link.href)}
                        aria-current={isActive ? 'location' : undefined}
                        className={`flex items-center justify-between py-3 font-display text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#880021] dark:focus-visible:ring-[#d43b5c] ${
                          isActive
                            ? 'text-[#880021] dark:text-[#d43b5c]'
                            : 'text-[#000000] hover:text-[#880021] dark:text-[#ffffff] dark:hover:text-[#d43b5c]'
                        }`}
                      >
                        <span>{link.label}</span>
                        {isActive && (
                          <span className="font-serif text-sm italic">Active</span>
                        )}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
