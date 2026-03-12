"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/player/html-player", label: "HTML5 播放器", activeClass: "bg-blue-500 hover:bg-blue-600" },
  { href: "/player/dash-player", label: "dash.js 播放器", activeClass: "bg-emerald-500 hover:bg-emerald-600" },
] as const;

export function PlayerNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-4">
      {navItems.map(({ href, label, activeClass }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`rounded-md px-5 py-2 text-sm font-medium text-white shadow transition-colors ${
              isActive ? `${activeClass} ring-2 ring-white/30` : `${activeClass} opacity-80 hover:opacity-100`
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
