import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: {
        '2xl': '1320px',
      },
    },
    extend: {
      colors: {
        background: '#0A0A0A',
        surface: '#111111',
        card: '#1A1A1A',
        muted: '#9CA3AF',
        primary: '#7C3AED',
        secondary: '#06B6D4',
      },
      borderRadius: {
        xl: '0.95rem',
        '2xl': '1.2rem',
      },
      boxShadow: {
        glow: '0 20px 60px rgba(124,58,237,0.15)',
      },
      keyframes: {
        blob: {
          '0%, 100%': { transform: 'translate(0px, 0px) scale(1)' },
          '50%': { transform: 'translate(20px, -16px) scale(1.05)' },
        },
      },
      animation: {
        blob: 'blob 9s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
