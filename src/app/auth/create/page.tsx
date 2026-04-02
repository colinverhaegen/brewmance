"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function CreateAccountPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Store email for the verification page
    localStorage.setItem("brewmance_verify_email", email);
    router.push("/auth/verify");
  }

  return (
    <div className="flex flex-col min-h-[100dvh] bg-soft-white px-6 pb-[env(safe-area-inset-bottom,24px)] pt-[env(safe-area-inset-top,48px)]">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="flex-1 flex flex-col"
      >
        {/* Header */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: "spring", bounce: 0.4 }}
          className="text-5xl mb-6"
        >
          ☕
        </motion.div>
        <h1 className="font-playfair text-[28px] font-bold text-espresso leading-tight mb-2">
          Save your Brewfile
        </h1>
        <p className="text-latte text-[15px] mb-8">
          Create an account so your coffee profile is always with you.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
            {loading ? "Brewing your account..." : "Create Account"}
          </motion.button>
        </form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-auto pt-8 pb-4 text-center"
        >
          <p className="text-latte text-sm">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => router.push("/auth?mode=login")}
              className="text-blush font-semibold hover:text-accent-rose transition-colors"
            >
              Log in
            </button>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
