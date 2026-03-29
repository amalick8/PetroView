import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "rgb(var(--ink) / <alpha-value>)",
        slate: "rgb(var(--slate) / <alpha-value>)",
        panel: "rgb(var(--panel) / <alpha-value>)",
        mist: "rgb(var(--mist) / <alpha-value>)",
        gold: "rgb(var(--gold) / <alpha-value>)",
        ember: "rgb(var(--ember) / <alpha-value>)",
        ocean: "rgb(var(--ocean) / <alpha-value>)"
      },
      fontFamily: {
        display: ["var(--display-font)", "sans-serif"],
        body: ["var(--body-font)", "sans-serif"]
      },
      boxShadow: {
        glass: "0 30px 80px rgba(27,23,16,0.18)",
        inset: "inset 0 0 0 1px rgba(27,23,16,0.08)"
      },
      backgroundImage: {
        "hero-gradient": "radial-gradient(circle at 20% 10%, rgba(var(--gold),0.35), transparent 55%), radial-gradient(circle at 85% 12%, rgba(var(--ocean),0.28), transparent 45%)",
        "panel-gradient": "linear-gradient(135deg, rgba(255,255,255,0.85), rgba(255,255,255,0.55))"
      }
    }
  },
  plugins: []
};

export default config;
