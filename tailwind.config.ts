import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  extend: {
    colors: {
      bg: 'var(--bg)',
      'text-primary': 'var(--text-primary)',
      'text-muted': 'var(--text-muted)',
      accent: 'var(--accent)',
      border: 'var(--border)',
    }
  }
},
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
