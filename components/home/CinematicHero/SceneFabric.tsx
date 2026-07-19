'use client';

import { type MotionValue, motion, useTransform } from 'framer-motion';

interface SceneFabricProps {
  progress: MotionValue<number>;
}

export function SceneFabric({ progress }: SceneFabricProps) {
  const sceneOpacity = useTransform(progress, [0.54, 0.6, 0.72, 0.78], [0, 1, 1, 0]);
  const cameraScale = useTransform(progress, [0.56, 0.68], [1, 1.06]);
  const warmLight = useTransform(progress, [0.58, 0.72], [0, 0.5]);

  // Mattress
  const mattressOpacity = useTransform(progress, [0.56, 0.6], [0, 1]);
  const mattressY = useTransform(progress, [0.56, 0.6], [-30, 0]);
  const mattressScale = useTransform(progress, [0.56, 0.59, 0.61], [0.95, 1.02, 1]);

  // Pillows
  const pillowOpacity = useTransform(progress, [0.62, 0.66], [0, 1]);
  const pillow1Y = useTransform(progress, [0.62, 0.65, 0.67], [-40, 5, 0]);
  const pillow2Y = useTransform(progress, [0.63, 0.66, 0.68], [-35, 3, 0]);

  // Blanket
  const blanketOpacity = useTransform(progress, [0.66, 0.7], [0, 1]);
  const blanketY = useTransform(progress, [0.66, 0.7], [-20, 0]);

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      style={{ opacity: sceneOpacity }}
    >
      {/* Warm lighting transition */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 45%, rgba(200,160,80,0.12) 0%, transparent 55%)',
          opacity: warmLight,
        }}
      />

      {/* SVG Bed with fabric */}
      <motion.svg
        viewBox="0 0 500 500"
        className="relative z-10 h-auto w-full max-w-2xl px-4"
        preserveAspectRatio="xMidYMid meet"
        style={{ scale: cameraScale }}
      >
        <defs>
          <filter id="fabricShadow" x="-10%" y="-10%" width="120%" height="130%">
            <feDropShadow dx="0" dy="3" stdDeviation="6" floodColor="rgba(0,0,0,0.2)" />
          </filter>
        </defs>

        <g filter="url(#fabricShadow)">
          {/* Frame (static, from previous scene) */}
          <rect x="80" y="400" width="340" height="18" rx="3" fill="#5C3A21" />
          <rect x="80" y="280" width="340" height="14" rx="3" fill="#6B4226" />
          <rect x="80" y="286" width="14" height="120" rx="3" fill="#5C3A21" />
          <rect x="406" y="286" width="14" height="120" rx="3" fill="#5C3A21" />
          <rect x="90" y="416" width="14" height="50" rx="3" fill="#3A2210" />
          <rect x="396" y="416" width="14" height="50" rx="3" fill="#3A2210" />
          <rect x="87" y="462" width="20" height="5" rx="2.5" fill="#2A1508" />
          <rect x="393" y="462" width="20" height="5" rx="2.5" fill="#2A1508" />
          <circle cx="97" cy="420" r="3" fill="#C4A44A" opacity="0.7" />
          <circle cx="403" cy="420" r="3" fill="#C4A44A" opacity="0.7" />

          {/* Headboard */}
          <rect x="66" y="100" width="30" height="186" rx="6" fill="#7A5230" />
          <path d="M66 118 Q66 80 96 80 L96 100 L66 100 Z" fill="#9A7B40" />
          <rect x="404" y="100" width="30" height="186" rx="6" fill="#7A5230" />
          <path d="M404 118 Q404 80 434 80 L434 100 L404 100 Z" fill="#9A7B40" />

          {/* === MATTRESS === */}
          <motion.g style={{ opacity: mattressOpacity, y: mattressY, scale: mattressScale, transformOrigin: '250 320' }}>
            <rect x="94" y="258" width="312" height="142" rx="10" fill="#F5F0EB" />
            <rect x="94" y="258" width="312" height="10" rx="5" fill="#EDE5D8" />
            <rect x="94" y="258" width="312" height="142" rx="10" fill="none" stroke="#E0D5C5" strokeWidth="1" />
            <rect x="94" y="394" width="312" height="10" rx="5" fill="#E0D5C8" />
            {[290, 318, 346, 374].map((y) => (
              <line key={`quilt-${y}`} x1="110" y1={y} x2="390" y2={y} stroke="#E4D9CB" strokeWidth="0.8" opacity="0.5" />
            ))}
            <rect x="94" y="260" width="6" height="138" rx="3" fill="#E8DDD0" />
            <rect x="400" y="260" width="6" height="138" rx="3" fill="#E8DDD0" />
            {Array.from({ length: 8 }).map((_, i) => (
              <circle key={`tuft-${i}`} cx={108 + i * 36} cy="268" r="1.5" fill="#D8CDBD" opacity="0.6" />
            ))}
          </motion.g>

          {/* === PILLOWS === */}
          <motion.g style={{ opacity: pillowOpacity }}>
            {/* Left pillow */}
            <motion.g style={{ y: pillow1Y }}>
              <rect x="116" y="262" width="88" height="48" rx="16" fill="#FFF8F0" />
              <rect x="121" y="266" width="78" height="40" rx="13" fill="#FDFAF5" />
              <rect x="116" y="262" width="88" height="48" rx="16" fill="none" stroke="#F0E8DC" strokeWidth="1" />
              <path d="M160 262 q1.5 10 0 22" stroke="#F0E8DC" strokeWidth="0.8" fill="none" />
              <rect x="128" y="272" width="64" height="8" rx="4" fill="rgba(255,255,255,0.35)" />
            </motion.g>

            {/* Right pillow */}
            <motion.g style={{ y: pillow2Y }}>
              <rect x="216" y="262" width="88" height="48" rx="16" fill="#FFF8F0" />
              <rect x="221" y="266" width="78" height="40" rx="13" fill="#FDFAF5" />
              <rect x="216" y="262" width="88" height="48" rx="16" fill="none" stroke="#F0E8DC" strokeWidth="1" />
              <path d="M260 262 q1.5 10 0 22" stroke="#F0E8DC" strokeWidth="0.8" fill="none" />
              <rect x="228" y="272" width="64" height="8" rx="4" fill="rgba(255,255,255,0.35)" />
            </motion.g>
          </motion.g>

          {/* === BLANKET === */}
          <motion.g style={{ opacity: blanketOpacity, y: blanketY }}>
            <path
              d="M94 370 Q94 350 120 348 L380 348 Q406 350 406 370 L406 400 Q406 410 380 412 L120 412 Q94 410 94 400 Z"
              fill="#8B6830"
              opacity="0.85"
            />
            <path
              d="M94 370 Q94 350 120 348 L380 348 Q406 350 406 370 L406 375 Q406 358 380 356 L120 356 Q94 358 94 375 Z"
              fill="#9A7B40"
              opacity="0.6"
            />
            <path d="M110 360 Q250 356 390 360" stroke="rgba(255,255,255,0.1)" strokeWidth="0.8" fill="none" />
            <path d="M94 400 Q94 412 120 414 L380 414 Q406 412 406 400" fill="rgba(0,0,0,0.08)" />
          </motion.g>

          {/* Floor shadow */}
          <ellipse cx="250" cy="472" rx="160" ry="6" fill="rgba(0,0,0,0.12)" />
        </g>
      </motion.svg>
    </motion.div>
  );
}
