"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [otherText, setOtherText] = useState("");

  const otherValue = selected.find(
    (s) => !RITUALS.some((r) => r.id === s)
  );

  function toggle(id: string) {
    if (selected.includes(id)) {
      onSelect(selected.filter((r) => r !== id));
    } else if (selected.length < 2) {
      onSelect([...selected, id]);
    }
  }

  function toggleOther() {
    if (otherValue) {
      // Deselect other
      onSelect(selected.filter((s) => RITUALS.some((r) => r.id === s)));
      setShowOtherInput(false);
      setOtherText("");
    } else {
      setShowOtherInput(true);
    }
  }

  function submitOther() {
    const trimmed = otherText.trim();
    if (!trimmed) return;
    // Remove any previous "other" entry, add new one
    const withoutOther = selected.filter((s) => RITUALS.some((r) => r.id === s));
    if (withoutOther.length < 2) {
      onSelect([...withoutOther, trimmed]);
    }
  }

  const isOtherSelected = !!otherValue;

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

        {/* Other option */}
        <motion.button
          onClick={toggleOther}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: RITUALS.length * 0.06, duration: 0.35 }}
          whileTap={{ scale: 0.97 }}
          className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
            isOtherSelected
              ? "border-blush bg-blush/8 shadow-sm"
              : "border-latte/15 bg-cream/40 hover:border-latte/30"
          }`}
        >
          <span className="text-3xl">✨</span>
          <div className="flex-1">
            <span className={`text-[15px] font-semibold block ${isOtherSelected ? "text-espresso" : "text-espresso/80"}`}>
              {otherValue || "Other"}
            </span>
            <span className="text-xs text-latte/60">Tell us your ritual</span>
          </div>
        </motion.button>

        {/* Other text input */}
        <AnimatePresence>
          {showOtherInput && !otherValue && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="flex gap-2 mt-1">
                <input
                  type="text"
                  value={otherText}
                  onChange={(e) => setOtherText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submitOther()}
                  placeholder="e.g. Late night coding fuel"
                  autoFocus
                  className="flex-1 px-4 py-3 rounded-xl bg-cream/50 border border-latte/15 text-espresso placeholder:text-latte/35 focus:outline-none focus:ring-2 focus:ring-blush/40 focus:border-blush/50 transition-all text-[15px]"
                />
                <motion.button
                  onClick={submitOther}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-3 bg-blush text-white rounded-xl font-semibold text-sm"
                >
                  Add
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
