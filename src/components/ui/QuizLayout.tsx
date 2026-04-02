"use client";

import { motion, AnimatePresence } from "framer-motion";
import ProgressBar from "./ProgressBar";

interface QuizLayoutProps {
  step: number;
  totalSteps: number;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  canContinue: boolean;
  onContinue: () => void;
  onBack: () => void;
  continueLabel?: string;
  showSkip?: boolean;
  onSkip?: () => void;
  direction: number;
}

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 200 : -200,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -200 : 200,
    opacity: 0,
  }),
};

export default function QuizLayout({
  step,
  totalSteps,
  title,
  subtitle,
  children,
  canContinue,
  onContinue,
  onBack,
  continueLabel = "Continue",
  showSkip,
  onSkip,
  direction,
}: QuizLayoutProps) {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-soft-white">
      {/* Header */}
      <div className="px-6 pt-[env(safe-area-inset-top,12px)] pb-4">
        <div className="flex items-center justify-between mb-4 pt-3">
          <button
            onClick={onBack}
            className="text-latte hover:text-espresso transition-colors p-1 -ml-1"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-xs text-latte/60 font-medium tracking-wider uppercase">
            {step + 1} of {totalSteps}
          </span>
          {showSkip ? (
            <button
              onClick={onSkip}
              className="text-sm text-latte hover:text-espresso transition-colors font-medium"
            >
              Skip
            </button>
          ) : (
            <div className="w-8" />
          )}
        </div>
        <ProgressBar current={step} total={totalSteps} />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col px-6 overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1 flex flex-col"
          >
            <h1 className="font-playfair text-[28px] font-bold text-espresso leading-tight mt-4 mb-1">
              {title}
            </h1>
            {subtitle && (
              <p className="text-latte text-[15px] mb-6">{subtitle}</p>
            )}
            {!subtitle && <div className="mb-6" />}

            <div className="flex-1">{children}</div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom action */}
      <div className="px-6 pb-[env(safe-area-inset-bottom,24px)] pt-4">
        <motion.button
          onClick={onContinue}
          disabled={!canContinue}
          whileHover={canContinue ? { scale: 1.02 } : {}}
          whileTap={canContinue ? { scale: 0.97 } : {}}
          className="w-full bg-blush text-white py-4 rounded-3xl text-[17px] font-semibold shadow-lg shadow-blush/20 hover:bg-accent-rose transition-all disabled:opacity-30 disabled:shadow-none"
        >
          {continueLabel}
        </motion.button>
      </div>
    </div>
  );
}
