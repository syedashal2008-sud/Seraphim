import { useState, type MouseEvent } from 'react';
import { Check, Copy, FileDown, Mail } from 'lucide-react';
import { motion } from 'motion/react';
import { Magnetic } from './Magnetic';

const EMAIL = 'syedashal2008@gmail.com';
const EDITORIAL_EASE = [0.16, 1, 0.3, 1] as const;
const NAVBAR_SCROLL_OFFSET = 88;

const EXPLORE_LINKS = [
  { label: 'Home', href: '#hero' },
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
] as const;

const SHOWCASE_LINKS = [
  { label: 'Fav Project', href: '#favorite-project' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Playground', href: '#sandbox' },
  { label: 'Channels', href: '#connect' },
] as const;

const SOCIAL_LINKS = [
  {
    label: 'Gmail',
    href: `https://mail.google.com/mail/?view=cm&fs=1&to=${EMAIL}`,
  },
  {
    label: 'Instagram',
    href: 'https://instagram.com/___ashal___',
  },
  {
    label: 'WhatsApp',
    href: 'https://wa.me/923326764949',
  },
  {
    label: 'GitHub',
    href: 'https://github.com/syedashal2008-sud',
  },
] as const;

export function Footer() {
  const [emailCopied, setEmailCopied] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setEmailCopied(true);
      window.setTimeout(() => setEmailCopied(false), 2000);
    } catch {
      // Clipboard blocked in restricted sandbox; ignore silently
    }
  };

  const handleAnchorClick = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith('#')) return;
    event.preventDefault();

    if (href === '#hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

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
    <motion.footer
      id="contact"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.55, ease: EDITORIAL_EASE }}
      className="relative z-[2] w-full bg-transparent px-4 pb-6 pt-10 text-[#000000] transition-colors duration-300 dark:text-[#ffffff] sm:px-8 sm:pb-8 sm:pt-14 lg:px-12"
    >
      <div className="mx-auto w-full max-w-6xl overflow-hidden rounded-3xl border border-black/12 bg-[#f9f9fb] px-6 pt-12 text-[#000000] shadow-[0_24px_60px_-24px_rgba(0,0,0,0.12)] transition-colors duration-300 dark:border-white/12 dark:bg-[#09090b] dark:text-[#ffffff] dark:shadow-[0_24px_70px_-20px_rgba(0,0,0,0.9)] sm:px-10 sm:pt-14 lg:px-14 lg:pt-16">
        {/* Top Split Layout: Brand Summary (Left) + 4 Navigation Columns (Right) */}
        <div className="grid grid-cols-1 gap-12 pb-12 lg:grid-cols-12 lg:gap-10">
          {/* Left Column: Brand Identity & Direct Summary */}
          <div className="lg:col-span-4">
            <a
              href="#hero"
              onClick={(e) => handleAnchorClick(e, '#hero')}
              className="inline-flex items-baseline gap-2 font-display text-2xl font-extrabold uppercase tracking-[-0.03em] text-[#000000] transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#880021] dark:text-[#ffffff] dark:focus-visible:ring-[#d43b5c]"
            >
              <span>SERAPHIM</span>
              <span className="font-serif text-xl font-medium italic lowercase tracking-normal text-[#880021] dark:text-[#d43b5c]">
                design
              </span>
            </a>

            <p className="mt-3.5 max-w-xs font-display text-xs leading-relaxed text-black/65 dark:text-white/60 sm:text-[13px]">
              Ashal Abbas is a Full-Stack Web Developer specializing in structured
              frontend systems, Laravel &amp; ASP.NET Core backends, and MySQL architectures.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-2.5">
              <Magnetic strength={0.3} proximity={28} maxOffset={8}>
                <a
                  href={`mailto:${EMAIL}`}
                  className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl bg-[#880021] px-3.5 py-2 font-display text-xs font-semibold text-[#ffffff] transition-colors duration-200 hover:bg-[#000000] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#880021] dark:hover:bg-[#ffffff] dark:hover:text-[#000000] dark:focus-visible:ring-[#d43b5c]"
                >
                  <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Send Email</span>
                </a>
              </Magnetic>

              <Magnetic strength={0.3} proximity={28} maxOffset={8}>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="inline-flex min-h-[38px] cursor-pointer items-center gap-1.5 rounded-xl border border-black/15 bg-transparent px-3.5 py-2 font-display text-xs font-medium text-[#000000] transition-colors duration-200 hover:border-[#880021] hover:text-[#880021] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#880021] dark:border-white/20 dark:text-[#ffffff] dark:hover:border-[#d43b5c] dark:hover:text-[#d43b5c] dark:focus-visible:ring-[#d43b5c]"
                >
                  {emailCopied ? (
                    <Check className="h-3.5 w-3.5 text-[#880021] dark:text-[#d43b5c]" aria-hidden="true" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                  )}
                  <span>{emailCopied ? 'Copied' : 'Copy Email'}</span>
                </button>
              </Magnetic>
            </div>
          </div>

          {/* Right Columns: 4 Structured Navigation & Connect Groups */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-8">
            {/* Column 1: Quick Links */}
            <div>
              <h3 className="font-display text-xs font-semibold text-[#000000] dark:text-[#ffffff] sm:text-sm">
                Quick link
              </h3>
              <ul className="mt-4 flex flex-col gap-2.5">
                {EXPLORE_LINKS.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={(e) => handleAnchorClick(e, link.href)}
                      className="inline-block font-display text-xs text-black/65 transition-colors duration-150 hover:text-[#880021] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#880021] dark:text-white/60 dark:hover:text-[#d43b5c] dark:focus-visible:ring-[#d43b5c] sm:text-[13px]"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2: Portfolio */}
            <div>
              <h3 className="font-display text-xs font-semibold text-[#000000] dark:text-[#ffffff] sm:text-sm">
                Portfolio
              </h3>
              <ul className="mt-4 flex flex-col gap-2.5">
                {SHOWCASE_LINKS.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={(e) => handleAnchorClick(e, link.href)}
                      className="inline-block font-display text-xs text-black/65 transition-colors duration-150 hover:text-[#880021] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#880021] dark:text-white/60 dark:hover:text-[#d43b5c] dark:focus-visible:ring-[#d43b5c] sm:text-[13px]"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Resources */}
            <div>
              <h3 className="font-display text-xs font-semibold text-[#000000] dark:text-[#ffffff] sm:text-sm">
                Resources
              </h3>
              <ul className="mt-4 flex flex-col gap-2.5">
                <li>
                  <a
                    href="/assets/aistudio/ashal_CV_37b68b7b.pdf"
                    download="Ashal_Abbas_CV.pdf"
                    className="inline-flex items-center gap-1.5 font-display text-xs text-black/65 transition-colors duration-150 hover:text-[#880021] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#880021] dark:text-white/60 dark:hover:text-[#d43b5c] dark:focus-visible:ring-[#d43b5c] sm:text-[13px]"
                  >
                    <FileDown className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Resume CV</span>
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${EMAIL}`}
                    className="inline-block font-display text-xs text-black/65 transition-colors duration-150 hover:text-[#880021] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#880021] dark:text-white/60 dark:hover:text-[#d43b5c] dark:focus-visible:ring-[#d43b5c] sm:text-[13px]"
                  >
                    Direct Mail
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+923326764949"
                    className="inline-block font-display text-xs tabular-nums text-black/65 transition-colors duration-150 hover:text-[#880021] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#880021] dark:text-white/60 dark:hover:text-[#d43b5c] dark:focus-visible:ring-[#d43b5c] sm:text-[13px]"
                  >
                    0332-6764949
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 4: Social */}
            <div>
              <h3 className="font-display text-xs font-semibold text-[#000000] dark:text-[#ffffff] sm:text-sm">
                Social
              </h3>
              <ul className="mt-4 flex flex-col gap-2.5">
                {SOCIAL_LINKS.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block font-display text-xs text-black/65 transition-colors duration-150 hover:text-[#880021] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#880021] dark:text-white/60 dark:hover:text-[#d43b5c] dark:focus-visible:ring-[#d43b5c] sm:text-[13px]"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Middle Hairline Divider & Copyright Strip */}
        <div className="flex flex-col items-start justify-between gap-2 border-t border-black/10 py-5 font-display text-xs text-black/55 dark:border-white/10 dark:text-white/55 sm:flex-row sm:items-center">
          <p className="tabular-nums">
            &copy; 2026 Seraphim Design. All rights reserved.
          </p>
          <p className="tabular-nums">
            Crafted by <span className="font-medium text-[#000000] dark:text-[#ffffff]">Ashal Abbas</span>
            <span aria-hidden="true" className="mx-1.5 text-[#880021] dark:text-[#d43b5c]">·</span>
            <a
              href={`mailto:${EMAIL}`}
              className="transition-colors hover:text-[#880021] dark:hover:text-[#d43b5c]"
            >
              {EMAIL}
            </a>
          </p>
        </div>

        {/* Bottom Oversized Edge-Fading Gradient Display Wordmark */}
        <div
          aria-hidden="true"
          className="relative -mx-2 mt-1 select-none overflow-hidden pb-2 text-center [mask-image:linear-gradient(to_right,transparent_0%,black_18%,black_82%,transparent_100%)]"
        >
          <p className="bg-gradient-to-b from-[#880021] via-[#880021]/80 to-transparent bg-clip-text font-display text-[clamp(3.6rem,15.5vw,12.25rem)] font-extrabold uppercase leading-[0.82] tracking-[-0.04em] text-transparent dark:from-[#e44c6f] dark:via-[#880021]/85 dark:to-transparent">
            SERAPHIM
          </p>
        </div>
      </div>
    </motion.footer>
  );
}
