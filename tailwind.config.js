/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        netflix: {
          bg: '#0A0A0A',
          red: '#E50914',
          gold: '#F5C518',
          gray: '#808080',
          light: '#E5E5E5',
        },
        disney: {
          blue: '#0D1B4B',
          blueLight: '#1A237E',
          gold: '#FFD700',
          purple: '#6B4C9A',
          castle: '#2C1A4F',
        },
        cinema: {
          glass: 'rgba(255, 255, 255, 0.1)',
          glassBorder: 'rgba(255, 255, 255, 0.2)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        disney: ['Nunito', 'system-ui', 'sans-serif'],
        cartoon: ['Baloo 2', 'system-ui', 'cursive'],
      },
      animation: {
        'float': 'float 20s ease-in-out infinite',
        'cloud': 'cloud 30s linear infinite',
        'sparkle': 'sparkle 1.5s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        cloud: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100vw)' },
        },
        sparkle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(0.8)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
