'use client';

import { type MotionValue, motion, useTransform } from 'framer-motion';

interface SceneAssemblyProps {
  progress: MotionValue<number>;
}

function AnimatedPart({
  progress,
  range,
  children,
}: {
  progress: MotionValue<number>;
  range: [number, number];
  children: React.ReactNode;
}) {
  const opacity = useTransform(progress, [range[0], range[0] + 0.02, range[1] - 0.01, range[1]], [0, 1, 1, 1]);
  const y = useTransform(progress, [range[0], range[1]], [25, 0]);
  const scale = useTransform(progress, [range[0], range[1]], [0.92, 1]);

  return (
    <motion.g style={{ opacity, y, scale, transformOrigin: 'center' }}>
      {children}
    </motion.g>
  );
}

function WoodGrain({ x, y, width, height }: { x: number; y: number; width: number; height: number }) {
  return (
    <>
      <rect x={x + 3} y={y + 1} width={width - 8} height={height - 2} rx={1} fill="rgba(255,255,255,0.05)" />
      <line x1={x + 5} y1={y + height * 0.3} x2={x + width - 5} y2={y + height * 0.3} stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
      <line x1={x + 5} y1={y + height * 0.6} x2={x + width - 5} y2={y + height * 0.6} stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
    </>
  );
}

export function SceneAssembly({ progress }: SceneAssemblyProps) {
  const sceneOpacity = useTransform(progress, [0.32, 0.38, 0.58, 0.64], [0, 1, 1, 0]);
  const cameraScale = useTransform(progress, [0.35, 0.5, 0.62], [0.95, 1.08, 1.02]);

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      style={{ opacity: sceneOpacity }}
    >
      {/* Assembly glow */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 55%, rgba(160,120,40,0.08) 0%, transparent 50%)',
          opacity: useTransform(progress, [0.35, 0.5], [0, 0.6]),
        }}
      />

      {/* SVG Assembly */}
      <motion.svg
        viewBox="0 0 500 500"
        className="relative z-10 h-auto w-full max-w-2xl px-4 drop-shadow-2xl"
        preserveAspectRatio="xMidYMid meet"
        style={{ scale: cameraScale }}
      >
        <defs>
          <filter id="asmSoftShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="rgba(0,0,0,0.25)" />
          </filter>
        </defs>

        <g filter="url(#asmSoftShadow)">
          {/* === FRAME RAILS (35-42%) === */}
          <AnimatedPart progress={progress} range={[0.35, 0.42]}>
            <g>
              {/* Bottom rail */}
              <rect x="80" y="400" width="340" height="18" rx="3" fill="#5C3A21" />
              <rect x="80" y="400" width="340" height="5" rx="2" fill="#6B4226" />
              <WoodGrain x={80} y={400} width={340} height={18} />

              {/* Top rail */}
              <rect x="80" y="280" width="340" height="14" rx="3" fill="#6B4226" />
              <WoodGrain x={80} y={280} width={340} height={14} />

              {/* Left side rail */}
              <rect x="80" y="286" width="14" height="120" rx="3" fill="#5C3A21" />
              <rect x="80" y="286" width="5" height="120" rx="2" fill="#6B4226" />

              {/* Right side rail */}
              <rect x="406" y="286" width="14" height="120" rx="3" fill="#5C3A21" />
              <rect x="415" y="286" width="5" height="120" rx="2" fill="#4A2F1A" />
            </g>
          </AnimatedPart>

          {/* === SLATS (40-46%) === */}
          <AnimatedPart progress={progress} range={[0.4, 0.46]}>
            <g>
              {[320, 340, 360, 380].map((y) => (
                <g key={`slat-${y}`}>
                  <rect x="94" y={y} width="312" height="5" rx="2" fill="#4A2F1A" />
                  <line x1="100" y1={y + 2.5} x2="400" y2={y + 2.5} stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                </g>
              ))}
              {/* Center support beam */}
              <rect x="240" y="290" width="8" height="105" rx="2" fill="#3A2210" />
            </g>
          </AnimatedPart>

          {/* === LEGS (44-50%) === */}
          <AnimatedPart progress={progress} range={[0.44, 0.5]}>
            <g>
              {/* Front left leg */}
              <rect x="90" y="416" width="14" height="50" rx="3" fill="#3A2210" />
              <rect x="90" y="416" width="5" height="50" rx="1.5" fill="#4A2F1A" />
              <rect x="87" y="462" width="20" height="5" rx="2.5" fill="#2A1508" />

              {/* Front right leg */}
              <rect x="396" y="416" width="14" height="50" rx="3" fill="#3A2210" />
              <rect x="396" y="416" width="5" height="50" rx="1.5" fill="#4A2F1A" />
              <rect x="393" y="462" width="20" height="5" rx="2.5" fill="#2A1508" />

              {/* Back legs */}
              <rect x="90" y="268" width="14" height="20" rx="3" fill="#2A1508" />
              <rect x="396" y="268" width="14" height="20" rx="3" fill="#2A1508" />

              {/* Brass caps */}
              <circle cx="97" cy="420" r="3" fill="#C4A44A" opacity="0.7" />
              <circle cx="403" cy="420" r="3" fill="#C4A44A" opacity="0.7" />
              <circle cx="97" cy="420" r="1.5" fill="#D4B45A" opacity="0.5" />
              <circle cx="403" cy="420" r="1.5" fill="#D4B45A" opacity="0.5" />
            </g>
          </AnimatedPart>

          {/* === HEADBOARD (48-56%) === */}
          <AnimatedPart progress={progress} range={[0.48, 0.56]}>
            <g>
              {/* Left headboard panel */}
              <rect x="66" y="100" width="30" height="186" rx="6" fill="#7A5230" />
              <rect x="66" y="100" width="30" height="186" rx="6" fill="#8B6830" opacity="0.25" />
              <path d="M66 118 Q66 80 96 80 L96 100 L66 100 Z" fill="#9A7B40" />
              <path d="M66 100 Q66 74 96 74 Q96 80 96 100 Z" fill="#8B6830" />
              <rect x="74" y="88" width="14" height="8" rx="4" fill="#6B4226" />
              <rect x="72" y="115" width="18" height="158" rx="5" fill="rgba(255,255,255,0.04)" />
              <rect x="74" y="108" width="14" height="3" rx="1.5" fill="#C4A44A" opacity="0.35" />
              <rect x="74" y="272" width="14" height="3" rx="1.5" fill="#C4A44A" opacity="0.35" />
              <line x1="81" y1="95" x2="81" y2="280" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" />

              {/* Right headboard panel */}
              <rect x="404" y="100" width="30" height="186" rx="6" fill="#7A5230" />
              <rect x="404" y="100" width="30" height="186" rx="6" fill="#8B6830" opacity="0.25" />
              <path d="M404 118 Q404 80 434 80 L434 100 L404 100 Z" fill="#9A7B40" />
              <path d="M404 100 Q404 74 434 74 Q434 80 434 100 Z" fill="#8B6830" />
              <rect x="412" y="88" width="14" height="8" rx="4" fill="#6B4226" />
              <rect x="410" y="108" width="14" height="3" rx="1.5" fill="#C4A44A" opacity="0.35" />
              <rect x="410" y="272" width="14" height="3" rx="1.5" fill="#C4A44A" opacity="0.35" />
            </g>
          </AnimatedPart>

          {/* === SPARKLE ACCENTS (54-60%) === */}
          <AnimatedPart progress={progress} range={[0.54, 0.6]}>
            <g>
              {[
                { x: 120, y: 120 },
                { x: 380, y: 150 },
                { x: 80, y: 350 },
                { x: 420, y: 310 },
                { x: 250, y: 85 },
              ].map((s, i) => (
                <g key={`sparkle-${i}`} opacity={0.5}>
                  <line x1={s.x - 4} y1={s.y} x2={s.x + 4} y2={s.y} stroke="rgba(255,215,150,0.5)" strokeWidth="1" strokeLinecap="round" />
                  <line x1={s.x} y1={s.y - 4} x2={s.x} y2={s.y + 4} stroke="rgba(255,215,150,0.5)" strokeWidth="1" strokeLinecap="round" />
                </g>
              ))}
              {/* Floor shadow */}
              <ellipse cx="250" cy="472" rx="160" ry="6" fill="rgba(0,0,0,0.12)" />
            </g>
          </AnimatedPart>
        </g>
      </motion.svg>
    </motion.div>
  );
}
