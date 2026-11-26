export interface MagneticButtonConfig {
  label: string;
  radius: number;
  glow: number;
  strength: number;
  color: string;
  shimmer: boolean;
}

export interface GlassCardConfig {
  blur: number;
  opacity: number;
  borderAlpha: number;
  accent: string;
  surfaceMode: 'dark' | 'light';
}

export interface MicroWidgetConfig {
  metric: 'throughput' | 'latency' | 'conversions';
  period: 'monthly' | 'quarterly';
  curve: 'spring' | 'snappy';
  accent: string;
  realtimeEnabled: boolean;
  showValues: boolean;
}

export function getContrastTextColor(hex: string): '#000000' | '#ffffff' {
  const cleaned = hex.replace('#', '');
  if (cleaned.length !== 6) return '#ffffff';
  const r = parseInt(cleaned.slice(0, 2), 16) / 255;
  const g = parseInt(cleaned.slice(2, 4), 16) / 255;
  const b = parseInt(cleaned.slice(4, 6), 16) / 255;
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance > 0.62 ? '#000000' : '#ffffff';
}

export function hexToRgba(hex: string, alpha: number): string {
  const cleaned = hex.replace('#', '');
  if (cleaned.length !== 6) return `rgba(136, 0, 33, ${alpha})`;
  const r = parseInt(cleaned.slice(0, 2), 16);
  const g = parseInt(cleaned.slice(2, 4), 16);
  const b = parseInt(cleaned.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(2)})`;
}

export function buildMagneticButtonCode(config: MagneticButtonConfig): string {
  const textColor = getContrastTextColor(config.color);
  const glowAlpha = (config.glow / 100) * 0.65;
  const glowSpread = Math.round((config.glow / 100) * 32);

  return `import { useRef, type PointerEvent } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

export function MagneticGlowButton() {
  const ref = useRef<HTMLButtonElement | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 280, damping: 20, mass: 0.25 });
  const springY = useSpring(y, { stiffness: 280, damping: 20, mass: 0.25 });

  const handlePointerMove = (e: PointerEvent<HTMLButtonElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    x.set(dx * ${config.strength.toFixed(2)});
    y.set(dy * ${config.strength.toFixed(2)});
  };

  const resetPosition = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      type="button"
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPosition}
      style={{
        x: springX,
        y: springY,
        borderRadius: '${config.radius}px',
        backgroundColor: '${config.color}',
        color: '${textColor}',
        boxShadow: '0 12px ${glowSpread}px -4px ${hexToRgba(config.color, glowAlpha)}',
      }}
      className="${config.shimmer ? 'group relative overflow-hidden ' : ''}px-6 py-3 text-sm font-semibold transition-transform active:scale-95 focus-visible:outline-none focus-visible:ring-2"
    >${config.shimmer ? `
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full"
      />` : ''}
      <span className="relative z-10">${config.label || 'Launch Studio'}</span>
    </motion.button>
  );
}`;
}

export function buildGlassCardCode(config: GlassCardConfig): string {
  const bgRgba =
    config.surfaceMode === 'light'
      ? `rgba(255, 255, 255, ${(config.opacity / 100).toFixed(2)})`
      : `rgba(12, 12, 16, ${(config.opacity / 100).toFixed(2)})`;
  const borderRgba =
    config.surfaceMode === 'light'
      ? `rgba(0, 0, 0, ${(config.borderAlpha / 100).toFixed(2)})`
      : `rgba(255, 255, 255, ${(config.borderAlpha / 100).toFixed(2)})`;
  const inkClass = config.surfaceMode === 'light' ? 'text-neutral-950' : 'text-white';

  return `export function GlassmorphismCard() {
  return (
    <div
      style={{
        backdropFilter: 'blur(${config.blur}px)',
        WebkitBackdropFilter: 'blur(${config.blur}px)',
        backgroundColor: '${bgRgba}',
        borderColor: '${borderRgba}',
      }}
      className="w-full max-w-sm rounded-2xl border p-6 shadow-2xl ${inkClass}"
    >
      <div className="flex items-center justify-between gap-4">
        <span className="text-xs font-medium opacity-70">
          Architecture · Full-Stack
        </span>
        <span
          style={{ backgroundColor: '${config.accent}' }}
          className="h-2.5 w-8 rounded-full"
        />
      </div>

      <h3 className="mt-4 text-xl font-bold tracking-tight">
        Seraphim Design System
      </h3>
      <p className="mt-2 text-sm leading-relaxed opacity-80">
        Adaptive frosted surface with ${config.blur}px backdrop blur and ${config.opacity}% translucency.
      </p>

      <div className="mt-5 flex items-center justify-between border-t border-current/15 pt-4 text-xs">
        <span className="tabular-nums opacity-70">Blur ${config.blur}px · Alpha ${config.opacity}%</span>
        <button
          type="button"
          style={{ color: '${config.accent}' }}
          className="font-semibold hover:underline"
        >
          Inspect Token →
        </button>
      </div>
    </div>
  );
}`;
}

export function buildMicroWidgetCode(config: MicroWidgetConfig): string {
  const transitionConfig =
    config.curve === 'spring'
      ? "{ type: 'spring', stiffness: 380, damping: 26 }"
      : '{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }';

  return `import { useState } from 'react';
import { motion } from 'motion/react';

const SERIES = [64, 82, 74, 91, 86, 98];

export function AnimatedMetricsWidget() {
  const [period, setPeriod] = useState<'monthly' | 'quarterly'>('${config.period}');
  const [liveSync, setLiveSync] = useState(${config.realtimeEnabled});

  return (
    <div className="w-full max-w-md rounded-2xl border border-black/15 bg-white p-5 dark:border-white/15 dark:bg-neutral-950">
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          role="switch"
          aria-checked={liveSync}
          onClick={() => setLiveSync((v) => !v)}
          className="relative inline-flex h-6 w-11 items-center rounded-full p-0.5 transition-colors"
          style={{ backgroundColor: liveSync ? '${config.accent}' : 'rgba(120,120,128,0.3)' }}
        >
          <motion.span
            layout
            transition={${transitionConfig}}
            className="block h-5 w-5 rounded-full bg-white shadow-sm"
            style={{ x: liveSync ? 20 : 0 }}
          />
        </button>

        <div className="inline-flex rounded-lg bg-black/5 p-1 dark:bg-white/10">
          {(['monthly', 'quarterly'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setPeriod(tab)}
              className="relative px-3 py-1 text-xs font-medium capitalize"
            >
              {period === tab && (
                <motion.span
                  layoutId="widget-period-indicator"
                  transition={${transitionConfig}}
                  className="absolute inset-0 rounded-md bg-black dark:bg-white"
                />
              )}
              <span className={period === tab ? 'relative z-10 text-white dark:text-black' : 'relative z-10'}>
                {tab}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid h-32 grid-cols-6 items-end gap-2.5">
        {SERIES.map((value, idx) => (
          <div key={idx} className="flex h-full flex-col justify-end">
            <motion.div
              animate={{ scaleY: (period === 'quarterly' ? Math.min(100, value + 4) : value) / 100 }}
              transition={${transitionConfig}}
              style={{ backgroundColor: '${config.accent}', transformOrigin: 'bottom' }}
              className="h-full w-full rounded-t-md"
            />
          </div>
        ))}
      </div>
    </div>
  );
}`;
}
