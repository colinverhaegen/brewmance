"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Map, Layers } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { rankCafes } from "@/lib/recommendations";
import type { CafeRow } from "@/lib/recommendations";
import type { Brewfile } from "@/types/brewfile";
import CafeCard from "@/components/discover/CafeCard";
import FilterBar from "@/components/discover/FilterBar";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

const CafeMap = dynamic(() => import("@/components/discover/CafeMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-cream/50 rounded-2xl flex items-center justify-center">
      <span className="text-latte text-sm">Loading map...</span>
    </div>
  ),
});

interface CafeDrinkRow {
  id: string;
  cafe_id: string;
  name: string;
  drink_type: string;
}

export default function DiscoverPage() {
  const router = useRouter();
  const [cafes, setCafes] = useState<CafeRow[]>([]);
  const [drinks, setDrinks] = useState<CafeDrinkRow[]>([]);
  const [brewfile, setBrewfile] = useState<Brewfile | null>(null);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"cards" | "map">("cards");

  // Card stack state
  const [currentIndex, setCurrentIndex] = useState(0);

  // Filters
  const [neighborhood, setNeighborhood] = useState("");
  const [vibes, setVibes] = useState<string[]>([]);
  const [drinkTypes, setDrinkTypes] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  // Auth state
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      // Get user + brewfile
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        const { data: bf } = await supabase
          .from("brewfiles")
          .select("*")
          .eq("user_id", user.id)
          .single();
        if (bf) setBrewfile(bf as unknown as Brewfile);

        // Load saved cafes
        const { data: saves } = await supabase
          .from("saves")
          .select("cafe_id")
          .eq("user_id", user.id);
        if (saves) setSavedIds(new Set(saves.map((s: { cafe_id: string }) => s.cafe_id)));
      }

      // Load all cafes
      const { data: cafeData } = await supabase
        .from("cafes")
        .select("*");
      if (cafeData) setCafes(cafeData as CafeRow[]);

      // Load all drinks
      const { data: drinkData } = await supabase
        .from("cafe_drinks")
        .select("id, cafe_id, name, drink_type");
      if (drinkData) setDrinks(drinkData as CafeDrinkRow[]);

      setLoading(false);
    }
    load();
  }, []);

  // Filter + rank cafes
  const rankedCafes = useMemo(() => {
    let filtered = cafes;

    if (neighborhood) {
      filtered = filtered.filter((c) => c.neighborhood === neighborhood);
    }
    if (vibes.length > 0) {
      filtered = filtered.filter((c) =>
        vibes.some((v) => c.vibe_tags.map((t) => t.toLowerCase()).includes(v))
      );
    }
    if (drinkTypes.length > 0) {
      filtered = filtered.filter((c) =>
        drinkTypes.some((d) => c.drink_types.map((t) => t.toLowerCase()).includes(d))
      );
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter((c) => c.name.toLowerCase().includes(q));
    }

    return rankCafes(filtered, brewfile);
  }, [cafes, brewfile, neighborhood, vibes, drinkTypes, search]);

  // Reset card index when filters change
  useEffect(() => {
    setCurrentIndex(0);
  }, [neighborhood, vibes, drinkTypes, search]);

  // Get top drink for a cafe
  function getTopDrink(cafeId: string): string | undefined {
    const cafeDrinks = drinks.filter((d) => d.cafe_id === cafeId);
    return cafeDrinks[0]?.name;
  }

  // Save cafe
  const saveCafe = useCallback(async (cafeId: string) => {
    if (!userId) return;
    await supabase.from("saves").insert({ user_id: userId, cafe_id: cafeId });
    setSavedIds((prev) => { const next = new Set(Array.from(prev)); next.add(cafeId); return next; });
  }, [userId]);

  // Skip cafe (just advance)
  function handleSwipeLeft() {
    setCurrentIndex((i) => i + 1);
  }

  function handleSwipeRight() {
    const cafe = rankedCafes[currentIndex];
    if (cafe && !savedIds.has(cafe.id)) {
      saveCafe(cafe.id);
    }
    setCurrentIndex((i) => i + 1);
  }

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

  const currentCafe = rankedCafes[currentIndex];
  const nextCafe = rankedCafes[currentIndex + 1];
  const allSwiped = currentIndex >= rankedCafes.length;

  return (
    <div className="bg-soft-white min-h-screen pt-[env(safe-area-inset-top,12px)]">
      {/* Header */}
      <div className="px-4 pt-3 pb-2 flex items-center justify-between">
        <h1 className="font-playfair text-xl font-bold text-espresso">Discover</h1>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setViewMode(viewMode === "cards" ? "map" : "cards")}
          className="w-9 h-9 rounded-full bg-cream flex items-center justify-center text-espresso/60 hover:text-espresso transition-colors"
        >
          {viewMode === "cards" ? <Map size={18} /> : <Layers size={18} />}
        </motion.button>
      </div>

      {/* Filters */}
      <div className="px-4 pb-2">
        <FilterBar
          neighborhood={neighborhood}
          onNeighborhoodChange={setNeighborhood}
          vibes={vibes}
          onVibesChange={setVibes}
          drinkTypes={drinkTypes}
          onDrinkTypesChange={setDrinkTypes}
          search={search}
          onSearchChange={setSearch}
        />
      </div>

      {viewMode === "cards" ? (
        /* Card stack */
        <div className="px-4">
          <div className="relative h-[calc(100vh-280px)] max-h-[520px]">
            {allSwiped ? (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center h-full text-center px-4"
              >
                <span className="text-5xl mb-4">🗺️</span>
                <h2 className="font-playfair text-xl font-bold text-espresso mb-2">
                  You&apos;ve explored them all!
                </h2>
                <p className="text-latte text-sm mb-6 max-w-[260px]">
                  {neighborhood
                    ? "Try a different neighborhood or clear your filters."
                    : "Check back soon — more cafes are brewing."}
                </p>
                {neighborhood && (
                  <button
                    onClick={() => { setNeighborhood(""); setCurrentIndex(0); }}
                    className="px-6 py-2.5 bg-blush text-white rounded-full text-sm font-semibold"
                  >
                    Show all neighborhoods
                  </button>
                )}
              </motion.div>
            ) : (
              <>
                {/* Next card (underneath) */}
                {nextCafe && (
                  <div className="absolute inset-0 scale-[0.95] opacity-60">
                    <div className="h-full bg-cream rounded-2xl overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.06)]">
                      <div className="absolute inset-0 bg-gradient-to-b from-espresso/5 via-transparent to-espresso/60" />
                      <div className="absolute inset-0 flex items-center justify-center text-7xl opacity-15">☕</div>
                      <div className="absolute bottom-4 left-4">
                        <h3 className="font-playfair text-lg font-bold text-white">{nextCafe.name}</h3>
                      </div>
                    </div>
                  </div>
                )}
                {/* Current card */}
                <AnimatePresence>
                  {currentCafe && (
                    <CafeCard
                      key={currentCafe.id}
                      cafe={currentCafe}
                      onSwipeRight={handleSwipeRight}
                      onSwipeLeft={handleSwipeLeft}
                      onTap={() => router.push(`/cafe/${currentCafe.id}`)}
                      topDrinkName={getTopDrink(currentCafe.id)}
                    />
                  )}
                </AnimatePresence>
              </>
            )}
          </div>

          {/* Count indicator */}
          {!allSwiped && (
            <p className="text-center text-latte/40 text-xs mt-3">
              {currentIndex + 1} of {rankedCafes.length} cafes
            </p>
          )}
        </div>
      ) : (
        /* Map view */
        <div className="px-4">
          <div className="h-[calc(100vh-240px)] max-h-[560px]">
            <CafeMap
              cafes={rankedCafes}
              onCafeSelect={(id) => router.push(`/cafe/${id}`)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
