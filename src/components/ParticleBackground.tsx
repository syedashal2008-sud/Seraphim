import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseVx: number;
  baseVy: number;
  radius: number;
  fillStyle: string;
  isBurgundy: boolean;
}

interface ParticleBackgroundProps {
  variant?: 'light' | 'dark';
  fixed?: boolean;
  className?: string;
}

const BURGUNDY_RGB = '136, 0, 33';
const INK_RGB = '0, 0, 0';
const WHITE_RGB = '255, 255, 255';
const LINK_DISTANCE = 122;
const MOUSE_RADIUS = 140;
const ALPHA_BUCKETS = 8;

function buildAlphaPalette(rgb: string, maxAlpha: number): string[] {
  const palette: string[] = [];
  for (let i = 0; i < ALPHA_BUCKETS; i++) {
    const a = (((i + 1) / ALPHA_BUCKETS) * maxAlpha).toFixed(3);
    palette.push(`rgba(${rgb}, ${a})`);
  }
  return palette;
}

function createParticles(
  width: number,
  height: number,
  variant: 'light' | 'dark',
  fixed: boolean
): Particle[] {
  const area = width * height;
  const maxCount = fixed ? 48 : 30;
  const minCount = fixed ? 20 : 14;
  const count = Math.min(maxCount, Math.max(minCount, Math.floor(area / 28000)));
  const neutralRgb = variant === 'dark' ? WHITE_RGB : INK_RGB;
  const particles: Particle[] = [];

  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.16 + Math.random() * 0.26;
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed;
    const isBurgundy = Math.random() < 0.28;

    const alpha =
      variant === 'dark'
        ? isBurgundy
          ? 0.34 + Math.random() * 0.26
          : 0.16 + Math.random() * 0.22
        : isBurgundy
          ? 0.22 + Math.random() * 0.24
          : 0.14 + Math.random() * 0.2;

    const fillStyle = isBurgundy
      ? `rgba(${BURGUNDY_RGB}, ${alpha.toFixed(2)})`
      : `rgba(${neutralRgb}, ${alpha.toFixed(2)})`;

    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx,
      vy,
      baseVx: vx,
      baseVy: vy,
      radius: isBurgundy ? 1.4 + Math.random() * 1.3 : 1.1 + Math.random() * 1.2,
      fillStyle,
      isBurgundy,
    });
  }

  return particles;
}

export function ParticleBackground({
  variant = 'light',
  fixed = true,
  className,
}: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let prefersReducedMotion = reducedMotionQuery.matches;

    const neutralRgb = variant === 'dark' ? WHITE_RGB : INK_RGB;
    const burgundyLinks = buildAlphaPalette(
      BURGUNDY_RGB,
      variant === 'dark' ? 0.2 : 0.12
    );
    const neutralLinks = buildAlphaPalette(
      neutralRgb,
      variant === 'dark' ? 0.1 : 0.075
    );

    const parentEl = fixed ? null : canvas.parentElement;

    let width = fixed ? window.innerWidth : parentEl?.clientWidth || window.innerWidth;
    let height = fixed ? window.innerHeight : parentEl?.clientHeight || window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let particles = createParticles(width, height, variant, fixed);
    let animationFrameId: number | null = null;
    let lastScrollY = window.scrollY;
    let isVisibleOnScreen = fixed;

    const cachedRect = { left: 0, top: 0, right: width, bottom: height };
    const updateCachedRect = () => {
      if (fixed) return;
      const rect = canvas.getBoundingClientRect();
      cachedRect.left = rect.left;
      cachedRect.top = rect.top;
      cachedRect.right = rect.right;
      cachedRect.bottom = rect.bottom;
    };

    const pointer = {
      x: -9999,
      y: -9999,
      active: false,
    };

    const resizeCanvas = () => {
      const nextWidth = fixed
        ? window.innerWidth
        : parentEl?.clientWidth || window.innerWidth;
      const nextHeight = fixed
        ? window.innerHeight
        : parentEl?.clientHeight || window.innerHeight;

      if (nextWidth <= 0 || nextHeight <= 0) return;

      width = nextWidth;
      height = nextHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles = createParticles(width, height, variant, fixed);
      updateCachedRect();
    };

    const drawFrame = (animate: boolean) => {
      ctx.clearRect(0, 0, width, height);

      if (animate) {
        const maxMouseDistSq = MOUSE_RADIUS * MOUSE_RADIUS;
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];

          if (pointer.active) {
            const dx = p.x - pointer.x;
            const dy = p.y - pointer.y;
            const distSq = dx * dx + dy * dy;

            if (distSq > 0.01 && distSq < maxMouseDistSq) {
              const dist = Math.sqrt(distSq);
              const force = (1 - dist / MOUSE_RADIUS) * 0.28;
              p.vx += (dx / dist) * force;
              p.vy += (dy / dist) * force;
            }
          }

          p.vx += (p.baseVx - p.vx) * 0.03;
          p.vy += (p.baseVy - p.vy) * 0.03;

          p.x += p.vx;
          p.y += p.vy;

          if (p.x < -16) p.x = width + 16;
          else if (p.x > width + 16) p.x = -16;

          if (p.y < -16) p.y = height + 16;
          else if (p.y > height + 16) p.y = -16;
        }
      }

      const maxLinkSq = LINK_DISTANCE * LINK_DISTANCE;
      ctx.lineWidth = 0.75;

      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          if (dx > LINK_DISTANCE || dx < -LINK_DISTANCE) continue;
          const dy = a.y - b.y;
          if (dy > LINK_DISTANCE || dy < -LINK_DISTANCE) continue;

          const distSq = dx * dx + dy * dy;
          if (distSq < maxLinkSq) {
            const strength = 1 - Math.sqrt(distSq) / LINK_DISTANCE;
            const bucket = Math.min(
              ALPHA_BUCKETS - 1,
              Math.max(0, Math.floor(strength * ALPHA_BUCKETS))
            );
            const hasBurgundy = a.isBurgundy || b.isBurgundy;
            ctx.strokeStyle = hasBurgundy
              ? burgundyLinks[bucket]
              : neutralLinks[bucket];

            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        ctx.fillStyle = p.fillStyle;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const stopLoop = () => {
      if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    };

    const tick = () => {
      if (document.hidden || prefersReducedMotion || !isVisibleOnScreen) {
        animationFrameId = null;
        return;
      }
      drawFrame(true);
      animationFrameId = window.requestAnimationFrame(tick);
    };

    const startLoop = () => {
      if (prefersReducedMotion) {
        drawFrame(false);
        return;
      }
      if (animationFrameId === null && !document.hidden && isVisibleOnScreen) {
        animationFrameId = window.requestAnimationFrame(tick);
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType && event.pointerType !== 'mouse') return;
      if (!isVisibleOnScreen) return;

      if (fixed) {
        pointer.x = event.clientX;
        pointer.y = event.clientY;
        pointer.active = true;
      } else {
        const inside =
          event.clientX >= cachedRect.left &&
          event.clientX <= cachedRect.right &&
          event.clientY >= cachedRect.top &&
          event.clientY <= cachedRect.bottom;
        if (inside) {
          pointer.x = event.clientX - cachedRect.left;
          pointer.y = event.clientY - cachedRect.top;
          pointer.active = true;
        } else {
          pointer.active = false;
        }
      }
    };

    const handlePointerLeave = () => {
      pointer.active = false;
    };

    const handleScroll = () => {
      if (!fixed) {
        if (isVisibleOnScreen) {
          updateCachedRect();
        }
        return;
      }
      const currentY = window.scrollY;
      const deltaY = currentY - lastScrollY;
      lastScrollY = currentY;
      if (prefersReducedMotion || deltaY === 0) return;

      const shift = deltaY * 0.14;
      for (let i = 0; i < particles.length; i++) {
        particles[i].y -= shift;
        if (particles[i].y < -16) particles[i].y = height + 16;
        else if (particles[i].y > height + 16) particles[i].y = -16;
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopLoop();
      } else {
        startLoop();
      }
    };

    const handleMotionPreferenceChange = (event: MediaQueryListEvent) => {
      prefersReducedMotion = event.matches;
      stopLoop();
      startLoop();
    };

    let intersectionObserver: IntersectionObserver | null = null;
    if (!fixed && typeof IntersectionObserver !== 'undefined') {
      intersectionObserver = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          isVisibleOnScreen = Boolean(entry?.isIntersecting);
          if (isVisibleOnScreen) {
            updateCachedRect();
            startLoop();
          } else {
            pointer.active = false;
            stopLoop();
          }
        },
        { rootMargin: '120px 0px' }
      );
      intersectionObserver.observe(canvas);
    }

    resizeCanvas();
    startLoop();

    let resizeObserver: ResizeObserver | null = null;
    if (!fixed && parentEl && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => resizeCanvas());
      resizeObserver.observe(parentEl);
    }

    window.addEventListener('resize', resizeCanvas, { passive: true });
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.documentElement.addEventListener('mouseleave', handlePointerLeave);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    reducedMotionQuery.addEventListener('change', handleMotionPreferenceChange);

    return () => {
      stopLoop();
      intersectionObserver?.disconnect();
      resizeObserver?.disconnect();
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('scroll', handleScroll);
      document.documentElement.removeEventListener('mouseleave', handlePointerLeave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      reducedMotionQuery.removeEventListener('change', handleMotionPreferenceChange);
    };
  }, [fixed, variant]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={
        className ??
        (fixed
          ? 'pointer-events-none fixed inset-0 z-[1] h-full w-full'
          : 'pointer-events-none absolute inset-0 z-0 h-full w-full')
      }
    />
  );
}
