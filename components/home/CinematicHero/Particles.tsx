'use client';

import { type MotionValue, motion, useTransform } from 'framer-motion';

interface Particle {
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  driftX: number;
  driftY: number;
  opacity: number;
}

const DUST_PARTICLES: Particle[] = Array.from({ length: 40 }, (_, i) => ({
  x: (i * 37 + 13) % 100,
  y: (i * 53 + 7) % 100,
  size: 1 + (i % 5) * 0.6,
  delay: (i * 0.4) % 6,
  duration: 5 + (i % 4) * 2,
  driftX: -20 + (i % 7) * 7,
  driftY: -15 + (i % 5) * 6,
  opacity: 0.15 + (i % 4) * 0.1,
}));

const ORB_PARTICLES: Particle[] = Array.from({ length: 12 }, (_, i) => ({
  x: 10 + (i * 29) % 80,
  y: 15 + (i * 43) % 70,
  size: 3 + (i % 3) * 2,
  delay: (i * 1.2) % 8,
  duration: 8 + (i % 3) * 3,
  driftX: -10 + (i % 4) * 6,
  driftY: -8 + (i % 3) * 5,
  opacity: 0.08 + (i % 3) * 0.04,
}));

function DustMotes({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0.02, 0.1, 0.85, 0.95], [0, 0.7, 0.7, 0]);

  return (
    <motion.div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ opacity }}>
      {DUST_PARTICLES.map((p, i) => (
        <motion.div
          key={`dust-${i}`}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: `rgba(200,170,100,${p.opacity})`,
            boxShadow: `0 0 ${p.size * 4}px rgba(200,170,100,${p.opacity * 0.5})`,
          }}
          animate={{
            x: [0, p.driftX, -p.driftX * 0.6, p.driftX * 0.3, 0],
            y: [0, p.driftY, -p.driftY * 0.8, p.driftY * 0.4, 0],
            opacity: [p.opacity * 0.5, p.opacity, p.opacity * 0.7, p.opacity * 0.9, p.opacity * 0.5],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </motion.div>
  );
}

function FloatingOrbs({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0.1, 0.2, 0.8, 0.92], [0, 0.5, 0.5, 0]);

  return (
    <motion.div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ opacity }}>
      {ORB_PARTICLES.map((p, i) => (
        <motion.div
          key={`orb-${i}`}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: `radial-gradient(circle, rgba(212,180,90,${p.opacity}) 0%, transparent 70%)`,
          }}
          animate={{
            x: [0, p.driftX, -p.driftX, 0],
            y: [0, p.driftY, -p.driftY, 0],
            scale: [1, 1.3, 0.9, 1],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </motion.div>
  );
}

function LightRays({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0.3, 0.45, 0.75, 0.88], [0, 0.12, 0.15, 0]);
  const rotate = useTransform(progress, [0.3, 0.88], [-5, 5]);

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ opacity, rotate }}
    >
      {[0, 1, 2].map((i) => (
        <div
          key={`ray-${i}`}
          className="absolute"
          style={{
            left: `${30 + i * 15}%`,
            top: '-20%',
            width: '2px',
            height: '140%',
            background: `linear-gradient(180deg, transparent 0%, rgba(255,220,150,0.06) 30%, rgba(255,220,150,0.02) 70%, transparent 100%)`,
            transform: `rotate(${15 + i * 12}deg)`,
            filter: 'blur(8px)',
          }}
        />
      ))}
    </motion.div>
  );
}

export function CinematicParticles({ progress }: { progress: MotionValue<number> }) {
  return (
    <>
      <DustMotes progress={progress} />
      <FloatingOrbs progress={progress} />
      <LightRays progress={progress} />
    </>
  );
}
