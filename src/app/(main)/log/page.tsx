"use client";

import { motion } from "framer-motion";
import { PenLine } from "lucide-react";

export default function LogPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-8 text-center pt-[env(safe-area-inset-top,12px)]">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center"
      >
        <div className="w-16 h-16 bg-cream rounded-2xl flex items-center justify-center mb-4">
          <PenLine size={28} className="text-latte" />
        </div>
        <h1 className="font-playfair text-xl font-bold text-espresso mb-2">
          Log a cup
        </h1>
        <p className="text-latte text-sm max-w-[260px] leading-relaxed">
          Rate your cafe visits and home brews. Every log refines your Brewfile. Coming soon.
        </p>
      </motion.div>
    </div>
  );
}
