"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, MapPin, X } from "lucide-react";
import type { ScoredCafe } from "@/lib/recommendations";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const NEIGHBORHOOD_LABELS: Record<string, string> = {
  tiong_bahru: "Tiong Bahru",
  tanjong_pagar_telok_ayer: "Tanjong Pagar",
  kampong_glam_bugis: "Kampong Glam",
  orchard_river_valley: "Orchard",
  holland_village_dempsey: "Holland V / Dempsey",
};

interface CafeMapProps {
  cafes: ScoredCafe[];
  onCafeSelect: (cafeId: string) => void;
}

export default function CafeMap({ cafes, onCafeSelect }: CafeMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const [selectedCafe, setSelectedCafe] = useState<ScoredCafe | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    // Singapore center
    const map = L.map(mapRef.current, {
      zoomControl: false,
      attributionControl: false,
    }).setView([1.295, 103.84], 13);

    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      maxZoom: 19,
    }).addTo(map);

    // Custom pin icon
    const pinIcon = L.divIcon({
      className: "",
      html: `<div style="width:28px;height:28px;background:#D4918B;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.2);display:flex;align-items:center;justify-content:center;cursor:pointer;">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3"/></svg>
      </div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });

    cafes.forEach((cafe) => {
      if (!cafe.latitude || !cafe.longitude) return;
      const marker = L.marker([cafe.latitude, cafe.longitude], { icon: pinIcon }).addTo(map);
      marker.on("click", () => setSelectedCafe(cafe));
    });

    mapInstance.current = map;

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, [cafes]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full rounded-2xl overflow-hidden" />

      {/* Selected cafe mini card */}
      <AnimatePresence>
        {selectedCafe && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-4 left-3 right-3 bg-white rounded-2xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.12)]"
          >
            <button
              onClick={() => setSelectedCafe(null)}
              className="absolute top-3 right-3 text-latte/40 hover:text-espresso"
            >
              <X size={16} />
            </button>
            <div
              onClick={() => onCafeSelect(selectedCafe.id)}
              className="cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className="w-14 h-14 bg-cream rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                  ☕
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-playfair text-[15px] font-bold text-espresso truncate">
                    {selectedCafe.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-latte mt-0.5">
                    <span className="flex items-center gap-0.5">
                      <MapPin size={11} />
                      {NEIGHBORHOOD_LABELS[selectedCafe.neighborhood] || selectedCafe.neighborhood}
                    </span>
                    {selectedCafe.google_rating && (
                      <span className="flex items-center gap-0.5">
                        <Star size={11} fill="currentColor" />
                        {selectedCafe.google_rating.toFixed(1)}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-1 mt-1.5">
                    {selectedCafe.vibe_tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="px-2 py-0.5 bg-blush/8 text-espresso text-[10px] font-medium rounded-full">
                        {tag}
                      </span>
                    ))}
                    <span className="px-2 py-0.5 bg-blush/15 text-blush text-[10px] font-bold rounded-full">
                      {selectedCafe.matchPercent}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
