"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AuthPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmationSent, setConfirmationSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(error.message);
      } else {
        setConfirmationSent(true);
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError(error.message);
      } else {
        router.push("/onboarding");
      }
    }

    setLoading(false);
  }

  return (
    <div className="flex flex-col min-h-screen bg-soft-white px-6 pb-[env(safe-area-inset-bottom,24px)] pt-[env(safe-area-inset-top,48px)]">
      {/* Back link */}
      <motion.div
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-latte hover:text-espresso transition-colors text-sm font-medium"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="flex-1 flex flex-col mt-8"
      >
        {/* Header */}
        <h1 className="font-playfair text-[32px] font-bold text-espresso leading-tight">
          {isSignUp ? "Create your\naccount" : "Welcome\nback"}
        </h1>
        <p className="text-latte text-[15px] mt-2 mb-10">
          {isSignUp
            ? "Start your coffee journey"
            : "We missed you — let's brew"}
        </p>

        <AnimatePresence mode="wait">
          {confirmationSent ? (
            <motion.div
              key="confirmation"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="flex-1 flex flex-col items-center justify-center text-center gap-5 -mt-12"
            >
              <div className="w-20 h-20 bg-cream rounded-2xl flex items-center justify-center shadow-sm">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#3B2314" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <div>
                <h2 className="font-playfair text-2xl font-bold text-espresso mb-2">
                  Check your email
                </h2>
                <p className="text-latte text-sm max-w-[280px] leading-relaxed">
                  We sent a confirmation link to{" "}
                  <span className="font-medium text-espresso">{email}</span>.
                  Tap it to finish signing up.
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-5"
            >
              {/* Form card */}
              <div className="bg-cream/40 rounded-2xl p-5 space-y-5 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
                <div>
                  <label htmlFor="email" className="block text-[13px] font-medium text-espresso/70 mb-1.5 uppercase tracking-wider">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3.5 rounded-xl bg-soft-white border border-latte/15 text-espresso placeholder:text-latte/35 focus:outline-none focus:ring-2 focus:ring-blush/40 focus:border-blush/50 transition-all text-[15px]"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-[13px] font-medium text-espresso/70 mb-1.5 uppercase tracking-wider">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full px-4 py-3.5 rounded-xl bg-soft-white border border-latte/15 text-espresso placeholder:text-latte/35 focus:outline-none focus:ring-2 focus:ring-blush/40 focus:border-blush/50 transition-all text-[15px]"
                  />
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-accent-rose/10 text-accent-rose text-sm px-4 py-3 rounded-xl"
                >
                  {error}
                </motion.div>
              )}

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="w-full bg-blush text-white py-4 rounded-3xl text-[17px] font-semibold shadow-lg shadow-blush/20 hover:bg-accent-rose transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? "Brewing your session..."
                  : isSignUp
                    ? "Create Account"
                    : "Log In"}
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Toggle sign up / log in */}
        {!confirmationSent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-auto pt-8 pb-4 text-center"
          >
            <p className="text-latte text-sm">
              {isSignUp ? "Already have an account?" : "New to Brewmance?"}{" "}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError(null);
                }}
                className="text-blush font-semibold hover:text-accent-rose transition-colors"
              >
                {isSignUp ? "Log in" : "Sign up"}
              </button>
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
