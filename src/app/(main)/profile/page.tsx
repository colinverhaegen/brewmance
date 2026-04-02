"use client";

import { motion } from "framer-motion";
import { User } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-8 text-center pt-[env(safe-area-inset-top,12px)]">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center"
      >
        <div className="w-16 h-16 bg-cream rounded-2xl flex items-center justify-center mb-4">
          <User size={28} className="text-latte" />
        </div>
        <h1 className="font-playfair text-xl font-bold text-espresso mb-2">
          Your profile
        </h1>
        <p className="text-latte text-sm max-w-[260px] leading-relaxed">
          Your coffee identity, activity history, and settings. Coming soon.
        </p>
      </motion.div>
    </div>
  );
}
