import { useEffect, useState } from 'react';
import { Play } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { GlassRefraction } from './GlassRefraction';
import { Magnetic } from './Magnetic';
import { ProjectLiveExperienceModal } from './ProjectLiveExperienceModal';
import { ScrollRevealSection } from './ScrollRevealSection';
import { SectionHeaderReveal } from './SectionHeaderReveal';

interface CarouselSlide {
  src: string;
  alt: string;
  caption: string;
  kind: 'Mockup' | 'Screenshot';
}

type ProjectFilter = 'All' | 'Laravel & PHP' | 'ASP.NET Core';

interface ProjectItem {
  id: string;
  index: string;
  category: string;
  filterGroup: Exclude<ProjectFilter, 'All'>;
  year: string;
  title: string;
  subtitle: string;
  description: string;
  architecture: string;
  stack: string;
  highlights: string[];
  slides: CarouselSlide[];
}

const EDITORIAL_EASE = [0.16, 1, 0.3, 1] as const;

const FILTER_OPTIONS: ProjectFilter[] = ['All', 'Laravel & PHP', 'ASP.NET Core'];

const PROJECTS: ProjectItem[] = [
  {
    id: 'seraphim-commerce',
    index: '01',
    category: 'Full-Stack E-Commerce',
    filterGroup: 'Laravel & PHP',
    year: '2026',
    title: 'Seraphim Commerce',
    subtitle: 'Storefront & Inventory Engine',
    description:
      'An end-to-end e-commerce web application built for curated retail catalogs. Customers browse responsive product grids and complete multi-step checkout flows, while administrators manage orders, stock levels, and fulfillment statuses in real time.',
    architecture: 'MVC Server Rendering · RESTful Order API',
    stack: 'Laravel · PHP · MySQL · Bootstrap · JavaScript',
    highlights: [
      'Real-time stock locking during multi-step checkout',
      'Normalized MySQL catalog, order, and fulfillment ledger',
      'Responsive storefront grid with instant filtering',
    ],
    slides: [
      {
        src: '/assets/aistudio/image_0d63918b.png',
        alt: 'Seraphim Commerce storefront interface displayed on a studio laptop mockup',
        caption: 'Storefront Display',
        kind: 'Mockup',
      },
      {
        src: '/assets/aistudio/image_b786ea62.png',
        alt: 'Seraphim Commerce curated catalog grid web interface screenshot',
        caption: 'Curated Catalog Grid',
        kind: 'Screenshot',
      },
      {
        src: '/assets/aistudio/image_7e114b71.png',
        alt: 'Seraphim Commerce order management and inventory console screenshot',
        caption: 'Order & Stock Console',
        kind: 'Screenshot',
      },
    ],
  },
  {
    id: 'nexus-operations',
    index: '02',
    category: 'Enterprise Web Portal',
    filterGroup: 'ASP.NET Core',
    year: '2026',
    title: 'Nexus Operations Suite',
    subtitle: 'Role-Based Billing & Workflow Portal',
    description:
      'A modular operations and client invoicing portal engineered to unify project milestones, team assignments, and financial billing. Features role-based authentication, parameterized SQL reporting, and instant invoice generation.',
    architecture: 'Layered Service Pattern · Role-Based Access',
    stack: 'ASP.NET Core · C# · MySQL · HTML · CSS · JavaScript',
    highlights: [
      'Granular role permissions for finance, ops, and client leads',
      'Zero-downtime invoice export pipeline via parameterized queries',
      'Live milestone tracking and approval audit trail',
    ],
    slides: [
      {
        src: '/assets/aistudio/image_b4fd8083.png',
        alt: 'Nexus Operations Suite portal displayed on a studio laptop mockup',
        caption: 'Operations Overview',
        kind: 'Mockup',
      },
      {
        src: '/assets/aistudio/image_97eb6101.png',
        alt: 'Nexus Operations Suite role-based authentication and sign-in interface screenshot',
        caption: 'Role-Based Auth Portal',
        kind: 'Screenshot',
      },
      {
        src: '/assets/aistudio/image_48bc4312.png',
        alt: 'Nexus Operations Suite financial billing and invoice builder screenshot',
        caption: 'Billing & Invoice Builder',
        kind: 'Screenshot',
      },
    ],
  },
  {
    id: 'aura-cms',
    index: '03',
    category: 'Publishing Platform',
    filterGroup: 'Laravel & PHP',
    year: '2025',
    title: 'Aura Editorial CMS',
    subtitle: 'Custom Content & Media Studio',
    description:
      'A lightweight publishing platform and studio showcase designed under Seraphim Design. Provides a distraction-free manuscript editor, draft versioning, and instant static-cached page delivery backed by normalized database schemas.',
    architecture: 'Custom CMS Pipeline · Normalized Media Tables',
    stack: 'PHP · Laravel · HTML · CSS · JavaScript · MySQL',
    highlights: [
      'Clean distraction-free manuscript editor with draft snapshots',
      'Normalized media library with automatic asset metadata',
      'Static-cached route delivery for sub-second page loads',
    ],
    slides: [
      {
        src: '/assets/aistudio/image_b6a5af04.png',
        alt: 'Aura Editorial CMS live showcase output on a laptop mockup',
        caption: 'Editorial Showcase Output',
        kind: 'Mockup',
      },
      {
        src: '/assets/aistudio/image_1c4601bc.png',
        alt: 'Aura Editorial CMS media library management console screenshot',
        caption: 'Media Library Studio',
        kind: 'Screenshot',
      },
      {
        src: '/assets/aistudio/image_e548ac3d.png',
        alt: 'Aura Editorial CMS content analytics and publishing dashboard screenshot',
        caption: 'Analytics & Publishing Hub',
        kind: 'Screenshot',
      },
    ],
  },
  {
    id: 'pulse-scheduler',
    index: '04',
    category: 'Scheduling System',
    filterGroup: 'ASP.NET Core',
    year: '2025',
    title: 'Pulse Booking Directory',
    subtitle: 'Conflict-Free Appointment Engine',
    description:
      'A responsive scheduling and client directory system built to eliminate booking overlaps. Implements server-side slot validation, calendar filtering across desktop and mobile breakpoints, and indexed MySQL lookups for fast search.',
    architecture: 'REST API Endpoints · Indexed Slot Validation',
    stack: 'ASP.NET Core · C# · Bootstrap · MySQL · JavaScript',
    highlights: [
      'Server-side overlap guards guaranteeing zero double bookings',
      'Sub-100ms directory search across indexed MySQL tables',
      'Responsive weekly calendar views across mobile and desktop',
    ],
    slides: [
      {
        src: '/assets/aistudio/image_59d98a73.png',
        alt: 'Pulse Booking Directory interface displayed on a studio laptop mockup',
        caption: 'Directory & Booking View',
        kind: 'Mockup',
      },
      {
        src: '/assets/aistudio/image_73d678d8.png',
        alt: 'Pulse Booking Directory appointment calendar and time-slot scheduler screenshot',
        caption: 'Appointment Slot Scheduler',
        kind: 'Screenshot',
      },
      {
        src: '/assets/aistudio/image_1e6af8f4.png',
        alt: 'Pulse Booking Directory profile management and upcoming bookings screenshot',
        caption: 'Profile & Bookings Console',
        kind: 'Screenshot',
      },
    ],
  },
  {
    id: 'vespera-inventory',
    index: '05',
    category: 'Warehouse & SKU SaaS',
    filterGroup: 'Laravel & PHP',
    year: '2026',
    title: 'Vespera Inventory Cloud',
    subtitle: 'Multi-Warehouse Stock & Transfer Ledger',
    description:
      'A multi-location warehouse control system built on Laravel and MySQL. Tracks SKU thresholds across regional hubs, flags reorder alerts automatically, and logs every inbound and outbound transfer batch with full audit accountability.',
    architecture: 'Queue-Driven Stock Sync · Transactional SQL Ledger',
    stack: 'Laravel · PHP · MySQL · Bootstrap · JavaScript',
    highlights: [
      'Automated reorder threshold alerts per warehouse hub',
      'Atomic inter-warehouse stock transfer batch transactions',
      'High-speed SKU search with indexed ledger audit history',
    ],
    slides: [
      {
        src: '/assets/aistudio/image_1634177f.png',
        alt: 'Vespera Inventory Cloud warehouse analytics on a studio laptop mockup',
        caption: 'Warehouse SKU Overview',
        kind: 'Mockup',
      },
      {
        src: '/assets/aistudio/image_42b9f5a9.png',
        alt: 'Vespera Inventory Cloud multi-warehouse SKU catalog and reorder alert screenshot',
        caption: 'SKU Stock Ledger',
        kind: 'Screenshot',
      },
      {
        src: '/assets/aistudio/image_3ad50888.png',
        alt: 'Vespera Inventory Cloud warehouse movements and stock transfer audit log screenshot',
        caption: 'Transfer & Batch Audit Log',
        kind: 'Screenshot',
      },
    ],
  },
  {
    id: 'kinetix-portal',
    index: '06',
    category: 'Client Support & SLA',
    filterGroup: 'ASP.NET Core',
    year: '2026',
    title: 'Kinetix Client Portal',
    subtitle: 'SLA Ticketing & Resolution Workspace',
    description:
      'A high-contrast client support and engineering escalation portal powered by ASP.NET Core and MySQL. Features real-time SLA countdown timers, priority routing queues, and structured client-to-engineer resolution threads.',
    architecture: 'Clean Architecture API · SLA Policy Engine',
    stack: 'ASP.NET Core · C# · MySQL · Bootstrap · JavaScript',
    highlights: [
      'Live SLA response timers with automated escalation alerts',
      'Threaded client conversations paired with internal engineering notes',
      'Role-scoped ticket queues and resolution analytics exports',
    ],
    slides: [
      {
        src: '/assets/aistudio/image_1cde68a3.png',
        alt: 'Kinetix Client Portal support ticket and SLA dashboard on a studio laptop mockup',
        caption: 'Support & SLA Console',
        kind: 'Mockup',
      },
      {
        src: '/assets/aistudio/image_2bf88880.png',
        alt: 'Kinetix Client Portal account settings and notification preferences screenshot',
        caption: 'Account & Security Settings',
        kind: 'Screenshot',
      },
      {
        src: '/assets/aistudio/image_5f23c317.png',
        alt: 'Kinetix Client Portal searchable knowledge base and help articles screenshot',
        caption: 'Knowledge Base Center',
        kind: 'Screenshot',
      },
    ],
  },
];

function getFastProjectWebp(src: string): string | null {
  const match = src.match(/^\/assets\/aistudio\/(image_[a-f0-9]+)\.png$/i);
  return match ? `/assets/projects/${match[1]}.webp` : null;
}

let projectImagesPreloaded = false;

export function preloadProjectImages(): void {
  if (projectImagesPreloaded || typeof window === 'undefined') return;
  projectImagesPreloaded = true;

  const preloadUrl = (src: string) => {
    const url = getFastProjectWebp(src) ?? src;
    const img = new window.Image();
    img.decoding = 'async';
    img.src = url;
  };

  // Preload the front cover image of every project card
  for (const project of PROJECTS) {
    if (project.slides[0]) {
      preloadUrl(project.slides[0].src);
    }
  }
}

function ProjectCoverImage({
  slide,
  projectTitle,
  onOpenLive,
}: {
  slide?: CarouselSlide;
  projectTitle: string;
  onOpenLive: () => void;
}) {
  const [hasError, setHasError] = useState(false);

  return (
    <div className="w-full">
      <div className="group/frame relative aspect-video w-full overflow-hidden rounded-xl border border-black/12 bg-white transition-colors duration-300 hover:border-[#880021] dark:border-white/15 dark:bg-[#000000] dark:hover:border-[#d43b5c]">
        {slide && !hasError ? (
          <picture className="block h-full w-full">
            {getFastProjectWebp(slide.src) && (
              <source
                srcSet={getFastProjectWebp(slide.src) ?? undefined}
                type="image/webp"
              />
            )}
            <img
              src={slide.src}
              alt={slide.alt}
              referrerPolicy="no-referrer"
              loading="eager"
              decoding="async"
              fetchPriority="high"
              onError={() => setHasError(true)}
              className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/frame:scale-[1.03]"
            />
          </picture>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-[#000000] p-6 text-center text-white">
            <span className="font-display text-lg font-bold">
              {projectTitle}
            </span>
          </div>
        )}

        {/* Bottom-Right Live Experience Trigger */}
        <div className="absolute bottom-3 right-3 z-10">
          <Magnetic strength={0.3} proximity={30} maxOffset={7}>
            <button
              type="button"
              onClick={onOpenLive}
              aria-label={`Unveil live experience for ${projectTitle}`}
              className="group/live inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-white/30 bg-black/75 px-3.5 py-1.5 font-display text-xs font-semibold text-white shadow-[0_10px_24px_-6px_rgba(0,0,0,0.65)] backdrop-blur-md transition-[background-color,border-color,transform,box-shadow] duration-200 hover:border-[#d43b5c] hover:bg-[#880021] hover:shadow-[0_12px_28px_-6px_rgba(136,0,33,0.65)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d43b5c] active:scale-[0.97]"
            >
              <Play
                className="h-3 w-3 fill-current transition-transform duration-200 group-hover/live:scale-110"
                aria-hidden="true"
              />
              <span>Unveil</span>
            </button>
          </Magnetic>
        </div>
      </div>
    </div>
  );
}

export function ProjectsSection() {
  const [activeFilter, setActiveFilter] = useState<ProjectFilter>('All');
  const [liveProject, setLiveProject] = useState<ProjectItem | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 767px)').matches : false
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)');
    const handleChange = () => setIsMobile(mediaQuery.matches);
    handleChange();
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const baseProjects = isMobile ? PROJECTS.slice(0, 5) : PROJECTS;
  const availableFilters = FILTER_OPTIONS.filter(
    (filter) =>
      filter === 'All' || baseProjects.some((p) => p.filterGroup === filter)
  );
  const effectiveFilter = availableFilters.includes(activeFilter) ? activeFilter : 'All';

  const visibleProjects =
    effectiveFilter === 'All'
      ? baseProjects
      : baseProjects.filter((project) => project.filterGroup === effectiveFilter);

  return (
    <ScrollRevealSection
      id="projects"
      className="relative z-[2] w-full bg-transparent px-6 pb-20 pt-12 text-[#000000] transition-colors duration-300 dark:text-[#ffffff] sm:px-12 sm:pb-24 sm:pt-16 lg:px-20"
    >
      <div className="mx-auto w-full max-w-6xl">
        {/* Staggered Section Heading */}
        <SectionHeaderReveal
          title="Projects"
          subtitle="Selected Works"
          layout="split"
          withDivider
          className="mb-8 sm:mb-10"
          titleClassName="font-display text-[clamp(2.25rem,4.5vw,3.5rem)] font-bold leading-none tracking-[-0.035em] text-[#000000] dark:text-[#ffffff]"
          subtitleClassName="font-serif text-xl font-medium italic text-[#880021] dark:text-[#d43b5c] sm:text-2xl"
        />

        {/* Interactive Filter Controls */}
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4 sm:mb-12">
          <div
            role="tablist"
            aria-label="Filter projects by stack"
            className="glass-control inline-flex flex-wrap items-center gap-1 rounded-full p-1"
          >
            {availableFilters.map((filter) => {
              const isSelected = effectiveFilter === filter;
              const count =
                filter === 'All'
                  ? baseProjects.length
                  : baseProjects.filter((p) => p.filterGroup === filter).length;
              return (
                <button
                  key={filter}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setActiveFilter(filter)}
                  className={`relative cursor-pointer rounded-full px-3.5 py-1.5 font-display text-xs font-medium whitespace-nowrap transition-colors ${
                    isSelected
                      ? 'text-[#ffffff]'
                      : 'text-black/70 hover:text-[#000000] dark:text-white/70 dark:hover:text-[#ffffff]'
                  }`}
                >
                  {isSelected && (
                    <motion.span
                      layoutId="projects-filter-pill"
                      transition={{ duration: 0.25, ease: EDITORIAL_EASE }}
                      aria-hidden="true"
                      className="liquid-glass-btn-accent absolute inset-0"
                    />
                  )}
                  <span className="relative z-10">
                    {filter} ({count})
                  </span>
                </button>
              );
            })}
          </div>

          <p className="font-display text-xs text-black/60 tabular-nums dark:text-white/60">
            Showing {visibleProjects.length} of {baseProjects.length} builds
          </p>
        </div>

        {/* Curated 2-Column Editorial Showcase Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.24, ease: EDITORIAL_EASE }}
            className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-10"
          >
            {visibleProjects.map((project) => (
              <article
                key={project.id}
                className="glass-card group/card relative flex flex-col justify-between overflow-hidden rounded-2xl p-5 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-[#880021] hover:shadow-[0_26px_54px_-22px_rgba(136,0,33,0.22)] dark:hover:border-[#d43b5c] dark:hover:shadow-[0_26px_54px_-22px_rgba(136,0,33,0.42)] sm:p-7"
              >
                <GlassRefraction subtle />
                <div className="relative z-10">
                  <div className="mb-4 flex items-center justify-between gap-3 text-xs text-black/65 dark:text-white/70">
                    <div className="flex items-center gap-2">
                      <span className="font-bold tabular-nums text-[#880021] dark:text-[#d43b5c]">
                        {project.index}
                      </span>
                      <span aria-hidden="true" className="text-[#880021] dark:text-[#d43b5c]">
                        ·
                      </span>
                      <span>{project.category}</span>
                    </div>
                    <span className="tabular-nums font-medium">{project.year}</span>
                  </div>

                  <ProjectCoverImage
                    slide={project.slides[0]}
                    projectTitle={project.title}
                    onOpenLive={() => setLiveProject(project)}
                  />

                  <div className="mt-6">
                    <h3 className="font-display text-2xl font-bold leading-tight tracking-[-0.03em] text-[#000000] dark:text-[#ffffff]">
                      {project.title}
                    </h3>
                    <p className="mt-1 font-serif text-lg font-medium italic text-[#880021] dark:text-[#d43b5c]">
                      {project.subtitle}
                    </p>
                    <p className="mt-3 font-display text-sm leading-[1.7] text-black/75 dark:text-white/80">
                      {project.description}
                    </p>
                  </div>
                </div>

                <div className="relative z-10 mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-black/15 pt-4 dark:border-white/20">
                  <span className="font-display text-xs font-medium text-black/65 dark:text-white/70">
                    Created On:
                  </span>
                  <span className="font-display text-xs font-medium text-black/65 dark:text-white/70 text-right">
                    {project.stack}
                  </span>
                </div>
              </article>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      <ProjectLiveExperienceModal
        project={liveProject}
        onClose={() => setLiveProject(null)}
      />
    </ScrollRevealSection>
  );
}
