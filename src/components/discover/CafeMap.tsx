"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, MapPin, ChevronRight, X } from "lucide-react";
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

const VIBE_EMOJI: Record<string, string> = {
  minimalist: "◻️", cozy: "🕯️", "work-friendly": "💻",
  social: "🎉", aesthetic: "📸", outdoor: "🌿",
  "hidden-gem": "💎", "brunch-spot": "🥞", rustic: "🪵", industrial: "🏭",
};

interface CafeMapProps {
  cafes: ScoredCafe[];
  onCafeSelect: (cafeId: string) => void;
}

function makePinHtml(isSelected: boolean) {
  const size = isSelected ? 36 : 28;
  const bg = isSelected ? "#B5656B" : "#D4918B";
  const border = isSelected ? "4px solid white" : "3px solid white";
  const shadow = isSelected
    ? "0 2px 12px rgba(181,101,107,0.5)"
    : "0 2px 6px rgba(0,0,0,0.2)";
  return `<div style="width:${size}px;height:${size}px;background:${bg};border-radius:50%;border:${border};box-shadow:${shadow};display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all 0.15s;">
    <svg width="${isSelected ? 18 : 14}" height="${isSelected ? 18 : 14}" viewBox="0 0 24 24" fill="white"><path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3"/></svg>
  </div>`;
}

export default function CafeMap({ cafes, onCafeSelect }: CafeMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const [selectedCafe, setSelectedCafe] = useState<ScoredCafe | null>(null);
  const selectedIdRef = useRef<string | null>(null);
  // Flag to prevent map click from immediately dismissing after marker click
  const justClickedMarkerRef = useRef(false);

  function resetSelectedPin() {
    if (!selectedIdRef.current) return;
    const prevMarker = markersRef.current.get(selectedIdRef.current);
    if (prevMarker) {
      prevMarker.setIcon(L.divIcon({
        className: "",
        html: makePinHtml(false),
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      }));
    }
    selectedIdRef.current = null;
  }

  function handleMarkerClick(cafe: ScoredCafe) {
    justClickedMarkerRef.current = true;
    setTimeout(() => { justClickedMarkerRef.current = false; }, 100);

    // Reset previous
    resetSelectedPin();

    // Highlight new
    const marker = markersRef.current.get(cafe.id);
    if (marker) {
      marker.setIcon(L.divIcon({
        className: "",
        html: makePinHtml(true),
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      }));
      marker.setZIndexOffset(1000);
    }

    selectedIdRef.current = cafe.id;
    setSelectedCafe(cafe);
  }

  function dismissCard() {
    resetSelectedPin();
    setSelectedCafe(null);
  }

  useEffect(() => {
    if (!mapRef.current) return;

    if (mapInstance.current) {
      mapInstance.current.remove();
      mapInstance.current = null;
      markersRef.current.clear();
    }

    const map = L.map(mapRef.current, {
      zoomControl: false,
      attributionControl: false,
    }).setView([1.295, 103.84], 13);

    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      maxZoom: 19,
    }).addTo(map);

    const defaultIcon = L.divIcon({
      className: "",
      html: makePinHtml(false),
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });

    cafes.forEach((cafe) => {
      if (!cafe.latitude || !cafe.longitude) return;
      const marker = L.marker([cafe.latitude, cafe.longitude], {
        icon: defaultIcon,
      }).addTo(map);
      marker.on("click", (e: L.LeafletMouseEvent) => {
        L.DomEvent.stopPropagation(e);
        handleMarkerClick(cafe);
      });
      markersRef.current.set(cafe.id, marker);
    });

    map.on("click", () => {
      if (justClickedMarkerRef.current) return;
      dismissCard();
    });

    mapInstance.current = map;

    return () => {
      map.remove();
      mapInstance.current = null;
      markersRef.current.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cafes]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full rounded-2xl overflow-hidden" style={{ zIndex: 1 }} />

      {/* Insight card overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2 }}>
        <AnimatePresence>
          {selectedCafe && (
            <motion.div
              key={selectedCafe.id}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute bottom-4 left-3 right-3 bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.14)] overflow-hidden pointer-events-auto"
            >
              {/* Close */}
              <button
                onClick={dismissCard}
                className="absolute top-3 right-3 w-6 h-6 bg-latte/10 rounded-full flex items-center justify-center text-latte/50 hover:text-espresso hover:bg-latte/20 transition-all z-10"
              >
                <X size={14} />
              </button>

              <div className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-cream rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                    ☕
                  </div>
                  <div className="flex-1 min-w-0 pr-6">
                    <h3 className="font-playfair text-[16px] font-bold text-espresso leading-tight">
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
                      <span className="text-blush font-bold">
                        {selectedCafe.matchPercent}% match
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {selectedCafe.vibe_tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="flex items-center gap-0.5 px-2 py-0.5 bg-cream text-espresso text-[11px] font-medium rounded-full">
                      {VIBE_EMOJI[tag] || ""} {tag}
                    </span>
                  ))}
                  {selectedCafe.specialty_flags.slice(0, 2).map((flag) => (
                    <span key={flag} className="px-2 py-0.5 bg-latte/8 text-latte text-[11px] font-medium rounded-full">
                      ✦ {flag}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <motion.button
                  onClick={() => onCafeSelect(selectedCafe.id)}
                  whileTap={{ scale: 0.97 }}
                  className="w-full mt-3 py-2.5 bg-blush text-white rounded-xl text-[13px] font-semibold flex items-center justify-center gap-1 hover:bg-accent-rose transition-colors"
                >
                  View cafe <ChevronRight size={14} />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
