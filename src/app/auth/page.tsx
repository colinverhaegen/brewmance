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
    <div className="flex flex-col min-h-screen bg-soft-white px-6 pt-12 pb-8">
      {/* Back link */}
      <Link href="/" className="text-latte hover:text-espresso transition-colors mb-8">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-1 flex flex-col"
      >
        {/* Header */}
        <h1 className="font-playfair text-3xl font-bold text-espresso mb-2">
          {isSignUp ? "Create your account" : "Welcome back"}
        </h1>
        <p className="text-latte mb-8">
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
              className="flex-1 flex flex-col items-center justify-center text-center gap-4"
            >
              <div className="w-16 h-16 bg-cream rounded-full flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3B2314" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <h2 className="font-playfair text-2xl font-bold text-espresso">
                Check your email
              </h2>
              <p className="text-latte text-sm max-w-[280px]">
                We sent a confirmation link to <span className="font-medium text-espresso">{email}</span>. Tap it to finish signing up.
              </p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-4"
            >
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-espresso mb-1.5">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-cream/50 border border-latte/20 text-espresso placeholder:text-latte/40 focus:outline-none focus:ring-2 focus:ring-blush/50 focus:border-blush transition-all"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-espresso mb-1.5">
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
                  className="w-full px-4 py-3 rounded-xl bg-cream/50 border border-latte/20 text-espresso placeholder:text-latte/40 focus:outline-none focus:ring-2 focus:ring-blush/50 focus:border-blush transition-all"
                />
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-accent-rose text-sm"
                >
                  {error}
                </motion.p>
              )}

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mt-4 w-full bg-blush text-white py-4 rounded-full text-lg font-medium shadow-lg shadow-blush/25 hover:bg-accent-rose transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? "One moment..."
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
            transition={{ delay: 0.3 }}
            className="mt-auto pt-8 text-center"
          >
            <p className="text-latte text-sm">
              {isSignUp ? "Already have an account?" : "New to Brewmance?"}{" "}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError(null);
                }}
                className="text-blush font-medium hover:text-accent-rose transition-colors"
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
