import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0a1628",
          surface: "#111d33",
          deep: "#060e1c",
          border: "rgba(255,255,255,0.08)",
        },
        gold: {
          DEFAULT: "#d4a853",
          hover: "#f0c56e",
          light: "#f5cf8a",
          muted: "rgba(212,168,83,0.15)",
        },
      },
      fontFamily: {
        heading: ["var(--font-outfit)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #d4a853, #f5cf8a)",
        "navy-gradient": "linear-gradient(135deg, #0a1628, #111d33)",
      },
      borderColor: {
        glass: "rgba(255,255,255,0.08)",
        "glass-strong": "rgba(255,255,255,0.14)",
        gold: "#d4a853",
      },
      boxShadow: {
        gold: "0 4px 20px rgba(212,168,83,0.25)",
        "gold-lg": "0 8px 40px rgba(212,168,83,0.4)",
        card: "0 4px 24px rgba(0,0,0,0.4)",
      },
      animation: {
        "fade-in-up": "fadeInUp 0.35s ease-out forwards",
        "fade-in": "fadeIn 0.25s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;
