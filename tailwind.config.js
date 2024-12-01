/** @type {import('tailwindcss').Config} */
const url = require('node:url');
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        noto: ['var(--font-noto)', 'sans'],
        clashDisplay: ['var(--font-clash-display)', 'sans'],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primaryTextColor: "rgb(61,59,59)",
        myGrey: '#fffffe',
      },
    },
  },
  plugins: [],
};
