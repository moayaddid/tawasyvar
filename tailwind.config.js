/** @type {import('tailwindcss').Config} */
// const defaultTheme = require("tailwindcss/defaultTheme");
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: { 
        skin: {
          primary: "#ff6600",
          darkprimary: "",
        },
      },
      fontFamily: {
        'mohave': ['Mohave', 'sans-serif'],
        'montserrat': ['Montserrat', 'sans-serif'],
        'hajar' : ['hajar'] ,
        'gothic' : ['gothic']
      },
    },
  },
  plugins: [],
  variants: {
    space: ['responsive', 'direction'],
  },
  // important : true ,
}

