"use client";

import { motion } from "framer-motion";

const RITUALS = [
  { id: "Morning Ritual", icon: "🌅", desc: "First thing, every day", time: "6-9am" },
  { id: "Afternoon Pick-me-up", icon: "⚡", desc: "That 2pm energy boost", time: "1-4pm" },
  { id: "Weekend Explorer", icon: "🗺️", desc: "Cafe-hopping adventures", time: "Weekends" },
  { id: "Social Occasion", icon: "👋", desc: "Catching up over coffee", time: "Anytime" },
  { id: "Post-meal", icon: "🍽️", desc: "The perfect finish", time: "After food" },
];

interface Props {
  selected: string[];
  onSelect: (rituals: string[]) => void;
}

export default function StepRitualPattern({ selected, onSelect }: Props) {
  function toggle(id: string) {
    if (selected.includes(id)) {
      onSelect(selected.filter((r) => r !== id));
    } else if (selected.length < 2) {
      onSelect([...selected, id]);
    }
  }

  return (
    <div>
      <p className="text-sm text-latte mb-4">Pick 1-2 that describe you</p>
      <div className="space-y-3">
        {RITUALS.map((ritual, i) => {
          const isSelected = selected.includes(ritual.id);
          return (
            <motion.button
              key={ritual.id}
              onClick={() => toggle(ritual.id)}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06, duration: 0.35 }}
              whileTap={{ scale: 0.97 }}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
                isSelected
                  ? "border-blush bg-blush/8 shadow-sm"
                  : "border-latte/15 bg-cream/40 hover:border-latte/30"
              }`}
            >
              <span className="text-3xl">{ritual.icon}</span>
              <div className="flex-1">
                <span className={`text-[15px] font-semibold block ${isSelected ? "text-espresso" : "text-espresso/80"}`}>
                  {ritual.id}
                </span>
                <span className="text-xs text-latte/60">{ritual.desc}</span>
              </div>
              <span className="text-xs text-latte/40 font-medium">{ritual.time}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
