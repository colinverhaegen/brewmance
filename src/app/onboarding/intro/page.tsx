"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function OnboardingIntro() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-between min-h-[100dvh] bg-soft-white px-8 pb-[env(safe-area-inset-bottom,24px)] pt-[env(safe-area-inset-top,0px)]">
      <div className="flex-1" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center text-center"
      >
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring", bounce: 0.4 }}
          className="text-7xl mb-8"
        >
          ☕
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="font-playfair text-[32px] font-bold text-espresso leading-tight mb-4"
        >
          Time to spill{"\n"}the beans
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="text-latte text-[16px] leading-relaxed max-w-[300px]"
        >
          A few quick questions about how you like your coffee — so we can find your perfect match.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="text-latte/50 text-sm mt-3"
        >
          Takes about 1 minute
        </motion.p>
      </motion.div>

      <div className="flex-1" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 0.6 }}
        className="w-full space-y-3 pb-4"
      >
        <motion.button
          onClick={() => router.push("/onboarding")}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="w-full bg-blush text-white py-4 rounded-3xl text-[17px] font-semibold shadow-lg shadow-blush/20 hover:bg-accent-rose transition-colors"
        >
          Let&apos;s go
        </motion.button>
      </motion.div>
    </div>
  );
}
