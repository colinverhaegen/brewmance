"use client";

import { motion } from "framer-motion";

interface Props {
  value: number;
  onChange: (value: number) => void;
}

export default function StepAdventurousness({ value, onChange }: Props) {
  const label =
    value < 0.33
      ? "Creature of Habit"
      : value < 0.66
        ? "Open to Trying"
        : "Always Exploring";
  const desc =
    value < 0.33
      ? "You know what you like — and you stick to it"
      : value < 0.66
        ? "Mostly loyal, but curious when something catches your eye"
        : "The menu is your playground — surprise me!";
  const emoji = value < 0.33 ? "🏠" : value < 0.66 ? "🤔" : "🧭";

  return (
    <div className="flex flex-col items-center pt-8">
      {/* Animated emoji */}
      <motion.div
        key={emoji}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", bounce: 0.4 }}
        className="text-7xl mb-6"
      >
        {emoji}
      </motion.div>

      {/* Label */}
      <motion.div
        key={label}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <p className="font-playfair text-2xl font-bold text-espresso">{label}</p>
        <p className="text-sm text-latte mt-2 max-w-[260px] mx-auto leading-relaxed">{desc}</p>
      </motion.div>

      {/* Slider */}
      <div className="w-full max-w-[300px] px-4">
        <div className="relative">
          <div className="w-full h-3 rounded-full bg-cream border border-latte/15">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-latte to-blush"
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
          <span className="text-xs text-latte/60 font-medium">Creature of Habit</span>
          <span className="text-xs text-latte/60 font-medium">Always Exploring</span>
        </div>
      </div>
    </div>
  );
}
