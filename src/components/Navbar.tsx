import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { Cpu, FolderKanban, Home, Mail, Menu, Star, User, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { BrandLogo } from './BrandLogo';
import { Magnetic } from './Magnetic';
import { ThemeToggle } from './ThemeToggle';

interface NavLinkItem {
  label: string;
  href: string;
  desktopOnly?: boolean;
}

const NAV_LINKS: NavLinkItem[] = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Fav Project', href: '#favorite-project' },
  { label: 'Testimonials', href: '#testimonials', desktopOnly: true },
  { label: 'Playground', href: '#sandbox', desktopOnly: true },
  { label: 'Contact', href: '#contact' },
];

const MOBILE_NAV_LINKS = [
  { label: 'Home', href: '#hero', Icon: Home },
  { label: 'About', href: '#about', Icon: User },
  { label: 'Projects', href: '#projects', Icon: FolderKanban },
  { label: 'Skills', href: '#skills', Icon: Cpu },
  { label: 'Fav', href: '#favorite-project', Icon: Star },
  { label: 'Contact', href: '#contact', Icon: Mail },
] as const;

const EDITORIAL_EASE = [0.16, 1, 0.3, 1] as const;
const NAVBAR_SCROLL_OFFSET = 88;
const MOBILE_SCROLL_OFFSET = 16;
const SHOW_AFTER_SCROLL_PX = 180;

export function Navbar() {
  const headerRef = useRef<HTMLElement | null>(null);
  const navLockRef = useRef<{ href: string; expiresAt: number } | null>(null);
  const cleanupNavTimersRef = useRef<(() => void) | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('#hero');

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

      if (navLockRef.current && Date.now() < navLockRef.current.expiresAt) {
        return;
      }
      navLockRef.current = null;

      const nearBottom =
        window.innerHeight + scrollY >= document.documentElement.scrollHeight - 40;
      if (nearBottom) {
        setActiveSection('#contact');
        return;
      }

      const offset =
        window.innerWidth >= 768 ? NAVBAR_SCROLL_OFFSET : MOBILE_SCROLL_OFFSET;
      let currentActive = '#hero';
      for (const link of NAV_LINKS) {
        const el = document.getElementById(link.href.slice(1));
        if (!el || el.getClientRects().length === 0) continue;
        const top = el.getBoundingClientRect().top;
        if (top <= offset + 64) {
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
      cleanupNavTimersRef.current?.();
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
    cleanupNavTimersRef.current?.();
    cleanupNavTimersRef.current = null;

    setActiveSection(href);
    navLockRef.current = { href, expiresAt: Date.now() + 850 };

    if (href === '#hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      try {
        window.history.replaceState(null, '', '#hero');
      } catch {
        // Ignore history restrictions inside sandboxed iframes
      }
      return;
    }

    const targetId = href.slice(1);
    const getOffset = () =>
      window.innerWidth >= 768 ? NAVBAR_SCROLL_OFFSET : MOBILE_SCROLL_OFFSET;

    let cancelled = false;
    let rafHandle: number | null = null;
    let settleTimer: number | null = null;
    let attempts = 0;

    const cancelNavigation = () => {
      cancelled = true;
      navLockRef.current = null;
      if (rafHandle !== null) window.cancelAnimationFrame(rafHandle);
      if (settleTimer !== null) window.clearTimeout(settleTimer);
      window.removeEventListener('wheel', cancelNavigation);
      window.removeEventListener('touchstart', cancelNavigation);
    };

    cleanupNavTimersRef.current = cancelNavigation;
    window.addEventListener('wheel', cancelNavigation, { passive: true, once: true });
    window.addEventListener('touchstart', cancelNavigation, { passive: true, once: true });

    const scrollToElement = (target: HTMLElement) => {
      const offset = getOffset();
      const targetTop = Math.max(
        0,
        Math.round(target.getBoundingClientRect().top + window.scrollY - offset)
      );
      window.scrollTo({ top: targetTop, behavior: 'smooth' });

      try {
        window.history.replaceState(null, '', href);
      } catch {
        // Ignore history restrictions inside sandboxed iframes
      }

      // Re-align once if lazy/whileInView animations shift page height mid-scroll
      settleTimer = window.setTimeout(() => {
        if (cancelled) return;
        const freshTarget = document.getElementById(targetId);
        if (!freshTarget || freshTarget.getClientRects().length === 0) return;
        const currentOffset = getOffset();
        const delta = freshTarget.getBoundingClientRect().top - currentOffset;
        const maxScroll =
          document.documentElement.scrollHeight - window.innerHeight;
        const desiredTop = Math.min(
          maxScroll,
          Math.max(0, Math.round(freshTarget.getBoundingClientRect().top + window.scrollY - currentOffset))
        );
        if (Math.abs(delta) > 16 && Math.abs(window.scrollY - desiredTop) > 16) {
          window.scrollTo({ top: desiredTop, behavior: 'smooth' });
        }
        window.removeEventListener('wheel', cancelNavigation);
        window.removeEventListener('touchstart', cancelNavigation);
      }, 460);
    };

    const tryFindAndScroll = () => {
      if (cancelled) return;
      const target = document.getElementById(targetId);
      if (target && target.getClientRects().length > 0) {
        scrollToElement(target);
        return;
      }
      attempts += 1;
      if (attempts < 40) {
        rafHandle = window.requestAnimationFrame(tryFindAndScroll);
      }
    };

    tryFindAndScroll();
  };

  return (
    <>
      {/* Tablet & Desktop Floating Top Navbar */}
      <motion.header
        ref={headerRef}
        initial={false}
        animate={{
          opacity: isVisible ? 1 : 0,
          y: isVisible ? 0 : -18,
        }}
        transition={{ duration: 0.28, ease: EDITORIAL_EASE }}
        aria-hidden={!isVisible}
        className={`fixed inset-x-0 top-3 z-40 hidden px-4 sm:px-8 md:block lg:px-12 ${
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
                      className={`border-b border-black/10 last:border-b-0 dark:border-white/10 ${
                        link.desktopOnly ? 'hidden md:block' : ''
                      }`}
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

      {/* Dedicated Mobile Bottom Dock Navbar (< 768px) */}
      <nav
        aria-label="Mobile navigation"
        className="fixed inset-x-2.5 bottom-3 z-40 mx-auto max-w-md md:hidden"
      >
        <div className="glass-surface relative flex items-center justify-between gap-1 overflow-hidden rounded-2xl px-1.5 py-1.5 text-[#000000] dark:text-[#ffffff]">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent dark:via-white/50"
          />

          <div className="relative z-10 flex flex-1 items-center justify-around gap-0.5">
            {MOBILE_NAV_LINKS.map(({ label, href, Icon }) => {
              const isActive = activeSection === href;
              return (
                <a
                  key={href}
                  href={href}
                  onClick={(e) => handleNavigate(e, href)}
                  aria-current={isActive ? 'location' : undefined}
                  className={`relative flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-1.5 font-display text-[9.5px] font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#880021] dark:focus-visible:ring-[#d43b5c] ${
                    isActive
                      ? 'text-[#ffffff]'
                      : 'text-black/70 hover:text-[#880021] dark:text-white/75 dark:hover:text-[#ffffff]'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="mobile-navbar-active-pill"
                      transition={{ duration: 0.25, ease: EDITORIAL_EASE }}
                      aria-hidden="true"
                      className="liquid-glass-btn-accent absolute inset-0 rounded-xl"
                    />
                  )}
                  <Icon className="relative z-10 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span className="relative z-10 leading-none">{label}</span>
                </a>
              );
            })}
          </div>

          <div
            aria-hidden="true"
            className="relative z-10 mx-0.5 h-7 w-px shrink-0 bg-black/15 dark:bg-white/20"
          />

          <div className="relative z-10 shrink-0 pr-0.5">
            <ThemeToggle className="!h-9 !w-9" />
          </div>
        </div>
      </nav>
    </>
  );
}
