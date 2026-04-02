import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        playfair: ["var(--font-playfair)", "serif"],
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
      },
      colors: {
        espresso: "#3B2314",
        cream: "#F5EDE3",
        blush: "#D4918B",
        latte: "#C8A882",
        charcoal: "#2C2C2C",
        "soft-white": "#FDFAF7",
        "accent-rose": "#B5656B",
      },
    },
  },
  plugins: [],
};
export default config;
