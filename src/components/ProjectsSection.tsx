import { useEffect, useState } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { GlassRefraction } from './GlassRefraction';
import { Magnetic } from './Magnetic';
import { ScrollRevealSection } from './ScrollRevealSection';
import { SectionHeaderReveal } from './SectionHeaderReveal';

interface CarouselSlide {
  src: string;
  alt: string;
  caption: string;
  kind: 'Mockup' | 'Screenshot';
}

type ProjectFilter = 'All' | 'Laravel & PHP' | 'ASP.NET Core' | 'Frontend & UI';

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

const FILTER_OPTIONS: ProjectFilter[] = ['All', 'Laravel & PHP', 'ASP.NET Core', 'Frontend & UI'];

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
        src: '/src/assets/images/p1_commerce_storefront_1794939906583.jpg',
        alt: 'Seraphim Commerce storefront interface displayed on a studio laptop mockup',
        caption: 'Storefront Display',
        kind: 'Mockup',
      },
      {
        src: '/src/assets/images/p1_screen_catalog_1795672218902.jpg',
        alt: 'Seraphim Commerce curated catalog grid web interface screenshot',
        caption: 'Curated Catalog Grid',
        kind: 'Screenshot',
      },
      {
        src: '/src/assets/images/p1_screen_orders_1795672218152.jpg',
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
        src: '/src/assets/images/p2_enterprise_portal_1794939906322.jpg',
        alt: 'Nexus Operations project tracking portal on a desktop monitor mockup',
        caption: 'Operations Overview',
        kind: 'Mockup',
      },
      {
        src: '/src/assets/images/p2_screen_milestones_1795672218213.jpg',
        alt: 'Nexus Operations project milestones and RBAC permission matrix screenshot',
        caption: 'Milestones & RBAC Matrix',
        kind: 'Screenshot',
      },
      {
        src: '/src/assets/images/p2_screen_invoicing_1795672219172.jpg',
        alt: 'Nexus Operations financial billing and invoice builder screenshot',
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
        src: '/src/assets/images/p3_cms_editorial_1794939907079.jpg',
        alt: 'Aura Editorial CMS live showcase output on a laptop mockup',
        caption: 'Editorial Showcase Output',
        kind: 'Mockup',
      },
      {
        src: '/src/assets/images/p3_screen_manuscript_1795672219624.jpg',
        alt: 'Aura Editorial CMS distraction-free manuscript editor screenshot',
        caption: 'Manuscript Writing Studio',
        kind: 'Screenshot',
      },
      {
        src: '/src/assets/images/p3_screen_media_1795672220102.jpg',
        alt: 'Aura Editorial CMS media library and page routing console screenshot',
        caption: 'Media & Route Console',
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
        src: '/src/assets/images/p4_clinic_booking_1794939907779.jpg',
        alt: 'Pulse Booking Directory calendar schedule view on a desktop display mockup',
        caption: 'Studio Schedule Display',
        kind: 'Mockup',
      },
      {
        src: '/src/assets/images/p4_screen_calendar_1795672220997.jpg',
        alt: 'Pulse Booking Directory weekly time-slot scheduler screenshot',
        caption: 'Weekly Appointment Grid',
        kind: 'Screenshot',
      },
      {
        src: '/src/assets/images/p4_screen_directory_1795672221988.jpg',
        alt: 'Pulse Booking Directory client intake and lookup table screenshot',
        caption: 'Client Intake Directory',
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
        src: '/src/assets/images/p5_vespera_mockup_1795672220983.jpg',
        alt: 'Vespera Inventory Cloud warehouse analytics on a matte-black laptop mockup',
        caption: 'Warehouse SKU Overview',
        kind: 'Mockup',
      },
      {
        src: '/src/assets/images/p5_screen_warehouse_1795672221288.jpg',
        alt: 'Vespera Inventory Cloud multi-warehouse SKU catalog screenshot',
        caption: 'SKU Stock Ledger',
        kind: 'Screenshot',
      },
      {
        src: '/src/assets/images/p5_screen_transfers_1795672222442.jpg',
        alt: 'Vespera Inventory Cloud inbound and outbound stock transfer audit log screenshot',
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
        src: '/src/assets/images/p6_kinetix_mockup_1795672347583.jpg',
        alt: 'Kinetix Client Portal support ticket dashboard on a studio monitor mockup',
        caption: 'Support & SLA Console',
        kind: 'Mockup',
      },
      {
        src: '/src/assets/images/p6_screen_tickets_1795672223212.jpg',
        alt: 'Kinetix Client Portal SLA ticket priority queue screenshot',
        caption: 'SLA Priority Queue',
        kind: 'Screenshot',
      },
      {
        src: '/src/assets/images/p6_screen_thread_1795672327357.jpg',
        alt: 'Kinetix Client Portal ticket conversation and SLA timeline screenshot',
        caption: 'Ticket Resolution Workspace',
        kind: 'Screenshot',
      },
    ],
  },
  {
    id: 'solstice-lookbook',
    index: '07',
    category: 'Editorial Frontend',
    filterGroup: 'Frontend & UI',
    year: '2026',
    title: 'Solstice Lookbook',
    subtitle: 'Semantic HTML, CSS Grid & JS Showcase',
    description:
      'An editorial architecture showcase crafted purely with semantic HTML5, responsive CSS Grid layouts, and lightweight vanilla JavaScript. Features category-filtered masonry galleries, interactive exhibition timelines, and silky scroll choreography.',
    architecture: 'Zero-Dependency DOM · CSS Grid Layout Engine',
    stack: 'HTML · CSS · JavaScript',
    highlights: [
      'Pure semantic HTML5 landmarks and keyboard-navigable gallery filters',
      'Asymmetric responsive CSS Grid templates without external UI libraries',
      'Hardware-accelerated vanilla JavaScript transitions and archive sorting',
    ],
    slides: [
      {
        src: '/src/assets/images/p7_solstice_mockup_1795672586571.jpg',
        alt: 'Solstice Lookbook website displayed on a matte-silver studio laptop mockup',
        caption: 'Editorial Hero Display',
        kind: 'Mockup',
      },
      {
        src: '/src/assets/images/p7_screen_lookbook_1795672586782.jpg',
        alt: 'Solstice Lookbook asymmetric photography grid web interface screenshot',
        caption: 'Asymmetric CSS Grid Gallery',
        kind: 'Screenshot',
      },
      {
        src: '/src/assets/images/p7_screen_archive_1795672587485.jpg',
        alt: 'Solstice Lookbook interactive dark exhibition timeline screenshot',
        caption: 'Exhibition Archive Timeline',
        kind: 'Screenshot',
      },
    ],
  },
  {
    id: 'meridian-agency',
    index: '08',
    category: 'UI System & Calculator',
    filterGroup: 'Frontend & UI',
    year: '2025',
    title: 'Meridian Design System',
    subtitle: 'Bootstrap 5 Kit & Scope Estimator',
    description:
      'A modular Bootstrap agency toolkit paired with an interactive JavaScript scope and budget estimator. Standardizes 12-column responsive layouts, form states, and real-time client pricing calculations across mobile, tablet, and desktop breakpoints.',
    architecture: 'Modular Bootstrap SCSS · Reactive JS State',
    stack: 'Bootstrap · HTML · CSS · JavaScript',
    highlights: [
      '12-column Bootstrap breakpoint previewer with live code export',
      'Interactive vanilla JS project estimator calculating itemized scopes live',
      'Accessible custom form controls, sliders, and responsive navigation patterns',
    ],
    slides: [
      {
        src: '/src/assets/images/p8_meridian_mockup_1795672587989.jpg',
        alt: 'Meridian Design System displayed on a frameless studio monitor mockup',
        caption: 'Design System Display',
        kind: 'Mockup',
      },
      {
        src: '/src/assets/images/p8_screen_components_1795672588836.jpg',
        alt: 'Meridian Bootstrap 12-column grid builder and component library screenshot',
        caption: 'Bootstrap Grid & UI Kit',
        kind: 'Screenshot',
      },
      {
        src: '/src/assets/images/p8_screen_estimator_1795672588541.jpg',
        alt: 'Meridian interactive JavaScript project quote estimator screenshot',
        caption: 'Interactive Quote Estimator',
        kind: 'Screenshot',
      },
    ],
  },
  {
    id: 'vanguard-ledger',
    index: '09',
    category: 'Financial Accounting',
    filterGroup: 'Laravel & PHP',
    year: '2025',
    title: 'Vanguard Finance Ledger',
    subtitle: 'Core PHP & MySQL Double-Entry Engine',
    description:
      'An object-oriented PHP and MySQL financial ledger engineered for small businesses and creative studios. Automates double-entry debit/credit reconciliation, quarterly cashflow analytics, and itemized CSV tax exports using parameterized PDO queries.',
    architecture: 'OOP PHP Services · Indexed MySQL PDO Ledger',
    stack: 'PHP · MySQL · Bootstrap · HTML · CSS · JavaScript',
    highlights: [
      'Strict PDO prepared statements and double-entry balance validation',
      'Quarterly cashflow area charts and automated tax breakdown summaries',
      'Filterable general ledger with one-click CSV and print reporting',
    ],
    slides: [
      {
        src: '/src/assets/images/p9_vanguard_mockup_1795672589375.jpg',
        alt: 'Vanguard Finance Ledger accounting dashboard on a matte-black laptop mockup',
        caption: 'Accounting Dashboard',
        kind: 'Mockup',
      },
      {
        src: '/src/assets/images/p9_screen_ledger_1795672589489.jpg',
        alt: 'Vanguard Finance Ledger general ledger transactions table screenshot',
        caption: 'General Ledger Table',
        kind: 'Screenshot',
      },
      {
        src: '/src/assets/images/p9_screen_reports_1795672609847.jpg',
        alt: 'Vanguard Finance Ledger quarterly cashflow and tax summary reports screenshot',
        caption: 'Cashflow & Tax Reports',
        kind: 'Screenshot',
      },
    ],
  },
  {
    id: 'aegis-telemetry',
    index: '10',
    category: 'Security & API Gateway',
    filterGroup: 'ASP.NET Core',
    year: '2026',
    title: 'Aegis Auth & Telemetry',
    subtitle: 'C# Identity & MySQL Audit Console',
    description:
      'A high-security authentication gateway and API telemetry console written in C# and ASP.NET Core. Manages active JWT user sessions, enforces role-based access policies, and logs endpoint latency metrics in indexed MySQL audit tables.',
    architecture: 'ASP.NET Core Middleware · MySQL Audit Pipeline',
    stack: 'C# · ASP.NET Core · MySQL · JavaScript · CSS',
    highlights: [
      'Instant session revocation and device/location tracking via C# middleware',
      'Sub-millisecond SQL query duration profiling across API endpoints',
      'Role-scoped permission policies with full request ID traceability',
    ],
    slides: [
      {
        src: '/src/assets/images/p10_aegis_mockup_1795672626337.jpg',
        alt: 'Aegis Auth and Telemetry API gateway console on a studio monitor mockup',
        caption: 'API Gateway Overview',
        kind: 'Mockup',
      },
      {
        src: '/src/assets/images/p10_screen_tokens_1795672611941.jpg',
        alt: 'Aegis Auth and Telemetry active JWT session manager screenshot',
        caption: 'JWT Session Manager',
        kind: 'Screenshot',
      },
      {
        src: '/src/assets/images/p10_screen_audit_1795672629387.jpg',
        alt: 'Aegis Auth and Telemetry MySQL API request audit log screenshot',
        caption: 'MySQL Audit & Latency Log',
        kind: 'Screenshot',
      },
    ],
  },
];

function ProjectCarousel({
  slides,
  projectTitle,
  compact = false,
}: {
  slides: CarouselSlide[];
  projectTitle: string;
  compact?: boolean;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [failedSlides, setFailedSlides] = useState<Record<number, boolean>>({});
  const prefersReducedMotion = useReducedMotion();

  const totalSlides = slides.length;
  const currentSlide = slides[activeIndex];

  useEffect(() => {
    if (prefersReducedMotion || isPaused || totalSlides <= 1) return;
    const timer = window.setInterval(() => {
      setDirection(1);
      setActiveIndex((prev) => (prev + 1) % totalSlides);
    }, 5200);
    return () => window.clearInterval(timer);
  }, [isPaused, prefersReducedMotion, totalSlides]);

  const goToPrev = () => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToNext = () => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % totalSlides);
  };

  const goToIndex = (index: number) => {
    if (index === activeIndex) return;
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
  };

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      className="w-full"
    >
      {/* Landscape 16:9 Carousel Frame */}
      <div className="group/frame relative aspect-video w-full overflow-hidden rounded-xl border border-black/12 bg-white transition-colors duration-300 hover:border-[#880021] dark:border-white/15 dark:bg-[#000000] dark:hover:border-[#d43b5c]">
        <AnimatePresence initial={false} mode="popLayout" custom={direction}>
          <motion.div
            key={activeIndex}
            custom={direction}
            initial={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, x: direction > 0 ? 36 : -36 }
            }
            animate={{ opacity: 1, x: 0 }}
            exit={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, x: direction > 0 ? -36 : 36 }
            }
            transition={{ duration: 0.45, ease: EDITORIAL_EASE }}
            className="absolute inset-0 h-full w-full"
          >
            {!failedSlides[activeIndex] ? (
              <img
                src={currentSlide.src}
                alt={currentSlide.alt}
                referrerPolicy="no-referrer"
                loading="lazy"
                decoding="async"
                onError={() =>
                  setFailedSlides((prev) => ({ ...prev, [activeIndex]: true }))
                }
                className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/frame:scale-[1.03]"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center bg-[#000000] p-6 text-center text-white">
                <span className="font-display text-lg font-bold">
                  {projectTitle}
                </span>
                <span className="mt-1 font-serif text-base italic text-white/75">
                  {currentSlide.caption}
                </span>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Minimalist Carousel Controls Bar */}
      <div className="mt-3 flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-2 text-xs text-black/65 dark:text-white/70">
          <span className="shrink-0 tabular-nums font-bold text-[#880021] dark:text-[#d43b5c]">
            0{activeIndex + 1} / 0{totalSlides}
          </span>
          <span aria-hidden="true" className="font-bold text-[#880021] dark:text-[#d43b5c]">·</span>
          <span className="shrink-0 font-medium text-[#000000] dark:text-[#ffffff]">
            {currentSlide.kind}
          </span>
          <span aria-hidden="true" className="text-black/35 dark:text-white/35">·</span>
          <span className="truncate">{currentSlide.caption}</span>
        </div>

        <div className="flex shrink-0 items-center gap-2.5">
          <div className="flex items-center gap-1.5" role="tablist" aria-label={`${projectTitle} slides`}>
            {slides.map((slide, idx) => (
              <button
                key={slide.caption}
                type="button"
                role="tab"
                aria-selected={idx === activeIndex}
                aria-label={`Show slide ${idx + 1}: ${slide.caption}`}
                onClick={() => goToIndex(idx)}
                className="flex h-6 cursor-pointer items-center px-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#880021] dark:focus-visible:ring-[#d43b5c]"
              >
                <span
                  className={`block h-[2px] transition-all duration-300 ${
                    idx === activeIndex
                      ? 'w-5 bg-[#880021] dark:bg-[#d43b5c]'
                      : 'w-2.5 bg-black/20 hover:bg-black/50 dark:bg-white/25 dark:hover:bg-white/60'
                  }`}
                />
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <Magnetic strength={0.3} proximity={22} maxOffset={6}>
              <button
                type="button"
                onClick={goToPrev}
                aria-label={`Previous slide for ${projectTitle}`}
                className={`liquid-glass-btn group/btn inline-flex cursor-pointer items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#880021] dark:focus-visible:ring-[#d43b5c] ${
                  compact ? 'h-8 w-8' : 'h-10 w-10'
                }`}
              >
                <ChevronLeft className="h-4 w-4 transition-transform duration-200 group-hover/btn:-translate-x-0.5" aria-hidden="true" />
              </button>
            </Magnetic>

            <Magnetic strength={0.3} proximity={22} maxOffset={6}>
              <button
                type="button"
                onClick={goToNext}
                aria-label={`Next slide for ${projectTitle}`}
                className={`liquid-glass-btn group/btn inline-flex cursor-pointer items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#880021] dark:focus-visible:ring-[#d43b5c] ${
                  compact ? 'h-8 w-8' : 'h-10 w-10'
                }`}
              >
                <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-0.5" aria-hidden="true" />
              </button>
            </Magnetic>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProjectsSection() {
  const [activeFilter, setActiveFilter] = useState<ProjectFilter>('All');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  const visibleProjects =
    activeFilter === 'All'
      ? PROJECTS
      : PROJECTS.filter((project) => project.filterGroup === activeFilter);

  useEffect(() => {
    if (!selectedProject) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedProject(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedProject]);

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
            {FILTER_OPTIONS.map((filter) => {
              const isSelected = activeFilter === filter;
              const count =
                filter === 'All'
                  ? PROJECTS.length
                  : PROJECTS.filter((p) => p.filterGroup === filter).length;
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
            Showing {visibleProjects.length} of {PROJECTS.length} builds
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
            className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10"
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

                  <ProjectCarousel
                    slides={project.slides}
                    projectTitle={project.title}
                    compact
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
                    {project.stack}
                  </span>

                  <Magnetic strength={0.34} proximity={36} maxOffset={9}>
                    <button
                      type="button"
                      onClick={() => setSelectedProject(project)}
                      className="liquid-glass-btn group inline-flex cursor-pointer items-center gap-1.5 px-3.5 py-1.5 font-display text-xs font-semibold !text-[#880021] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#880021] dark:!text-[#d43b5c] dark:focus-visible:ring-[#d43b5c] whitespace-nowrap"
                    >
                      <span>Case Study</span>
                      <ArrowUpRight
                        className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        aria-hidden="true"
                      />
                    </button>
                  </Magnetic>
                </div>
              </article>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Case Study Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={() => setSelectedProject(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm sm:p-6"
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="case-study-title"
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.28, ease: EDITORIAL_EASE }}
              onClick={(e) => e.stopPropagation()}
              className="glass-surface relative max-h-[90dvh] w-full max-w-3xl overflow-y-auto overflow-x-hidden rounded-2xl p-6 text-[#000000] dark:text-[#ffffff] sm:p-8"
            >
              <GlassRefraction />
              <div className="relative z-10 mb-6 flex items-start justify-between gap-4 border-b border-black/15 pb-4 dark:border-white/20">
                <div>
                  <div className="flex items-center gap-2 font-display text-xs text-black/60 dark:text-white/65">
                    <span className="font-bold tabular-nums text-[#880021] dark:text-[#d43b5c]">
                      {selectedProject.index}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{selectedProject.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">{selectedProject.year}</span>
                  </div>
                  <h3
                    id="case-study-title"
                    className="mt-1.5 font-display text-2xl font-bold tracking-[-0.03em] sm:text-3xl"
                  >
                    {selectedProject.title}
                  </h3>
                  <p className="mt-0.5 font-serif text-lg italic text-[#880021] dark:text-[#d43b5c]">
                    {selectedProject.subtitle}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedProject(null)}
                  aria-label="Close case study"
                  className="liquid-glass-btn inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#880021] dark:focus-visible:ring-[#d43b5c]"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              <ProjectCarousel
                slides={selectedProject.slides}
                projectTitle={selectedProject.title}
              />

              <p className="mt-6 font-display text-sm leading-[1.75] text-black/80 dark:text-white/85 sm:text-[15px]">
                {selectedProject.description}
              </p>

              <div className="mt-6 grid grid-cols-1 gap-4 border-t border-black/15 pt-5 dark:border-white/20 sm:grid-cols-2">
                <div>
                  <p className="font-display text-xs font-medium text-black/60 dark:text-white/60">
                    Architecture
                  </p>
                  <p className="mt-1 font-display text-sm font-semibold">
                    {selectedProject.architecture}
                  </p>
                </div>
                <div>
                  <p className="font-display text-xs font-medium text-black/60 dark:text-white/60">
                    Technology Stack
                  </p>
                  <p className="mt-1 font-display text-sm font-semibold">
                    {selectedProject.stack}
                  </p>
                </div>
              </div>

              <div className="mt-6 border-t border-black/15 pt-5 dark:border-white/20">
                <p className="font-display text-xs font-medium text-black/60 dark:text-white/60">
                  Key Engineering Outcomes
                </p>
                <ul className="mt-3 flex flex-col gap-2">
                  {selectedProject.highlights.map((highlight) => (
                    <li
                      key={highlight}
                      className="flex items-baseline gap-2.5 font-display text-sm text-black/85 dark:text-white/85"
                    >
                      <span aria-hidden="true" className="font-bold text-[#880021] dark:text-[#d43b5c]">
                        ·
                      </span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ScrollRevealSection>
  );
}
