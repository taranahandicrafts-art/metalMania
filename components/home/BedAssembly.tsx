'use client';

import { FurnitureAssembly, type AssemblyStep } from '@/components/common/FurnitureAssembly';

export function BedAssemblySection() {
  const steps: AssemblyStep[] = [
    {
      id: 'wood',
      label: 'Sourcing Premium Timber',
      start: 0.00,
      end: 0.14,
      content: (
        <g>
          {[
            { x: 140, y: 240, w: 36, h: 7, r: -12, c: '#5C3A21' },
            { x: 300, y: 320, w: 30, h: 6, r: 18, c: '#6B4226' },
            { x: 180, y: 400, w: 34, h: 7, r: -22, c: '#5C3A21' },
            { x: 340, y: 230, w: 28, h: 5, r: 8, c: '#7A5230' },
            { x: 110, y: 350, w: 32, h: 6, r: 25, c: '#6B4226' },
            { x: 370, y: 380, w: 30, h: 7, r: -16, c: '#5C3A21' },
            { x: 240, y: 200, w: 26, h: 5, r: 4, c: '#7A5230' },
            { x: 130, y: 440, w: 34, h: 6, r: -8, c: '#6B4226' },
            { x: 330, y: 420, w: 28, h: 5, r: 12, c: '#5C3A21' },
            { x: 270, y: 280, w: 30, h: 6, r: -4, c: '#7A5230' },
          ].map((p, i) => (
            <g key={i}>
              <rect
                x={p.x} y={p.y} width={p.w} height={p.h} rx={3}
                fill={p.c}
                transform={`rotate(${p.r} ${p.x + p.w / 2} ${p.y + p.h / 2})`}
              />
              <rect
                x={p.x + 4} y={p.y + 1.5} width={p.w - 10} height={p.h - 3} rx={1}
                fill="rgba(255,255,255,0.06)"
                transform={`rotate(${p.r} ${p.x + p.w / 2} ${p.y + p.h / 2})`}
              />
            </g>
          ))}
          {Array.from({ length: 20 }).map((_, i) => (
            <circle
              key={i}
              cx={90 + (i * 17) % 320}
              cy={180 + (i * 13) % 280}
              r={1 + (i % 3)}
              fill="rgba(180,150,110,0.35)"
            />
          ))}
        </g>
      ),
    },
    {
      id: 'frame',
      label: 'Assembling the Frame',
      start: 0.14,
      end: 0.28,
      content: (
        <g>
          <rect x="72" y="412" width="356" height="20" rx="3" fill="#5C3A21" />
          <rect x="72" y="412" width="356" height="6" rx="3" fill="#6B4226" />

          <rect x="72" y="288" width="356" height="14" rx="3" fill="#6B4226" />

          <rect x="72" y="294" width="14" height="128" rx="3" fill="#5C3A21" />
          <rect x="414" y="294" width="14" height="128" rx="3" fill="#5C3A21" />

          <rect x="72" y="294" width="6" height="128" rx="2" fill="#6B4226" />
          <rect x="422" y="294" width="6" height="128" rx="2" fill="#4A2F1A" />

          {[332, 352, 372, 392].map((y) => (
            <rect key={y} x="86" y={y} width="328" height="5" rx="2" fill="#4A2F1A" />
          ))}

          <rect x="86" y="332" width="328" height="65" fill="url(#grain)" opacity="0.3" />
        </g>
      ),
    },
    {
      id: 'legs',
      label: 'Attaching the Legs',
      start: 0.28,
      end: 0.42,
      content: (
        <g>
          <rect x="86" y="430" width="12" height="48" rx="3" fill="#3A2210" />
          <rect x="86" y="430" width="4" height="48" rx="1" fill="#4A2F1A" />

          <rect x="402" y="430" width="12" height="48" rx="3" fill="#3A2210" />
          <rect x="402" y="430" width="4" height="48" rx="1" fill="#4A2F1A" />

          <rect x="86" y="288" width="12" height="26" rx="3" fill="#2A1508" />
          <rect x="402" y="288" width="12" height="26" rx="3" fill="#2A1508" />

          <circle cx="92" cy="434" r="2.5" fill="#8B6914" opacity="0.7" />
          <circle cx="408" cy="434" r="2.5" fill="#8B6914" opacity="0.7" />

          <rect x="86" y="476" width="14" height="4" rx="2" fill="#2A1508" />
          <rect x="400" y="476" width="14" height="4" rx="2" fill="#2A1508" />
        </g>
      ),
    },
    {
      id: 'headboard',
      label: 'Raising the Headboard',
      start: 0.42,
      end: 0.57,
      content: (
        <g>
          <rect x="58" y="110" width="28" height="188" rx="5" fill="#7A5230" />
          <rect x="58" y="110" width="28" height="188" rx="5" fill="#8B6830" opacity="0.3" />

          <path d="M58 125 Q58 90 86 90 L86 110 L58 110 Z" fill="#9A7B40" />
          <path d="M58 110 Q58 85 86 85 Q86 90 86 110 Z" fill="#8B6830" />

          <rect x="63" y="100" width="18" height="6" rx="3" fill="#6B4226" />

          <rect x="65" y="125" width="14" height="160" rx="4" fill="rgba(255,255,255,0.05)" />
          <rect x="67" y="130" width="10" height="150" rx="3" fill="rgba(255,255,255,0.03)" />

          <rect x="65" y="280" width="14" height="3" rx="1.5" fill="#8B6914" opacity="0.4" />
          <rect x="65" y="120" width="14" height="3" rx="1.5" fill="#8B6914" opacity="0.4" />

          <line x1="72" y1="105" x2="72" y2="290" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        </g>
      ),
    },
    {
      id: 'mattress',
      label: 'Placing the Mattress',
      start: 0.57,
      end: 0.71,
      content: (
        <g>
          <rect x="88" y="266" width="324" height="156" rx="10" fill="#F5F0EB" />
          <rect x="88" y="266" width="324" height="10" rx="5" fill="#EDE5D8" />

          <rect x="88" y="266" width="324" height="156" rx="10" fill="none" stroke="#E0D5C5" strokeWidth="1" />

          <rect x="88" y="416" width="324" height="10" rx="5" fill="#E0D5C8" />
          <rect x="88" y="418" width="324" height="4" rx="2" fill="#D8CDBD" opacity="0.5" />

          {[302, 332, 362, 392].map((y) => (
            <line key={y} x1="105" y1={y} x2="395" y2={y} stroke="#E4D9CB" strokeWidth="0.8" opacity="0.5" />
          ))}

          <rect x="88" y="268" width="6" height="152" rx="3" fill="#E8DDD0" />
          <rect x="406" y="268" width="6" height="152" rx="3" fill="#E8DDD0" />

          {Array.from({ length: 8 }).map((_, i) => (
            <circle key={i} cx={100 + i * 38} cy="276" r="1.5" fill="#D8CDBD" opacity="0.6" />
          ))}

          <rect x="88" y="410" width="324" height="2" rx="1" fill="#D8CDBD" opacity="0.4" />
        </g>
      ),
    },
    {
      id: 'pillows',
      label: 'Arranging the Pillows',
      start: 0.71,
      end: 0.85,
      content: (
        <g>
          <rect x="110" y="270" width="90" height="50" rx="15" fill="#FFF8F0" />
          <rect x="115" y="274" width="80" height="42" rx="12" fill="#FDFAF5" />
          <rect x="110" y="270" width="90" height="50" rx="15" fill="none" stroke="#F0E8DC" strokeWidth="1" />

          <path d="M155 270 q2 10 0 20" stroke="#F0E8DC" strokeWidth="1" fill="none" />
          <path d="M155 295 q2 12 0 25" stroke="#F0E8DC" strokeWidth="1" fill="none" />

          <rect x="210" y="270" width="90" height="50" rx="15" fill="#FFF8F0" />
          <rect x="215" y="274" width="80" height="42" rx="12" fill="#FDFAF5" />
          <rect x="210" y="270" width="90" height="50" rx="15" fill="none" stroke="#F0E8DC" strokeWidth="1" />

          <path d="M255 270 q2 10 0 20" stroke="#F0E8DC" strokeWidth="1" fill="none" />
          <path d="M255 295 q2 12 0 25" stroke="#F0E8DC" strokeWidth="1" fill="none" />

          <rect x="122" y="280" width="66" height="8" rx="4" fill="rgba(255,255,255,0.4)" />
          <rect x="222" y="280" width="66" height="8" rx="4" fill="rgba(255,255,255,0.4)" />
        </g>
      ),
    },
    {
      id: 'finish',
      label: 'Your Luxury Bed is Ready',
      start: 0.85,
      end: 1.00,
      content: (
        <g>
          <ellipse cx="250" cy="340" rx="180" ry="130" fill="rgba(255,215,150,0.08)" />

          {[
            { x: 120, y: 130 },
            { x: 380, y: 160 },
            { x: 90, y: 360 },
            { x: 410, y: 320 },
            { x: 250, y: 95 },
            { x: 160, y: 480 },
            { x: 340, y: 470 },
          ].map((s, i) => (
            <g key={i}>
              <line x1={s.x - 5} y1={s.y} x2={s.x + 5} y2={s.y} stroke="rgba(255,215,150,0.5)" strokeWidth="1.5" strokeLinecap="round" />
              <line x1={s.x} y1={s.y - 5} x2={s.x} y2={s.y + 5} stroke="rgba(255,215,150,0.5)" strokeWidth="1.5" strokeLinecap="round" />
              <line x1={s.x - 2.5} y1={s.y - 2.5} x2={s.x + 2.5} y2={s.y + 2.5} stroke="rgba(255,215,150,0.3)" strokeWidth="0.8" strokeLinecap="round" />
              <line x1={s.x + 2.5} y1={s.y - 2.5} x2={s.x - 2.5} y2={s.y + 2.5} stroke="rgba(255,215,150,0.3)" strokeWidth="0.8" strokeLinecap="round" />
            </g>
          ))}

          <rect x="60" y="480" width="380" height="1" rx="0.5" fill="rgba(255,215,150,0.15)" />
        </g>
      ),
    },
  ];

  return (
    <FurnitureAssembly
      steps={steps}
      defs={
        <pattern id="grain" width="6" height="6" patternUnits="userSpaceOnUse">
          <line x1="0" y1="3" x2="6" y2="3" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
        </pattern>
      }
    />
  );
}
