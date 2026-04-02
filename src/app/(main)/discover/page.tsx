"use client";

import { motion } from "framer-motion";
import { Compass } from "lucide-react";

export default function DiscoverPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-8 text-center pt-[env(safe-area-inset-top,12px)]">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center"
      >
        <div className="w-16 h-16 bg-cream rounded-2xl flex items-center justify-center mb-4">
          <Compass size={28} className="text-latte" />
        </div>
        <h1 className="font-playfair text-xl font-bold text-espresso mb-2">
          Discover cafes
        </h1>
        <p className="text-latte text-sm max-w-[260px] leading-relaxed">
          Swipe through cafes matched to your Brewfile. Coming soon — your coffee city awaits.
        </p>
      </motion.div>
    </div>
  );
}
