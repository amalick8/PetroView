import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0b0d12",
        slate: "#141821",
        panel: "#191e27",
        mist: "#d9dee7",
        gold: "#f5c46a",
        ember: "#f08b65",
        ocean: "#1f6feb"
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'IBM Plex Sans'", "sans-serif"]
      },
      boxShadow: {
        glass: "0 20px 60px rgba(0,0,0,0.4)",
        inset: "inset 0 0 0 1px rgba(255,255,255,0.05)"
      },
      backgroundImage: {
        "hero-gradient": "radial-gradient(circle at top, rgba(31,111,235,0.25), transparent 55%), radial-gradient(circle at 20% 20%, rgba(245,196,106,0.25), transparent 45%)",
        "panel-gradient": "linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.01))"
      }
    }
  },
  plugins: []
};

export default config;
