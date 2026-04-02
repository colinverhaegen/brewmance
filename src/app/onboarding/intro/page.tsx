"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

function CoffeeBean({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <ellipse cx="12" cy="12" rx="8" ry="11" fill="#6B4226" />
      <ellipse cx="12" cy="12" rx="8" ry="11" fill="url(#beanShade)" />
      <path
        d="M12 1.5C10 5 10 8 12 12C14 16 14 19 12 22.5"
        stroke="#3B2314"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
      />
      <defs>
        <radialGradient id="beanShade" cx="0.4" cy="0.3">
          <stop offset="0%" stopColor="#8B5E3C" />
          <stop offset="100%" stopColor="#5C3A1E" />
        </radialGradient>
      </defs>
    </svg>
  );
}

function FallingBean({ delay, x, rotate, size = 24 }: { delay: number; x: number; rotate: number; size?: number }) {
  return (
    <motion.div
      className="absolute"
      style={{ left: `${x}%` }}
      initial={{ y: -40, opacity: 0, rotate: rotate }}
      animate={{
        y: [-40, 120, 100],
        opacity: [0, 0.9, 0.6],
        rotate: [rotate, rotate + 180, rotate + 220],
      }}
      transition={{
        duration: 2.5,
        delay,
        repeat: Infinity,
        repeatDelay: 1.5,
        ease: "easeIn",
      }}
    >
      <CoffeeBean size={size} />
    </motion.div>
  );
}

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
        {/* Falling beans animation */}
        <div className="relative w-40 h-32 mb-4 overflow-hidden">
          <FallingBean delay={0} x={15} rotate={-30} size={28} />
          <FallingBean delay={0.4} x={45} rotate={15} size={22} />
          <FallingBean delay={0.8} x={72} rotate={-10} size={26} />
          <FallingBean delay={1.2} x={30} rotate={25} size={20} />
          <FallingBean delay={1.6} x={60} rotate={-20} size={24} />
          <FallingBean delay={0.6} x={85} rotate={35} size={18} />
          <FallingBean delay={1.0} x={8} rotate={-45} size={22} />
        </div>

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
