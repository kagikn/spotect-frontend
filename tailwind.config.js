module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: true,
  theme: {
    extend: {
      colors: {
        subdued: '#a7a7a7',
        'white-0.6-opacity': 'rgba(255, 255, 255, 0.6)',
        'black-0.85-opacity': 'rgba(32, 32, 32, 0.80)',
        'white-0.05-opacity': 'rgba(255, 255, 255, 0.05)',
        'black-bg-base': 'rgb(18, 18, 18)',
        'black-bg-base-0.8-opacity': 'rgba(18, 18, 18, 0.8)',
      },
    },
  },
  plugins: [],
};
