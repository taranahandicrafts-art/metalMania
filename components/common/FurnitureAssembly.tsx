'use client';

import { useRef, type ReactNode } from 'react';
import { motion, useScroll, useTransform, useSpring, type MotionValue } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface AssemblyStep {
  id: string;
  label: string;
  content: ReactNode;
  start: number;
  end: number;
}

interface FurnitureAssemblyProps {
  steps: AssemblyStep[];
  className?: string;
  defs?: ReactNode;
}

export function FurnitureAssembly({ steps, className, defs }: FurnitureAssemblyProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 25,
    restDelta: 0.001,
  });

  const activeIndex = useTransform(smoothProgress, (v) => {
    for (let i = steps.length - 1; i >= 0; i--) {
      if (v >= steps[i].start) return i;
    }
    return 0;
  });

  const label = useTransform(activeIndex, (i) => steps[i]?.label ?? '');

  return (
    <section ref={containerRef} className={cn('relative', className)}>
      <div className="sticky top-0 flex min-h-screen flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950" />

        <svg
          viewBox="0 0 500 650"
          className="relative z-10 h-auto w-full max-w-lg px-4 drop-shadow-2xl"
          preserveAspectRatio="xMidYMid meet"
        >
          {defs && <defs>{defs}</defs>}
          {steps.map((step) => (
            <PartRenderer
              key={step.id}
              progress={smoothProgress}
              start={step.start}
              end={step.end}
            >
              {step.content}
            </PartRenderer>
          ))}
        </svg>

        <div className="absolute bottom-16 z-20 text-center">
          <motion.p className="text-sm font-medium tracking-widest uppercase text-white/50">
            {label}
          </motion.p>

          <div className="mt-4 flex items-center justify-center gap-2">
            {steps.map((step, i) => (
              <StepDot
                key={step.id}
                progress={smoothProgress}
                start={step.start}
                end={step.end}
                isFirst={i === 0}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PartRenderer({
  progress,
  start,
  end,
  children,
}: {
  progress: MotionValue<number>;
  start: number;
  end: number;
  children: ReactNode;
}) {
  const opacity = useTransform(progress, [start, end], [0, 1]);
  const y = useTransform(progress, [start, end], [40, 0]);
  const scale = useTransform(progress, [start, end], [0.92, 1]);

  return (
    <motion.g style={{ opacity, y, scale, transformOrigin: 'center' }}>
      {children}
    </motion.g>
  );
}

function StepDot({
  progress,
  start,
  end,
  isFirst,
}: {
  progress: MotionValue<number>;
  start: number;
  end: number;
  isFirst: boolean;
}) {
  const width = useTransform(progress, [start, end], [8, 28]);
  const bg = useTransform(
    progress,
    [start, Math.min(end + 0.02, 1)],
    ['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.9)'],
  );

  return (
    <motion.div
      className="h-1.5 rounded-full"
      style={{ width, backgroundColor: bg }}
    />
  );
}

export function scrollOpacity(progress: MotionValue<number>, start: number, end: number) {
  const opacity = useTransform(progress, [start, end], [0, 1]);
  const y = useTransform(progress, [start, end], [30, 0]);
  return { opacity, y } as const;
}
