/** @type {import('tailwindcss').Config} */
export default {
  content: ["./*.html", "./js/**/*.js"],
  theme: {
    extend: {
      colors: {
        "viz-black": "#0B0B0C",
        "viz-card": "#16161A",
        "viz-fog": "#8C8C94",
        "viz-red": "#E8332A",
        "viz-yellow": "#F4E409",
      },
      fontFamily: {
        display: ["Archivo Black", "system-ui", "sans-serif"],
        heading: ["Space Grotesk", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
