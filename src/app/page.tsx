"use client";

import { motion } from "framer-motion";
import Link from "next/link";

function SteamLine({ delay, x }: { delay: number; x: number }) {
  return (
    <motion.path
      d={`M${x},0 Q${x + 4},8 ${x - 2},16 Q${x + 6},24 ${x},32`}
      fill="none"
      stroke="#C8A882"
      strokeWidth={1.5}
      strokeLinecap="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: [0, 0.7, 0] }}
      transition={{
        duration: 2.4,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

export default function SplashScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-soft-white px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center gap-4"
      >
        {/* Coffee cup with steam + heart */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6, type: "spring", bounce: 0.4 }}
          className="relative w-28 h-28 flex items-center justify-center"
        >
          {/* Steam */}
          <svg
            className="absolute -top-6 left-1/2 -translate-x-1/2"
            width="40"
            height="32"
            viewBox="0 0 40 32"
          >
            <SteamLine delay={0} x={12} />
            <SteamLine delay={0.4} x={20} />
            <SteamLine delay={0.8} x={28} />
          </svg>

          {/* Cup */}
          <div className="w-20 h-16 bg-cream rounded-b-3xl rounded-t-lg border-2 border-latte/40 relative flex items-center justify-center mt-4">
            {/* Handle */}
            <div className="absolute -right-3 top-2 w-4 h-8 border-2 border-latte/40 rounded-r-full border-l-0" />
            {/* Heart in cup */}
            <motion.svg
              width="24"
              height="22"
              viewBox="0 0 24 22"
              className="mt-1"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8, type: "spring", bounce: 0.5 }}
            >
              <path
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                fill="#D4918B"
                opacity={0.8}
              />
            </motion.svg>
          </div>
        </motion.div>

        {/* Brand name */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="font-playfair text-5xl font-bold text-espresso tracking-tight mt-4"
        >
          Brewmance
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="text-latte text-lg text-center font-light tracking-wide"
        >
          Fall in love with your next cup
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="mt-10 w-full px-4"
        >
          <Link href="/auth">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full bg-blush text-white py-4 rounded-full text-lg font-medium shadow-lg shadow-blush/25 transition-colors hover:bg-accent-rose"
            >
              Get Started
            </motion.button>
          </Link>
        </motion.div>

        {/* Subtle bottom text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="mt-4 text-latte/60 text-xs tracking-widest uppercase"
        >
          Your perfect cup awaits
        </motion.p>
      </motion.div>
    </div>
  );
}
