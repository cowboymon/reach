/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        linen: '#F5F0E8',
        ink: '#1C1814',
        kraft: '#E8DFD0',
        gold: '#C9A84C',
        amber: '#D4A843',
        sage: '#7A9E87',
        mauve: '#9B8EA8',
        rose: '#C47A7A',
      },
      fontFamily: {
        serif: ['Fraunces_400Regular'],
        'serif-bold': ['Fraunces_700Bold'],
        sans: ['PlusJakartaSans_400Regular'],
        'sans-medium': ['PlusJakartaSans_500Medium'],
        'sans-bold': ['PlusJakartaSans_700Bold'],
      },
    },
  },
  plugins: [],
};
