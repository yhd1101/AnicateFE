/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        ysabeau: ['"Ysabeau Infant"', 'sans-serif'], // Ysabeau Infant 폰트 추가
      },
      colors: {
        primary: '#5CA157', // primary 색상 추가
      },
    },
  },
  plugins: [],
};
