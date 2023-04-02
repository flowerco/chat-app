/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#202225',
        secondary: '#5865f2',
        gray: {
          900: '#202225',
          800: '#2f3136',
          700: '#36393f',
        },
      },
      maxWidth: {
        '1/4': '25%',
        '1/2': '50%',
        '2/3': '66%',
        '3/4': '75%',
        '5/6': '83%'
      },
    },
  },
  plugins: [],
};
