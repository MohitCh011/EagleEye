module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}",
  ],
  theme: {
    fontFamily: {
      'sans': ['ui-sans-serif', 'system-ui','Playwrite HR Lijeva']
    },
    extend: {
      backdropBlur: {
        lg: '10px', // Custom blur size (adjust as needed)
      },
    },
  },
  plugins: [],
}
