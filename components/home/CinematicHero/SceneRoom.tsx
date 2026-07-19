'use client';

import { type MotionValue, motion, useTransform } from 'framer-motion';

interface SceneRoomProps {
  progress: MotionValue<number>;
}

export function SceneRoom({ progress }: SceneRoomProps) {
  const sceneOpacity = useTransform(progress, [0.68, 0.74, 0.88, 0.94], [0, 1, 1, 0.3]);

  // Room elements fade in progressively
  const wallOpacity = useTransform(progress, [0.7, 0.76], [0, 1]);
  const floorOpacity = useTransform(progress, [0.72, 0.78], [0, 1]);
  const windowOpacity = useTransform(progress, [0.74, 0.8], [0, 1]);
  const lightRayOpacity = useTransform(progress, [0.76, 0.82], [0, 0.6]);
  const plantOpacity = useTransform(progress, [0.78, 0.84], [0, 1]);
  const curtainOpacity = useTransform(progress, [0.8, 0.86], [0, 1]);
  const decorOpacity = useTransform(progress, [0.82, 0.88], [0, 1]);

  // Camera pulls back to reveal room
  const cameraScale = useTransform(progress, [0.7, 0.88], [1.1, 0.85]);
  const cameraY = useTransform(progress, [0.7, 0.88], [-20, 10]);

  // Sunlight intensity
  const sunlightIntensity = useTransform(progress, [0.76, 0.88], [0, 0.4]);

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center overflow-hidden"
      style={{ opacity: sceneOpacity }}
    >
      {/* Camera wrapper */}
      <motion.div
        className="relative h-full w-full"
        style={{
          scale: cameraScale,
          y: cameraY,
        }}
      >
        {/* === WALLS === */}
        <motion.div
          className="absolute inset-0"
          style={{ opacity: wallOpacity }}
        >
          {/* Back wall */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(180deg, #2C2824 0%, #352F2A 40%, #3A332E 100%)',
            }}
          />
          {/* Wall texture */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `repeating-linear-gradient(
                90deg,
                transparent,
                transparent 200px,
                rgba(255,255,255,0.015) 200px,
                rgba(255,255,255,0.015) 201px
              )`,
            }}
          />
          {/* Crown molding */}
          <div
            className="absolute top-[8%] left-0 right-0 h-[3px]"
            style={{
              background: 'linear-gradient(90deg, rgba(180,150,100,0.15), rgba(180,150,100,0.25), rgba(180,150,100,0.15))',
            }}
          />
          {/* Baseboard */}
          <div
            className="absolute bottom-[18%] left-0 right-0 h-[6px]"
            style={{
              background: 'linear-gradient(180deg, #4A3F35, #3A332E)',
            }}
          />
        </motion.div>

        {/* === FLOOR === */}
        <motion.div
          className="absolute bottom-0 left-0 right-0"
          style={{
            opacity: floorOpacity,
            height: '25%',
            background: 'linear-gradient(180deg, #3A2F25 0%, #2E2520 100%)',
          }}
        >
          {/* Wood floor planks */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `repeating-linear-gradient(
                90deg,
                transparent,
                transparent 80px,
                rgba(255,255,255,0.02) 80px,
                rgba(255,255,255,0.02) 81px
              )`,
            }}
          />
          {/* Floor reflection */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(180deg, rgba(255,220,150,0.04) 0%, transparent 40%)',
            }}
          />
        </motion.div>

        {/* === WINDOW === */}
        <motion.div
          className="absolute"
          style={{
            opacity: windowOpacity,
            right: '8%',
            top: '12%',
            width: '22%',
            height: '55%',
          }}
        >
          {/* Window frame */}
          <div
            className="absolute inset-0 rounded-sm border-2"
            style={{ borderColor: 'rgba(120,100,70,0.4)' }}
          />
          {/* Window cross */}
          <div className="absolute left-1/2 top-0 h-full w-[2px] -translate-x-1/2" style={{ background: 'rgba(120,100,70,0.3)' }} />
          <div className="absolute top-1/2 left-0 w-full h-[2px] -translate-y-1/2" style={{ background: 'rgba(120,100,70,0.3)' }} />
          {/* Sky through window */}
          <div
            className="absolute inset-[2px]"
            style={{
              background: 'linear-gradient(180deg, #87CEEB 0%, #B8D4E8 40%, #E8DCC8 100%)',
              opacity: 0.6,
            }}
          />
          {/* Window sill */}
          <div
            className="absolute -bottom-2 -left-3 -right-3 h-3 rounded-sm"
            style={{ background: 'rgba(120,100,70,0.5)' }}
          />
        </motion.div>

        {/* === LIGHT RAYS FROM WINDOW === */}
        <motion.div
          className="absolute pointer-events-none"
          style={{
            opacity: lightRayOpacity,
            right: '5%',
            top: '10%',
            width: '40%',
            height: '80%',
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(215deg, rgba(255,220,150,0.12) 0%, rgba(255,200,100,0.04) 40%, transparent 70%)',
            }}
          />
          {/* Dust in light */}
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={`light-dust-${i}`}
              className="absolute rounded-full"
              style={{
                left: `${20 + (i * 17) % 60}%`,
                top: `${10 + (i * 23) % 70}%`,
                width: 2,
                height: 2,
                background: 'rgba(255,220,150,0.4)',
              }}
              animate={{
                y: [0, -10, 5, -5, 0],
                x: [0, 5, -3, 2, 0],
                opacity: [0.2, 0.5, 0.3, 0.4, 0.2],
              }}
              transition={{
                duration: 4 + i * 0.5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.3,
              }}
            />
          ))}
        </motion.div>

        {/* === SUNLIGHT OVERLAY === */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 80% 30%, rgba(255,220,150,0.08) 0%, transparent 50%)',
            opacity: sunlightIntensity,
          }}
        />

        {/* === PLANT === */}
        <motion.div
          className="absolute"
          style={{
            opacity: plantOpacity,
            left: '6%',
            bottom: '20%',
          }}
        >
          <svg width="60" height="100" viewBox="0 0 60 100">
            {/* Pot */}
            <path d="M18 70 L15 95 L45 95 L42 70 Z" fill="#6B4226" />
            <rect x="14" y="67" width="32" height="5" rx="2" fill="#7A5230" />
            {/* Leaves */}
            {[
              { d: 'M30 67 Q15 50 10 35 Q20 40 30 55', fill: '#2D5016' },
              { d: 'M30 67 Q45 45 50 30 Q40 38 30 55', fill: '#3A6B1E' },
              { d: 'M30 67 Q20 40 25 20 Q30 35 30 55', fill: '#2D5016' },
              { d: 'M30 67 Q40 42 35 25 Q30 38 30 55', fill: '#4A7A28' },
              { d: 'M30 67 Q10 55 5 45 Q18 48 30 60', fill: '#3A6B1E' },
            ].map((leaf, i) => (
              <motion.path
                key={`leaf-${i}`}
                d={leaf.d}
                fill={leaf.fill}
                animate={{
                  d: [
                    leaf.d,
                    leaf.d.replace(/Q(\d+)/g, (_, n) => `Q${parseInt(n) + (i % 2 === 0 ? 2 : -2)}`),
                    leaf.d,
                  ],
                }}
                transition={{
                  duration: 3 + i * 0.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </svg>
        </motion.div>

        {/* === CURTAIN === */}
        <motion.div
          className="absolute"
          style={{
            opacity: curtainOpacity,
            right: '5%',
            top: '10%',
            width: '8%',
            height: '60%',
          }}
        >
          <svg width="100%" height="100%" viewBox="0 0 40 200" preserveAspectRatio="none">
            <path
              d="M5 0 Q0 50 8 100 Q0 150 5 200 L35 200 Q30 150 38 100 Q30 50 35 0 Z"
              fill="rgba(180,160,130,0.3)"
            />
            <path
              d="M10 0 Q5 50 12 100 Q5 150 10 200"
              stroke="rgba(180,160,130,0.15)"
              strokeWidth="1"
              fill="none"
            />
            <path
              d="M25 0 Q20 50 27 100 Q20 150 25 200"
              stroke="rgba(180,160,130,0.1)"
              strokeWidth="1"
              fill="none"
            />
          </svg>
        </motion.div>

        {/* === DECORATIVE ELEMENTS === */}
        <motion.g style={{ opacity: decorOpacity }}>
          {/* Nightstand left */}
          <div
            className="absolute"
            style={{
              left: '12%',
              bottom: '18%',
              width: '10%',
              height: '14%',
              background: 'linear-gradient(180deg, #5C3A21, #4A2F1A)',
              borderRadius: 4,
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            }}
          >
            {/* Lamp */}
            <div
              className="absolute -top-8 left-1/2 -translate-x-1/2"
              style={{
                width: 4,
                height: 24,
                background: 'linear-gradient(180deg, #C4A44A, #8B6830)',
                borderRadius: 2,
              }}
            />
            <div
              className="absolute -top-14 left-1/2 -translate-x-1/2"
              style={{
                width: 24,
                height: 16,
                background: 'rgba(200,180,140,0.4)',
                borderRadius: '50% 50% 0 0',
              }}
            />
            {/* Lamp glow */}
            <div
              className="absolute -top-20 left-1/2 -translate-x-1/2"
              style={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(255,220,150,0.15) 0%, transparent 70%)',
              }}
            />
          </div>

          {/* Rug under bed */}
          <div
            className="absolute"
            style={{
              left: '15%',
              bottom: '12%',
              width: '70%',
              height: '8%',
              background: 'linear-gradient(90deg, rgba(140,100,60,0.2), rgba(160,120,70,0.25), rgba(140,100,60,0.2))',
              borderRadius: 4,
            }}
          />
        </motion.g>
      </motion.div>
    </motion.div>
  );
}
