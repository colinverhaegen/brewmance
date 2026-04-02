"use client";

import { motion } from "framer-motion";

const DRINKS = [
  { id: "Espresso", icon: "☕", desc: "Pure & bold" },
  { id: "Flat White", icon: "🥛", desc: "Smooth & velvety" },
  { id: "Latte", icon: "🍵", desc: "Milky & mellow" },
  { id: "Cappuccino", icon: "☁️", desc: "Frothy classic" },
  { id: "Long Black", icon: "🖤", desc: "Bold & clean" },
  { id: "Pour Over", icon: "🫗", desc: "Delicate & bright" },
  { id: "Cold Brew", icon: "🧊", desc: "Cool & smooth" },
  { id: "Iced Latte", icon: "🥤", desc: "Chilled & creamy" },
];

interface Props {
  selected: string[];
  onSelect: (drinks: string[]) => void;
}

export default function StepDrinkType({ selected, onSelect }: Props) {
  function toggle(id: string) {
    if (selected.includes(id)) {
      onSelect(selected.filter((d) => d !== id));
    } else if (selected.length < 3) {
      onSelect([...selected, id]);
    }
  }

  return (
    <div>
      <p className="text-sm text-latte mb-4">Pick up to 3 favorites</p>
      <div className="grid grid-cols-2 gap-3">
        {DRINKS.map((drink, i) => {
          const isSelected = selected.includes(drink.id);
          return (
            <motion.button
              key={drink.id}
              onClick={() => toggle(drink.id)}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
              whileTap={{ scale: 0.95 }}
              className={`relative flex flex-col items-center gap-1.5 p-4 rounded-2xl border-2 transition-all ${
                isSelected
                  ? "border-blush bg-blush/8 shadow-sm"
                  : "border-latte/15 bg-cream/40 hover:border-latte/30"
              }`}
            >
              <span className="text-3xl">{drink.icon}</span>
              <span className={`text-sm font-semibold ${isSelected ? "text-espresso" : "text-espresso/80"}`}>
                {drink.id}
              </span>
              <span className="text-xs text-latte/60">{drink.desc}</span>
              {isSelected && (
                <motion.div
                  layoutId="drink-check"
                  className="absolute top-2 right-2 w-5 h-5 bg-blush rounded-full flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", bounce: 0.5 }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
