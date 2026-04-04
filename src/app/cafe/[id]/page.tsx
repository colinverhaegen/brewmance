"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Star, MapPin, Heart, Globe, Share2, PenLine } from "lucide-react";
import dynamic from "next/dynamic";

const CafeLocationMap = dynamic(() => import("@/components/discover/CafeLocationMap"), {
  ssr: false,
  loading: () => <div className="w-full h-40 bg-cream/50 rounded-xl" />,
});

const NEIGHBORHOOD_LABELS: Record<string, string> = {
  tiong_bahru: "Tiong Bahru",
  tanjong_pagar_telok_ayer: "Tanjong Pagar / Telok Ayer",
  kampong_glam_bugis: "Kampong Glam / Bugis",
  orchard_river_valley: "Orchard / River Valley",
  holland_village_dempsey: "Holland Village / Dempsey",
};

interface Cafe {
  id: string;
  name: string;
  description: string | null;
  address: string | null;
  neighborhood: string;
  latitude: number | null;
  longitude: number | null;
  google_rating: number | null;
  vibe_tags: string[];
  drink_types: string[];
  specialty_flags: string[];
  website: string | null;
  instagram: string | null;
  total_checkins: number;
  avg_rating: number;
}

interface CafeDrink {
  id: string;
  name: string;
  drink_type: string;
  description: string | null;
  price: number | null;
  flavor_tags: string[];
}

const FLAVOR_EMOJI: Record<string, string> = {
  Chocolate: "🍫", Caramel: "🍮", Vanilla: "🌿", Honey: "🍯",
  "Brown Sugar": "🟤", Berry: "🫐", Citrus: "🍊", Tropical: "🥭",
  "Stone Fruit": "🍑", "Dried Fruit": "🍇", Nutty: "🥜", Toffee: "🧈",
  Roasty: "🔥", Floral: "🌸", Herbal: "🍃", Spicy: "🌶️",
  Cinnamon: "🫚", Earthy: "🌍", Smoky: "♨️", Winey: "🍷",
  "Dark Cocoa": "☕", Toasted: "🍞", "Black Pepper": "🫘",
};

export default function CafeProfilePage() {
  const params = useParams();
  const router = useRouter();
  const cafeId = params.id as string;

  const [cafe, setCafe] = useState<Cafe | null>(null);
  const [drinks, setDrinks] = useState<CafeDrink[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      // Auth
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        const { data: save } = await supabase
          .from("saves")
          .select("id")
          .eq("user_id", user.id)
          .eq("cafe_id", cafeId)
          .single();
        if (save) setIsSaved(true);
      }

      // Cafe data
      const { data: cafeData } = await supabase
        .from("cafes")
        .select("*")
        .eq("id", cafeId)
        .single();
      if (cafeData) setCafe(cafeData as Cafe);

      // Drinks
      const { data: drinkData } = await supabase
        .from("cafe_drinks")
        .select("*")
        .eq("cafe_id", cafeId);
      if (drinkData) setDrinks(drinkData as CafeDrink[]);

      setLoading(false);
    }
    load();
  }, [cafeId]);

  async function toggleSave() {
    if (!userId) return;
    if (isSaved) {
      await supabase.from("saves").delete().eq("user_id", userId).eq("cafe_id", cafeId);
      setIsSaved(false);
    } else {
      await supabase.from("saves").insert({ user_id: userId, cafe_id: cafeId });
      setIsSaved(true);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="text-4xl">☕</motion.div>
      </div>
    );
  }

  if (!cafe) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-8 text-center">
        <span className="text-5xl mb-4">🔍</span>
        <h2 className="font-playfair text-xl font-bold text-espresso mb-2">Cafe not found</h2>
        <button onClick={() => router.back()} className="text-blush font-medium text-sm mt-2">Go back</button>
      </div>
    );
  }

  const hoodLabel = NEIGHBORHOOD_LABELS[cafe.neighborhood] || cafe.neighborhood;

  return (
    <div className="bg-soft-white min-h-screen pb-8">
      {/* Hero */}
      <div className="relative h-56 bg-gradient-to-b from-espresso/30 to-espresso/70">
        <div className="absolute inset-0 flex items-center justify-center text-9xl opacity-15">☕</div>

        {/* Nav buttons */}
        <div className="absolute top-[env(safe-area-inset-top,12px)] left-0 right-0 px-4 pt-3 flex items-center justify-between z-10">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => router.back()}
            className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
          >
            <ArrowLeft size={20} className="text-white" />
          </motion.button>
          <div className="flex gap-2">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleSave}
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                isSaved ? "bg-blush" : "bg-white/20 backdrop-blur-sm"
              }`}
            >
              <Heart size={20} className="text-white" fill={isSaved ? "white" : "none"} />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
            >
              <Share2 size={20} className="text-white" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 -mt-8 relative z-10">
        {/* Main info card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.08)]"
        >
          <h1 className="font-playfair text-[24px] font-bold text-espresso leading-tight">
            {cafe.name}
          </h1>

          <div className="flex items-center gap-3 mt-2 text-sm text-latte">
            <span className="flex items-center gap-1">
              <MapPin size={14} />
              {hoodLabel}
            </span>
            {cafe.google_rating && (
              <span className="flex items-center gap-1 text-espresso font-medium">
                <Star size={14} fill="#C8A882" className="text-latte" />
                {cafe.google_rating.toFixed(1)}
              </span>
            )}
            <span>{cafe.total_checkins} check-ins</span>
          </div>

          {/* Vibe tags */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {cafe.vibe_tags.map((tag) => (
              <span key={tag} className="px-2.5 py-1 bg-blush/8 text-espresso text-xs font-medium rounded-full">
                {tag}
              </span>
            ))}
          </div>

          {/* Specialty flags */}
          {cafe.specialty_flags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {cafe.specialty_flags.map((flag) => (
                <span key={flag} className="px-2.5 py-1 bg-latte/10 text-latte text-xs font-medium rounded-full">
                  ✦ {flag}
                </span>
              ))}
            </div>
          )}
        </motion.div>

        {/* Description */}
        {cafe.description && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4"
          >
            <p className="text-sm text-espresso/70 leading-relaxed">{cafe.description}</p>
          </motion.div>
        )}

        {/* Drink Menu */}
        {drinks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-5"
          >
            <h3 className="text-[11px] font-semibold text-espresso/40 uppercase tracking-wider mb-3">
              Menu Highlights
            </h3>
            <div className="space-y-2.5">
              {drinks.map((drink) => (
                <div
                  key={drink.id}
                  className="bg-cream/40 rounded-xl p-3.5 shadow-[0_1px_4px_rgba(0,0,0,0.04)]"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-[14px] font-semibold text-espresso">{drink.name}</h4>
                      <span className="text-xs text-latte capitalize">{drink.drink_type?.replace(/-/g, " ")}</span>
                    </div>
                    {drink.price && (
                      <span className="text-sm font-medium text-espresso">${drink.price.toFixed(2)}</span>
                    )}
                  </div>
                  {drink.flavor_tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {drink.flavor_tags.map((tag) => (
                        <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-latte/8 text-latte rounded-full">
                          {FLAVOR_EMOJI[tag] || ""} {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Address + map */}
        {cafe.address && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-5"
          >
            <h3 className="text-[11px] font-semibold text-espresso/40 uppercase tracking-wider mb-3">
              Location
            </h3>
            <p className="text-sm text-espresso/70 mb-3">{cafe.address}</p>
            {cafe.latitude && cafe.longitude && (
              <div className="h-40 rounded-xl overflow-hidden">
                <CafeLocationMap lat={cafe.latitude} lng={cafe.longitude} name={cafe.name} />
              </div>
            )}
          </motion.div>
        )}

        {/* Links */}
        {(cafe.website || cafe.instagram) && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mt-5 flex gap-3"
          >
            {cafe.website && (
              <a
                href={cafe.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 bg-cream/50 rounded-xl text-xs font-medium text-espresso/70 hover:text-espresso transition-colors"
              >
                <Globe size={14} /> Website
              </a>
            )}
            {cafe.instagram && (
              <a
                href={`https://instagram.com/${cafe.instagram.replace("@", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 bg-cream/50 rounded-xl text-xs font-medium text-espresso/70 hover:text-espresso transition-colors"
              >
                📸 Instagram
              </a>
            )}
          </motion.div>
        )}

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 space-y-3"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={toggleSave}
            className={`w-full py-3.5 rounded-3xl text-[15px] font-semibold transition-colors ${
              isSaved
                ? "bg-cream text-espresso border border-latte/20"
                : "bg-blush text-white shadow-lg shadow-blush/20"
            }`}
          >
            {isSaved ? "✓ Saved to Want to Try" : "♡ Want to Try"}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="w-full py-3.5 rounded-3xl text-[15px] font-semibold bg-cream text-espresso border border-latte/20"
          >
            <span className="flex items-center justify-center gap-2">
              <PenLine size={16} /> Log a Visit
            </span>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
