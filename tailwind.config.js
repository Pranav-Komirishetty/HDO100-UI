/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        appLightBlue: "#B8E3E9",
        appGrey: "#93B1B5",
        appMidBlue: "#4F7C82",
        color1: "#0B2E33",
        custom:{
          100: "#B8E3E9",
          200: "#93B1B5",
          300: "#4F7C82",
          400: "#0B2E33",
        },
      }
    },
  },
  plugins: [],
};
