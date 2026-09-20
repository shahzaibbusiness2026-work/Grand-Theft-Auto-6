import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1rem",
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        elevated: {
          DEFAULT: "hsl(var(--elevated))",
          foreground: "hsl(var(--elevated-foreground))",
        },
        coral: {
          DEFAULT: "hsl(var(--coral))",
          accent: "#F3A398",
        },
        neon: {
          cyan: "#00F0FF",
          cyber: "#00F0FF",
          blue: "#0284c7",
          sky: "#38bdf8",
          amber: "#f59e0b",
          gold: "#fbbf24",
          orange: "#fb923c",
          purple: "#8b5cf6",
          violet: "#8b5cf6",
          green: "#10b981",
          pink: "#f59e0b",
          magenta: "#f59e0b",
          yellow: "#facc15",
          red: "#f87171",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        "neon-magenta": "0 0 24px rgba(245, 158, 11, 0.35)",
        "neon-cyber": "0 0 20px rgba(0, 240, 255, 0.45)",
        "neon-cyan": "0 0 20px rgba(0, 240, 255, 0.4)",
        "neon-amber": "0 0 20px rgba(245, 158, 11, 0.4)",
        "neon-pink": "0 0 24px rgba(245, 158, 11, 0.35)",
        "neon-purple": "0 0 20px rgba(139, 92, 246, 0.35)",
        "card-dark": "0 8px 30px rgba(0, 0, 0, 0.45)",
        "card-light": "0 8px 30px rgba(15, 23, 42, 0.06)",
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(90deg, #0ea5e9 0%, #0284c7 100%)",
        "gradient-amber": "linear-gradient(90deg, #f59e0b 0%, #ea580c 100%)",
        "gradient-cyan": "linear-gradient(90deg, #00e5ff 0%, #0284c7 100%)",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
        "scale-slow": {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.08)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "float-medium": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
        "float-reverse": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(10px)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "pulse-glow": "pulse-glow 2.4s ease-in-out infinite",
        "scale-slow": "scale-slow 24s ease-in-out infinite alternate",
        "float-slow": "float-slow 6s ease-in-out infinite",
        "float-medium": "float-medium 5s ease-in-out infinite",
        "float-reverse": "float-reverse 7s ease-in-out infinite",
        "shimmer": "shimmer 8s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
