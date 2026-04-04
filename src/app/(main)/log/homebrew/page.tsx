"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { updateBrewfileFromHomeBrewLog } from "@/lib/brewfile";
import type { Brewfile } from "@/types/brewfile";
import CupRating from "@/components/log/CupRating";
import FlavorTagPicker from "@/components/log/FlavorTagPicker";
import BeanDetails from "@/components/log/BeanDetails";
import { ArrowLeft } from "lucide-react";

const BREW_METHODS = [
  { id: "espresso-machine", icon: "☕", label: "Espresso Machine" },
  { id: "pour-over", icon: "🫗", label: "Pour Over" },
  { id: "aeropress", icon: "🔬", label: "AeroPress" },
  { id: "french-press", icon: "🫖", label: "French Press" },
  { id: "cold-brew", icon: "🧊", label: "Cold Brew" },
  { id: "moka-pot", icon: "🏺", label: "Moka Pot" },
  { id: "v60", icon: "🔻", label: "V60" },
  { id: "chemex", icon: "⏳", label: "Chemex" },
];

const GRIND_SIZES = ["Fine", "Medium-Fine", "Medium", "Medium-Coarse", "Coarse"];

export default function HomeBrewLogPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);

  const [beanNames, setBeanNames] = useState<string[]>([""]);
  const [beanBrand, setBeanBrand] = useState("");
  const [beanOrigins, setBeanOrigins] = useState<string[]>([]);
  const [roastLevel, setRoastLevel] = useState("");
  const [brewMethod, setBrewMethod] = useState("");
  const [rating, setRating] = useState(0);
  const [flavorTags, setFlavorTags] = useState<string[]>([]);
  const [grindSize, setGrindSize] = useState("");
  const [waterTemp, setWaterTemp] = useState("");
  const [ratio, setRatio] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [complete, setComplete] = useState(false);

  function goNext() { setDirection(1); setStep(step + 1); }
  function goBack() {
    if (step > 0) { setDirection(-1); setStep(step - 1); }
    else router.back();
  }

  async function saveLog() {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setSaving(false); return; }

    await supabase.from("logs_homebrew").insert({
      user_id: user.id,
      bean_name: beanNames.filter(Boolean).join(" + ") || "Unknown",
      bean_brand: beanBrand || null,
      bean_origin: beanOrigins.join(", ") || null,
      brew_method: brewMethod,
      rating,
      flavor_tags: flavorTags,
      notes: notes || null,
      grind_size: grindSize || null,
      water_temp: waterTemp || null,
      ratio: ratio || null,
      photo_url: null,
    });

    // Update Brewfile
    const { data: bfData } = await supabase
      .from("brewfiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (bfData) {
      const bf = bfData as unknown as Brewfile & { total_logs: number };
      const updated = updateBrewfileFromHomeBrewLog(bf, {
        brewMethod,
        beanOrigin: beanOrigins[0] || null,
        rating,
        flavorTags,
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
    beanNames.some((n) => n.trim().length > 0),
    !!brewMethod,
    rating > 0,
    true, // optional
  ][step];

  if (complete) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-soft-white px-8">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", bounce: 0.3 }} className="flex flex-col items-center text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", bounce: 0.5 }} className="text-6xl mb-4">🫘✨</motion.div>
          <h1 className="font-playfair text-[28px] font-bold text-espresso mb-2">Brewed & Logged!</h1>
          <p className="text-latte text-[15px] mb-2">Your Brewfile is evolving.</p>

          <div className="bg-cream/50 rounded-2xl p-4 w-full max-w-[300px] mt-4 mb-8 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
            <p className="text-sm font-semibold text-espresso">{beanNames.filter(Boolean).join(" + ")}</p>
            <p className="text-xs text-latte">{BREW_METHODS.find((m) => m.id === brewMethod)?.label} {beanOrigins.length > 0 && `· ${beanOrigins.join(", ")}`}</p>
            <div className="flex items-center gap-1 mt-1">
              {Array.from({ length: rating }).map((_, i) => (
                <span key={i} className="text-blush text-sm">☕</span>
              ))}
            </div>
          </div>

          <div className="flex gap-3 w-full max-w-[300px]">
            <motion.button onClick={() => router.push("/brewfile")} whileTap={{ scale: 0.97 }} className="flex-1 py-3 rounded-3xl text-sm font-semibold bg-blush text-white">View Brewfile</motion.button>
            <motion.button onClick={() => router.push("/log")} whileTap={{ scale: 0.97 }} className="flex-1 py-3 rounded-3xl text-sm font-semibold bg-cream text-espresso border border-latte/15">Log Another</motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (saving) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-soft-white">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="text-4xl mb-3">🫘</motion.div>
        <p className="text-latte font-medium">Saving your brew...</p>
      </div>
    );
  }

  const steps = [
    // Step 0: Bean info
    <div key="beans">
      <div className="space-y-4">
        <BeanDetails
          beanNames={beanNames}
          onBeanNamesChange={setBeanNames}
          origins={beanOrigins}
          onOriginsChange={setBeanOrigins}
          roastLevel={roastLevel}
          onRoastLevelChange={setRoastLevel}
        />
        <div>
          <label className="block text-[13px] font-medium text-espresso/70 mb-1.5 uppercase tracking-wider">Roaster / Brand (optional)</label>
          <input type="text" value={beanBrand} onChange={(e) => setBeanBrand(e.target.value)} placeholder="e.g. Nylon Coffee Roasters" className="w-full px-4 py-3 rounded-xl bg-cream/50 border border-latte/15 text-sm text-espresso placeholder:text-latte/35 focus:outline-none focus:ring-2 focus:ring-blush/30" />
        </div>
      </div>
    </div>,

    // Step 1: Brew method
    <div key="method">
      <div className="grid grid-cols-2 gap-3">
        {BREW_METHODS.map((m, i) => (
          <motion.button key={m.id} onClick={() => setBrewMethod(m.id)}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
            whileTap={{ scale: 0.95 }}
            className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${brewMethod === m.id ? "border-blush bg-blush/8" : "border-latte/15 bg-cream/40"}`}>
            <span className="text-3xl">{m.icon}</span>
            <span className="text-xs font-semibold text-espresso">{m.label}</span>
          </motion.button>
        ))}
      </div>
    </div>,

    // Step 2: Rate + flavor tags
    <div key="rate">
      <div className="mb-8">
        <p className="text-sm text-latte text-center mb-4">How was it?</p>
        <CupRating value={rating} onChange={setRating} />
        {rating > 0 && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-sm text-espresso font-medium mt-2">
            {rating === 1 ? "Not great" : rating === 2 ? "Okay" : rating === 3 ? "Good" : rating === 4 ? "Really good" : "Incredible!"}
          </motion.p>
        )}
      </div>
      <p className="text-sm text-latte mb-3">What did you taste?</p>
      <FlavorTagPicker selected={flavorTags} onSelect={setFlavorTags} />
    </div>,

    // Step 3: Dial it in (optional)
    <div key="details">
      <p className="text-sm text-latte mb-4">For the nerds — totally optional.</p>
      <div className="space-y-4">
        <div>
          <label className="block text-[13px] font-medium text-espresso/70 mb-1.5 uppercase tracking-wider">Grind Size</label>
          <div className="flex flex-wrap gap-1.5">
            {GRIND_SIZES.map((g) => (
              <button key={g} onClick={() => setGrindSize(grindSize === g ? "" : g)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${grindSize === g ? "bg-blush/15 text-blush border border-blush/30" : "bg-cream/40 text-espresso/50 border border-transparent"}`}>
                {g}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-[13px] font-medium text-espresso/70 mb-1.5 uppercase tracking-wider">Water Temp</label>
          <input type="text" value={waterTemp} onChange={(e) => setWaterTemp(e.target.value)} placeholder="e.g. 93°C" className="w-full px-4 py-3 rounded-xl bg-cream/50 border border-latte/15 text-sm text-espresso placeholder:text-latte/35 focus:outline-none focus:ring-2 focus:ring-blush/30" />
        </div>
        <div>
          <label className="block text-[13px] font-medium text-espresso/70 mb-1.5 uppercase tracking-wider">Ratio</label>
          <input type="text" value={ratio} onChange={(e) => setRatio(e.target.value)} placeholder="e.g. 1:15" className="w-full px-4 py-3 rounded-xl bg-cream/50 border border-latte/15 text-sm text-espresso placeholder:text-latte/35 focus:outline-none focus:ring-2 focus:ring-blush/30" />
        </div>
        <div>
          <label className="block text-[13px] font-medium text-espresso/70 mb-1.5 uppercase tracking-wider">Notes</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Tasting notes, thoughts..." rows={3} className="w-full px-4 py-3 rounded-xl bg-cream/50 border border-latte/15 text-sm text-espresso placeholder:text-latte/35 focus:outline-none focus:ring-2 focus:ring-blush/30 resize-none" />
        </div>
      </div>
    </div>,
  ];

  const titles = ["What beans?", "How did you brew it?", "How was it?", "Dial it in"];

  return (
    <div className="flex flex-col min-h-[100dvh] bg-soft-white">
      <div className="px-4 pt-[env(safe-area-inset-top,12px)] pb-3">
        <div className="flex items-center gap-3 pt-3">
          <button onClick={goBack} className="text-latte hover:text-espresso p-1"><ArrowLeft size={20} /></button>
          <h1 className="font-playfair text-xl font-bold text-espresso flex-1">{titles[step]}</h1>
          <span className="text-xs text-latte/50">{step + 1}/4</span>
        </div>
        <div className="h-1 bg-cream rounded-full mt-3 overflow-hidden">
          <motion.div className="h-full bg-blush rounded-full" animate={{ width: `${((step + 1) / 4) * 100}%` }} transition={{ duration: 0.3 }} />
        </div>
      </div>

      <div className="flex-1 px-4 overflow-y-auto">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div key={step} custom={direction} initial={{ x: direction > 0 ? 150 : -150, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: direction > 0 ? -150 : 150, opacity: 0 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}>
            {steps[step]}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="px-4 pb-[env(safe-area-inset-bottom,24px)] pt-3">
        <motion.button
          onClick={step === 3 ? saveLog : goNext}
          disabled={!canContinue}
          whileTap={canContinue ? { scale: 0.97 } : {}}
          className="w-full bg-blush text-white py-4 rounded-3xl text-[15px] font-semibold shadow-lg shadow-blush/20 disabled:opacity-30 disabled:shadow-none"
        >
          {step === 3 ? "Log It" : step === 2 ? "Continue" : "Continue"}
        </motion.button>
        {step === 3 && (
          <button onClick={saveLog} className="w-full text-center text-sm text-latte mt-2">Skip & save</button>
        )}
      </div>
    </div>
  );
}
