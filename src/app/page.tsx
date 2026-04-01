"use client";

import { motion } from "framer-motion";
import { Coffee } from "lucide-react";

export default function SplashScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-soft-white px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center gap-6"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
          className="w-20 h-20 rounded-full bg-cream flex items-center justify-center"
        >
          <Coffee className="w-10 h-10 text-espresso" />
        </motion.div>

        <h1 className="text-5xl font-bold text-espresso tracking-tight">
          Brewmance
        </h1>

        <p className="text-latte text-lg text-center">
          Find your perfect brew
        </p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-8"
        >
          <button className="bg-accent-rose text-soft-white px-8 py-3 rounded-full text-lg font-medium hover:bg-blush transition-colors">
            Get Started
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
