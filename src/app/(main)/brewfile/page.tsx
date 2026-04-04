"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Share2 } from "lucide-react";
import type { Brewfile, WeightedPreference } from "@/types/brewfile";
import RadarChart from "@/components/brewfile/RadarChart";

function topItems(items: WeightedPreference[], limit = 3): WeightedPreference[] {
  return [...items]
    .sort((a, b) => b.weight - a.weight)
    .slice(0, limit);
}

const FLAVOR_EMOJI: Record<string, string> = {
  Chocolate: "🍫", Caramel: "🍮", Vanilla: "🌿", Honey: "🍯",
  "Brown Sugar": "🟤", Berry: "🫐", Citrus: "🍊", Tropical: "🥭",
  "Stone Fruit": "🍑", "Dried Fruit": "🍇", Nutty: "🥜", Toffee: "🧈",
  Roasty: "🔥", Floral: "🌸", Herbal: "🍃", Spicy: "🌶️",
  Cinnamon: "🫚", Earthy: "🌍", Smoky: "♨️", Winey: "🍷",
};

// 6 main flavor categories for the radar chart
const FLAVOR_CATEGORIES: { name: string; emoji: string; notes: string[] }[] = [
  { name: "Sweet", emoji: "🍮", notes: ["Caramel", "Vanilla", "Honey", "Brown Sugar", "Toffee"] },
  { name: "Fruity", emoji: "🫐", notes: ["Berry", "Citrus", "Tropical", "Stone Fruit", "Dried Fruit"] },
  { name: "Nutty/Cocoa", emoji: "🥜", notes: ["Nutty", "Chocolate", "Winey"] },
  { name: "Floral/Herbal", emoji: "🌸", notes: ["Floral", "Herbal"] },
  { name: "Spicy", emoji: "🌶️", notes: ["Spicy", "Cinnamon"] },
  { name: "Roasty", emoji: "🔥", notes: ["Roasty", "Earthy", "Smoky"] },
];

function getCategoryScore(
  palette: WeightedPreference[],
  categoryNotes: string[]
): { score: number; matched: string[] } {
  const matched: string[] = [];
  let totalWeight = 0;
  for (const pref of palette) {
    if (categoryNotes.includes(pref.name)) {
      matched.push(pref.name);
      totalWeight += pref.weight;
    }
  }
  // Normalize: score is proportion of category notes selected, capped at 1
  const score = Math.min(totalWeight / Math.max(categoryNotes.length * 0.5, 1), 1);
  return { score, matched };
}

const ORIGIN_FLAG: Record<string, string> = {
  Ethiopian: "🇪🇹", Colombian: "🇨🇴", Indonesian: "🇮🇩",
  Guatemalan: "🇬🇹", Kenyan: "🇰🇪", Brazilian: "🇧🇷",
};

const BREW_ICON: Record<string, string> = {
  espresso_machine: "☕", pour_over: "🫗", cold_brew: "🧊",
  aeropress: "🔬", french_press: "🫖", moka_pot: "🏺",
};

const VIBE_EMOJI: Record<string, string> = {
  Minimalist: "◻️", Cozy: "🕯️", "Work-friendly": "💻",
  Social: "🎉", Aesthetic: "📸", Outdoor: "🌿",
};

const RITUAL_EMOJI: Record<string, string> = {
  "Morning Ritual": "🌅", "Afternoon Pick-me-up": "⚡",
  "Weekend Explorer": "🗺️", "Social Occasion": "👋", "Post-meal": "🍽️",
};

const card = "bg-cream/50 rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.06)]";
const sectionLabel = "text-[11px] font-semibold text-espresso/40 uppercase tracking-wider mb-3";

function SpectrumBar({
  label,
  value,
  leftLabel,
  rightLabel,
  gradient,
  delay = 0,
}: {
  label: string;
  value: number;
  leftLabel: string;
  rightLabel: string;
  gradient: string;
  delay?: number;
}) {
  const displayLabel =
    value < 0.2 ? leftLabel
    : value < 0.4 ? `Leaning ${leftLabel.toLowerCase()}`
    : value < 0.6 ? "Balanced"
    : value < 0.8 ? `Leaning ${rightLabel.toLowerCase()}`
    : rightLabel;

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[13px] font-semibold text-espresso">{label}</span>
        <span className="text-[12px] text-latte font-medium">{displayLabel}</span>
      </div>
      <div className="relative h-2.5 bg-latte/10 rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ background: gradient }}
          initial={{ width: 0 }}
          animate={{ width: `${value * 100}%` }}
          transition={{ delay, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
        {/* Marker dot */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-sm border-2 border-espresso/20"
          initial={{ left: 0, opacity: 0 }}
          animate={{ left: `calc(${value * 100}% - 7px)`, opacity: 1 }}
          transition={{ delay: delay + 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-[10px] text-latte/40">{leftLabel}</span>
        <span className="text-[10px] text-latte/40">{rightLabel}</span>
      </div>
    </div>
  );
}

function RankedBar({
  label,
  value,
  maxValue,
  icon,
  delay = 0,
}: {
  label: string;
  value: number;
  maxValue: number;
  icon?: string;
  delay?: number;
}) {
  const pct = maxValue > 0 ? (value / maxValue) * 100 : 0;
  return (
    <div className="flex items-center gap-2.5">
      {icon && <span className="text-base w-6 text-center flex-shrink-0">{icon}</span>}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-0.5">
          <span className="text-[13px] font-medium text-espresso">{label}</span>
        </div>
        <div className="h-2 bg-latte/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blush/70 to-blush rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${Math.max(pct, 8)}%` }}
            transition={{ delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </div>
    </div>
  );
}

export default function BrewfilePage() {
  const [brewfile, setBrewfile] = useState<Brewfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [totalLogs, setTotalLogs] = useState(0);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("brewfiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (data) {
        setBrewfile(data as unknown as Brewfile);
        setTotalLogs(data.total_logs || 0);
      }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="text-4xl"
        >
          ☕
        </motion.div>
      </div>
    );
  }

  if (!brewfile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-8 text-center">
        <span className="text-5xl mb-4">📋</span>
        <h2 className="font-playfair text-xl font-bold text-espresso mb-2">No Brewfile yet</h2>
        <p className="text-latte text-sm mb-6">Complete the taste quiz to build your coffee profile.</p>
        <motion.a
          href="/onboarding/intro"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="bg-blush text-white px-8 py-3.5 rounded-3xl text-[15px] font-semibold shadow-lg shadow-blush/20 hover:bg-accent-rose transition-colors"
        >
          Take the Quiz
        </motion.a>
      </div>
    );
  }

  // Flavor radar — 6 fixed categories, each scored by matched notes
  const categoryData = FLAVOR_CATEGORIES.map((cat) => {
    const { score, matched } = getCategoryScore(brewfile.flavor_palette, cat.notes);
    return { ...cat, score, matched };
  });
  const flavorLabels = categoryData.map((c) => c.name);
  const flavorValues = categoryData.map((c) => c.score);

  // Top drinks
  const topDrinks = topItems(brewfile.drink_type, 4);
  const maxDrinkWeight = topDrinks[0]?.weight || 1;

  // Bean origins
  const topOrigins = topItems(brewfile.bean_origin, 4);
  const maxOriginWeight = topOrigins[0]?.weight || 1;

  // Brew methods
  const topMethods = topItems(brewfile.brew_method, 3);

  return (
    <div className="bg-soft-white min-h-screen pt-[env(safe-area-inset-top,12px)]">
      {/* Header */}
      <div className="px-6 pt-4 pb-2 flex items-center justify-between">
        <div>
          <h1 className="font-playfair text-2xl font-bold text-espresso">Your Brewfile</h1>
          <p className="text-xs text-latte mt-0.5">
            {totalLogs === 0 ? "Based on your taste quiz" : `Refined by ${totalLogs} logs`}
          </p>
        </div>
        <button className="w-10 h-10 rounded-full bg-cream flex items-center justify-center text-espresso/60 hover:text-espresso transition-colors">
          <Share2 size={18} />
        </button>
      </div>

      {/* ── Flavor Radar ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`mx-4 mt-4 ${card}`}
      >
        <h3 className={sectionLabel}>Flavor Profile</h3>
        <div className="flex justify-center -mt-2">
          <RadarChart labels={flavorLabels} values={flavorValues} />
        </div>
        {/* Notes breakdown by category */}
        <div className="space-y-2.5 mt-2">
          {categoryData.filter((c) => c.matched.length > 0).map((cat) => (
            <div key={cat.name} className="flex items-start gap-2">
              <span className="text-sm mt-0.5">{cat.emoji}</span>
              <div>
                <span className="text-[12px] font-semibold text-espresso/60 uppercase tracking-wider">{cat.name}</span>
                <div className="flex flex-wrap gap-1 mt-0.5">
                  {cat.matched.map((note) => (
                    <span key={note} className="px-2 py-0.5 bg-blush/8 text-espresso text-[11px] font-medium rounded-full">
                      {FLAVOR_EMOJI[note] || ""} {note}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Spectrum Sliders ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5 }}
        className={`mx-4 mt-3 ${card} space-y-5`}
      >
        <h3 className={sectionLabel}>Your Spectrum</h3>
        <SpectrumBar
          label="Roast"
          value={brewfile.roast_profile}
          leftLabel="Light"
          rightLabel="Dark"
          gradient="linear-gradient(to right, #E8CDB0, #A0845C, #3B2314)"
          delay={0.3}
        />
        <SpectrumBar
          label="Intensity"
          value={brewfile.intensity}
          leftLabel="Mild"
          rightLabel="Strong"
          gradient="linear-gradient(to right, #C8A882, #8B6914, #3B2314)"
          delay={0.4}
        />
        <SpectrumBar
          label="Adventurousness"
          value={brewfile.adventurousness}
          leftLabel="Creature of Habit"
          rightLabel="Always Exploring"
          gradient="linear-gradient(to right, #C8A882, #D4918B)"
          delay={0.5}
        />
      </motion.div>

      {/* ── Top Drinks ── */}
      {topDrinks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className={`mx-4 mt-3 ${card}`}
        >
          <h3 className={sectionLabel}>Top Drinks</h3>
          <div className="space-y-3">
            {topDrinks.map((d, i) => (
              <RankedBar
                key={d.name}
                label={d.name}
                value={d.weight}
                maxValue={maxDrinkWeight}
                icon={i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : "☕"}
                delay={0.4 + i * 0.08}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* ── Bean Origins ── */}
      {topOrigins.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className={`mx-4 mt-3 ${card}`}
        >
          <h3 className={sectionLabel}>Bean Origins</h3>
          <div className="space-y-3">
            {topOrigins.map((o, i) => (
              <RankedBar
                key={o.name}
                label={o.name}
                value={o.weight}
                maxValue={maxOriginWeight}
                icon={ORIGIN_FLAG[o.name] || "🌍"}
                delay={0.5 + i * 0.08}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* ── Brew Methods ── */}
      {topMethods.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className={`mx-4 mt-3 ${card}`}
        >
          <h3 className={sectionLabel}>Brew Methods</h3>
          <div className="flex gap-2.5">
            {topMethods.map((m, i) => {
              const label = m.name.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
              return (
                <motion.div
                  key={m.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.55 + i * 0.1 }}
                  className="flex-1 bg-latte/8 rounded-xl p-3 flex flex-col items-center gap-1.5"
                >
                  <span className="text-2xl">{BREW_ICON[m.name] || "☕"}</span>
                  <span className="text-[11px] font-medium text-espresso text-center leading-tight">{label}</span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* ── Experience: Vibe + Ritual ── */}
      <div className="mx-4 mt-3 grid grid-cols-2 gap-3">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className={card}
        >
          <h3 className={sectionLabel}>Cafe Vibe</h3>
          <div className="space-y-2">
            {brewfile.cafe_vibe.map((v) => (
              <div key={v.name} className="flex items-center gap-1.5">
                <span className="text-base">{VIBE_EMOJI[v.name] || "☕"}</span>
                <span className="text-[13px] font-medium text-espresso">{v.name}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.5 }}
          className={card}
        >
          <h3 className={sectionLabel}>Ritual</h3>
          <div className="space-y-2">
            {brewfile.ritual_pattern.map((r) => (
              <div key={r.name} className="flex items-center gap-1.5">
                <span className="text-base">{RITUAL_EMOJI[r.name] || "☕"}</span>
                <span className="text-[13px] font-medium text-espresso">{r.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom spacer */}
      <div className="h-6" />
    </div>
  );
}
