"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { MapPin, Coffee, Star, Zap } from "lucide-react";

interface LogEntry {
  id: string;
  type: "cafe" | "homebrew";
  name: string;
  subtitle: string;
  rating: number;
  flavor_tags: string[];
  created_at: string;
}

export default function LogPage() {
  const router = useRouter();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      // Fetch cafe logs with cafe name
      const { data: cafeLogs } = await supabase
        .from("logs_cafe")
        .select("id, drink_name, rating, flavor_tags, created_at, cafes(name)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10);

      // Fetch homebrew logs
      const { data: homebrewLogs } = await supabase
        .from("logs_homebrew")
        .select("id, bean_name, brew_method, rating, flavor_tags, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10);

      const entries: LogEntry[] = [];

      if (cafeLogs) {
        for (const log of cafeLogs) {
          const l = log as Record<string, unknown>;
          const cafe = l.cafes as { name: string } | null;
          entries.push({
            id: l.id as string,
            type: "cafe",
            name: cafe?.name || "Unknown cafe",
            subtitle: (l.drink_name as string) || "Coffee",
            rating: l.rating as number,
            flavor_tags: (l.flavor_tags as string[]) || [],
            created_at: l.created_at as string,
          });
        }
      }

      if (homebrewLogs) {
        for (const log of homebrewLogs) {
          const l = log as Record<string, unknown>;
          const methodLabel = (l.brew_method as string || "").replace(/-/g, " ");
          entries.push({
            id: l.id as string,
            type: "homebrew",
            name: l.bean_name as string,
            subtitle: methodLabel,
            rating: l.rating as number,
            flavor_tags: (l.flavor_tags as string[]) || [],
            created_at: l.created_at as string,
          });
        }
      }

      entries.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setLogs(entries.slice(0, 10));
      setLoading(false);
    }
    load();
  }, []);

  function formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
    return d.toLocaleDateString("en-SG", { month: "short", day: "numeric" });
  }

  return (
    <div className="bg-soft-white min-h-screen pt-[env(safe-area-inset-top,12px)]">
      <div className="px-5 pt-4 pb-2">
        <h1 className="font-playfair text-2xl font-bold text-espresso">Log</h1>
      </div>

      {/* Log type cards */}
      <div className="px-4 mt-2 grid grid-cols-2 gap-3">
        <motion.button
          onClick={() => router.push("/log/cafe")}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="bg-cream/50 rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.06)] text-left"
        >
          <div className="w-12 h-12 bg-blush/10 rounded-xl flex items-center justify-center mb-3">
            <MapPin size={24} className="text-blush" />
          </div>
          <h3 className="font-playfair text-[15px] font-bold text-espresso">Cafe Visit</h3>
          <p className="text-xs text-latte mt-0.5">Log a drink at a cafe</p>
        </motion.button>

        <motion.button
          onClick={() => router.push("/log/homebrew")}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="bg-cream/50 rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.06)] text-left"
        >
          <div className="w-12 h-12 bg-latte/10 rounded-xl flex items-center justify-center mb-3">
            <Coffee size={24} className="text-latte" />
          </div>
          <h3 className="font-playfair text-[15px] font-bold text-espresso">Home Brew</h3>
          <p className="text-xs text-latte mt-0.5">Log your own brew</p>
        </motion.button>
      </div>

      {/* Quick Log */}
      <div className="px-4 mt-3">
        <motion.button
          onClick={() => router.push("/log/cafe?quick=1")}
          whileTap={{ scale: 0.97 }}
          className="w-full flex items-center gap-3 bg-blush/8 border border-blush/20 rounded-xl px-4 py-3"
        >
          <Zap size={18} className="text-blush" />
          <div className="text-left">
            <span className="text-sm font-semibold text-espresso">Quick Log</span>
            <span className="text-xs text-latte ml-2">3 taps, done</span>
          </div>
        </motion.button>
      </div>

      {/* Recent Logs */}
      <div className="px-4 mt-6">
        <h3 className="text-[11px] font-semibold text-espresso/40 uppercase tracking-wider mb-3">
          Recent Activity
        </h3>

        {loading ? (
          <div className="text-center py-8">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="text-3xl inline-block">☕</motion.div>
          </div>
        ) : logs.length === 0 ? (
          <div className="bg-cream/30 rounded-2xl p-6 text-center">
            <span className="text-3xl mb-2 block">📝</span>
            <p className="text-sm text-latte">No logs yet. Time for a cup!</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {logs.map((log, i) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-cream/40 rounded-xl p-3.5 flex items-start gap-3"
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm flex-shrink-0 ${
                  log.type === "cafe" ? "bg-blush/10" : "bg-latte/10"
                }`}>
                  {log.type === "cafe" ? "☕" : "🫘"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-espresso truncate">{log.name}</p>
                  <p className="text-xs text-latte truncate capitalize">{log.subtitle}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: log.rating }).map((_, j) => (
                        <Star key={j} size={10} fill="#D4918B" className="text-blush" />
                      ))}
                    </div>
                    {log.flavor_tags.length > 0 && (
                      <span className="text-[10px] text-latte/50 truncate">
                        {log.flavor_tags.slice(0, 2).join(", ")}
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-[10px] text-latte/40 whitespace-nowrap flex-shrink-0">{formatDate(log.created_at)}</span>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <div className="h-6" />
    </div>
  );
}
