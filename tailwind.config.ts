import type { Config } from "tailwindcss"
const { fontFamily } = require("tailwindcss/defaultTheme")
const colors = require("tailwindcss/colors")

// The brand palette, sampled from the bottle: rust-maroon, copper and cream.
const brand = {
  50: "#FCF4EE",
  100: "#F8E6D9",
  200: "#F0CAB2",
  300: "#E3A584",
  400: "#CF7C55",
  500: "#B45A33",
  600: "#984426",
  700: "#7F351E",
  800: "#62281A",
  900: "#451C13",
  950: "#2A100A",
}

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem", // Adjusted padding for better mobile experience
      screens: {
        "2xl": "1280px",
      },
    },
    extend: {
      screens: {
        xs: "475px",
      },
      fontFamily: {
        sans: ["var(--font-inter)", ...fontFamily.sans],
        serif: ["var(--font-lora)", ...fontFamily.serif],
      },
      // Written for readers aged 55+: body text is 18px and nothing is smaller
      // than 15px. Spacing is unchanged; only the type scale moves.
      fontSize: {
        xs: ["0.9375rem", { lineHeight: "1.375rem" }],
        sm: ["1.0625rem", { lineHeight: "1.625rem" }],
        base: ["1.125rem", { lineHeight: "1.875rem" }],
        lg: ["1.25rem", { lineHeight: "1.875rem" }],
        xl: ["1.375rem", { lineHeight: "2rem" }],
      },
      colors: {
        brand,
        copper: { 400: "#D08A4E", 500: "#B87333", 600: "#9A5E28" },
        cream: "#FBF4E8",
        // The pages were built in emerald and gray. Pointing those at the brand
        // palette and warm stone moves the whole site over in one place; new
        // code should say brand-* directly.
        emerald: brand,
        gray: colors.stone,
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
}
export default config
