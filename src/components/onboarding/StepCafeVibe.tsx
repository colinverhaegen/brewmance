"use client";

import { motion } from "framer-motion";

const VIBES = [
  { id: "minimalist", label: "Minimalist", icon: "◻️", desc: "Clean lines, quiet focus", color: "#E8E4E0" },
  { id: "cozy", label: "Cozy", icon: "🕯️", desc: "Warm lights, soft seats", color: "#D4C4B0" },
  { id: "work-friendly", label: "Work-friendly", icon: "💻", desc: "Power outlets & WiFi", color: "#C8D8D0" },
  { id: "social", label: "Social", icon: "🎉", desc: "Buzzy & vibrant", color: "#E8C8C4" },
  { id: "aesthetic", label: "Aesthetic", icon: "📸", desc: "Instagram-worthy", color: "#D4C8D8" },
  { id: "outdoor", label: "Outdoor", icon: "🌿", desc: "Sunshine & fresh air", color: "#C8D8C0" },
  { id: "hidden-gem", label: "Hidden Gem", icon: "💎", desc: "Off the beaten path", color: "#D0D8E0" },
  { id: "brunch-spot", label: "Brunch Spot", icon: "🥞", desc: "Coffee + food heaven", color: "#E8D4C0" },
];

interface Props {
  selected: string[];
  onSelect: (vibes: string[]) => void;
}

export default function StepCafeVibe({ selected, onSelect }: Props) {
  function toggle(id: string) {
    if (selected.includes(id)) {
      onSelect(selected.filter((v) => v !== id));
    } else if (selected.length < 3) {
      onSelect([...selected, id]);
    }
  }

  return (
    <div>
      <p className="text-sm text-latte mb-4">Pick up to 3 that feel like you</p>
      <div className="space-y-3">
        {VIBES.map((vibe, i) => {
          const isSelected = selected.includes(vibe.id);
          return (
            <motion.button
              key={vibe.id}
              onClick={() => toggle(vibe.id)}
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
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ backgroundColor: vibe.color }}
              >
                {vibe.icon}
              </div>
              <div className="flex-1">
                <span className={`text-[15px] font-semibold block ${isSelected ? "text-espresso" : "text-espresso/80"}`}>
                  {vibe.label}
                </span>
                <span className="text-xs text-latte/60">{vibe.desc}</span>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                isSelected ? "border-blush bg-blush" : "border-latte/25"
              }`}>
                {isSelected && (
                  <motion.svg
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                    width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </motion.svg>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
