/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        customPink: '#DF5BBA',
        customPurple: '#5D32A9',
        customIndigo: '#451B87',
        customBlack: '#1E1E1E',
        customWhite: '#F9F8F8',
      },
    },
  },
  plugins: [],
};
