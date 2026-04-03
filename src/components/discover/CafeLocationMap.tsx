"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface CafeLocationMapProps {
  lat: number;
  lng: number;
  name: string;
}

export default function CafeLocationMap({ lat, lng, name }: CafeLocationMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = L.map(mapRef.current, {
      zoomControl: false,
      attributionControl: false,
      dragging: false,
      scrollWheelZoom: false,
    }).setView([lat, lng], 16);

    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      maxZoom: 19,
    }).addTo(map);

    const pinIcon = L.divIcon({
      className: "",
      html: `<div style="width:32px;height:32px;background:#D4918B;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.2);display:flex;align-items:center;justify-content:center;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3"/></svg>
      </div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    L.marker([lat, lng], { icon: pinIcon }).addTo(map).bindPopup(name);

    return () => { map.remove(); };
  }, [lat, lng, name]);

  return <div ref={mapRef} className="w-full h-full" />;
}
