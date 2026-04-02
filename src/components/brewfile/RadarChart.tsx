"use client";

import { motion } from "framer-motion";

interface RadarChartProps {
  labels: string[];
  values: number[]; // 0-1 scale
  size?: number;
}

export default function RadarChart({ labels, values, size = 260 }: RadarChartProps) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 40;
  const levels = 4;
  const angleStep = (Math.PI * 2) / labels.length;

  function getPoint(index: number, value: number) {
    const angle = angleStep * index - Math.PI / 2;
    return {
      x: cx + Math.cos(angle) * radius * value,
      y: cy + Math.sin(angle) * radius * value,
    };
  }

  // Grid lines
  const gridPaths = Array.from({ length: levels }, (_, level) => {
    const scale = (level + 1) / levels;
    const points = labels.map((_, i) => getPoint(i, scale));
    return points.map((p) => `${p.x},${p.y}`).join(" ");
  });

  // Axis lines
  const axes = labels.map((_, i) => getPoint(i, 1));

  // Data polygon
  const dataPoints = values.map((v, i) => getPoint(i, Math.max(v, 0.05)));
  const dataPath = dataPoints.map((p) => `${p.x},${p.y}`).join(" ");

  // Label positions
  const labelPoints = labels.map((_, i) => getPoint(i, 1.22));

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <linearGradient id="radarFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D4918B" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#C8A882" stopOpacity="0.2" />
        </linearGradient>
      </defs>

      {/* Grid */}
      {gridPaths.map((points, i) => (
        <polygon
          key={i}
          points={points}
          fill="none"
          stroke="#C8A882"
          strokeWidth="0.5"
          opacity={0.25 + i * 0.1}
        />
      ))}

      {/* Axes */}
      {axes.map((p, i) => (
        <line
          key={i}
          x1={cx}
          y1={cy}
          x2={p.x}
          y2={p.y}
          stroke="#C8A882"
          strokeWidth="0.5"
          opacity="0.3"
        />
      ))}

      {/* Data area */}
      <motion.polygon
        points={dataPath}
        fill="url(#radarFill)"
        stroke="#D4918B"
        strokeWidth="2"
        strokeLinejoin="round"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      />

      {/* Data points */}
      {dataPoints.map((p, i) => (
        <motion.circle
          key={i}
          cx={p.x}
          cy={p.y}
          r="4"
          fill="#D4918B"
          stroke="white"
          strokeWidth="2"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 + i * 0.08, type: "spring", bounce: 0.4 }}
        />
      ))}

      {/* Labels */}
      {labelPoints.map((p, i) => (
        <text
          key={i}
          x={p.x}
          y={p.y}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-espresso/70 text-[10px] font-medium"
        >
          {labels[i]}
        </text>
      ))}
    </svg>
  );
}
