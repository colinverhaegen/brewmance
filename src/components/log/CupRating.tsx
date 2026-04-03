"use client";

import { motion } from "framer-motion";

interface CupRatingProps {
  value: number;
  onChange: (rating: number) => void;
}

function CupIcon({ filled, index }: { filled: boolean; index: number }) {
  return (
    <motion.svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      whileTap={{ scale: 0.85 }}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
    >
      {/* Cup body */}
      <path
        d="M8 14 L6.5 32 Q6.5 36 12 36.5 L26 36.5 Q31.5 36 31.5 32 L30 14 Z"
        fill={filled ? "#D4918B" : "#E8DDD0"}
        stroke={filled ? "#B5656B" : "#D4C4B0"}
        strokeWidth="1"
      />
      {/* Rim */}
      <ellipse cx="19" cy="14" rx="12" ry="3.5" fill={filled ? "#D4918B" : "#F5EDE3"} stroke={filled ? "#B5656B" : "#D4C4B0"} strokeWidth="1" />
      {/* Handle */}
      <path
        d="M31 18 Q36 19 36 25 Q36 31 31 32"
        fill="none"
        stroke={filled ? "#B5656B" : "#D4C4B0"}
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Steam for filled */}
      {filled && (
        <>
          <motion.path
            d="M15 8 Q16 5 15 2"
            fill="none" stroke="#C8A882" strokeWidth="1" strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.6 }}
            transition={{ delay: 0.2 }}
          />
          <motion.path
            d="M22 9 Q23 6 22 3"
            fill="none" stroke="#C8A882" strokeWidth="1" strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.6 }}
            transition={{ delay: 0.35 }}
          />
        </>
      )}
    </motion.svg>
  );
}

export default function CupRating({ value, onChange }: CupRatingProps) {
  return (
    <div className="flex items-center justify-center gap-2">
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} onClick={() => onChange(n)} className="p-0.5">
          <CupIcon filled={n <= value} index={n} />
        </button>
      ))}
    </div>
  );
}
