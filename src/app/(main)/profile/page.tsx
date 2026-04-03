"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { User, LogOut, Heart, Star, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";

const NEIGHBORHOOD_LABELS: Record<string, string> = {
  tiong_bahru: "Tiong Bahru",
  tanjong_pagar_telok_ayer: "Tanjong Pagar",
  kampong_glam_bugis: "Kampong Glam",
  orchard_river_valley: "Orchard",
  holland_village_dempsey: "Holland V / Dempsey",
};

interface SavedCafe {
  id: string;
  name: string;
  neighborhood: string;
  google_rating: number | null;
  vibe_tags: string[];
}

export default function ProfilePage() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [savedCafes, setSavedCafes] = useState<SavedCafe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      setEmail(user.email || null);

      // Load saved cafes
      const { data: saves } = await supabase
        .from("saves")
        .select("cafe_id")
        .eq("user_id", user.id);

      if (saves && saves.length > 0) {
        const cafeIds = saves.map((s: { cafe_id: string }) => s.cafe_id);
        const { data: cafes } = await supabase
          .from("cafes")
          .select("id, name, neighborhood, google_rating, vibe_tags")
          .in("id", cafeIds);
        if (cafes) setSavedCafes(cafes as SavedCafe[]);
      }

      setLoading(false);
    }
    load();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  async function removeSave(cafeId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("saves").delete().eq("user_id", user.id).eq("cafe_id", cafeId);
    setSavedCafes((prev) => prev.filter((c) => c.id !== cafeId));
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="text-4xl">☕</motion.div>
      </div>
    );
  }

  return (
    <div className="bg-soft-white min-h-screen pt-[env(safe-area-inset-top,12px)]">
      {/* Header */}
      <div className="px-6 pt-4 pb-4">
        <h1 className="font-playfair text-2xl font-bold text-espresso">Profile</h1>
      </div>

      {/* User info */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-4 bg-cream/50 rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-blush/10 rounded-full flex items-center justify-center">
            <User size={24} className="text-blush" />
          </div>
          <div className="flex-1">
            {email ? (
              <>
                <p className="text-[15px] font-semibold text-espresso">{email}</p>
                <p className="text-xs text-latte">Coffee lover</p>
              </>
            ) : (
              <>
                <p className="text-[15px] font-semibold text-espresso">Not logged in</p>
                <button
                  onClick={() => router.push("/auth?mode=login")}
                  className="text-xs text-blush font-medium"
                >
                  Log in to save your data
                </button>
              </>
            )}
          </div>
          {email && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="p-2 text-latte/40 hover:text-accent-rose transition-colors"
            >
              <LogOut size={18} />
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Saved Cafes */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mx-4 mt-4"
      >
        <div className="flex items-center gap-2 mb-3">
          <Heart size={16} className="text-blush" fill="#D4918B" />
          <h3 className="text-[11px] font-semibold text-espresso/40 uppercase tracking-wider">
            Want to Try ({savedCafes.length})
          </h3>
        </div>

        {savedCafes.length === 0 ? (
          <div className="bg-cream/30 rounded-2xl p-6 text-center">
            <span className="text-3xl mb-2 block">☕</span>
            <p className="text-sm text-latte">
              No saved cafes yet. Swipe right on cafes you want to try!
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {savedCafes.map((cafe, i) => (
              <motion.div
                key={cafe.id}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-cream/50 rounded-xl p-3.5 shadow-[0_1px_4px_rgba(0,0,0,0.04)] flex items-center gap-3"
              >
                <div
                  onClick={() => router.push(`/cafe/${cafe.id}`)}
                  className="flex-1 cursor-pointer"
                >
                  <h4 className="text-[14px] font-semibold text-espresso">{cafe.name}</h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-latte flex items-center gap-0.5">
                      <MapPin size={10} />
                      {NEIGHBORHOOD_LABELS[cafe.neighborhood] || cafe.neighborhood}
                    </span>
                    {cafe.google_rating && (
                      <span className="text-xs text-latte flex items-center gap-0.5">
                        <Star size={10} fill="currentColor" />
                        {cafe.google_rating.toFixed(1)}
                      </span>
                    )}
                  </div>
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => removeSave(cafe.id)}
                  className="p-2 text-blush hover:text-accent-rose transition-colors"
                >
                  <Heart size={16} fill="currentColor" />
                </motion.button>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Bottom spacer */}
      <div className="h-6" />
    </div>
  );
}
