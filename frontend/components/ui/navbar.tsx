"use client";

import Link from "next/link";

"use client";

import Link from "next/link";

const navItems = [
  { label: "Overview", href: "/" },
  { label: "Forecast", href: "/forecast" },
  { label: "Volatility", href: "/volatility" },
  { label: "News", href: "/news" },
  { label: "Report", href: "/report" },
  { label: "Methodology", href: "/methodology" }
];

export function Navbar() {
  return (
    <nav className="flex items-center justify-between rounded-full border border-white/10 bg-panel/70 px-6 py-3 backdrop-blur-xl">
      <Link href="/" className="font-display text-lg text-white">
        PetroView
      </Link>
      <div className="hidden items-center gap-6 text-sm text-mist/70 md:flex">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} className="hover:text-white">
            {item.label}
          </Link>
        ))}
      </div>
      <div className="text-xs uppercase tracking-[0.25em] text-gold/70">Public Intelligence</div>
    </nav>
  );
}
