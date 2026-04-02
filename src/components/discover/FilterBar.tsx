"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";

const NEIGHBORHOODS = [
  { value: "", label: "All" },
  { value: "tiong_bahru", label: "Tiong Bahru" },
  { value: "tanjong_pagar_telok_ayer", label: "Tanjong Pagar" },
  { value: "kampong_glam_bugis", label: "Kampong Glam" },
  { value: "orchard_river_valley", label: "Orchard" },
  { value: "holland_village_dempsey", label: "Holland V" },
];

const VIBES = [
  "minimalist", "cozy", "work-friendly", "social",
  "aesthetic", "outdoor", "hidden-gem", "brunch-spot",
];

const DRINK_TYPES = [
  "espresso", "flat-white", "latte", "pour-over",
  "cold-brew", "filter", "matcha", "chai",
];

interface FilterBarProps {
  neighborhood: string;
  onNeighborhoodChange: (value: string) => void;
  vibes: string[];
  onVibesChange: (vibes: string[]) => void;
  drinkTypes: string[];
  onDrinkTypesChange: (types: string[]) => void;
  search: string;
  onSearchChange: (search: string) => void;
}

export default function FilterBar({
  neighborhood,
  onNeighborhoodChange,
  vibes,
  onVibesChange,
  drinkTypes,
  onDrinkTypesChange,
  search,
  onSearchChange,
}: FilterBarProps) {
  const [showFilters, setShowFilters] = useState(false);
  const activeFilterCount = vibes.length + drinkTypes.length;

  function toggleVibe(v: string) {
    onVibesChange(vibes.includes(v) ? vibes.filter((x) => x !== v) : [...vibes, v]);
  }

  function toggleDrink(d: string) {
    onDrinkTypesChange(drinkTypes.includes(d) ? drinkTypes.filter((x) => x !== d) : [...drinkTypes, d]);
  }

  return (
    <div>
      {/* Search + filter toggle */}
      <div className="flex gap-2 mb-3">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-latte/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search cafes..."
            className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-cream/50 border border-latte/15 text-sm text-espresso placeholder:text-latte/35 focus:outline-none focus:ring-2 focus:ring-blush/30 transition-all"
          />
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowFilters(!showFilters)}
          className={`px-3 rounded-xl border transition-all flex items-center gap-1.5 ${
            showFilters || activeFilterCount > 0
              ? "bg-blush/10 border-blush/30 text-blush"
              : "bg-cream/50 border-latte/15 text-latte"
          }`}
        >
          <SlidersHorizontal size={16} />
          {activeFilterCount > 0 && (
            <span className="text-xs font-bold">{activeFilterCount}</span>
          )}
        </motion.button>
      </div>

      {/* Neighborhood chips */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
        {NEIGHBORHOODS.map((n) => (
          <button
            key={n.value}
            onClick={() => onNeighborhoodChange(n.value)}
            className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium transition-all flex-shrink-0 ${
              neighborhood === n.value
                ? "bg-blush text-white"
                : "bg-cream/60 text-espresso/60 hover:bg-cream"
            }`}
          >
            {n.label}
          </button>
        ))}
      </div>

      {/* Expanded filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-3 pb-1 space-y-3">
              {/* Vibes */}
              <div>
                <span className="text-[11px] font-semibold text-espresso/40 uppercase tracking-wider">Vibe</span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {VIBES.map((v) => (
                    <button
                      key={v}
                      onClick={() => toggleVibe(v)}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                        vibes.includes(v)
                          ? "bg-blush/15 text-blush border border-blush/30"
                          : "bg-cream/40 text-espresso/50 border border-transparent"
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              {/* Drink types */}
              <div>
                <span className="text-[11px] font-semibold text-espresso/40 uppercase tracking-wider">Drinks</span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {DRINK_TYPES.map((d) => (
                    <button
                      key={d}
                      onClick={() => toggleDrink(d)}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                        drinkTypes.includes(d)
                          ? "bg-blush/15 text-blush border border-blush/30"
                          : "bg-cream/40 text-espresso/50 border border-transparent"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear filters */}
              {activeFilterCount > 0 && (
                <button
                  onClick={() => { onVibesChange([]); onDrinkTypesChange([]); }}
                  className="text-xs text-accent-rose font-medium flex items-center gap-1"
                >
                  <X size={12} /> Clear filters
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
