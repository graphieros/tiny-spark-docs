/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        "app-bg-grey": "rgb(210,210,210)",
        "app-grey-dark": "rgb(140,150,150)",
        "app-grey-light": "",
        "black": "#1a1a1a",
        "black-100" : "#242424",
        "app-green": "#42d392",
        "app-green-dark": "#1d915d",
        "app-green-light": "#87e6bb",
        "app-green-light-extra": "#d5eee3",
        "app-blue": "#5f8aee",
        "app-blue-mid": "#83a4f2",
        "app-blue-light": "#abc2f6",
        "app-blue-dark": "#314063",
        "app-orange": "#ff6600",
        "app-orange-light": "#faa770",
        "app-red": "#ff3700",
        "app-yellow": "#c8c832",
        "app-gold" : "#fdd663",
        ////////////////////////////////////////
        "spark-primary": "#FF6A00",
        "spark-yellow": "#FFD500",
        "spark-glow": "#FF2E92",
        "spark-blue": "#0099FF",
        "spark-charcoal": "#1C1C1E",
        "spark-gray": "#F2F2F7"
      }
    },
  },
  plugins: [],
}