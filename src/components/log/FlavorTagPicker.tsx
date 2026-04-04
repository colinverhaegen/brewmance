"use client";

import { motion } from "framer-motion";

const FLAVORS = [
  // Sweet
  { id: "Caramel", emoji: "🍮" },
  { id: "Vanilla", emoji: "🌿" },
  { id: "Honey", emoji: "🍯" },
  { id: "Brown Sugar", emoji: "🟤" },
  { id: "Toffee", emoji: "🧈" },
  // Fruity
  { id: "Berry", emoji: "🫐" },
  { id: "Citrus", emoji: "🍊" },
  { id: "Tropical", emoji: "🥭" },
  { id: "Stone Fruit", emoji: "🍑" },
  { id: "Dried Fruit", emoji: "🍇" },
  // Nutty/Cocoa
  { id: "Nutty", emoji: "🥜" },
  { id: "Chocolate", emoji: "🍫" },
  { id: "Winey", emoji: "🍷" },
  // Floral/Herbal
  { id: "Floral", emoji: "🌸" },
  { id: "Herbal", emoji: "🍃" },
  // Spicy
  { id: "Spicy", emoji: "🌶️" },
  { id: "Cinnamon", emoji: "🫚" },
  // Roasty
  { id: "Roasty", emoji: "🔥" },
  { id: "Earthy", emoji: "🌍" },
  { id: "Smoky", emoji: "♨️" },
];

interface FlavorTagPickerProps {
  selected: string[];
  onSelect: (tags: string[]) => void;
  max?: number;
}

export default function FlavorTagPicker({ selected, onSelect, max = 5 }: FlavorTagPickerProps) {
  function toggle(id: string) {
    if (selected.includes(id)) {
      onSelect(selected.filter((t) => t !== id));
    } else if (selected.length < max) {
      onSelect([...selected, id]);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {FLAVORS.map((f, i) => {
          const isSelected = selected.includes(f.id);
          return (
            <motion.button
              key={f.id}
              onClick={() => toggle(f.id)}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.02 }}
              whileTap={{ scale: 0.9 }}
              className={`flex items-center gap-1 px-3 py-2 rounded-full border-2 text-sm transition-all ${
                isSelected
                  ? "border-blush bg-blush/10 font-semibold text-espresso"
                  : "border-latte/15 bg-cream/40 text-espresso/60"
              }`}
            >
              <span className="text-sm">{f.emoji}</span>
              <span>{f.id}</span>
            </motion.button>
          );
        })}
      </div>
      <p className="text-xs text-latte/50 mt-2 text-center">{selected.length}/{max} selected</p>
    </div>
  );
}
