"use client";

import { motion } from "framer-motion";

const ORIGINS = [
  { id: "Ethiopian", flag: "🇪🇹", note: "Fruity, floral, bright" },
  { id: "Colombian", flag: "🇨🇴", note: "Balanced, nutty, sweet" },
  { id: "Indonesian", flag: "🇮🇩", note: "Earthy, bold, full-bodied" },
  { id: "Guatemalan", flag: "🇬🇹", note: "Chocolatey, complex" },
  { id: "Kenyan", flag: "🇰🇪", note: "Bright, berry, wine-like" },
  { id: "Brazilian", flag: "🇧🇷", note: "Nutty, smooth, low-acid" },
  { id: "Surprise me", flag: "🌍", note: "I'm open to anything!" },
];

interface Props {
  selected: string[];
  onSelect: (origins: string[]) => void;
}

export default function StepBeanOrigin({ selected, onSelect }: Props) {
  function toggle(id: string) {
    if (id === "Surprise me") {
      onSelect(selected.includes(id) ? [] : [id]);
      return;
    }
    // Deselect "Surprise me" if picking specific origins
    const filtered = selected.filter((o) => o !== "Surprise me");
    if (filtered.includes(id)) {
      onSelect(filtered.filter((o) => o !== id));
    } else if (filtered.length < 3) {
      onSelect([...filtered, id]);
    }
  }

  return (
    <div>
      <p className="text-sm text-latte mb-4">Pick up to 3 — or skip this one</p>
      <div className="space-y-2.5">
        {ORIGINS.map((origin, i) => {
          const isSelected = selected.includes(origin.id);
          return (
            <motion.button
              key={origin.id}
              onClick={() => toggle(origin.id)}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
              whileTap={{ scale: 0.97 }}
              className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl border-2 transition-all text-left ${
                isSelected
                  ? "border-blush bg-blush/8 shadow-sm"
                  : "border-latte/15 bg-cream/40 hover:border-latte/30"
              }`}
            >
              <span className="text-2xl">{origin.flag}</span>
              <div className="flex-1">
                <span className={`text-[15px] font-semibold ${isSelected ? "text-espresso" : "text-espresso/80"}`}>
                  {origin.id}
                </span>
                <span className="text-xs text-latte/50 ml-2">{origin.note}</span>
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
