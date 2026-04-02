"use client";

import { motion } from "framer-motion";

interface Props {
  value: number;
  onChange: (value: number) => void;
}

export default function StepRoastProfile({ value, onChange }: Props) {
  const roastLabel = value < 0.33 ? "Light" : value < 0.66 ? "Medium" : "Dark";
  const roastDesc =
    value < 0.33
      ? "Bright, fruity, floral notes"
      : value < 0.66
        ? "Balanced, smooth, caramel"
        : "Bold, chocolatey, smoky";

  return (
    <div className="flex flex-col items-center pt-8">
      {/* Roast visual */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative mb-10"
      >
        <div className="w-32 h-32 rounded-full flex items-center justify-center relative overflow-hidden">
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{
              background: `radial-gradient(circle, ${
                value < 0.33
                  ? "#D4A574, #E8CDB0"
                  : value < 0.66
                    ? "#8B6914, #A0845C"
                    : "#3B2314, #5C3D24"
              })`,
            }}
            transition={{ duration: 0.4 }}
          />
          <span className="text-5xl relative z-10">☕</span>
        </div>
      </motion.div>

      {/* Label */}
      <motion.div
        key={roastLabel}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <p className="font-playfair text-2xl font-bold text-espresso">{roastLabel}</p>
        <p className="text-sm text-latte mt-1">{roastDesc}</p>
      </motion.div>

      {/* Slider */}
      <div className="w-full max-w-[300px] px-4">
        <div className="relative">
          <div
            className="w-full h-3 rounded-full"
            style={{
              background: "linear-gradient(to right, #E8CDB0, #A0845C, #3B2314)",
            }}
          />
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
          <span className="text-xs text-latte/60 font-medium">Light</span>
          <span className="text-xs text-latte/60 font-medium">Medium</span>
          <span className="text-xs text-latte/60 font-medium">Dark</span>
        </div>
      </div>
    </div>
  );
}
