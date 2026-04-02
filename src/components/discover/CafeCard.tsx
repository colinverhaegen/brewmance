"use client";

import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { Heart, X, Star, MapPin } from "lucide-react";
import type { ScoredCafe } from "@/lib/recommendations";

const NEIGHBORHOOD_LABELS: Record<string, string> = {
  tiong_bahru: "Tiong Bahru",
  tanjong_pagar_telok_ayer: "Tanjong Pagar",
  kampong_glam_bugis: "Kampong Glam",
  orchard_river_valley: "Orchard",
  holland_village_dempsey: "Holland V / Dempsey",
};

interface CafeCardProps {
  cafe: ScoredCafe;
  onSwipeRight: () => void;
  onSwipeLeft: () => void;
  onTap: () => void;
  topDrinkName?: string;
}

export default function CafeCard({
  cafe,
  onSwipeRight,
  onSwipeLeft,
  onTap,
  topDrinkName,
}: CafeCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const saveOpacity = useTransform(x, [0, 80], [0, 1]);
  const skipOpacity = useTransform(x, [-80, 0], [1, 0]);

  function handleDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.x > 100) {
      onSwipeRight();
    } else if (info.offset.x < -100) {
      onSwipeLeft();
    }
  }

  const hoodLabel = NEIGHBORHOOD_LABELS[cafe.neighborhood] || cafe.neighborhood;

  return (
    <motion.div
      className="absolute inset-0 cursor-grab active:cursor-grabbing"
      style={{ x, rotate }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
      whileTap={{ scale: 0.98 }}
    >
      <div
        onClick={onTap}
        className="relative h-full bg-cream rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.1)]"
      >
        {/* Photo area */}
        <div className="absolute inset-0 bg-gradient-to-b from-espresso/10 via-transparent to-espresso/80" />
        <div className="absolute inset-0 flex items-center justify-center text-8xl opacity-20">
          ☕
        </div>

        {/* Swipe indicators */}
        <motion.div
          className="absolute top-6 right-6 bg-blush text-white px-4 py-2 rounded-xl font-bold text-sm -rotate-12 border-2 border-white z-10"
          style={{ opacity: saveOpacity }}
        >
          WANT TO TRY
        </motion.div>
        <motion.div
          className="absolute top-6 left-6 bg-charcoal/70 text-white px-4 py-2 rounded-xl font-bold text-sm rotate-12 border-2 border-white z-10"
          style={{ opacity: skipOpacity }}
        >
          SKIP
        </motion.div>

        {/* Match badge */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full z-10">
          <span className="text-xs font-bold text-blush">{cafe.matchPercent}% match</span>
        </div>

        {/* Content overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
          {/* Vibe tags */}
          <div className="flex flex-wrap gap-1.5 mb-2.5">
            {cafe.vibe_tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-0.5 bg-white/20 backdrop-blur-sm text-white text-[11px] font-medium rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Name + rating */}
          <h2 className="font-playfair text-2xl font-bold text-white leading-tight mb-1">
            {cafe.name}
          </h2>

          <div className="flex items-center gap-3 text-white/80 text-sm mb-3">
            <span className="flex items-center gap-1">
              <MapPin size={13} />
              {hoodLabel}
            </span>
            {cafe.google_rating && (
              <span className="flex items-center gap-1">
                <Star size={13} fill="currentColor" />
                {cafe.google_rating.toFixed(1)}
              </span>
            )}
          </div>

          {/* Top drink highlight */}
          {topDrinkName && (
            <div className="bg-white/15 backdrop-blur-sm rounded-xl px-3.5 py-2 mb-4">
              <span className="text-white/60 text-[11px] uppercase tracking-wider font-medium">Popular</span>
              <p className="text-white text-sm font-medium">{topDrinkName}</p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-center gap-6">
            <motion.button
              onClick={(e) => { e.stopPropagation(); onSwipeLeft(); }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30"
            >
              <X size={24} className="text-white" />
            </motion.button>
            <motion.button
              onClick={(e) => { e.stopPropagation(); onSwipeRight(); }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-14 h-14 bg-blush rounded-full flex items-center justify-center shadow-lg shadow-blush/30"
            >
              <Heart size={24} className="text-white" fill="white" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
