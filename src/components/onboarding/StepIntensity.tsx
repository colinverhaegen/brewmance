"use client";

import { motion } from "framer-motion";

interface Props {
  value: number;
  onChange: (value: number) => void;
}

export default function StepIntensity({ value, onChange }: Props) {
  const label = value < 0.33 ? "Mild" : value < 0.66 ? "Medium" : "Strong";
  const desc =
    value < 0.33
      ? "Light & easy-drinking"
      : value < 0.66
        ? "Just right — balanced kick"
        : "Full power, maximum flavor";

  // Fill level for the cup illustration
  const fillPercent = 20 + value * 60;

  return (
    <div className="flex flex-col items-center pt-8">
      {/* Cup illustration that fills */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative mb-10"
      >
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
          <defs>
            <clipPath id="cupClip">
              <path d="M25 20 L22 95 Q22 105 35 107 L75 107 Q88 105 88 95 L85 20 Z" />
            </clipPath>
            <linearGradient id="coffeeFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8B6914" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#3B2314" />
            </linearGradient>
          </defs>

          {/* Coffee fill */}
          <g clipPath="url(#cupClip)">
            <motion.rect
              x="20"
              width="70"
              height="110"
              fill="url(#coffeeFill)"
              animate={{ y: 110 - (fillPercent / 100) * 110 }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
            />
          </g>

          {/* Cup outline */}
          <path
            d="M25 20 L22 95 Q22 105 35 107 L75 107 Q88 105 88 95 L85 20 Z"
            fill="none"
            stroke="#D4C4B0"
            strokeWidth="2"
          />
          {/* Rim */}
          <ellipse cx="55" cy="20" rx="32" ry="8" fill="#F5EDE3" stroke="#D4C4B0" strokeWidth="1.5" />
          {/* Handle */}
          <path d="M88 35 Q105 37 105 57 Q105 77 88 79" fill="none" stroke="#D4C4B0" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </motion.div>

      {/* Label */}
      <motion.div
        key={label}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <p className="font-playfair text-2xl font-bold text-espresso">{label}</p>
        <p className="text-sm text-latte mt-1">{desc}</p>
      </motion.div>

      {/* Slider */}
      <div className="w-full max-w-[300px] px-4">
        <div className="relative">
          <div className="w-full h-3 rounded-full bg-cream border border-latte/15">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-latte/50 to-espresso"
              animate={{ width: `${value * 100}%` }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={Math.round(value * 100)}
            onChange={(e) => onChange(Number(e.target.value) / 100)}
            className="absolute inset-0 w-full h-3 opacity-0 cursor-pointer"
          />
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 w-7 h-7 bg-white rounded-full shadow-md border-2 border-blush pointer-events-none"
            style={{ left: `calc(${value * 100}% - 14px)` }}
            animate={{ left: `calc(${value * 100}% - 14px)` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        </div>
        <div className="flex justify-between mt-3">
          <span className="text-xs text-latte/60 font-medium">Mild</span>
          <span className="text-xs text-latte/60 font-medium">Strong</span>
        </div>
      </div>
    </div>
  );
}
