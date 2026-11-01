import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1400px",
      },
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
        brand: {
          dark: "#0f172a",
          surface: "#ffffff",
          card: "#ffffff",
          border: "#0f172a",
          hover: "#f1f5f9",
          yellow: "#fde047",
          hotpink: "#f43f5e",
          magenta: "#ec4899",
          lime: "#a3e635",
          cyan: "#06b6d4",
          violet: "#8b5cf6",
          blue: "#3b82f6",
          paper: "#fafaf8",
        },
      },
      borderRadius: {
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        display: ["'Unbounded'", "sans-serif"],
        sans: ["'Space Grotesk'", "sans-serif"],
        mono: ["'Space Mono'", "monospace"],
        tech: ["'Unbounded'", "sans-serif"],
      },
      boxShadow: {
        neo: "3px 3px 0px #0f172a",
        "neo-sm": "2px 2px 0px #0f172a",
        "neo-lg": "5px 5px 0px #0f172a",
        "neo-yellow": "3px 3px 0px #0f172a",
        "neo-pink": "3px 3px 0px #0f172a",
        subtle: "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
        card: "3px 3px 0px #0f172a",
      },
    },
  },
  plugins: [],
};

export default config;
