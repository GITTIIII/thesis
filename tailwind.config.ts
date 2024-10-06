import type { Config } from "tailwindcss";
import { DEFAULT_CIPHERS } from "tls";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
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
          50: "hsl(24.6, 95%, 95%)",
          100: "hsl(24.6, 95%, 90%)",
          200: "hsl(24.6, 95%, 80%)",
          300: "hsl(24.6, 95%, 70%)",
          400: "hsl(24.6, 95%, 60%)",
          500: "hsl(24.6, 95%, 53.1%)",
          600: "hsl(24.6, 95%, 40%)",
          700: "hsl(24.6, 95%, 30%)",
          800: "hsl(24.6, 95%, 20%)",
          900: "hsl(24.6, 95%, 10%)",
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
        mineshaft: {
          50: "rgb(245 245 245)",
          100: "rgb(235 235 235)",
          200: "rgb(204 204 206)",
          300: "rgb(173 174 176)",
          400: "rgb(112 113 116)",
          500: "rgb(140 141 143)",
          600: "rgb(80 81 83)",
          700: "rgb(45 46 48   )",
          800: "rgb(30 31 34 )",
          900: "rgb(10 10 12  )",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": {
            opacity: "0",
          },
          "100%": {
            opacity: "1",
          },
        },
        ping_: {
          "50%": {
            transform: "scale(1)",
            opacity: "0.6",
          },
        },
      },

      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        fadeIn: "fade-in 1s ease-in-out 0.25s 1",
        ping2500: "ping_ 2.5s ease-in-out infinite alternate",
        ping3500: "ping_ 3.5s ease-in-out infinite alternate",
        ping1000: "ping_ 1s ease-in-out infinite alternate",
        ping1500: "ping_ 1.5s ease-in-out infinite alternate",
        ping500: "ping_ 0.5s ease-in-out infinite alternate",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
