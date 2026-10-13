/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bgApp: '#EDE9FE',       // Soft Purple
        cardBg: '#FFFFFF',      // White
        primary: '#6D28D9',     // Deep Purple
        btnPrimary: '#7C3AED',  // Purple
        btnHover: '#5B21B6',    // Dark Purple
        secondary: '#A78BFA',   // Lavender
        textMain: '#2E1065',    // Dark Purple
        textSub: '#6B5B95',     // Purple Gray
        borderLight: '#DDD6FE', // Light Purple
        
        // Financial Colors
        financial: {
          income: '#059669',    // Emerald
          expense: '#E11D48',   // Rose
          savings: '#0891B2',   // Cyan
          investment: '#D97706',// Amber
          goal: '#7C3AED',      // Violet
          warning: '#EA580C'    // Orange
        }
      }
    },
  },
  plugins: [],
}
