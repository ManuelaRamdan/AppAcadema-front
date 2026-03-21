/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        color1: "#e6f99d", // Fondo claro
        color2: "#7fda89", // Acentos suaves
        color3: "#259073", // Acento fuerte / botones
        color4: "#c8e98e", // Tonos intermedios
        color5: "#041122", // Texto principal / sidebar
      },
      boxShadow: {
        'custom': '0px 6px 20px rgba(0,0,0,0.08)',
        'soft': '0px 3px 12px rgba(0,0,0,0.05)',
      }
    },
  },
  plugins: [],
}