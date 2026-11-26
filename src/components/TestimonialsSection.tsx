import { useState } from 'react';
import { Quote, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { ParticleBackground } from './ParticleBackground';
import { ScrollRevealSection } from './ScrollRevealSection';
import { SectionHeaderReveal } from './SectionHeaderReveal';

interface TestimonialItem {
  id: string;
  name: string;
  initials: string;
  designation: string;
  quote: string;
  avatar: string;
  rating: number;
}

const EDITORIAL_EASE = [0.16, 1, 0.3, 1] as const;

const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 'elena-vance',
    name: 'Elena Vance',
    initials: 'EV',
    designation: 'Creative Director · Atelier Nord',
    quote:
      'Working with Ashal under Seraphim Design transformed our storefront from a slow legacy template into a sharp, reliable Laravel platform. Checkout friction dropped immediately and our team manages inventory effortlessly.',
    avatar: '/src/assets/images/client_avatar_elena_1794941752744.jpg',
    rating: 5,
  },
  {
    id: 'tariq-mehmood',
    name: 'Tariq Mehmood',
    initials: 'TM',
    designation: 'Founder · Verve Logistics',
    quote:
      'Our internal operations portal needed strict role permissions and fast billing exports. Ashal engineered the ASP.NET Core backend and MySQL reporting layer cleanly on schedule with zero downtime.',
    avatar: '/src/assets/images/client_avatar_tariq_1794941752871.jpg',
    rating: 5,
  },
  {
    id: 'nadia-keller',
    name: 'Nadia Keller',
    initials: 'NK',
    designation: 'Head of Operations · Licht Studio',
    quote:
      'Rarely do you find a developer who cares equally about visual restraint and clean database structure. Every page transition feels deliberate, responsive, and dependable for our clients.',
    avatar: '/src/assets/images/client_avatar_nadia_1794941753259.jpg',
    rating: 5,
  },
  {
    id: 'marcus-reid',
    name: 'Marcus Reid',
    initials: 'MR',
    designation: 'Managing Partner · Reid & Co.',
    quote:
      'From initial wireframe planning to final MySQL deployment, Seraphim delivered a minimalist web presence that doubled qualified client inquiries within the first quarter after launch.',
    avatar: '/src/assets/images/client_avatar_marcus_1794941753667.jpg',
    rating: 5,
  },
  {
    id: 'sanaullah-qureshi',
    name: 'Sanaullah Qureshi',
    initials: 'SQ',
    designation: 'CTO · Kestrel FinTech',
    quote:
      'Ashal rebuilt our legacy PHP billing dashboards with Laravel and MySQL indexing that cut report wait times in half. Clean code, clear communication, and zero production surprises.',
    avatar: '/src/assets/images/client_avatar_sanaullah_1795155465109.jpg',
    rating: 5,
  },
  {
    id: 'claire-beaumont',
    name: 'Claire Beaumont',
    initials: 'CB',
    designation: 'Brand Director · Maison Solis',
    quote:
      'We handed over intricate editorial mockups expecting compromises. Seraphim translated every grid proportion and hover nuance into crisp responsive HTML, CSS, and JavaScript.',
    avatar: '/src/assets/images/client_avatar_claire_1795155465317.jpg',
    rating: 5,
  },
  {
    id: 'danish-alvi',
    name: 'Danish Alvi',
    initials: 'DA',
    designation: 'Product Lead · Crescent Health',
    quote:
      'Our clinic scheduling system needed rock-solid ASP.NET Core APIs and intuitive patient flows. Ashal delivered both reliability under load and a calm interface our staff loves.',
    avatar: '/src/assets/images/client_avatar_danish_1795155465088.jpg',
    rating: 5,
  },
  {
    id: 'henrik-lindqvist',
    name: 'Henrik Lindqvist',
    initials: 'HL',
    designation: 'Founder · Nordik Supply',
    quote:
      'Rarely does an engineer balance visual polish with backend discipline so naturally. From Bootstrap component consistency to MySQL query tuning, every milestone shipped ahead of schedule.',
    avatar: '/src/assets/images/client_avatar_henrik_1795155465443.jpg',
    rating: 5,
  },
];

export function TestimonialsSection() {
  const [failedAvatars, setFailedAvatars] = useState<Record<string, boolean>>({});

  return (
    <ScrollRevealSection
      id="testimonials"
      className="relative z-[2] w-full overflow-hidden bg-[#000000] px-6 pb-20 pt-10 text-[#ffffff] sm:px-10 sm:pb-24 sm:pt-14 lg:px-12"
    >
      {/* Subtle burgundy (#880021) ambient depth behind transparent glass panels */}
      <div
        aria-hidden="true"
        style={{
          backgroundImage:
            'radial-gradient(circle at 15% 25%, rgba(136,0,33,0.42), transparent 50%), radial-gradient(circle at 85% 75%, rgba(136,0,33,0.34), transparent 50%)',
        }}
        className="pointer-events-none absolute inset-0"
      />
      <ParticleBackground variant="dark" fixed={false} />

      <div className="relative z-[1] mx-auto w-full max-w-[1380px] border-t border-white/15 pt-14 sm:pt-16">
        {/* Stylish Staggered Section Heading & Subtitle */}
        <SectionHeaderReveal
          title="What Our Clients Say"
          subtitle="Real experiences. Genuine feedback. Lasting relationships."
          className="mb-12 max-w-2xl sm:mb-14"
          titleClassName="font-display text-[clamp(2rem,4.2vw,3.25rem)] font-bold leading-none tracking-[-0.035em] text-[#ffffff] text-balance"
          subtitleClassName="mt-3 font-serif text-xl italic leading-snug text-white/75 sm:text-2xl"
        />

        {/* Responsive 4x2 Transparent Glassmorphism Cards Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {TESTIMONIALS.map((item, idx) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.05 }}
              transition={{
                duration: 0.55,
                delay: (idx % 4) * 0.06,
                ease: EDITORIAL_EASE,
              }}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/22 bg-gradient-to-br from-white/[0.11] via-[#0d0d11]/72 to-white/[0.04] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.32),inset_0_-1px_0_rgba(255,255,255,0.08),0_24px_56px_-18px_rgba(0,0,0,0.88)] backdrop-blur-md transition-[transform,border-color,box-shadow,background-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 hover:border-[#d43b5c] hover:from-[#880021]/28 hover:via-[#0d0d11]/74 hover:to-[#880021]/14 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.38),0_24px_54px_-14px_rgba(136,0,33,0.48)] sm:p-6"
            >
              {/* Specular rim & zero-cost radial refracted orbs */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-px bg-gradient-to-r from-transparent via-white/55 to-transparent"
              />
              <span
                aria-hidden="true"
                style={{
                  background:
                    'radial-gradient(circle, rgba(255,255,255,0.14) 0%, transparent 70%)',
                }}
                className="pointer-events-none absolute -top-12 right-0 h-32 w-36 rounded-full"
              />
              <span
                aria-hidden="true"
                style={{
                  background:
                    'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)',
                }}
                className="pointer-events-none absolute -bottom-14 left-0 h-32 w-40 rounded-full"
              />

              <div className="relative z-10">
                {/* Top Row: Five-Star Rating & Subtle Quote Icon */}
                <div className="flex items-center justify-between gap-4">
                  <div
                    role="img"
                    aria-label={`${item.rating} out of 5 stars`}
                    className="flex items-center gap-1 text-[#ffffff]"
                  >
                    {Array.from({ length: item.rating }).map((_, starIdx) => (
                      <Star
                        key={starIdx}
                        className="h-3.5 w-3.5 fill-[#ffffff] text-[#ffffff] transition-transform duration-200 group-hover:scale-110"
                        style={{ transitionDelay: `${starIdx * 25}ms` }}
                        aria-hidden="true"
                      />
                    ))}
                  </div>

                  <Quote
                    className="h-5 w-5 text-white/30 transition-all duration-300 group-hover:-rotate-6 group-hover:scale-110 group-hover:text-white/80"
                    aria-hidden="true"
                  />
                </div>

                {/* Testimonial Text */}
                <blockquote className="mt-5 font-display text-[13.5px] leading-[1.7] text-white/90 sm:text-[14px]">
                  &ldquo;{item.quote}&rdquo;
                </blockquote>
              </div>

              {/* Client Profile Footer */}
              <div className="relative z-10 mt-6 flex items-center gap-3.5 border-t border-white/15 pt-4">
                <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full border border-white/25 bg-[#000000] transition-transform duration-300 group-hover:scale-105 group-hover:border-[#ffffff]">
                  {!failedAvatars[item.id] ? (
                    <img
                      src={item.avatar}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      decoding="async"
                      onError={() =>
                        setFailedAvatars((prev) => ({
                          ...prev,
                          [item.id]: true,
                        }))
                      }
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[#880021] font-display text-xs font-semibold text-[#ffffff]">
                      {item.initials}
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <p className="truncate font-display text-[13.5px] font-bold tracking-tight text-[#ffffff] sm:text-sm">
                    {item.name}
                  </p>
                  <p className="truncate font-serif text-sm italic text-white/70">
                    {item.designation}
                  </p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </ScrollRevealSection>
  );
}
