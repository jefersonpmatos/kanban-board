/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        mainBgColor: "#0d1117",
        columnBgColor: "#161c22",
      },
    },
  },
  plugins: [],
};
