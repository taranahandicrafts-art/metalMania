'use client';

import { type MotionValue, motion, useTransform } from 'framer-motion';

interface ScenePiecesProps {
  progress: MotionValue<number>;
}

interface FloatingPiece {
  finalX: number;
  finalY: number;
  startX: number;
  startY: number;
  width: number;
  height: number;
  rotation: number;
  color: string;
  delay: number;
}

const FLOATING_PIECES: FloatingPiece[] = [
  // Left side rail
  { finalX: 22, finalY: 48, startX: -15, startY: 30, width: 180, height: 18, rotation: 0, color: '#5C3A21', delay: 0 },
  // Right side rail
  { finalX: 58, finalY: 48, startX: 115, startY: 25, width: 180, height: 18, rotation: 0, color: '#6B4226', delay: 0.01 },
  // Bottom rail
  { finalX: 28, finalY: 62, startX: 20, startY: 110, width: 220, height: 22, rotation: 0, color: '#5C3A21', delay: 0.02 },
  // Top rail
  { finalX: 28, finalY: 38, startX: 80, startY: -20, width: 220, height: 16, rotation: 0, color: '#6B4226', delay: 0.015 },
  // Headboard left
  { finalX: 18, finalY: 22, startX: -30, startY: -15, width: 30, height: 120, rotation: 0, color: '#7A5230', delay: 0.03 },
  // Headboard right
  { finalX: 65, finalY: 22, startX: 130, startY: -10, width: 30, height: 120, rotation: 0, color: '#7A5230', delay: 0.035 },
  // Front left leg
  { finalX: 20, finalY: 68, startX: -20, startY: 120, width: 16, height: 55, rotation: 0, color: '#3A2210', delay: 0.04 },
  // Front right leg
  { finalX: 70, finalY: 68, startX: 120, startY: 115, width: 16, height: 55, rotation: 0, color: '#3A2210', delay: 0.045 },
];

export function ScenePieces({ progress }: ScenePiecesProps) {
  const sceneOpacity = useTransform(progress, [0.18, 0.24, 0.38, 0.44], [0, 1, 1, 0]);
  const cameraRotateY = useTransform(progress, [0.2, 0.42], [-8, 8]);
  const cameraScale = useTransform(progress, [0.2, 0.32, 0.42], [0.9, 1.05, 1]);
  const cameraX = useTransform(progress, [0.2, 0.35, 0.42], [20, -10, 0]);
  const ambientGlow = useTransform(progress, [0.2, 0.35], [0, 0.6]);

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      style={{
        opacity: sceneOpacity,
        perspective: 1200,
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Warm ambient glow */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(180,130,50,0.1) 0%, transparent 50%)',
          opacity: ambientGlow,
        }}
      />

      {/* Camera container */}
      <motion.div
        className="relative"
        style={{
          rotateY: cameraRotateY,
          scale: cameraScale,
          x: cameraX,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Floor shadow */}
        <motion.div
          className="absolute"
          style={{
            left: '15%',
            bottom: '5%',
            width: '70%',
            height: 20,
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(0,0,0,0.2) 0%, transparent 70%)',
            opacity: useTransform(progress, [0.25, 0.35], [0, 1]),
            filter: 'blur(8px)',
          }}
        />

        {/* Floating wooden pieces */}
        {FLOATING_PIECES.map((piece, i) => {
          const pieceProgress = useTransform(
            progress,
            [0.2 + piece.delay, 0.32 + piece.delay],
            [0, 1],
          );
          const pieceX = useTransform(pieceProgress, [0, 1], [piece.startX, piece.finalX]);
          const pieceY = useTransform(pieceProgress, [0, 1], [piece.startY, piece.finalY]);
          const pieceOpacity = useTransform(pieceProgress, [0, 0.2, 1], [0, 0.7, 1]);
          const pieceRotateX = useTransform(pieceProgress, [0, 0.5, 1], [25, -5, 0]);
          const pieceRotateZ = useTransform(
            pieceProgress,
            [0, 0.3, 0.7, 1],
            [15 * (i % 2 === 0 ? 1 : -1), -3, 1, 0],
          );

          return (
            <motion.div
              key={`piece-${i}`}
              className="absolute"
              style={{
                left: `${pieceX}%`,
                top: `${pieceY}%`,
                opacity: pieceOpacity,
                rotateX: pieceRotateX,
                rotateZ: pieceRotateZ,
                transformStyle: 'preserve-3d',
                filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.3))',
              }}
            >
              <svg
                width={piece.width}
                height={piece.height}
                viewBox={`0 0 ${piece.width} ${piece.height}`}
              >
                <rect
                  width={piece.width}
                  height={piece.height}
                  rx={3}
                  fill={piece.color}
                />
                {/* Wood grain */}
                {Array.from({ length: Math.floor(piece.height / 6) }).map((_, j) => (
                  <line
                    key={j}
                    x1={6}
                    y1={4 + j * 6}
                    x2={piece.width - 6}
                    y2={4 + j * 6}
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth="0.5"
                  />
                ))}
                {/* Top highlight */}
                <rect
                  width={piece.width}
                  height={2}
                  rx={1}
                  fill="rgba(255,255,255,0.1)"
                />
              </svg>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.5) 100%)',
        }}
      />
    </motion.div>
  );
}
