"use client";

import { motion } from "framer-motion";
import Link from "next/link";

function SteamLine({ delay, x, height }: { delay: number; x: number; height: number }) {
  return (
    <motion.path
      d={`M${x},${height} C${x + 3},${height * 0.75} ${x - 4},${height * 0.5} ${x + 2},${height * 0.25} S${x - 2},0 ${x},0`}
      fill="none"
      stroke="url(#steamGradient)"
      strokeWidth={2}
      strokeLinecap="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{
        pathLength: [0, 1, 1],
        opacity: [0, 0.6, 0],
      }}
      transition={{
        duration: 3,
        delay,
        repeat: Infinity,
        ease: "easeOut",
      }}
    />
  );
}

export default function SplashScreen() {
  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-soft-white px-8 pb-[env(safe-area-inset-bottom,24px)] pt-[env(safe-area-inset-top,0px)]">
      {/* Top spacer */}
      <div className="flex-1" />

      {/* Center content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="flex flex-col items-center"
      >
        {/* Illustration: elegant coffee cup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8"
        >
          <svg width="120" height="140" viewBox="0 0 120 140" fill="none">
            <defs>
              <linearGradient id="steamGradient" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#C8A882" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#C8A882" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="cupGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F5EDE3" />
                <stop offset="100%" stopColor="#E8DDD0" />
              </linearGradient>
              <linearGradient id="coffeeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#C8A882" />
                <stop offset="100%" stopColor="#A88B6A" />
              </linearGradient>
            </defs>

            {/* Steam */}
            <g transform="translate(30, 0)">
              <SteamLine delay={0} x={10} height={40} />
              <SteamLine delay={0.8} x={28} height={44} />
              <SteamLine delay={1.6} x={46} height={38} />
            </g>

            {/* Saucer */}
            <ellipse cx="55" cy="132" rx="42" ry="8" fill="#E8DDD0" />
            <ellipse cx="55" cy="130" rx="38" ry="6" fill="#F5EDE3" />

            {/* Cup body */}
            <path
              d="M25 65 L22 120 Q22 128 35 130 L75 130 Q88 128 88 120 L85 65 Z"
              fill="url(#cupGradient)"
              stroke="#D4C4B0"
              strokeWidth="1"
            />

            {/* Coffee surface */}
            <ellipse cx="55" cy="68" rx="30" ry="8" fill="url(#coffeeGradient)" />

            {/* Cup rim */}
            <ellipse cx="55" cy="65" rx="32" ry="9" fill="none" stroke="#D4C4B0" strokeWidth="1.5" />
            <ellipse cx="55" cy="65" rx="32" ry="9" fill="#F5EDE3" opacity="0.3" />

            {/* Handle */}
            <path
              d="M88 78 Q104 80 104 97 Q104 114 88 116"
              fill="none"
              stroke="#D4C4B0"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Latte art heart */}
            <motion.g
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.8, type: "spring", bounce: 0.4 }}
              style={{ transformOrigin: "55px 68px" }}
            >
              <path
                d="M55 76 L52.5 73.5 C49 69.5 46 67.5 49 64 C50.5 62 53 62.5 55 65 C57 62.5 59.5 62 61 64 C64 67.5 61 69.5 57.5 73.5 Z"
                fill="#E8DDD0"
                opacity="0.9"
              />
            </motion.g>
          </svg>
        </motion.div>

        {/* Brand name */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="font-playfair text-[44px] font-bold text-espresso tracking-tight leading-none"
        >
          Brewmance
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-3 text-latte text-[17px] text-center tracking-wide"
        >
          Fall in love with your next cup
        </motion.p>
      </motion.div>

      {/* Bottom section */}
      <div className="flex-1 flex flex-col justify-end w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="w-full space-y-4"
        >
          <Link href="/auth" className="block">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="w-full bg-blush text-white py-4 rounded-3xl text-[17px] font-semibold shadow-lg shadow-blush/20 hover:bg-accent-rose transition-colors"
            >
              Get Started
            </motion.button>
          </Link>

          <Link href="/auth?mode=login" className="block">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="w-full bg-cream text-espresso py-4 rounded-3xl text-[17px] font-semibold hover:bg-cream/80 transition-colors"
            >
              I already have an account
            </motion.button>
          </Link>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3, duration: 0.8 }}
            className="text-center text-latte/50 text-xs tracking-wider uppercase pt-2 pb-2"
          >
            Your perfect cup awaits
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
