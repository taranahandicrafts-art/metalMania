'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
  useReducedMotion,
} from 'framer-motion';
import { BedAssemblySVG } from './BedAssemblySVG';
import { CinematicParticles } from './Particles';

export function CinematicHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 30,
    restDelta: 0.001,
  });

  // ── Phase gating ──
  // Phase 1: Hero text visible (0-15%)
  const heroTextOpacity = useTransform(smoothProgress, [0, 0.02, 0.12, 0.18], [1, 1, 1, 0]);
  const heroTextY = useTransform(smoothProgress, [0.12, 0.18], [0, -40]);
  const heroTextScale = useTransform(smoothProgress, [0.12, 0.18], [1, 0.95]);

  // Phase 5: Final CTA reveal (85-100%)
  const ctaOpacity = useTransform(smoothProgress, [0.85, 0.92], [0, 1]);
  const ctaY = useTransform(smoothProgress, [0.85, 0.92], [30, 0]);

  // ── Camera transforms ──
  const cameraScale = useTransform(smoothProgress, [0.15, 0.5, 0.8, 0.95], [1, 1.05, 1.12, 1.08]);
  const cameraRotateY = useTransform(smoothProgress, [0.2, 0.6, 0.85], [0, 2, 0]);
  const cameraTranslateY = useTransform(smoothProgress, [0.15, 0.5, 0.85], [20, -10, 0]);
  const cameraX = useTransform(smoothProgress, [0.2, 0.5, 0.8], [0, -8, 0]);

  // ── Lighting transitions ──
  const lightingWarmth = useTransform(smoothProgress, [0.15, 0.6, 0.85], [0, 0.6, 0.4]);
  const ambientGlow = useTransform(smoothProgress, [0.6, 0.85], [0, 0.15]);
  const vignetteIntensity = useTransform(smoothProgress, [0.1, 0.4, 0.85], [0.6, 0.3, 0.15]);

  // ── Progress indicator ──
  const progressWidth = useTransform(smoothProgress, [0, 1], ['0%', '100%']);
  const progressOpacity = useTransform(smoothProgress, [0, 0.05, 0.9, 1], [0, 0.8, 0.8, 0]);

  // ── Scroll indicator fade ──
  const scrollIndicatorOpacity = useTransform(smoothProgress, [0, 0.06], [1, 0]);

  // ── Background image opacity ──
  const bgImageOpacity = useTransform(smoothProgress, [0, 0.15], [0.3, 0.08]);

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (shouldReduceMotion) {
    return <ReducedMotionHero />;
  }

  return (
    <div ref={containerRef} className="relative" style={{ height: '500vh' }}>
      {/* Sticky viewport */}
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        {/* Background layer */}
        <div className="absolute inset-0 bg-neutral-950">
          {/* Base background image */}
          <motion.div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=2070')`,
              opacity: bgImageOpacity,
            }}
          />

          {/* Warm lighting overlay */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse at 50% 40%, rgba(180,140,60,0.15), transparent 70%)',
              opacity: lightingWarmth,
            }}
          />

          {/* Ambient glow */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse at 50% 50%, rgba(255,200,100,0.08), transparent 60%)',
              opacity: ambientGlow,
            }}
          />

          {/* Vignette */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.7) 100%)',
              opacity: vignetteIntensity,
            }}
          />

          {/* Dark gradient base */}
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/80 via-transparent to-neutral-950/90" />
        </div>

        {/* Floating particles */}
        <CinematicParticles progress={smoothProgress} />

        {/* Hero text (Phase 1) */}
        <motion.div
          className="absolute inset-0 z-20 flex items-center justify-center"
          style={{ opacity: heroTextOpacity, y: heroTextY, scale: heroTextScale }}
        >
          <div className="mx-auto max-w-4xl px-4 text-center">
            <motion.p
              className="mb-4 text-sm font-medium tracking-[0.25em] uppercase text-white/60"
              initial={{ opacity: 0, y: 20 }}
              animate={isReady ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
            >
              Premium Handcrafted Furniture
            </motion.p>

            <motion.h1
              className="font-display text-5xl font-normal leading-[1.02] tracking-[-0.02em] text-white sm:text-7xl lg:text-8xl"
              initial={{ opacity: 0, y: 30 }}
              animate={isReady ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
            >
              Crafted for
              <br />
              <span className="lux-shimmer italic">lasting beauty</span>
            </motion.h1>

            <motion.p
              className="mx-auto mt-6 max-w-xl text-lg text-white/50"
              initial={{ opacity: 0, y: 20 }}
              animate={isReady ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
            >
              Each piece is thoughtfully designed with premium materials,
              blending timeless elegance with modern comfort.
            </motion.p>

            <motion.div
              className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={isReady ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
            >
              <Link
                href="/products"
                className="inline-flex h-12 items-center justify-center rounded-full bg-white px-8 text-sm font-semibold text-neutral-900 transition-all hover:bg-white/90 active:scale-95"
              >
                Explore Collection
              </Link>
              <Link
                href="/about"
                className="inline-flex h-12 items-center justify-center rounded-full border border-white/30 px-8 text-sm font-medium text-white transition-all hover:bg-white/10 active:scale-95"
              >
                Our Story
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2"
          style={{ opacity: scrollIndicatorOpacity }}
        >
          <motion.div
            className="flex flex-col items-center gap-2 text-white/40"
            initial={{ opacity: 0 }}
            animate={isReady ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <span className="text-xs tracking-[0.2em] uppercase">Scroll to Explore</span>
            <motion.svg
              width="16" height="24" viewBox="0 0 16 24" fill="none" stroke="currentColor" strokeWidth="1.5"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <rect x="1" y="1" width="14" height="22" rx="7" />
              <motion.circle
                cx="8" cy="8" r="2" fill="currentColor"
                animate={{ cy: [6, 14, 6] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
            </motion.svg>
          </motion.div>
        </motion.div>

        {/* SVG Assembly Container (Phases 2-4) */}
        <motion.div
          className="absolute inset-0 z-10 flex items-center justify-center"
          style={{
            scale: cameraScale,
            rotateY: cameraRotateY,
            x: cameraX,
            y: cameraTranslateY,
            perspective: 1200,
            transformStyle: 'preserve-3d',
          }}
        >
          <svg
            viewBox="0 0 500 500"
            className="h-auto w-full max-w-2xl px-4 drop-shadow-2xl"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <pattern id="woodGrain" width="6" height="6" patternUnits="userSpaceOnUse">
                <line x1="0" y1="3" x2="6" y2="3" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
              </pattern>
              <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="rgba(0,0,0,0.3)" />
              </filter>
            </defs>
            <g filter="url(#softShadow)">
              <BedAssemblySVG progress={smoothProgress} />
            </g>
          </svg>
        </motion.div>

        {/* Final CTA overlay (Phase 5) */}
        <motion.div
          className="absolute inset-0 z-30 flex items-end justify-center pb-24"
          style={{ opacity: ctaOpacity, y: ctaY }}
        >
          <div className="text-center">
            <p className="mb-2 text-sm font-medium tracking-[0.2em] uppercase text-lux-gold/80">
              Handcrafted perfection
            </p>
            <h2 className="mb-6 font-display text-3xl font-normal tracking-[-0.01em] text-white sm:text-5xl">
              Your dream bedroom awaits
            </h2>
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/products"
                className="inline-flex h-12 items-center justify-center rounded-full bg-lux-gold px-8 text-sm font-medium uppercase tracking-[0.12em] text-lux-ink transition-all hover:bg-lux-gold-dark hover:text-lux-soft active:scale-95"
              >
                Shop the Collection
              </Link>
              <Link
                href="/about"
                className="inline-flex h-12 items-center justify-center rounded-full border border-white/25 px-8 text-sm font-medium text-white/80 transition-all hover:bg-white/10 active:scale-95"
              >
                Our Craftsmanship
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Progress bar */}
        <motion.div
          className="absolute bottom-0 left-0 z-40 h-[2px] bg-gradient-to-r from-amber-500/60 to-amber-300/60"
          style={{ width: progressWidth, opacity: progressOpacity }}
        />

        {/* Phase label */}
        <motion.div
          className="absolute bottom-6 left-1/2 z-40 -translate-x-1/2 text-center"
          style={{ opacity: progressOpacity }}
        >
          <PhaseLabel progress={smoothProgress} />
        </motion.div>
      </div>
    </div>
  );
}

function PhaseLabel({ progress }: { progress: ReturnType<typeof useSpring> }) {
  const [label, setLabel] = useState('');

  useMotionValueEvent(progress, 'change', (v) => {
    if (v < 0.12) setLabel('');
    else if (v < 0.2) setLabel('Premium Timber');
    else if (v < 0.32) setLabel('Frame Assembly');
    else if (v < 0.42) setLabel('Attaching Legs');
    else if (v < 0.52) setLabel('Raising the Headboard');
    else if (v < 0.62) setLabel('Placing the Mattress');
    else if (v < 0.72) setLabel('Arranging Pillows');
    else if (v < 0.82) setLabel('Finishing Touches');
    else setLabel('');
  });

  return (
    <p className="text-xs font-medium tracking-[0.15em] uppercase text-white/40">
      {label}
    </p>
  );
}

function ReducedMotionHero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-neutral-950">
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=2070')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/80 via-transparent to-neutral-950/90" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
        <p className="mb-4 text-sm font-medium tracking-[0.25em] uppercase text-white/60">
          Premium Handcrafted Furniture
        </p>
        <h1 className="font-display text-5xl font-normal leading-[1.02] tracking-[-0.02em] text-white sm:text-7xl lg:text-8xl">
          Crafted for
          <br />
          <span className="lux-shimmer italic">lasting beauty</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-white/50">
          Each piece is thoughtfully designed with premium materials,
          blending timeless elegance with modern comfort.
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/products"
            className="inline-flex h-12 items-center justify-center rounded-full bg-white px-8 text-sm font-semibold text-neutral-900 transition-all hover:bg-white/90 active:scale-95"
          >
            Explore Collection
          </Link>
          <Link
            href="/about"
            className="inline-flex h-12 items-center justify-center rounded-full border border-white/30 px-8 text-sm font-medium text-white transition-all hover:bg-white/10 active:scale-95"
          >
            Our Story
          </Link>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40">
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs tracking-[0.2em] uppercase">Scroll</span>
          <svg width="16" height="24" viewBox="0 0 16 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="1" y="1" width="14" height="22" rx="7" />
            <circle cx="8" cy="8" r="2" fill="currentColor" />
          </svg>
        </div>
      </div>
    </section>
  );
}
