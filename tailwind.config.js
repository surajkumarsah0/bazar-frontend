/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ["Playfair Display", "serif"],
        body: ["Lato", "sans-serif"],
        button: ["Montserrat", "sans-serif"],
      },
      colors: {
        primary: "#2D2D2D",
        secondary: "#FFFFFF",
        accent: "#4CAF50",
        background: "#F5F5F5",
        cta: "#FF5722",
      }
    },
  },
  plugins: [],
}
