'use client';

import { type MotionValue, motion, useTransform } from 'framer-motion';
import Link from 'next/link';

interface SceneRevealProps {
  progress: MotionValue<number>;
}

export function SceneReveal({ progress }: SceneRevealProps) {
  const sceneOpacity = useTransform(progress, [0.86, 0.92], [0, 1]);

  // Typography animations
  const brandOpacity = useTransform(progress, [0.88, 0.93], [0, 1]);
  const brandY = useTransform(progress, [0.88, 0.93], [30, 0]);
  const brandScale = useTransform(progress, [0.88, 0.93], [0.95, 1]);

  const taglineOpacity = useTransform(progress, [0.9, 0.95], [0, 1]);
  const taglineY = useTransform(progress, [0.9, 0.95], [20, 0]);

  const ctaOpacity = useTransform(progress, [0.92, 0.97], [0, 1]);
  const ctaY = useTransform(progress, [0.92, 0.97], [20, 0]);

  const lineWidth = useTransform(progress, [0.9, 0.95], [0, 200]);
  const lineOpacity = useTransform(progress, [0.9, 0.93], [0, 0.5]);

  // Warm ambient glow
  const ambientGlow = useTransform(progress, [0.88, 0.96], [0, 0.3]);

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      style={{ opacity: sceneOpacity }}
    >
      {/* Warm ambient glow */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(200,160,80,0.1) 0%, transparent 50%)',
          opacity: ambientGlow,
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center">
        {/* Brand name */}
        <motion.div
          style={{ opacity: brandOpacity, y: brandY, scale: brandScale }}
        >
          <h2
            className="text-5xl font-light tracking-wide text-white sm:text-6xl lg:text-7xl"
            style={{
              fontFamily: '"Playfair Display", "Georgia", "Times New Roman", serif',
            }}
          >
            Furnihaven
          </h2>
        </motion.div>

        {/* Decorative line */}
        <motion.div className="mx-auto mt-6 overflow-hidden" style={{ opacity: lineOpacity }}>
          <motion.div
            className="mx-auto h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent"
            style={{ width: lineWidth }}
          />
        </motion.div>

        {/* Tagline */}
        <motion.p
          className="mx-auto mt-6 max-w-lg text-lg font-light leading-relaxed text-white/50"
          style={{ opacity: taglineOpacity, y: taglineY }}
        >
          Where every piece tells a story of timeless craftsmanship
          <br />
          and enduring elegance.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          style={{ opacity: ctaOpacity, y: ctaY }}
        >
          <Link
            href="/products"
            className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-10 text-sm font-semibold tracking-wide text-neutral-900 shadow-lg shadow-amber-500/20 transition-all hover:shadow-xl hover:shadow-amber-500/30 active:scale-[0.98]"
          >
            <span className="relative z-10">Explore Collection</span>
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-500 opacity-0 transition-opacity group-hover:opacity-100" />
          </Link>
          <Link
            href="/about"
            className="inline-flex h-14 items-center justify-center rounded-full border border-white/20 px-10 text-sm font-medium tracking-wide text-white/70 transition-all hover:border-white/40 hover:bg-white/5 hover:text-white active:scale-[0.98]"
          >
            Our Craftsmanship
          </Link>
        </motion.div>

        {/* Subtle bottom text */}
        <motion.p
          className="mt-12 text-[10px] font-light tracking-[0.4em] text-white/20 uppercase"
          style={{ opacity: useTransform(progress, [0.94, 0.98], [0, 1]) }}
        >
          Scroll to discover more
        </motion.p>
      </div>
    </motion.div>
  );
}
