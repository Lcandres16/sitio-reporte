/** @type {import('tailwindcss').Config} */
export default {
  content: [ "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",],
  theme: {
    extend: { colors: {
      'teal': {
        100: '#B2F5EA',  // Color del hero section
      },
    },
    maxWidth: {
      '6xl': '72rem',
    },
    height: {
      '72': '18rem',  // Altura del hero section},
  },
},
},
  plugins: [],
}

