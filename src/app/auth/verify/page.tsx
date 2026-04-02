"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function VerifyPage() {
  const router = useRouter();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("brewmance_verify_email");
    if (stored) setEmail(stored);
    // Focus first input
    inputRefs.current[0]?.focus();
  }, []);

  function handleChange(index: number, value: string) {
    if (!/^\d*$/.test(value)) return; // digits only

    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);

    // Auto-advance to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 6 digits entered
    if (value && index === 5 && newCode.every((d) => d !== "")) {
      verifyCode(newCode.join(""));
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;

    const newCode = [...code];
    for (let i = 0; i < pasted.length; i++) {
      newCode[i] = pasted[i];
    }
    setCode(newCode);

    // Focus last filled or next empty
    const focusIndex = Math.min(pasted.length, 5);
    inputRefs.current[focusIndex]?.focus();

    if (pasted.length === 6) {
      verifyCode(pasted);
    }
  }

  async function verifyCode(token: string) {
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "signup",
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Account verified — now save brewfile to Supabase
    await savePendingBrewfile();
    router.push("/brewfile");
  }

  async function savePendingBrewfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const stored = localStorage.getItem("brewmance_brewfile");
    if (!stored) return;

    const brewfile = JSON.parse(stored);

    // Upsert user profile
    await supabase.from("users").upsert({
      id: user.id,
      email: user.email!,
      onboarding_completed: true,
    });

    // Upsert brewfile
    await supabase.from("brewfiles").upsert({
      user_id: user.id,
      ...brewfile,
      total_logs: 0,
      last_updated: new Date().toISOString(),
    });

    // Clean up localStorage
    localStorage.removeItem("brewmance_brewfile");
    localStorage.removeItem("brewmance_verify_email");
  }

  async function resendCode() {
    if (!email) return;
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
    });
    if (error) {
      setError(error.message);
    } else {
      setError(null);
    }
  }

  return (
    <div className="flex flex-col min-h-[100dvh] bg-soft-white px-6 pb-[env(safe-area-inset-bottom,24px)] pt-[env(safe-area-inset-top,48px)]">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="flex-1 flex flex-col items-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: "spring", bounce: 0.4 }}
          className="w-20 h-20 bg-cream rounded-2xl flex items-center justify-center mb-6 shadow-sm"
        >
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#3B2314" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="M22 7l-10 7L2 7" />
          </svg>
        </motion.div>

        <h1 className="font-playfair text-[28px] font-bold text-espresso leading-tight text-center mb-2">
          Check your email
        </h1>
        <p className="text-latte text-[15px] text-center mb-2">
          We sent a 6-digit code to
        </p>
        {email && (
          <p className="text-espresso font-semibold text-[15px] mb-8">{email}</p>
        )}

        {/* Code input */}
        <div className="flex gap-2.5 mb-6" onPaste={handlePaste}>
          {code.map((digit, i) => (
            <motion.input
              key={i}
              ref={(el) => { inputRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              className={`w-12 h-14 text-center text-xl font-bold rounded-xl border-2 bg-cream/40 text-espresso focus:outline-none focus:ring-2 focus:ring-blush/40 transition-all ${
                digit ? "border-blush/50" : "border-latte/20"
              }`}
            />
          ))}
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-accent-rose/10 text-accent-rose text-sm px-4 py-3 rounded-xl mb-4 w-full max-w-[320px] text-center"
          >
            {error}
          </motion.div>
        )}

        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-latte text-sm mb-4"
          >
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            >
              ☕
            </motion.span>
            Verifying...
          </motion.div>
        )}

        <motion.button
          onClick={() => {
            const full = code.join("");
            if (full.length === 6) verifyCode(full);
          }}
          disabled={loading || code.some((d) => !d)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="w-full max-w-[320px] bg-blush text-white py-4 rounded-3xl text-[17px] font-semibold shadow-lg shadow-blush/20 hover:bg-accent-rose transition-colors disabled:opacity-30 disabled:shadow-none"
        >
          Verify
        </motion.button>

        <button
          onClick={resendCode}
          className="mt-4 text-sm text-latte hover:text-espresso transition-colors"
        >
          Didn&apos;t get a code? <span className="text-blush font-semibold">Resend</span>
        </button>
      </motion.div>
    </div>
  );
}
