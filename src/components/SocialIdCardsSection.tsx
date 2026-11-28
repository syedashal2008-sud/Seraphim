import { useState, type ReactNode } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';
import { QRCodeSVG } from 'qrcode.react';
import { GlassRefraction } from './GlassRefraction';
import { Magnetic } from './Magnetic';
import { SectionHeaderReveal } from './SectionHeaderReveal';

interface SocialCardData {
  id: string;
  platform: string;
  handle: string;
  qrValue: string;
  cordClassName: string;
  swayDuration: number;
  renderLogo: () => ReactNode;
}

const EDITORIAL_EASE = [0.16, 1, 0.3, 1] as const;

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-14 w-14"
      aria-hidden="true"
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-14 w-14"
      aria-hidden="true"
    >
      <path d="M12.031 2c-5.516 0-9.969 4.453-9.969 9.969 0 1.766.469 3.484 1.344 5l-1.406 5.156 5.281-1.375c1.469.797 3.109 1.219 4.75 1.219 5.516 0 9.969-4.453 9.969-9.969S17.547 2 12.031 2zm5.813 14.125c-.25.703-1.453 1.344-2 1.422-.516.078-1.172.109-1.891-.125-.438-.141-1-.328-1.719-.641-3.016-1.297-4.984-4.344-5.141-4.547-.156-.203-1.234-1.641-1.234-3.125 0-1.484.781-2.219 1.063-2.516.281-.297.609-.375.813-.375.203 0 .406 0 .578.016.188.016.438-.078.688.516.25.609.859 2.094.938 2.25.078.156.125.344.031.547-.094.203-.141.328-.297.5-.156.172-.313.391-.453.516-.156.141-.313.297-.141.594.172.297.781 1.281 1.672 2.078 1.156 1.031 2.125 1.344 2.422 1.5.297.156.469.125.641-.078.172-.203.734-.859.938-1.156.203-.297.406-.25.672-.156.266.094 1.719.813 2.016.953.297.141.484.219.563.344.078.125.078.719-.172 1.422z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-14 w-14"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

const SOCIAL_CARDS: SocialCardData[] = [
  {
    id: 'instagram',
    platform: 'Instagram',
    handle: '@___ashal___',
    qrValue: 'https://instagram.com/___ashal___',
    cordClassName: 'h-12 md:h-16',
    swayDuration: 5.4,
    renderLogo: () => <InstagramIcon />,
  },
  {
    id: 'whatsapp',
    platform: 'WhatsApp',
    handle: '0332-6764949',
    qrValue: 'https://wa.me/923326764949',
    cordClassName: 'h-12 md:h-24',
    swayDuration: 6.2,
    renderLogo: () => <WhatsAppIcon />,
  },
  {
    id: 'github',
    platform: 'GitHub',
    handle: '@syedashal2008-sud',
    qrValue: 'https://github.com/syedashal2008-sud',
    cordClassName: 'h-12 md:h-14',
    swayDuration: 5.8,
    renderLogo: () => <GitHubIcon />,
  },
];

interface HangingCardProps {
  card: SocialCardData;
  orderIndex: number;
}

function HangingIdCard({ card, orderIndex }: HangingCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.75,
        delay: orderIndex * 0.1,
        ease: EDITORIAL_EASE,
      }}
      className="flex flex-col items-center border-t border-black/15 dark:border-white/20 md:border-t-0"
    >
      {/* Top anchor pin on the rail */}
      <span
        aria-hidden="true"
        className="-mt-[5px] h-2.5 w-2.5 rounded-full border border-[#880021] bg-[#ffffff] dark:border-[#d43b5c] dark:bg-[#000000]"
      />

      {/* Pendulum assembly pivoting from the top rail via GPU CSS keyframes */}
      <div
        style={{
          animationDuration: `${card.swayDuration}s`,
          animationDelay: `${orderIndex * -1.4}s`,
        }}
        className="animate-card-sway flex w-full flex-col items-center"
      >
        <div className="flex w-full flex-col items-center transition-transform duration-300 ease-out hover:-translate-y-2">
        {/* Vertical lanyard cord + metallic clasp */}
        <div
          aria-hidden="true"
          className={`w-[2px] bg-[#000000] transition-colors duration-300 dark:bg-[#ffffff] ${card.cordClassName}`}
        />
        <div aria-hidden="true" className="flex flex-col items-center">
          <div className="h-2.5 w-5 rounded-sm border border-black/30 bg-[#ffffff] dark:border-white/35 dark:bg-[#000000]" />
          <div className="h-3 w-1.5 rounded-t-xs bg-[#000000] dark:bg-[#ffffff]" />
        </div>

        {/* 3D Flip ID Card */}
        <div
          onMouseEnter={() => setIsFlipped(true)}
          onMouseLeave={() => setIsFlipped(false)}
          className="group relative -mt-1 h-[360px] w-full max-w-[268px] [perspective:1200px] sm:h-[380px]"
        >
          <motion.div
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 24,
              mass: 0.9,
            }}
            style={{ transformStyle: 'preserve-3d' }}
            className="relative h-full w-full will-change-transform"
          >
            {/* FRONT FACE: Sleek 3D glass card with centered brand icon + platform name */}
            <div
              style={{ backfaceVisibility: 'hidden' }}
              aria-hidden={isFlipped}
              className={`glass-card-3d absolute inset-0 flex flex-col items-center justify-between overflow-hidden rounded-2xl px-6 py-7 text-[#000000] transition-[border-color,box-shadow] duration-300 group-hover:border-[#880021] group-hover:shadow-[0_28px_56px_-18px_rgba(136,0,33,0.24)] dark:text-[#ffffff] dark:group-hover:border-[#d43b5c] dark:group-hover:shadow-[0_28px_56px_-18px_rgba(136,0,33,0.45)] ${
                isFlipped ? 'pointer-events-none' : 'pointer-events-auto'
              }`}
            >
              <GlassRefraction subtle />
              <button
                type="button"
                tabIndex={isFlipped ? -1 : 0}
                onClick={() => setIsFlipped((prev) => !prev)}
                aria-label={`Flip ${card.platform} ID card for ${card.handle} to view QR code`}
                className="absolute inset-0 z-0 cursor-pointer rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#880021] focus-visible:ring-offset-4 dark:focus-visible:ring-[#d43b5c]"
              />

              {/* Badge slot punch */}
              <div
                aria-hidden="true"
                className="pointer-events-none relative z-10 h-2 w-12 rounded-full border border-black/25 bg-transparent transition-colors duration-300 group-hover:border-[#880021] dark:border-white/30 dark:group-hover:border-[#d43b5c]"
              />

              {/* Crisp centered platform icon */}
              <div className="pointer-events-none relative z-10 flex flex-1 items-center justify-center text-[#000000] transition-all duration-300 ease-out group-hover:scale-110 group-hover:text-[#880021] dark:text-[#ffffff] dark:group-hover:text-[#d43b5c]">
                {card.renderLogo()}
              </div>

              {/* Platform name centered at the bottom */}
              <p className="pointer-events-none relative z-10 w-full text-center font-display text-2xl font-bold tracking-[-0.025em] text-[#000000] transition-transform duration-300 group-hover:-translate-y-0.5 dark:text-[#ffffff]">
                {card.platform}
              </p>
            </div>

            {/* BACK FACE: Full-size scannable QR Code + Direct Link */}
            <div
              style={{
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
              }}
              aria-hidden={!isFlipped}
              className={`glass-card-3d absolute inset-0 flex flex-col items-center justify-between overflow-hidden rounded-2xl p-4 text-[#000000] transition-[border-color,box-shadow] duration-300 group-hover:border-[#880021] group-hover:shadow-[0_28px_56px_-18px_rgba(136,0,33,0.24)] dark:text-[#ffffff] dark:group-hover:border-[#d43b5c] dark:group-hover:shadow-[0_28px_56px_-18px_rgba(136,0,33,0.45)] sm:p-5 lg:p-6 ${
                isFlipped ? 'pointer-events-auto' : 'pointer-events-none'
              }`}
            >
              <GlassRefraction subtle />
              <button
                type="button"
                tabIndex={isFlipped ? 0 : -1}
                onClick={() => setIsFlipped((prev) => !prev)}
                aria-label={`Flip ${card.platform} ID card back to front view`}
                className="absolute inset-0 z-0 cursor-pointer rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#880021] focus-visible:ring-offset-4 dark:focus-visible:ring-[#d43b5c]"
              />

              {/* Badge slot punch */}
              <div
                aria-hidden="true"
                className="pointer-events-none relative z-10 h-2 w-12 rounded-full border border-black/25 bg-transparent transition-colors duration-300 group-hover:border-[#880021] dark:border-white/30 dark:group-hover:border-[#d43b5c]"
              />

              {/* High-Contrast QR Code with quiet zone for reliable phone scanning */}
              <div className="pointer-events-none relative z-10 rounded-xl border border-black/10 bg-[#ffffff] p-2.5 shadow-sm lg:p-3">
                <QRCodeSVG
                  value={card.qrValue}
                  size={132}
                  bgColor="#ffffff"
                  fgColor="#000000"
                  level="M"
                  className="h-[116px] w-[116px] sm:h-[128px] sm:w-[128px] lg:h-[144px] lg:w-[144px]"
                />
              </div>

              {/* Platform, ID Name & Direct Link underneath QR code */}
              <div className="relative z-10 w-full border-t border-black/15 pt-3 text-center dark:border-white/20">
                <p className="pointer-events-none font-display text-xs font-medium tracking-wide text-black/65 dark:text-white/70">
                  {card.platform}
                </p>
                <p className="pointer-events-none mt-0.5 font-serif text-xl font-medium italic leading-tight text-[#880021] dark:text-[#d43b5c]">
                  {card.handle}
                </p>
                <div className="mt-2.5 flex items-center justify-center gap-4">
                  <Magnetic strength={0.28} proximity={24} maxOffset={6} disabled={!isFlipped}>
                    <a
                      href={card.qrValue}
                      target="_blank"
                      rel="noopener noreferrer"
                      tabIndex={isFlipped ? 0 : -1}
                      className="liquid-glass-btn relative z-20 inline-flex items-center gap-1 px-3.5 py-1.5 font-display text-[11px] font-semibold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#880021] dark:focus-visible:ring-[#d43b5c]"
                    >
                      <span>Open {card.platform}</span>
                      <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                    </a>
                  </Magnetic>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        </div>
      </div>
    </motion.div>
  );
}

export function SocialIdCardsSection() {
  return (
    <section
      id="connect"
      aria-label="Social Identity Cards"
      className="relative z-[2] w-full bg-transparent px-6 pb-28 pt-10 text-[#000000] transition-colors duration-300 dark:text-[#ffffff] sm:px-12 sm:pb-36 sm:pt-16 lg:px-20"
    >
      <div className="mx-auto w-full max-w-5xl">
        <SectionHeaderReveal
          title="Direct Channels"
          subtitle="Hover or tap any hanging badge to reveal its scannable QR code"
          layout="split"
          className="mb-10"
          titleClassName="font-display text-xl font-bold tracking-[-0.025em] text-[#000000] dark:text-[#ffffff] sm:text-2xl"
          subtitleClassName="font-serif text-base italic text-[#880021] dark:text-[#d43b5c] sm:text-lg"
        />

        {/* Architectural hanging rail */}
        <div className="md:border-t md:border-black/15 dark:md:border-white/20">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-5 lg:gap-12">
            {SOCIAL_CARDS.map((card, index) => (
              <HangingIdCard key={card.id} card={card} orderIndex={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
