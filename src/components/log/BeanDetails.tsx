"use client";

import { motion } from "framer-motion";
import { BEAN_ORIGINS, ROAST_LEVELS } from "@/lib/constants";

interface BeanDetailsProps {
  beanNames: string[];
  onBeanNamesChange: (names: string[]) => void;
  origins: string[];
  onOriginsChange: (origins: string[]) => void;
  roastLevel: string;
  onRoastLevelChange: (level: string) => void;
}

export default function BeanDetails({
  beanNames,
  onBeanNamesChange,
  origins,
  onOriginsChange,
  roastLevel,
  onRoastLevelChange,
}: BeanDetailsProps) {

  function addBean() {
    onBeanNamesChange([...beanNames, ""]);
  }

  function updateBean(index: number, value: string) {
    const updated = [...beanNames];
    updated[index] = value;
    onBeanNamesChange(updated);
  }

  function removeBean(index: number) {
    if (beanNames.length <= 1) return;
    onBeanNamesChange(beanNames.filter((_, i) => i !== index));
  }

  function toggleOrigin(id: string) {
    if (origins.includes(id)) {
      onOriginsChange(origins.filter((o) => o !== id));
    } else {
      onOriginsChange([...origins, id]);
    }
  }

  return (
    <div className="space-y-5">
      {/* Bean names */}
      <div>
        <label className="block text-[13px] font-medium text-espresso/70 mb-1.5 uppercase tracking-wider">
          Bean{beanNames.length > 1 ? "s" : ""} (optional)
        </label>
        <div className="space-y-2">
          {beanNames.map((name, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="text"
                value={name}
                onChange={(e) => updateBean(i, e.target.value)}
                placeholder={beanNames.length > 1 ? `Bean ${i + 1}` : "e.g. Yirgacheffe Natural"}
                className="flex-1 px-4 py-2.5 rounded-xl bg-cream/50 border border-latte/15 text-sm text-espresso placeholder:text-latte/35 focus:outline-none focus:ring-2 focus:ring-blush/30"
              />
              {beanNames.length > 1 && (
                <button
                  onClick={() => removeBean(i)}
                  className="px-2 text-latte/40 hover:text-accent-rose transition-colors text-lg"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          onClick={addBean}
          className="text-xs text-blush font-medium mt-1.5 hover:text-accent-rose transition-colors"
        >
          + Add another bean (blend)
        </button>
      </div>

      {/* Origin */}
      <div>
        <label className="block text-[13px] font-medium text-espresso/70 mb-1.5 uppercase tracking-wider">
          Origin{origins.length > 1 ? "s" : ""} (optional)
        </label>
        <div className="flex flex-wrap gap-1.5">
          {BEAN_ORIGINS.map((o) => {
            const isSelected = origins.includes(o.id);
            return (
              <motion.button
                key={o.id}
                onClick={() => toggleOrigin(o.id)}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full border-2 text-xs transition-all ${
                  isSelected
                    ? "border-blush bg-blush/10 font-semibold text-espresso"
                    : "border-latte/15 bg-cream/40 text-espresso/60"
                }`}
              >
                <span>{o.flag}</span>
                <span>{o.id}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Roast level */}
      <div>
        <label className="block text-[13px] font-medium text-espresso/70 mb-1.5 uppercase tracking-wider">
          Roast Level (optional)
        </label>
        <div className="flex gap-1.5">
          {ROAST_LEVELS.map((r) => {
            const isSelected = roastLevel === r.id;
            return (
              <motion.button
                key={r.id}
                onClick={() => onRoastLevelChange(isSelected ? "" : r.id)}
                whileTap={{ scale: 0.95 }}
                className={`flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl border-2 transition-all ${
                  isSelected
                    ? "border-blush bg-blush/8"
                    : "border-latte/15 bg-cream/40"
                }`}
              >
                <div
                  className="w-5 h-5 rounded-full"
                  style={{ backgroundColor: r.color }}
                />
                <span className="text-[10px] font-medium text-espresso">{r.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
