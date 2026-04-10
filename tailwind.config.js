/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["*.html", "js/**/*.js"],
  theme: {
    extend: {
      colors: {
        primary: '#1A4288',
        'on-primary': '#FFFFFF',
        'primary-container': '#D6E3FF',
        'on-primary-container': '#001B3E',
        secondary: '#1A4288',
        'on-secondary': '#FFFFFF',
        'secondary-container': '#1A4288',
        'on-secondary-container': '#FFFFFF',
        tertiary: '#775730',
        'on-tertiary': '#FFFFFF',
        'tertiary-container': '#FFDCBE',
        'on-tertiary-container': '#2A1700',
        error: '#BA1A1A',
        'on-error': '#FFFFFF',
        'error-container': '#FFDAD6',
        'on-error-container': '#410002',
        background: '#FDFBFF',
        'on-background': '#1A1C1E',
        surface: '#FDFBFF',
        'on-surface': '#1A1C1E',
        'surface-variant': '#E0E2EC',
        'on-surface-variant': '#44474E',
        outline: '#74777F',
        'outline-variant': '#C4C6D0',
        'surface-container-lowest': '#FFFFFF',
        'surface-container-low': '#F7F6FA',
        'surface-container': '#F1F0F4',
        'surface-container-high': '#EBEAEF',
        'surface-container-highest': '#E6E4E9',
        'inverse-surface': '#2F3033',
        'inverse-on-surface': '#F1F0F4',
        'inverse-primary': '#A8C8FF'
      },
      fontFamily: {
        headline: ['Inter', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        label: ['Space Grotesk', 'sans-serif']
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        lg: '0.5rem',
        xl: '0.75rem',
        full: '9999px'
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
}
