'use client';

import { type MotionValue, motion, useTransform } from 'framer-motion';

interface BedPartProps {
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
  const opacity = useTransform(progress, [range[0], range[0] + 0.03, range[1] - 0.02, range[1]], [0, 1, 1, 1]);
  const y = useTransform(progress, [range[0], range[1]], [30, 0]);
  const scale = useTransform(progress, [range[0], range[1]], [0.9, 1]);

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

export function BedAssemblySVG({ progress }: BedPartProps) {
  const assemblyOpacity = useTransform(progress, [0.12, 0.18, 0.85, 0.92], [0, 1, 1, 1]);

  return (
    <motion.g style={{ opacity: assemblyOpacity }}>
      {/* === SCATTERED WOOD PIECES (Phase 2: 12-20%) === */}
      <AnimatedPart progress={progress} range={[0.12, 0.2]}>
        <g>
          {[
            { x: 140, y: 220, w: 36, h: 7, r: -12, c: '#5C3A21' },
            { x: 310, y: 300, w: 30, h: 6, r: 18, c: '#6B4226' },
            { x: 180, y: 380, w: 34, h: 7, r: -22, c: '#5C3A21' },
            { x: 350, y: 210, w: 28, h: 5, r: 8, c: '#7A5230' },
            { x: 100, y: 330, w: 32, h: 6, r: 25, c: '#6B4226' },
            { x: 380, y: 360, w: 30, h: 7, r: -16, c: '#5C3A21' },
            { x: 240, y: 180, w: 26, h: 5, r: 4, c: '#7A5230' },
            { x: 120, y: 420, w: 34, h: 6, r: -8, c: '#6B4226' },
          ].map((p, i) => (
            <g key={`scatter-${i}`}>
              <rect
                x={p.x} y={p.y} width={p.w} height={p.h} rx={3}
                fill={p.c}
                transform={`rotate(${p.r} ${p.x + p.w / 2} ${p.y + p.h / 2})`}
              />
              <WoodGrain x={p.x} y={p.y} width={p.w} height={p.h} />
            </g>
          ))}
          {/* Floating sawdust particles */}
          {Array.from({ length: 16 }).map((_, i) => (
            <circle
              key={`dust-${i}`}
              cx={80 + (i * 23) % 340}
              cy={160 + (i * 19) % 300}
              r={0.8 + (i % 3) * 0.5}
              fill="rgba(180,150,110,0.4)"
            />
          ))}
        </g>
      </AnimatedPart>

      {/* === FRAME ASSEMBLY (Phase 3: 20-32%) === */}
      <AnimatedPart progress={progress} range={[0.2, 0.32]}>
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

          {/* Slats */}
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

      {/* === LEGS (Phase 4: 30-40%) === */}
      <AnimatedPart progress={progress} range={[0.3, 0.4]}>
        <g>
          {/* Front left leg */}
          <rect x="90" y="416" width="14" height="50" rx="3" fill="#3A2210" />
          <rect x="90" y="416" width="5" height="50" rx="1.5" fill="#4A2F1A" />
          {/* Foot detail */}
          <rect x="87" y="462" width="20" height="5" rx="2.5" fill="#2A1508" />

          {/* Front right leg */}
          <rect x="396" y="416" width="14" height="50" rx="3" fill="#3A2210" />
          <rect x="396" y="416" width="5" height="50" rx="1.5" fill="#4A2F1A" />
          <rect x="393" y="462" width="20" height="5" rx="2.5" fill="#2A1508" />

          {/* Back left leg (shorter, behind headboard) */}
          <rect x="90" y="268" width="14" height="20" rx="3" fill="#2A1508" />

          {/* Back right leg */}
          <rect x="396" y="268" width="14" height="20" rx="3" fill="#2A1508" />

          {/* Brass caps */}
          <circle cx="97" cy="420" r="3" fill="#C4A44A" opacity="0.7" />
          <circle cx="403" cy="420" r="3" fill="#C4A44A" opacity="0.7" />
          <circle cx="97" cy="420" r="1.5" fill="#D4B45A" opacity="0.5" />
          <circle cx="403" cy="420" r="1.5" fill="#D4B45A" opacity="0.5" />
        </g>
      </AnimatedPart>

      {/* === HEADBOARD (Phase 5: 38-50%) === */}
      <AnimatedPart progress={progress} range={[0.38, 0.5]}>
        <g>
          {/* Main headboard panel */}
          <rect x="66" y="100" width="30" height="186" rx="6" fill="#7A5230" />
          <rect x="66" y="100" width="30" height="186" rx="6" fill="#8B6830" opacity="0.25" />

          {/* Curved top */}
          <path d="M66 118 Q66 80 96 80 L96 100 L66 100 Z" fill="#9A7B40" />
          <path d="M66 100 Q66 74 96 74 Q96 80 96 100 Z" fill="#8B6830" />

          {/* Top finial */}
          <rect x="74" y="88" width="14" height="8" rx="4" fill="#6B4226" />

          {/* Panel detail */}
          <rect x="72" y="115" width="18" height="158" rx="5" fill="rgba(255,255,255,0.04)" />
          <rect x="75" y="120" width="12" height="148" rx="4" fill="rgba(255,255,255,0.02)" />

          {/* Brass accents */}
          <rect x="74" y="108" width="14" height="3" rx="1.5" fill="#C4A44A" opacity="0.35" />
          <rect x="74" y="272" width="14" height="3" rx="1.5" fill="#C4A44A" opacity="0.35" />

          {/* Center line detail */}
          <line x1="81" y1="95" x2="81" y2="280" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" />

          {/* Right headboard piece */}
          <rect x="404" y="100" width="30" height="186" rx="6" fill="#7A5230" />
          <rect x="404" y="100" width="30" height="186" rx="6" fill="#8B6830" opacity="0.25" />
          <path d="M404 118 Q404 80 434 80 L434 100 L404 100 Z" fill="#9A7B40" />
          <path d="M404 100 Q404 74 434 74 Q434 80 434 100 Z" fill="#8B6830" />
          <rect x="412" y="88" width="14" height="8" rx="4" fill="#6B4226" />
          <rect x="410" y="108" width="14" height="3" rx="1.5" fill="#C4A44A" opacity="0.35" />
          <rect x="410" y="272" width="14" height="3" rx="1.5" fill="#C4A44A" opacity="0.35" />
        </g>
      </AnimatedPart>

      {/* === MATTRESS (Phase 6: 48-60%) === */}
      <AnimatedPart progress={progress} range={[0.48, 0.6]}>
        <g>
          {/* Main mattress body */}
          <rect x="94" y="258" width="312" height="142" rx="10" fill="#F5F0EB" />
          <rect x="94" y="258" width="312" height="10" rx="5" fill="#EDE5D8" />

          {/* Border stitch */}
          <rect x="94" y="258" width="312" height="142" rx="10" fill="none" stroke="#E0D5C5" strokeWidth="1" />

          {/* Bottom edge */}
          <rect x="94" y="394" width="312" height="10" rx="5" fill="#E0D5C8" />
          <rect x="94" y="396" width="312" height="4" rx="2" fill="#D8CDBD" opacity="0.5" />

          {/* Quilted lines */}
          {[290, 318, 346, 374].map((y) => (
            <line key={`quilt-${y}`} x1="110" y1={y} x2="390" y2={y} stroke="#E4D9CB" strokeWidth="0.8" opacity="0.5" />
          ))}

          {/* Side piping */}
          <rect x="94" y="260" width="6" height="138" rx="3" fill="#E8DDD0" />
          <rect x="400" y="260" width="6" height="138" rx="3" fill="#E8DDD0" />

          {/* Top surface tufting dots */}
          {Array.from({ length: 8 }).map((_, i) => (
            <circle key={`tuft-${i}`} cx={108 + i * 36} cy="268" r="1.5" fill="#D8CDBD" opacity="0.6" />
          ))}

          {/* Shadow under mattress */}
          <rect x="94" y="388" width="312" height="2" rx="1" fill="#D8CDBD" opacity="0.4" />
        </g>
      </AnimatedPart>

      {/* === PILLOWS (Phase 7: 58-68%) === */}
      <AnimatedPart progress={progress} range={[0.58, 0.68]}>
        <g>
          {/* Left pillow */}
          <rect x="116" y="262" width="88" height="48" rx="16" fill="#FFF8F0" />
          <rect x="121" y="266" width="78" height="40" rx="13" fill="#FDFAF5" />
          <rect x="116" y="262" width="88" height="48" rx="16" fill="none" stroke="#F0E8DC" strokeWidth="1" />
          {/* Pillow crease */}
          <path d="M160 262 q1.5 10 0 22" stroke="#F0E8DC" strokeWidth="0.8" fill="none" />
          <path d="M160 288 q1.5 10 0 22" stroke="#F0E8DC" strokeWidth="0.8" fill="none" />
          {/* Highlight */}
          <rect x="128" y="272" width="64" height="8" rx="4" fill="rgba(255,255,255,0.35)" />

          {/* Right pillow */}
          <rect x="216" y="262" width="88" height="48" rx="16" fill="#FFF8F0" />
          <rect x="221" y="266" width="78" height="40" rx="13" fill="#FDFAF5" />
          <rect x="216" y="262" width="88" height="48" rx="16" fill="none" stroke="#F0E8DC" strokeWidth="1" />
          <path d="M260 262 q1.5 10 0 22" stroke="#F0E8DC" strokeWidth="0.8" fill="none" />
          <path d="M260 288 q1.5 10 0 22" stroke="#F0E8DC" strokeWidth="0.8" fill="none" />
          <rect x="228" y="272" width="64" height="8" rx="4" fill="rgba(255,255,255,0.35)" />
        </g>
      </AnimatedPart>

      {/* === BLANKET / THROW (Phase 8: 65-75%) === */}
      <AnimatedPart progress={progress} range={[0.65, 0.75]}>
        <g>
          {/* Draped blanket across foot of bed */}
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

          {/* Fold line */}
          <path
            d="M110 360 Q250 356 390 360"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="0.8"
            fill="none"
          />

          {/* Drape shadow */}
          <path
            d="M94 400 Q94 412 120 414 L380 414 Q406 412 406 400"
            fill="rgba(0,0,0,0.08)"
          />
        </g>
      </AnimatedPart>

      {/* === DECORATIVE ELEMENTS & FINISH (Phase 9: 73-85%) === */}
      <AnimatedPart progress={progress} range={[0.73, 0.85]}>
        <g>
          {/* Ambient glow */}
          <ellipse cx="250" cy="320" rx="170" ry="120" fill="rgba(255,215,150,0.06)" />

          {/* Sparkle accents */}
          {[
            { x: 120, y: 120 },
            { x: 380, y: 150 },
            { x: 80, y: 350 },
            { x: 420, y: 310 },
            { x: 250, y: 85 },
            { x: 150, y: 470 },
            { x: 350, y: 460 },
          ].map((s, i) => (
            <g key={`sparkle-${i}`} opacity={0.6}>
              <line x1={s.x - 5} y1={s.y} x2={s.x + 5} y2={s.y} stroke="rgba(255,215,150,0.5)" strokeWidth="1.2" strokeLinecap="round" />
              <line x1={s.x} y1={s.y - 5} x2={s.x} y2={s.y + 5} stroke="rgba(255,215,150,0.5)" strokeWidth="1.2" strokeLinecap="round" />
              <line x1={s.x - 2.5} y1={s.y - 2.5} x2={s.x + 2.5} y2={s.y + 2.5} stroke="rgba(255,215,150,0.3)" strokeWidth="0.7" strokeLinecap="round" />
              <line x1={s.x + 2.5} y1={s.y - 2.5} x2={s.x - 2.5} y2={s.y + 2.5} stroke="rgba(255,215,150,0.3)" strokeWidth="0.7" strokeLinecap="round" />
            </g>
          ))}

          {/* Floor line */}
          <line x1="60" y1="470" x2="440" y2="470" stroke="rgba(255,215,150,0.12)" strokeWidth="1" />

          {/* Shadow on floor */}
          <ellipse cx="250" cy="472" rx="160" ry="6" fill="rgba(0,0,0,0.15)" />
        </g>
      </AnimatedPart>
    </motion.g>
  );
}
