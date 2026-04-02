"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, PenLine, Fingerprint, User } from "lucide-react";

const TABS = [
  { href: "/discover", label: "Discover", icon: Compass },
  { href: "/log", label: "Log", icon: PenLine },
  { href: "/brewfile", label: "Brewfile", icon: Fingerprint },
  { href: "/profile", label: "Profile", icon: User },
];

export default function TabBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-soft-white/90 backdrop-blur-lg border-t border-latte/10 pb-[env(safe-area-inset-bottom,8px)]">
      <div className="flex items-center justify-around pt-2 pb-1">
        {TABS.map((tab) => {
          const isActive = pathname === tab.href;
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center gap-0.5 px-4 py-1.5 transition-colors ${
                isActive ? "text-blush" : "text-charcoal/40"
              }`}
            >
              <Icon size={22} strokeWidth={isActive ? 2.2 : 1.8} />
              <span className={`text-[10px] font-medium ${isActive ? "text-blush" : "text-charcoal/40"}`}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
