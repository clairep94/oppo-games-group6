/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      color: {
        customPink: '#DF5BBA',
        customPurple: '#5D32A9',
        customIndigo: '#451B87',
        customBlack: '#1E1E1E',
        customWhite: '#F9F8F8',
        'white': '#ffffff',
        'purple': '#3f3cbb',
      },
    },
    fontFamily: {
      sans: [
        '"Inter var", sans-serif',
        {
          fontFeatureSettings: '"cv11", "ss01"',
          fontVariationSettings: '"opsz" 32'
        },
      ],
    }
  },
  plugins: [],
};