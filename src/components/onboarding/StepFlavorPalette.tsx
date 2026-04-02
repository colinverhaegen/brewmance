"use client";

import { motion } from "framer-motion";

const FLAVORS = [
  // Sweet
  { id: "Caramel", emoji: "🍮", cat: "sweet" },
  { id: "Vanilla", emoji: "🌿", cat: "sweet" },
  { id: "Honey", emoji: "🍯", cat: "sweet" },
  { id: "Brown Sugar", emoji: "🟤", cat: "sweet" },
  { id: "Toffee", emoji: "🧈", cat: "sweet" },
  // Fruity
  { id: "Berry", emoji: "🫐", cat: "fruity" },
  { id: "Citrus", emoji: "🍊", cat: "fruity" },
  { id: "Tropical", emoji: "🥭", cat: "fruity" },
  { id: "Stone Fruit", emoji: "🍑", cat: "fruity" },
  { id: "Dried Fruit", emoji: "🍇", cat: "fruity" },
  { id: "Winey", emoji: "🍷", cat: "fruity" },
  // Nutty
  { id: "Nutty", emoji: "🥜", cat: "nutty" },
  { id: "Chocolate", emoji: "🍫", cat: "nutty" },
  { id: "Roasty", emoji: "♨️", cat: "nutty" },
  // Floral
  { id: "Floral", emoji: "🌸", cat: "floral" },
  { id: "Herbal", emoji: "🍃", cat: "floral" },
  // Spicy
  { id: "Spicy", emoji: "🌶️", cat: "spicy" },
  { id: "Cinnamon", emoji: "🫚", cat: "spicy" },
  // Earthy
  { id: "Earthy", emoji: "🌍", cat: "earthy" },
  { id: "Smoky", emoji: "🔥", cat: "earthy" },
];

interface Props {
  selected: string[];
  onSelect: (flavors: string[]) => void;
}

export default function StepFlavorPalette({ selected, onSelect }: Props) {
  function toggle(id: string) {
    if (selected.includes(id)) {
      onSelect(selected.filter((f) => f !== id));
    } else if (selected.length < 5) {
      onSelect([...selected, id]);
    }
  }

  return (
    <div>
      <p className="text-sm text-latte mb-4">Pick 3-5 taste notes you like</p>
      <div className="flex flex-wrap gap-2.5">
        {FLAVORS.map((flavor, i) => {
          const isSelected = selected.includes(flavor.id);
          return (
            <motion.button
              key={flavor.id}
              onClick={() => toggle(flavor.id)}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03, duration: 0.25 }}
              whileTap={{ scale: 0.9 }}
              className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-full border-2 transition-all text-sm ${
                isSelected
                  ? "border-blush bg-blush/10 shadow-sm font-semibold text-espresso"
                  : "border-latte/15 bg-cream/40 text-espresso/70 hover:border-latte/30"
              }`}
            >
              <span className="text-base">{flavor.emoji}</span>
              <span>{flavor.id}</span>
            </motion.button>
          );
        })}
      </div>
      <p className="text-xs text-latte/50 mt-4 text-center">
        {selected.length}/5 selected
      </p>
    </div>
  );
}
