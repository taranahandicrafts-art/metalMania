'use client';

import { type MotionValue, motion, useTransform } from 'framer-motion';

interface SceneWoodProps {
  progress: MotionValue<number>;
}

const WOOD_PLANKS = [
  { x: 15, y: 35, width: 180, height: 24, rotation: -3, color: '#6B4226', delay: 0 },
  { x: 55, y: 25, width: 160, height: 20, rotation: 2, color: '#5C3A21', delay: 0.01 },
  { x: 30, y: 55, width: 200, height: 28, rotation: -1, color: '#7A5230', delay: 0.02 },
  { x: 65, y: 50, width: 140, height: 22, rotation: 4, color: '#6B4226', delay: 0.015 },
  { x: 20, y: 70, width: 170, height: 26, rotation: -2, color: '#5C3A21', delay: 0.025 },
  { x: 50, y: 68, width: 150, height: 20, rotation: 1, color: '#8B6830', delay: 0.03 },
];

export function SceneWood({ progress }: SceneWoodProps) {
  const sceneOpacity = useTransform(progress, [0.08, 0.14, 0.22, 0.28], [0, 1, 1, 0]);
  const glowIntensity = useTransform(progress, [0.1, 0.2, 0.25], [0, 0.8, 0.4]);
  const vignetteIntensity = useTransform(progress, [0.1, 0.2, 0.28], [0.8, 0.3, 0.6]);

  return (
    <motion.div className="absolute inset-0" style={{ opacity: sceneOpacity }}>
      {/* Warm central light */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 45%, rgba(180,130,50,0.15) 0%, transparent 60%)',
          opacity: glowIntensity,
        }}
      />

      {/* Wood grain texture overlay */}
      <motion.div
        className="absolute inset-0"
        style={{
          opacity: useTransform(progress, [0.12, 0.18], [0, 0.15]),
        }}
      >
        <svg width="100%" height="100%" className="absolute inset-0">
          <defs>
            <pattern id="woodGrainFull" width="8" height="8" patternUnits="userSpaceOnUse">
              <line x1="0" y1="4" x2="8" y2="4" stroke="rgba(180,140,80,0.08)" strokeWidth="0.5" />
              <line x1="0" y1="1" x2="8" y2="1" stroke="rgba(180,140,80,0.04)" strokeWidth="0.3" />
              <line x1="0" y1="7" x2="8" y2="7" stroke="rgba(180,140,80,0.06)" strokeWidth="0.4" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#woodGrainFull)" />
        </svg>
      </motion.div>

      {/* Emerging wood planks */}
      {WOOD_PLANKS.map((plank, i) => {
        const plankProgress = useTransform(
          progress,
          [0.1 + plank.delay, 0.18 + plank.delay],
          [0, 1],
        );
        const plankOpacity = useTransform(plankProgress, [0, 0.3, 1], [0, 0.8, 1]);
        const plankY = useTransform(plankProgress, [0, 1], [30, 0]);
        const plankScale = useTransform(plankProgress, [0, 1], [0.95, 1]);

        return (
          <motion.div
            key={`plank-${i}`}
            className="absolute"
            style={{
              left: `${plank.x}%`,
              top: `${plank.y}%`,
              opacity: plankOpacity,
              y: plankY,
              scale: plankScale,
              transform: `rotate(${plank.rotation}deg)`,
            }}
          >
            <svg width={plank.width} height={plank.height} viewBox={`0 0 ${plank.width} ${plank.height}`}>
              <rect
                width={plank.width}
                height={plank.height}
                rx={4}
                fill={plank.color}
              />
              {/* Wood grain lines */}
              {Array.from({ length: 4 }).map((_, j) => (
                <line
                  key={j}
                  x1={8}
                  y1={plank.height * (0.2 + j * 0.2)}
                  x2={plank.width - 8}
                  y2={plank.height * (0.2 + j * 0.2)}
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth="0.5"
                />
              ))}
              {/* Top highlight */}
              <rect
                width={plank.width}
                height={3}
                rx={1.5}
                fill="rgba(255,255,255,0.08)"
              />
            </svg>
          </motion.div>
        );
      })}

      {/* Vignette */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 20%, rgba(0,0,0,0.6) 100%)',
          opacity: vignetteIntensity,
        }}
      />
    </motion.div>
  );
}
