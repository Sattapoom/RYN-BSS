/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'yellow-text': '#faf803',
        'yellow-bg': '#fbd626'
      }
    }
  },
  plugins: [],
};
