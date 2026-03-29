"use client";

import { useEffect, useState } from "react";

const THEME_KEY = "petroview-theme";

const themes = [
  { id: "florida", label: "Florida" },
  { id: "dark", label: "Dark" },
  { id: "berry", label: "Berry" },
  { id: "purple", label: "Purple Swirl" }
];

type ThemeId = (typeof themes)[number]["id"];

export function ThemeSwitcher() {
  const [theme, setTheme] = useState<ThemeId>("florida");

  useEffect(() => {
    const stored = window.localStorage.getItem(THEME_KEY);
    const initial = themes.find((item) => item.id === stored)?.id ?? "florida";
    setTheme(initial);
    document.documentElement.dataset.theme = initial;
  }, []);

  const handleChange = (value: ThemeId) => {
    setTheme(value);
    document.documentElement.dataset.theme = value;
    window.localStorage.setItem(THEME_KEY, value);
  };

  return (
    <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-ink/60">
      <span className="hidden md:inline">Theme</span>
      <div className="relative">
        <select
          value={theme}
          onChange={(event) => handleChange(event.target.value as ThemeId)}
          className="appearance-none rounded-full border border-ink/10 bg-panel/80 px-3 py-2 text-[10px] uppercase tracking-[0.28em] text-ink/70 shadow-inset focus:outline-none"
        >
          {themes.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink/50">
          v
        </span>
      </div>
    </div>
  );
}
