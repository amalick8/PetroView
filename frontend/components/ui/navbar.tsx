import Link from "next/link";

import { ThemeSwitcher } from "@/components/ui/theme-switcher";

const navItems = [
  { label: "Terminal", href: "/dashboard" },
  { label: "Pulse", href: "/dashboard#pulse" },
  { label: "Tape", href: "/dashboard#tape" },
  { label: "Equities", href: "/dashboard#equities" },
  { label: "Forecast", href: "/dashboard#forecast" },
  { label: "Volatility", href: "/dashboard#volatility" },
  { label: "News", href: "/dashboard#news" },
  { label: "Models", href: "/dashboard#models" },
  { label: "Core", href: "/dashboard#core" },
  { label: "Reports", href: "/dashboard#reports" },
  { label: "Datasets", href: "/dashboard#datasets" },
  { label: "Method", href: "/dashboard#method" }
];

export function Navbar() {
  return (
    <nav className="relative z-30 w-full rounded-3xl border border-transparent bg-panel/85 px-6 py-4 shadow-glass backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link href="/dashboard" className="brand-mark bg-clip-text font-display text-lg text-transparent">
          PetroView
        </Link>
        <div className="hidden items-center gap-4 text-sm text-ink/70 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="nav-pill"
            >
              {item.label}
            </Link>
          ))}
        </div>
        <div className="hidden md:block">
          <ThemeSwitcher />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-3 overflow-x-auto pb-1 text-xs uppercase tracking-[0.2em] text-ink/60 lg:hidden">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="nav-pill text-[10px]"
          >
            {item.label}
          </Link>
        ))}
        <ThemeSwitcher />
      </div>
    </nav>
  );
}
