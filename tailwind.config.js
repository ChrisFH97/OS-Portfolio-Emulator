/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
   './portfolio/app/styles/**/*.css',
    './app/**/*.{js,ts,jsx,tsx}',   // Ensure this path covers your App Directory
    './components/**/*.{js,ts,jsx,tsx}', // Add components folder as well
    './layouts/**/*.{js,ts,jsx,tsx}',  // Add layouts folder too
    './pages/**/*.{js,ts,jsx,tsx}',   // In case pages directory is used
    './styles/**/*.{css}',   // If you have any other stylesheets
  ],
  theme: {
    extend: {
      colors: {
        'windows-taskbar': '#202122',
        'windows-taskbar-opacity': '#202122fa',
        'windows-start-menu': '#2a2a2afa',
        'app-background': '#272727',
        'calculator-background': '#202020',
      },
      backdropBlur: {
        sm: '4px',
        DEFAULT: '10px',
        lg: '16px',
      },
    },
  },
  plugins: [],
};
