import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0A2E1E',
        accent: {
          DEFAULT: '#C9A84C',
          light: '#EDD97A',
        },
        background: '#F7F5F0',
        surface: '#FFFFFF',
        text: '#1A1A1A',
      },
    },
  },
  plugins: [],
};
export default config;
