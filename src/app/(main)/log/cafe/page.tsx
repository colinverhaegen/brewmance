"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { updateBrewfileFromCafeLog } from "@/lib/brewfile";
import type { Brewfile } from "@/types/brewfile";
import CupRating from "@/components/log/CupRating";
import FlavorTagPicker from "@/components/log/FlavorTagPicker";
import { Search, MapPin, ArrowLeft, Star, Camera } from "lucide-react";

interface Cafe {
  id: string;
  name: string;
  neighborhood: string;
  vibe_tags: string[];
  specialty_flags: string[];
  google_rating: number | null;
}

interface Drink {
  id: string;
  cafe_id: string;
  name: string;
  drink_type: string;
}

const NEIGHBORHOOD_LABELS: Record<string, string> = {
  tiong_bahru: "Tiong Bahru",
  tanjong_pagar_telok_ayer: "Tanjong Pagar",
  kampong_glam_bugis: "Kampong Glam",
  orchard_river_valley: "Orchard",
  holland_village_dempsey: "Holland V",
};

export default function CafeLogPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);

  // Data
  const [allCafes, setAllCafes] = useState<Cafe[]>([]);
  const [cafeSearch, setCafeSearch] = useState("");
  const [selectedCafe, setSelectedCafe] = useState<Cafe | null>(null);
  const [cafeDrinks, setCafeDrinks] = useState<Drink[]>([]);
  const [selectedDrink, setSelectedDrink] = useState<Drink | null>(null);
  const [customDrinkName, setCustomDrinkName] = useState("");
  const [rating, setRating] = useState(0);
  const [flavorTags, setFlavorTags] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    supabase.from("cafes").select("id, name, neighborhood, vibe_tags, specialty_flags, google_rating").then(({ data }) => {
      if (data) setAllCafes(data as Cafe[]);
    });
  }, []);

  // Load drinks when cafe selected
  useEffect(() => {
    if (!selectedCafe) return;
    supabase.from("cafe_drinks").select("id, cafe_id, name, drink_type").eq("cafe_id", selectedCafe.id).then(({ data }) => {
      if (data) setCafeDrinks(data as Drink[]);
    });
  }, [selectedCafe]);

  const filteredCafes = cafeSearch.trim()
    ? allCafes.filter((c) => c.name.toLowerCase().includes(cafeSearch.toLowerCase()))
    : allCafes.slice(0, 8);

  function goNext() { setDirection(1); setStep(step + 1); }
  function goBack() {
    if (step > 0) { setDirection(-1); setStep(step - 1); }
    else router.back();
  }

  async function saveLog() {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !selectedCafe) { setSaving(false); return; }

    const drinkName = selectedDrink?.name || customDrinkName;
    const drinkType = selectedDrink?.drink_type || null;

    // Insert log
    await supabase.from("logs_cafe").insert({
      user_id: user.id,
      cafe_id: selectedCafe.id,
      drink_id: selectedDrink?.id || null,
      drink_name: drinkName,
      rating,
      flavor_tags: flavorTags,
      notes: notes || null,
      photo_url: null,
      is_quick_log: false,
    });

    // Update cafe stats
    const { data: allLogs } = await supabase
      .from("logs_cafe")
      .select("rating")
      .eq("cafe_id", selectedCafe.id);
    if (allLogs) {
      const avg = allLogs.reduce((sum, l) => sum + (l as { rating: number }).rating, 0) / allLogs.length;
      await supabase.from("cafes").update({
        total_checkins: allLogs.length,
        avg_rating: Math.round(avg * 10) / 10,
      }).eq("id", selectedCafe.id);
    }

    // Update Brewfile
    const { data: bfData } = await supabase
      .from("brewfiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (bfData) {
      const bf = bfData as unknown as Brewfile & { total_logs: number };
      const updated = updateBrewfileFromCafeLog(bf, {
        drinkType,
        drinkName,
        rating,
        flavorTags,
        cafeVibes: selectedCafe.vibe_tags,
        cafeSpecialty: selectedCafe.specialty_flags,
      }, bf.total_logs);

      await supabase.from("brewfiles").update({
        ...updated,
        total_logs: bf.total_logs + 1,
        last_updated: new Date().toISOString(),
      }).eq("user_id", user.id);
    }

    setSaving(false);
    setComplete(true);
  }

  const canContinue = [
    !!selectedCafe,
    !!(selectedDrink || customDrinkName.trim()),
    rating > 0,
    true, // notes optional
  ][step];

  if (complete) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-soft-white px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", bounce: 0.3 }}
          className="flex flex-col items-center text-center"
        >
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", bounce: 0.5 }} className="text-6xl mb-4">
            ☕✨
          </motion.div>
          <h1 className="font-playfair text-[28px] font-bold text-espresso mb-2">Logged!</h1>
          <p className="text-latte text-[15px] mb-2">Your Brewfile is evolving.</p>

          <div className="bg-cream/50 rounded-2xl p-4 w-full max-w-[300px] mt-4 mb-8 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
            <p className="text-sm font-semibold text-espresso">{selectedCafe?.name}</p>
            <p className="text-xs text-latte">{selectedDrink?.name || customDrinkName}</p>
            <div className="flex items-center gap-1 mt-1">
              {Array.from({ length: rating }).map((_, i) => (
                <span key={i} className="text-blush text-sm">☕</span>
              ))}
            </div>
            {flavorTags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {flavorTags.map((t) => (
                  <span key={t} className="text-[10px] px-1.5 py-0.5 bg-blush/8 text-espresso rounded-full">{t}</span>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 w-full max-w-[300px]">
            <motion.button
              onClick={() => router.push("/brewfile")}
              whileTap={{ scale: 0.97 }}
              className="flex-1 py-3 rounded-3xl text-sm font-semibold bg-blush text-white"
            >
              View Brewfile
            </motion.button>
            <motion.button
              onClick={() => router.push("/log")}
              whileTap={{ scale: 0.97 }}
              className="flex-1 py-3 rounded-3xl text-sm font-semibold bg-cream text-espresso border border-latte/15"
            >
              Log Another
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (saving) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-soft-white">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="text-4xl mb-3">☕</motion.div>
        <p className="text-latte font-medium">Saving your log...</p>
      </div>
    );
  }

  const steps = [
    // Step 0: Select cafe
    <div key="cafe">
      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-latte/40" />
        <input
          type="text"
          value={cafeSearch}
          onChange={(e) => setCafeSearch(e.target.value)}
          placeholder="Search cafes..."
          autoFocus
          className="w-full pl-9 pr-3 py-3 rounded-xl bg-cream/50 border border-latte/15 text-sm text-espresso placeholder:text-latte/35 focus:outline-none focus:ring-2 focus:ring-blush/30"
        />
      </div>
      <div className="space-y-2 max-h-[50vh] overflow-y-auto">
        {filteredCafes.map((cafe) => (
          <motion.button
            key={cafe.id}
            whileTap={{ scale: 0.98 }}
            onClick={() => { setSelectedCafe(cafe); goNext(); }}
            className={`w-full flex items-center gap-3 p-3.5 rounded-xl border-2 text-left transition-all ${
              selectedCafe?.id === cafe.id ? "border-blush bg-blush/8" : "border-latte/15 bg-cream/40"
            }`}
          >
            <div className="w-10 h-10 bg-cream rounded-lg flex items-center justify-center text-lg flex-shrink-0">☕</div>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-semibold text-espresso truncate">{cafe.name}</p>
              <p className="text-xs text-latte flex items-center gap-1">
                <MapPin size={10} /> {NEIGHBORHOOD_LABELS[cafe.neighborhood] || cafe.neighborhood}
                {cafe.google_rating && <><Star size={10} fill="currentColor" className="ml-1" /> {cafe.google_rating}</>}
              </p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>,

    // Step 1: Select drink
    <div key="drink">
      <p className="text-sm text-latte mb-3">What did you have at {selectedCafe?.name}?</p>
      <div className="space-y-2 mb-4">
        {cafeDrinks.map((drink) => (
          <motion.button
            key={drink.id}
            whileTap={{ scale: 0.98 }}
            onClick={() => { setSelectedDrink(drink); setCustomDrinkName(""); }}
            className={`w-full p-3.5 rounded-xl border-2 text-left transition-all ${
              selectedDrink?.id === drink.id ? "border-blush bg-blush/8" : "border-latte/15 bg-cream/40"
            }`}
          >
            <p className="text-[14px] font-semibold text-espresso">{drink.name}</p>
            <p className="text-xs text-latte capitalize">{drink.drink_type?.replace(/-/g, " ")}</p>
          </motion.button>
        ))}
      </div>
      <div className="border-t border-latte/10 pt-3">
        <p className="text-xs text-latte mb-2">Something else?</p>
        <input
          type="text"
          value={customDrinkName}
          onChange={(e) => { setCustomDrinkName(e.target.value); setSelectedDrink(null); }}
          placeholder="Type drink name..."
          className="w-full px-4 py-3 rounded-xl bg-cream/50 border border-latte/15 text-sm text-espresso placeholder:text-latte/35 focus:outline-none focus:ring-2 focus:ring-blush/30"
        />
      </div>
    </div>,

    // Step 2: Rate + flavor tags
    <div key="rate">
      <div className="mb-8">
        <p className="text-sm text-latte text-center mb-4">How was it?</p>
        <CupRating value={rating} onChange={setRating} />
        {rating > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-sm text-espresso font-medium mt-2"
          >
            {rating === 1 ? "Not great" : rating === 2 ? "Okay" : rating === 3 ? "Good" : rating === 4 ? "Really good" : "Incredible!"}
          </motion.p>
        )}
      </div>
      <div>
        <p className="text-sm text-latte mb-3">What did you taste?</p>
        <FlavorTagPicker selected={flavorTags} onSelect={setFlavorTags} />
      </div>
    </div>,

    // Step 3: Notes (optional)
    <div key="notes">
      <p className="text-sm text-latte mb-4">Anything else? (Optional)</p>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Tasting notes, thoughts, anything..."
        rows={4}
        className="w-full px-4 py-3 rounded-xl bg-cream/50 border border-latte/15 text-sm text-espresso placeholder:text-latte/35 focus:outline-none focus:ring-2 focus:ring-blush/30 resize-none"
      />
      <button className="flex items-center gap-2 mt-3 px-4 py-2.5 rounded-xl bg-cream/50 border border-latte/15 text-sm text-latte">
        <Camera size={16} /> Add a photo
      </button>
    </div>,
  ];

  const titles = [
    "Where are you?",
    "What did you have?",
    "How was it?",
    "Anything else?",
  ];

  return (
    <div className="flex flex-col min-h-[100dvh] bg-soft-white">
      {/* Header */}
      <div className="px-4 pt-[env(safe-area-inset-top,12px)] pb-3">
        <div className="flex items-center gap-3 pt-3">
          <button onClick={goBack} className="text-latte hover:text-espresso p-1">
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1">
            <h1 className="font-playfair text-xl font-bold text-espresso">{titles[step]}</h1>
          </div>
          <span className="text-xs text-latte/50">{step + 1}/4</span>
        </div>
        {/* Progress */}
        <div className="h-1 bg-cream rounded-full mt-3 overflow-hidden">
          <motion.div
            className="h-full bg-blush rounded-full"
            animate={{ width: `${((step + 1) / 4) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 overflow-y-auto">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            initial={{ x: direction > 0 ? 150 : -150, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction > 0 ? -150 : 150, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {steps[step]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom action */}
      {step > 0 && (
        <div className="px-4 pb-[env(safe-area-inset-bottom,24px)] pt-3">
          <motion.button
            onClick={step === 3 ? saveLog : goNext}
            disabled={!canContinue}
            whileTap={canContinue ? { scale: 0.97 } : {}}
            className="w-full bg-blush text-white py-4 rounded-3xl text-[15px] font-semibold shadow-lg shadow-blush/20 disabled:opacity-30 disabled:shadow-none"
          >
            {step === 3 ? "Log It" : "Continue"}
          </motion.button>
        </div>
      )}
    </div>
  );
}
