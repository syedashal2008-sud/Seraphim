import { useId, useMemo, useState, type ReactNode } from 'react';
import {
  ArrowUpRight,
  Check,
  Code2,
  Copy,
  Eye,
  RotateCcw,
  SlidersHorizontal,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Magnetic } from './Magnetic';
import { ScrollRevealSection } from './ScrollRevealSection';
import { SectionHeaderReveal } from './SectionHeaderReveal';
import {
  buildGlassCardCode,
  buildMagneticButtonCode,
  buildMicroWidgetCode,
  getContrastTextColor,
  hexToRgba,
  type GlassCardConfig,
  type MagneticButtonConfig,
  type MicroWidgetConfig,
} from './playgroundCode';

type CardViewMode = 'preview' | 'code';

const EDITORIAL_EASE = [0.16, 1, 0.3, 1] as const;

const ACCENT_SWATCHES = [
  { name: 'Burgundy', hex: '#880021' },
  { name: 'Obsidian', hex: '#18181b' },
  { name: 'Cobalt', hex: '#2563eb' },
  { name: 'Emerald', hex: '#059669' },
  { name: 'Amber', hex: '#d97706' },
] as const;

const INITIAL_BUTTON_CONFIG: MagneticButtonConfig = {
  label: 'Launch Studio',
  radius: 14,
  glow: 65,
  strength: 0.38,
  color: '#880021',
  shimmer: true,
};

const INITIAL_GLASS_CONFIG: GlassCardConfig = {
  blur: 16,
  opacity: 24,
  borderAlpha: 28,
  accent: '#880021',
  surfaceMode: 'dark',
};

const INITIAL_WIDGET_CONFIG: MicroWidgetConfig = {
  metric: 'throughput',
  period: 'monthly',
  curve: 'spring',
  accent: '#880021',
  realtimeEnabled: true,
  showValues: true,
};

const WIDGET_DATASETS: Record<
  MicroWidgetConfig['metric'],
  {
    title: string;
    unit: string;
    delta: Record<MicroWidgetConfig['period'], string>;
    headline: Record<MicroWidgetConfig['period'], string>;
    monthly: { label: string; value: number; display: string }[];
    quarterly: { label: string; value: number; display: string }[];
  }
> = {
  throughput: {
    title: 'API Throughput',
    unit: 'req/s',
    delta: { monthly: '+18.4% vs last mo', quarterly: '+24.1% vs last qtr' },
    headline: { monthly: '1,480 req/s', quarterly: '4,290 req/s' },
    monthly: [
      { label: 'Jan', value: 58, display: '980' },
      { label: 'Feb', value: 72, display: '1.1k' },
      { label: 'Mar', value: 65, display: '1.0k' },
      { label: 'Apr', value: 84, display: '1.3k' },
      { label: 'May', value: 79, display: '1.2k' },
      { label: 'Jun', value: 96, display: '1.5k' },
    ],
    quarterly: [
      { label: 'Q1', value: 66, display: '2.9k' },
      { label: 'Q2', value: 78, display: '3.4k' },
      { label: 'Q3', value: 74, display: '3.2k' },
      { label: 'Q4', value: 89, display: '3.9k' },
      { label: 'Q5', value: 92, display: '4.1k' },
      { label: 'Q6', value: 98, display: '4.3k' },
    ],
  },
  latency: {
    title: 'SQL Query Speed',
    unit: 'ms',
    delta: { monthly: '-22% query time', quarterly: '-31% query time' },
    headline: { monthly: '38 ms avg', quarterly: '29 ms avg' },
    monthly: [
      { label: 'Jan', value: 88, display: '54ms' },
      { label: 'Feb', value: 76, display: '48ms' },
      { label: 'Mar', value: 70, display: '44ms' },
      { label: 'Apr', value: 61, display: '41ms' },
      { label: 'May', value: 54, display: '39ms' },
      { label: 'Jun', value: 48, display: '38ms' },
    ],
    quarterly: [
      { label: 'Q1', value: 84, display: '49ms' },
      { label: 'Q2', value: 71, display: '43ms' },
      { label: 'Q3', value: 62, display: '38ms' },
      { label: 'Q4', value: 53, display: '34ms' },
      { label: 'Q5', value: 47, display: '31ms' },
      { label: 'Q6', value: 42, display: '29ms' },
    ],
  },
  conversions: {
    title: 'Checkout Completion',
    unit: '%',
    delta: { monthly: '+9.2% conversion', quarterly: '+14.6% conversion' },
    headline: { monthly: '86.4%', quarterly: '91.2%' },
    monthly: [
      { label: 'Jan', value: 64, display: '64%' },
      { label: 'Feb', value: 69, display: '69%' },
      { label: 'Mar', value: 74, display: '74%' },
      { label: 'Apr', value: 78, display: '78%' },
      { label: 'May', value: 82, display: '82%' },
      { label: 'Jun', value: 86, display: '86%' },
    ],
    quarterly: [
      { label: 'Q1', value: 68, display: '68%' },
      { label: 'Q2', value: 73, display: '73%' },
      { label: 'Q3', value: 79, display: '79%' },
      { label: 'Q4', value: 84, display: '84%' },
      { label: 'Q5', value: 88, display: '88%' },
      { label: 'Q6', value: 91, display: '91%' },
    ],
  },
};

function SliderControl({
  label,
  value,
  min,
  max,
  step = 1,
  displayValue,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  displayValue: string;
  onChange: (next: number) => void;
}) {
  const inputId = useId();
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        <label
          htmlFor={inputId}
          className="font-display text-xs font-medium text-[#000000] dark:text-[#ffffff]"
        >
          {label}
        </label>
        <span className="font-mono text-xs font-semibold tabular-nums text-[#880021] dark:text-[#d43b5c]">
          {displayValue}
        </span>
      </div>
      <input
        id={inputId}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-black/15 accent-[#880021] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#880021] focus-visible:ring-offset-2 dark:bg-white/20 dark:accent-[#d43b5c] dark:focus-visible:ring-[#d43b5c]"
      />
    </div>
  );
}

function ColorControl({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (hex: string) => void;
}) {
  const pickerId = useId();
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        <label
          htmlFor={pickerId}
          className="font-display text-xs font-medium text-[#000000] dark:text-[#ffffff]"
        >
          {label}
        </label>
        <span className="font-mono text-[11px] uppercase tabular-nums text-black/60 dark:text-white/65">
          {value}
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {ACCENT_SWATCHES.map((swatch) => {
          const isSelected = value.toLowerCase() === swatch.hex.toLowerCase();
          return (
            <button
              key={swatch.hex}
              type="button"
              onClick={() => onChange(swatch.hex)}
              aria-label={`Select ${swatch.name} (${swatch.hex})`}
              aria-pressed={isSelected}
              style={{ backgroundColor: swatch.hex }}
              className={`h-7 w-7 cursor-pointer rounded-lg border transition-transform duration-150 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#880021] focus-visible:ring-offset-2 dark:focus-visible:ring-[#d43b5c] ${
                isSelected
                  ? 'scale-110 border-[#000000] ring-2 ring-[#000000]/20 dark:border-[#ffffff] dark:ring-white/30'
                  : 'border-black/20 dark:border-white/25'
              }`}
            />
          );
        })}

        <label
          htmlFor={pickerId}
          className="inline-flex h-7 cursor-pointer items-center gap-1.5 rounded-lg border border-black/15 bg-black/[0.03] px-2 font-display text-[11px] font-medium text-black/75 transition-colors hover:border-[#880021] dark:border-white/20 dark:bg-white/[0.05] dark:text-white/80 dark:hover:border-[#d43b5c]"
        >
          <input
            id={pickerId}
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            aria-label={`Custom ${label.toLowerCase()} color picker`}
            className="h-4 w-4 cursor-pointer border-0 bg-transparent p-0"
          />
          <span>Custom</span>
        </label>
      </div>
    </div>
  );
}

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="font-display text-xs font-medium text-[#000000] dark:text-[#ffffff]">
        {label}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#880021] focus-visible:ring-offset-2 dark:focus-visible:ring-[#d43b5c] ${
          checked ? 'bg-[#880021] dark:bg-[#d43b5c]' : 'bg-black/20 dark:bg-white/25'
        }`}
      >
        <motion.span
          layout
          transition={{ type: 'spring', stiffness: 420, damping: 28 }}
          className="block h-5 w-5 rounded-full bg-[#ffffff] shadow-xs"
          style={{ x: checked ? 20 : 0 }}
        />
      </button>
    </div>
  );
}

function CodeViewer({ code }: { code: string }) {
  const lines = useMemo(() => code.split('\n'), [code]);

  return (
    <div className="bg-[#09090c] text-[#f4f4f5]">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-2.5 font-mono text-[11px] text-white/60">
        <span>React · TypeScript · Tailwind CSS</span>
        <span className="tabular-nums">{lines.length} lines</span>
      </div>
      <div className="max-h-[380px] overflow-auto p-5 font-mono text-xs leading-relaxed sm:p-6">
        <pre className="m-0">
          <code>
            {lines.map((line, idx) => (
              <div key={idx} className="flex gap-4">
                <span
                  aria-hidden="true"
                  className="w-7 shrink-0 select-none text-right text-white/30 tabular-nums"
                >
                  {idx + 1}
                </span>
                <span className="whitespace-pre text-white/90">{line || ' '}</span>
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}

function PlaygroundCardShell({
  idSuffix,
  title,
  subtitle,
  code,
  onReset,
  controls,
  preview,
}: {
  idSuffix: string;
  title: string;
  subtitle: string;
  code: string;
  onReset: () => void;
  controls: ReactNode;
  preview: ReactNode;
}) {
  const [viewMode, setViewMode] = useState<CardViewMode>('preview');
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard blocked in restricted sandbox; ignore gracefully
    }
  };

  return (
    <article className="overflow-hidden rounded-2xl border border-black/12 bg-[#ffffff]/80 shadow-[0_22px_54px_-22px_rgba(0,0,0,0.12)] backdrop-blur-md transition-colors duration-300 hover:border-[#880021]/60 dark:border-white/15 dark:bg-[#08080a]/85 dark:shadow-[0_24px_60px_-22px_rgba(0,0,0,0.8)] dark:hover:border-[#d43b5c]/60">
      {/* Card Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-black/12 px-5 py-4 dark:border-white/15 sm:px-7 sm:py-5">
        <div>
          <h3 className="font-display text-lg font-bold tracking-[-0.02em] text-[#000000] dark:text-[#ffffff] sm:text-xl">
            {title}
          </h3>
          <p className="mt-0.5 font-display text-xs text-black/65 dark:text-white/70 sm:text-[13px]">
            {subtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div
            role="tablist"
            aria-label={`${title} mode`}
            className="inline-flex items-center gap-1 rounded-xl border border-black/12 bg-black/[0.03] p-1 dark:border-white/15 dark:bg-white/[0.04]"
          >
            {(
              [
                { id: 'preview', label: 'Preview', icon: Eye },
                { id: 'code', label: 'View Code', icon: Code2 },
              ] as const
            ).map((tab) => {
              const Icon = tab.icon;
              const isSelected = viewMode === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setViewMode(tab.id)}
                  className={`relative inline-flex min-h-[34px] cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 font-display text-xs font-medium whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#880021] dark:focus-visible:ring-[#d43b5c] ${
                    isSelected
                      ? 'text-[#ffffff] dark:text-[#000000]'
                      : 'text-black/70 hover:text-[#000000] dark:text-white/70 dark:hover:text-[#ffffff]'
                  }`}
                >
                  {isSelected && (
                    <motion.span
                      layoutId={`playground-tab-${idSuffix}`}
                      transition={{ duration: 0.24, ease: EDITORIAL_EASE }}
                      aria-hidden="true"
                      className="absolute inset-0 rounded-lg bg-[#000000] dark:bg-[#ffffff]"
                    />
                  )}
                  <Icon className="relative z-10 h-3.5 w-3.5" aria-hidden="true" />
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleCopy}
            aria-label={`Copy code for ${title}`}
            className="inline-flex min-h-[40px] cursor-pointer items-center gap-1.5 rounded-xl border border-black/15 bg-transparent px-3.5 py-2 font-display text-xs font-semibold text-[#000000] transition-colors duration-200 hover:border-[#880021] hover:text-[#880021] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#880021] dark:border-white/20 dark:text-[#ffffff] dark:hover:border-[#d43b5c] dark:hover:text-[#d43b5c] whitespace-nowrap"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-[#880021] dark:text-[#d43b5c]" aria-hidden="true" />
            ) : (
              <Copy className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            <span>{copied ? 'Copied' : 'Copy Code'}</span>
          </button>
        </div>
      </div>

      {/* Card Body: Split Preview + Controls OR Code View */}
      <AnimatePresence mode="wait">
        {viewMode === 'preview' ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-12"
          >
            {/* Interactive Controls Panel */}
            <div className="order-2 flex flex-col justify-between gap-5 border-t border-black/12 p-5 dark:border-white/15 sm:p-7 lg:order-1 lg:col-span-5 lg:border-r lg:border-t-0">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-black/10 pb-2.5 dark:border-white/10">
                  <span className="inline-flex items-center gap-1.5 font-display text-xs font-semibold tracking-wide text-black/65 dark:text-white/70">
                    <SlidersHorizontal className="h-3.5 w-3.5 text-[#880021] dark:text-[#d43b5c]" aria-hidden="true" />
                    <span>Live Controls</span>
                  </span>
                  <button
                    type="button"
                    onClick={onReset}
                    aria-label={`Reset ${title} controls`}
                    className="inline-flex cursor-pointer items-center gap-1 font-display text-[11px] font-medium text-black/60 transition-colors hover:text-[#880021] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#880021] dark:text-white/60 dark:hover:text-[#d43b5c]"
                  >
                    <RotateCcw className="h-3 w-3" aria-hidden="true" />
                    <span>Reset</span>
                  </button>
                </div>

                {controls}
              </div>
            </div>

            {/* Live Preview Stage */}
            <div className="order-1 flex min-h-[300px] items-center justify-center p-6 sm:min-h-[350px] sm:p-8 lg:order-2 lg:col-span-7">
              {preview}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="code"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <CodeViewer code={code} />
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}

export function ComponentPlaygroundSection() {
  const prefersReducedMotion = useReducedMotion();

  // 01. Magnetic Glow Button State
  const [btnConfig, setBtnConfig] = useState<MagneticButtonConfig>(INITIAL_BUTTON_CONFIG);
  const [btnClicks, setBtnClicks] = useState(0);

  // 02. Glassmorphism Card State
  const [glassConfig, setGlassConfig] = useState<GlassCardConfig>(INITIAL_GLASS_CONFIG);

  // 03. Animated Micro-Interaction Widget State
  const [widgetConfig, setWidgetConfig] = useState<MicroWidgetConfig>(INITIAL_WIDGET_CONFIG);
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  const btnCode = useMemo(() => buildMagneticButtonCode(btnConfig), [btnConfig]);
  const glassCode = useMemo(() => buildGlassCardCode(glassConfig), [glassConfig]);
  const widgetCode = useMemo(() => buildMicroWidgetCode(widgetConfig), [widgetConfig]);

  const activeDataset = WIDGET_DATASETS[widgetConfig.metric];
  const activeSeries =
    widgetConfig.period === 'monthly' ? activeDataset.monthly : activeDataset.quarterly;
  const maxBarValue = 100;

  const barTransition = prefersReducedMotion
    ? { duration: 0 }
    : widgetConfig.curve === 'spring'
      ? { type: 'spring' as const, stiffness: 320, damping: 24 }
      : { duration: 0.35, ease: EDITORIAL_EASE };

  return (
    <ScrollRevealSection
      id="sandbox"
      className="relative z-[2] w-full bg-transparent px-6 pb-20 pt-10 text-[#000000] transition-colors duration-300 dark:text-[#ffffff] sm:px-12 sm:pb-28 sm:pt-14 lg:px-20"
    >
      <div className="mx-auto w-full max-w-6xl border-t border-black/15 pt-14 dark:border-white/20 sm:pt-16">
        <SectionHeaderReveal
          title="Component Playground"
          subtitle="Adjust live controls, test micro-interactions, and copy production React & Tailwind code."
          layout="split"
          className="mb-10 sm:mb-12"
          titleClassName="font-display text-[clamp(1.9rem,3.8vw,2.9rem)] font-bold leading-none tracking-[-0.03em] text-[#000000] dark:text-[#ffffff]"
          subtitleClassName="max-w-md font-serif text-lg font-medium italic leading-snug text-[#880021] dark:text-[#d43b5c] sm:text-xl"
        />

        <div className="flex flex-col gap-8 sm:gap-10">
          {/* 01. Interactive Magnetic / Glow Button */}
          <PlaygroundCardShell
            idSuffix="magnetic-btn"
            title="01. Magnetic Glow Button"
            subtitle="Pointer-aware spring pull, customizable border radius, luminance-safe ink, and radial glow intensity."
            code={btnCode}
            onReset={() => {
              setBtnConfig(INITIAL_BUTTON_CONFIG);
              setBtnClicks(0);
            }}
            controls={
              <>
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="pg-btn-label"
                    className="font-display text-xs font-medium text-[#000000] dark:text-[#ffffff]"
                  >
                    Button Label
                  </label>
                  <input
                    id="pg-btn-label"
                    type="text"
                    maxLength={24}
                    value={btnConfig.label}
                    onChange={(e) =>
                      setBtnConfig((prev) => ({ ...prev, label: e.target.value }))
                    }
                    className="rounded-lg border border-black/15 bg-transparent px-3 py-2 font-display text-xs font-medium text-[#000000] focus:border-[#880021] focus:outline-none dark:border-white/20 dark:text-[#ffffff] dark:focus:border-[#d43b5c]"
                  />
                </div>

                <SliderControl
                  label="Border Radius"
                  value={btnConfig.radius}
                  min={0}
                  max={32}
                  displayValue={`${btnConfig.radius}px`}
                  onChange={(radius) => setBtnConfig((prev) => ({ ...prev, radius }))}
                />

                <SliderControl
                  label="Glow Intensity"
                  value={btnConfig.glow}
                  min={0}
                  max={100}
                  displayValue={`${btnConfig.glow}%`}
                  onChange={(glow) => setBtnConfig((prev) => ({ ...prev, glow }))}
                />

                <SliderControl
                  label="Magnetic Pull"
                  value={btnConfig.strength}
                  min={0.1}
                  max={0.6}
                  step={0.02}
                  displayValue={`${btnConfig.strength.toFixed(2)}×`}
                  onChange={(strength) => setBtnConfig((prev) => ({ ...prev, strength }))}
                />

                <ColorControl
                  label="Button Accent"
                  value={btnConfig.color}
                  onChange={(color) => setBtnConfig((prev) => ({ ...prev, color }))}
                />

                <ToggleRow
                  label="Hover Light Sweep"
                  checked={btnConfig.shimmer}
                  onChange={(shimmer) => setBtnConfig((prev) => ({ ...prev, shimmer }))}
                />
              </>
            }
            preview={
              <div className="relative flex h-full min-h-[260px] w-full flex-col items-center justify-center overflow-hidden rounded-xl border border-black/10 bg-[#fafafa] bg-[radial-gradient(rgba(0,0,0,0.12)_1px,transparent_1px)] [background-size:18px_18px] p-8 dark:border-white/10 dark:bg-[#050507] dark:bg-[radial-gradient(rgba(255,255,255,0.14)_1px,transparent_1px)]">
                {/* Ambient glow halo behind the button */}
                <div
                  aria-hidden="true"
                  style={{
                    backgroundColor: btnConfig.color,
                    opacity: (btnConfig.glow / 100) * 0.34,
                  }}
                  className="pointer-events-none absolute h-32 w-56 rounded-full blur-3xl transition-opacity duration-200"
                />

                <Magnetic
                  strength={btnConfig.strength}
                  proximity={64}
                  maxOffset={16}
                >
                  <button
                    type="button"
                    onClick={() => setBtnClicks((c) => c + 1)}
                    style={{
                      borderRadius: `${btnConfig.radius}px`,
                      backgroundColor: btnConfig.color,
                      color: getContrastTextColor(btnConfig.color),
                      boxShadow: `0 14px ${Math.round((btnConfig.glow / 100) * 34)}px -4px ${hexToRgba(
                        btnConfig.color,
                        (btnConfig.glow / 100) * 0.7
                      )}`,
                    }}
                    className="group relative inline-flex min-h-[48px] cursor-pointer items-center gap-2 overflow-hidden px-7 py-3.5 font-display text-sm font-semibold tracking-tight transition-transform duration-150 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#880021] focus-visible:ring-offset-4 dark:focus-visible:ring-[#d43b5c]"
                  >
                    {btnConfig.shimmer && (
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full"
                      />
                    )}
                    <span className="relative z-10">
                      {btnConfig.label.trim() || 'Launch Studio'}
                    </span>
                    <ArrowUpRight
                      className="relative z-10 h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden="true"
                    />
                  </button>
                </Magnetic>

                <p className="mt-7 font-mono text-[11px] text-black/55 tabular-nums dark:text-white/55">
                  Move cursor near button · Radius {btnConfig.radius}px · Triggered {btnClicks}×
                </p>
              </div>
            }
          />

          {/* 02. Live Theme & Glassmorphism Card Customizer */}
          <PlaygroundCardShell
            idSuffix="glass-card"
            title="02. Glassmorphism Card Customizer"
            subtitle="Real-time frosted backdrop blur, translucent surface alpha, border contrast, and light/dark card theming."
            code={glassCode}
            onReset={() => setGlassConfig(INITIAL_GLASS_CONFIG)}
            controls={
              <>
                <div className="flex flex-col gap-2">
                  <span className="font-display text-xs font-medium text-[#000000] dark:text-[#ffffff]">
                    Card Surface Theme
                  </span>
                  <div
                    role="tablist"
                    aria-label="Glass card surface theme"
                    className="inline-flex w-full items-center gap-1 rounded-xl border border-black/12 bg-black/[0.03] p-1 dark:border-white/15 dark:bg-white/[0.04]"
                  >
                    {(['dark', 'light'] as const).map((surface) => {
                      const isSelected = glassConfig.surfaceMode === surface;
                      return (
                        <button
                          key={surface}
                          type="button"
                          role="tab"
                          aria-selected={isSelected}
                          onClick={() =>
                            setGlassConfig((prev) => ({ ...prev, surfaceMode: surface }))
                          }
                          className={`relative flex-1 cursor-pointer rounded-lg px-3 py-1.5 font-display text-xs font-medium capitalize transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#880021] ${
                            isSelected
                              ? 'text-[#ffffff] dark:text-[#000000]'
                              : 'text-black/70 hover:text-[#000000] dark:text-white/70 dark:hover:text-[#ffffff]'
                          }`}
                        >
                          {isSelected && (
                            <motion.span
                              layoutId="pg-glass-surface"
                              transition={{ duration: 0.22, ease: EDITORIAL_EASE }}
                              aria-hidden="true"
                              className="absolute inset-0 rounded-lg bg-[#000000] dark:bg-[#ffffff]"
                            />
                          )}
                          <span className="relative z-10">{surface} Glass</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <SliderControl
                  label="Backdrop Blur"
                  value={glassConfig.blur}
                  min={0}
                  max={28}
                  displayValue={`${glassConfig.blur}px`}
                  onChange={(blur) => setGlassConfig((prev) => ({ ...prev, blur }))}
                />

                <SliderControl
                  label="Surface Opacity"
                  value={glassConfig.opacity}
                  min={5}
                  max={85}
                  displayValue={`${glassConfig.opacity}%`}
                  onChange={(opacity) => setGlassConfig((prev) => ({ ...prev, opacity }))}
                />

                <SliderControl
                  label="Border Opacity"
                  value={glassConfig.borderAlpha}
                  min={10}
                  max={65}
                  displayValue={`${glassConfig.borderAlpha}%`}
                  onChange={(borderAlpha) =>
                    setGlassConfig((prev) => ({ ...prev, borderAlpha }))
                  }
                />

                <ColorControl
                  label="Accent Highlight"
                  value={glassConfig.accent}
                  onChange={(accent) => setGlassConfig((prev) => ({ ...prev, accent }))}
                />
              </>
            }
            preview={
              <div className="relative flex min-h-[290px] w-full items-center justify-center overflow-hidden rounded-xl border border-black/10 bg-[#121216] p-6 sm:p-10">
                {/* Vivid architectural backdrop shapes so real-time blur & opacity are clearly visible */}
                <div
                  aria-hidden="true"
                  style={{ backgroundColor: glassConfig.accent }}
                  className="pointer-events-none absolute -left-10 -top-10 h-48 w-48 rounded-full opacity-75"
                />
                <div
                  aria-hidden="true"
                  style={{ backgroundColor: glassConfig.accent }}
                  className="pointer-events-none absolute -bottom-12 -right-8 h-56 w-56 rounded-full opacity-45"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-[linear-gradient(125deg,rgba(255,255,255,0.12)_0%,transparent_42%,rgba(255,255,255,0.08)_100%)]"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-1/2 h-[2px] -rotate-12 bg-white/25"
                />

                {/* Live Glassmorphic Card */}
                <div
                  style={{
                    backdropFilter: `blur(${glassConfig.blur}px)`,
                    WebkitBackdropFilter: `blur(${glassConfig.blur}px)`,
                    backgroundColor:
                      glassConfig.surfaceMode === 'light'
                        ? `rgba(255, 255, 255, ${(glassConfig.opacity / 100).toFixed(2)})`
                        : `rgba(12, 12, 16, ${(glassConfig.opacity / 100).toFixed(2)})`,
                    borderColor:
                      glassConfig.surfaceMode === 'light'
                        ? `rgba(0, 0, 0, ${(glassConfig.borderAlpha / 100).toFixed(2)})`
                        : `rgba(255, 255, 255, ${(glassConfig.borderAlpha / 100).toFixed(2)})`,
                  }}
                  className={`relative z-10 w-full max-w-sm rounded-2xl border p-6 shadow-[0_24px_60px_-14px_rgba(0,0,0,0.55)] transition-colors duration-200 ${
                    glassConfig.surfaceMode === 'light' ? 'text-[#000000]' : 'text-[#ffffff]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-display text-xs font-medium opacity-75">
                      Seraphim Design · UI Token
                    </span>
                    <span
                      style={{ backgroundColor: glassConfig.accent }}
                      className="h-2.5 w-9 rounded-full"
                    />
                  </div>

                  <h4 className="mt-4 font-display text-xl font-bold tracking-[-0.025em]">
                    Architectural Surface
                  </h4>
                  <p className="mt-2 font-display text-xs leading-relaxed opacity-85 sm:text-[13px]">
                    Frosted depth calibrated at{' '}
                    <span className="font-mono font-semibold tabular-nums">
                      {glassConfig.blur}px
                    </span>{' '}
                    blur and{' '}
                    <span className="font-mono font-semibold tabular-nums">
                      {glassConfig.opacity}%
                    </span>{' '}
                    surface alpha.
                  </p>

                  <div className="mt-5 flex items-center justify-between border-t border-current/15 pt-3.5 text-xs">
                    <span className="font-mono text-[11px] tabular-nums opacity-75">
                      Border {glassConfig.borderAlpha}%
                    </span>
                    <span
                      style={{ color: glassConfig.accent }}
                      className="font-display font-semibold"
                    >
                      Live Preview
                    </span>
                  </div>
                </div>
              </div>
            }
          />

          {/* 03. Animated Micro-Interaction Toggle & Metrics Chart Widget */}
          <PlaygroundCardShell
            idSuffix="micro-widget"
            title="03. Animated Toggle & Telemetry Chart"
            subtitle="Spring-driven switch, shared-layout period selector, and compositor-animated bar chart widget."
            code={widgetCode}
            onReset={() => {
              setWidgetConfig(INITIAL_WIDGET_CONFIG);
              setHoveredBar(null);
            }}
            controls={
              <>
                <div className="flex flex-col gap-2">
                  <span className="font-display text-xs font-medium text-[#000000] dark:text-[#ffffff]">
                    Dataset Metric
                  </span>
                  <div
                    role="tablist"
                    aria-label="Chart dataset metric"
                    className="inline-flex w-full flex-wrap items-center gap-1 rounded-xl border border-black/12 bg-black/[0.03] p-1 dark:border-white/15 dark:bg-white/[0.04]"
                  >
                    {(
                      [
                        { id: 'throughput', label: 'Throughput' },
                        { id: 'latency', label: 'Latency' },
                        { id: 'conversions', label: 'Checkout' },
                      ] as const
                    ).map((m) => {
                      const isSelected = widgetConfig.metric === m.id;
                      return (
                        <button
                          key={m.id}
                          type="button"
                          role="tab"
                          aria-selected={isSelected}
                          onClick={() =>
                            setWidgetConfig((prev) => ({ ...prev, metric: m.id }))
                          }
                          className={`relative flex-1 cursor-pointer rounded-lg px-2.5 py-1.5 font-display text-xs font-medium whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#880021] ${
                            isSelected
                              ? 'text-[#ffffff] dark:text-[#000000]'
                              : 'text-black/70 hover:text-[#000000] dark:text-white/70 dark:hover:text-[#ffffff]'
                          }`}
                        >
                          {isSelected && (
                            <motion.span
                              layoutId="pg-widget-metric"
                              transition={{ duration: 0.22, ease: EDITORIAL_EASE }}
                              aria-hidden="true"
                              className="absolute inset-0 rounded-lg bg-[#000000] dark:bg-[#ffffff]"
                            />
                          )}
                          <span className="relative z-10">{m.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="font-display text-xs font-medium text-[#000000] dark:text-[#ffffff]">
                    Motion Curve
                  </span>
                  <div
                    role="tablist"
                    aria-label="Animation curve preset"
                    className="inline-flex w-full items-center gap-1 rounded-xl border border-black/12 bg-black/[0.03] p-1 dark:border-white/15 dark:bg-white/[0.04]"
                  >
                    {(
                      [
                        { id: 'spring', label: 'Spring Physics' },
                        { id: 'snappy', label: 'Snappy Ease' },
                      ] as const
                    ).map((curve) => {
                      const isSelected = widgetConfig.curve === curve.id;
                      return (
                        <button
                          key={curve.id}
                          type="button"
                          role="tab"
                          aria-selected={isSelected}
                          onClick={() =>
                            setWidgetConfig((prev) => ({ ...prev, curve: curve.id }))
                          }
                          className={`relative flex-1 cursor-pointer rounded-lg px-3 py-1.5 font-display text-xs font-medium whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#880021] ${
                            isSelected
                              ? 'text-[#ffffff] dark:text-[#000000]'
                              : 'text-black/70 hover:text-[#000000] dark:text-white/70 dark:hover:text-[#ffffff]'
                          }`}
                        >
                          {isSelected && (
                            <motion.span
                              layoutId="pg-widget-curve"
                              transition={{ duration: 0.22, ease: EDITORIAL_EASE }}
                              aria-hidden="true"
                              className="absolute inset-0 rounded-lg bg-[#000000] dark:bg-[#ffffff]"
                            />
                          )}
                          <span className="relative z-10">{curve.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <ColorControl
                  label="Chart Accent"
                  value={widgetConfig.accent}
                  onChange={(accent) => setWidgetConfig((prev) => ({ ...prev, accent }))}
                />

                <ToggleRow
                  label="Live Stream Sync"
                  checked={widgetConfig.realtimeEnabled}
                  onChange={(realtimeEnabled) =>
                    setWidgetConfig((prev) => ({ ...prev, realtimeEnabled }))
                  }
                />

                <ToggleRow
                  label="Show Bar Values"
                  checked={widgetConfig.showValues}
                  onChange={(showValues) =>
                    setWidgetConfig((prev) => ({ ...prev, showValues }))
                  }
                />
              </>
            }
            preview={
              <div className="w-full max-w-md rounded-2xl border border-black/12 bg-[#ffffff] p-5 shadow-[0_18px_46px_-20px_rgba(0,0,0,0.14)] dark:border-white/15 dark:bg-[#0d0d10] dark:shadow-[0_18px_46px_-20px_rgba(0,0,0,0.8)] sm:p-6">
                {/* Interactive Widget Header: Micro-Toggle + Period Switcher */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={widgetConfig.realtimeEnabled}
                      aria-label="Toggle live sync state"
                      onClick={() =>
                        setWidgetConfig((prev) => ({
                          ...prev,
                          realtimeEnabled: !prev.realtimeEnabled,
                        }))
                      }
                      style={{
                        backgroundColor: widgetConfig.realtimeEnabled
                          ? widgetConfig.accent
                          : 'rgba(120,120,128,0.28)',
                      }}
                      className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#880021]"
                    >
                      <motion.span
                        layout
                        transition={barTransition}
                        className="block h-5 w-5 rounded-full bg-[#ffffff] shadow-xs"
                        style={{ x: widgetConfig.realtimeEnabled ? 20 : 0 }}
                      />
                    </button>
                    <span className="font-display text-xs font-semibold text-[#000000] dark:text-[#ffffff]">
                      {widgetConfig.realtimeEnabled ? 'Sync Active' : 'Paused'}
                    </span>
                  </div>

                  <div
                    role="tablist"
                    aria-label="Chart period"
                    className="inline-flex items-center gap-1 rounded-xl border border-black/12 bg-black/[0.03] p-1 dark:border-white/15 dark:bg-white/[0.04]"
                  >
                    {(['monthly', 'quarterly'] as const).map((period) => {
                      const isSelected = widgetConfig.period === period;
                      return (
                        <button
                          key={period}
                          type="button"
                          role="tab"
                          aria-selected={isSelected}
                          onClick={() =>
                            setWidgetConfig((prev) => ({ ...prev, period }))
                          }
                          className={`relative cursor-pointer rounded-lg px-2.5 py-1 font-display text-[11px] font-medium capitalize transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#880021] ${
                            isSelected
                              ? 'text-[#ffffff] dark:text-[#000000]'
                              : 'text-black/65 hover:text-[#000000] dark:text-white/65 dark:hover:text-[#ffffff]'
                          }`}
                        >
                          {isSelected && (
                            <motion.span
                              layoutId="pg-widget-period"
                              transition={barTransition}
                              aria-hidden="true"
                              className="absolute inset-0 rounded-lg bg-[#000000] dark:bg-[#ffffff]"
                            />
                          )}
                          <span className="relative z-10">{period}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Metric Summary Readout */}
                <div className="mt-5 flex items-baseline justify-between gap-4 border-b border-black/10 pb-4 dark:border-white/10">
                  <div>
                    <p className="font-display text-xs text-black/60 dark:text-white/60">
                      {activeDataset.title}
                    </p>
                    <p className="mt-0.5 font-display text-2xl font-bold tracking-tight tabular-nums text-[#000000] dark:text-[#ffffff]">
                      {hoveredBar !== null
                        ? `${activeSeries[hoveredBar].display} (${activeSeries[hoveredBar].label})`
                        : activeDataset.headline[widgetConfig.period]}
                    </p>
                  </div>
                  <span
                    style={{ color: widgetConfig.accent }}
                    className="font-mono text-xs font-semibold tabular-nums"
                  >
                    {activeDataset.delta[widgetConfig.period]}
                  </span>
                </div>

                {/* Compositor-Only Animated Bar Chart */}
                <div className="mt-5 grid h-36 grid-cols-6 items-end gap-2.5 sm:gap-3">
                  {activeSeries.map((bar, idx) => {
                    const isHighlighted = hoveredBar === idx;
                    const ratio = Math.max(0.14, bar.value / maxBarValue);
                    return (
                      <button
                        key={bar.label}
                        type="button"
                        onMouseEnter={() => setHoveredBar(idx)}
                        onMouseLeave={() => setHoveredBar(null)}
                        onFocus={() => setHoveredBar(idx)}
                        onBlur={() => setHoveredBar(null)}
                        aria-label={`${bar.label}: ${bar.display}`}
                        className="group flex h-full cursor-pointer flex-col items-center justify-end gap-1.5 focus-visible:outline-none"
                      >
                        {widgetConfig.showValues && (
                          <span
                            className={`font-mono text-[10px] font-semibold tabular-nums transition-opacity duration-150 ${
                              isHighlighted
                                ? 'text-[#000000] opacity-100 dark:text-[#ffffff]'
                                : 'text-black/55 opacity-75 dark:text-white/55'
                            }`}
                          >
                            {bar.display}
                          </span>
                        )}
                        <div className="relative flex h-24 w-full items-end overflow-hidden rounded-md bg-black/[0.05] dark:bg-white/[0.06]">
                          <motion.div
                            animate={{
                              scaleY: widgetConfig.realtimeEnabled ? ratio : ratio * 0.65,
                              opacity:
                                hoveredBar === null || isHighlighted ? 1 : 0.45,
                            }}
                            transition={barTransition}
                            style={{
                              backgroundColor: widgetConfig.accent,
                              transformOrigin: 'bottom',
                            }}
                            className="h-full w-full rounded-t-md"
                          />
                        </div>
                        <span className="font-mono text-[10px] text-black/60 dark:text-white/60">
                          {bar.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            }
          />
        </div>
      </div>
    </ScrollRevealSection>
  );
}
