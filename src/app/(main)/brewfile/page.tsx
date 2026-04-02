"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Share2 } from "lucide-react";
import type { Brewfile, WeightedPreference } from "@/types/brewfile";
import RadarChart from "@/components/brewfile/RadarChart";

function topNames(items: WeightedPreference[], limit = 3): string[] {
  return items
    .sort((a, b) => b.weight - a.weight)
    .slice(0, limit)
    .map((i) => i.name);
}

function dimensionValue(items: WeightedPreference[]): number {
  if (items.length === 0) return 0;
  return Math.min(items.length / 3, 1);
}

const VIBE_EMOJI: Record<string, string> = {
  Minimalist: "◻️",
  Cozy: "🕯️",
  "Work-friendly": "💻",
  Social: "🎉",
  Aesthetic: "📸",
  Outdoor: "🌿",
};

const RITUAL_EMOJI: Record<string, string> = {
  "Morning Ritual": "🌅",
  "Afternoon Pick-me-up": "⚡",
  "Weekend Explorer": "🗺️",
  "Social Occasion": "👋",
  "Post-meal": "🍽️",
};

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
        <p className="text-latte text-sm">Complete the taste quiz to build your coffee profile.</p>
      </div>
    );
  }

  // Radar chart data — 7 taste/source dimensions
  const radarLabels = ["Drinks", "Roast", "Flavors", "Intensity", "Milk", "Origins", "Method"];
  const radarValues = [
    dimensionValue(brewfile.drink_type),
    brewfile.roast_profile,
    dimensionValue(brewfile.flavor_palette),
    brewfile.intensity,
    dimensionValue(brewfile.milk_extras),
    dimensionValue(brewfile.bean_origin),
    dimensionValue(brewfile.brew_method),
  ];

  const adventureLabel =
    brewfile.adventurousness < 0.33
      ? "Creature of Habit"
      : brewfile.adventurousness < 0.66
        ? "Open to Trying"
        : "Always Exploring";

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

      {/* Radar Chart Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mx-4 mt-4 bg-cream/50 rounded-2xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
      >
        <div className="flex justify-center">
          <RadarChart labels={radarLabels} values={radarValues} />
        </div>
      </motion.div>

      {/* Top Tastes */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mx-4 mt-4 bg-cream/50 rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
      >
        <h3 className="text-xs font-medium text-espresso/50 uppercase tracking-wider mb-3">Your Coffee DNA</h3>

        <div className="space-y-3">
          {brewfile.drink_type.length > 0 && (
            <div>
              <span className="text-xs text-latte font-medium">Drinks</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {topNames(brewfile.drink_type).map((d) => (
                  <span key={d} className="px-2.5 py-1 bg-blush/10 text-espresso text-xs font-medium rounded-full">{d}</span>
                ))}
              </div>
            </div>
          )}
          {brewfile.flavor_palette.length > 0 && (
            <div>
              <span className="text-xs text-latte font-medium">Flavors</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {topNames(brewfile.flavor_palette, 5).map((f) => (
                  <span key={f} className="px-2.5 py-1 bg-latte/10 text-espresso text-xs font-medium rounded-full">{f}</span>
                ))}
              </div>
            </div>
          )}
          {brewfile.bean_origin.length > 0 && (
            <div>
              <span className="text-xs text-latte font-medium">Origins</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {topNames(brewfile.bean_origin).map((o) => (
                  <span key={o} className="px-2.5 py-1 bg-cream text-espresso text-xs font-medium rounded-full border border-latte/15">{o}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Experience Cards */}
      <div className="mx-4 mt-4 grid grid-cols-2 gap-3">
        {/* Cafe Vibe */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="bg-cream/50 rounded-2xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
        >
          <h3 className="text-xs font-medium text-espresso/50 uppercase tracking-wider mb-2">Cafe Vibe</h3>
          <div className="space-y-1.5">
            {brewfile.cafe_vibe.map((v) => (
              <div key={v.name} className="flex items-center gap-1.5">
                <span className="text-base">{VIBE_EMOJI[v.name] || "☕"}</span>
                <span className="text-sm font-medium text-espresso">{v.name}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Ritual */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="bg-cream/50 rounded-2xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
        >
          <h3 className="text-xs font-medium text-espresso/50 uppercase tracking-wider mb-2">Ritual</h3>
          <div className="space-y-1.5">
            {brewfile.ritual_pattern.map((r) => (
              <div key={r.name} className="flex items-center gap-1.5">
                <span className="text-base">{RITUAL_EMOJI[r.name] || "☕"}</span>
                <span className="text-sm font-medium text-espresso">{r.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Adventurousness */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mx-4 mt-4 mb-6 bg-cream/50 rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
      >
        <h3 className="text-xs font-medium text-espresso/50 uppercase tracking-wider mb-3">Adventurousness</h3>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <div className="h-2.5 bg-latte/15 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-latte to-blush rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${brewfile.adventurousness * 100}%` }}
                transition={{ delay: 0.7, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </div>
          <span className="text-sm font-semibold text-espresso whitespace-nowrap">{adventureLabel}</span>
        </div>
      </motion.div>
    </div>
  );
}
