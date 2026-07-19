'use client';

import { type MotionValue, motion, useTransform } from 'framer-motion';

interface SceneIntroProps {
  progress: MotionValue<number>;
}

export function SceneIntro({ progress }: SceneIntroProps) {
  const opacity = useTransform(progress, [0, 0.02, 0.1, 0.14], [1, 1, 1, 0]);
  const glowOpacity = useTransform(progress, [0, 0.05, 0.12], [0.3, 0.6, 0.3]);
  const glowScale = useTransform(progress, [0, 0.12], [0.8, 1.2]);
  const textOpacity = useTransform(progress, [0.01, 0.04, 0.1, 0.14], [0, 1, 1, 0]);
  const textY = useTransform(progress, [0.01, 0.04], [20, 0]);
  const subtitleOpacity = useTransform(progress, [0.03, 0.06, 0.1, 0.14], [0, 1, 1, 0]);
  const lineWidth = useTransform(progress, [0.04, 0.08], [0, 120]);
  const lineOpacity = useTransform(progress, [0.04, 0.06, 0.1, 0.13], [0, 0.6, 0.6, 0]);
  const promptOpacity = useTransform(progress, [0.06, 0.08, 0.11, 0.13], [0, 1, 1, 0]);

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      style={{ opacity }}
    >
      {/* Central ambient glow */}
      <motion.div
        className="absolute"
        style={{
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(180,140,60,0.12) 0%, rgba(180,140,60,0.04) 40%, transparent 70%)',
          opacity: glowOpacity,
          scale: glowScale,
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center">
        {/* Brand mark */}
        <motion.div
          className="mb-8 flex justify-center"
          style={{ opacity: textOpacity, y: textY }}
        >
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <rect x="8" y="20" width="32" height="4" rx="2" fill="rgba(200,170,100,0.6)" />
            <rect x="12" y="16" width="24" height="4" rx="2" fill="rgba(200,170,100,0.4)" />
            <rect x="16" y="12" width="16" height="4" rx="2" fill="rgba(200,170,100,0.3)" />
            <rect x="10" y="24" width="2" height="12" rx="1" fill="rgba(200,170,100,0.5)" />
            <rect x="36" y="24" width="2" height="12" rx="1" fill="rgba(200,170,100,0.5)" />
          </svg>
        </motion.div>

        {/* Headline */}
        <motion.h1
          className="font-serif text-4xl font-light tracking-wide text-white/90 sm:text-5xl lg:text-6xl"
          style={{
            opacity: textOpacity,
            y: textY,
            fontFamily: '"Playfair Display", "Georgia", "Times New Roman", serif',
          }}
        >
          Where Craft Meets
          <br />
          <span className="bg-gradient-to-r from-amber-200 via-amber-300 to-amber-400 bg-clip-text text-transparent">
            Timeless Design
          </span>
        </motion.h1>

        {/* Decorative line */}
        <motion.div className="mx-auto mt-6 overflow-hidden" style={{ opacity: lineOpacity }}>
          <motion.div
            className="mx-auto h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent"
            style={{ width: lineWidth }}
          />
        </motion.div>

        {/* Subtitle */}
        <motion.p
          className="mx-auto mt-6 max-w-md text-sm font-light tracking-widest text-white/40 uppercase"
          style={{ opacity: subtitleOpacity }}
        >
          Premium Handcrafted Furniture
        </motion.p>

        {/* Scroll prompt */}
        <motion.div
          className="mt-16 flex flex-col items-center gap-3"
          style={{ opacity: promptOpacity }}
        >
          <span className="text-[10px] font-light tracking-[0.3em] text-white/30 uppercase">
            Scroll to Begin
          </span>
          <motion.div
            className="flex flex-col items-center"
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="h-8 w-px bg-gradient-to-b from-white/20 to-transparent" />
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
