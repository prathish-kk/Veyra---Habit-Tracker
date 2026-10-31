import type { Config } from 'tailwindcss';

const sageGreen = {
  50: '#F4F6F1',
  100: '#E8EDE4',
  200: '#D1DBC8',
  300: '#B5C49C',
  400: '#A3B18A',
  500: '#8B9A7B',
  600: '#7C8C6E',
  700: '#6B7A5E',
  800: '#4A5542',
  900: '#3A4334',
  950: '#232B1E',
};

const warmNeutrals = {
  50: '#F7F7F5',
  100: '#F0F0EE',
  200: '#E8E8E4',
  300: '#D0D0CC',
  400: '#8A8A86',
  500: '#6A6A66',
  600: '#4A4A48',
  700: '#2E2E2C',
  800: '#1E1E1C',
  900: '#121210',
  950: '#0A0A09',
};

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: sageGreen,
        // Map blue to sage green for full codebase consistency
        blue: sageGreen,
        // Map zinc and gray to warm neutrals
        zinc: warmNeutrals,
        gray: warmNeutrals,
        accent: {
          400: '#A3B18A',
          500: '#8B9A7B',
        },
        surface: {
          light: '#FFFFFF',
          dark: '#1E1E1C',
          alt: '#1A1A1A',
        },
        warm: warmNeutrals,
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '1.5rem',
          lg: '2rem',
          xl: '3rem',
        },
      },
      spacing: {
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-top': 'env(safe-area-inset-top)',
      },
      borderRadius: {
        surface: '16px',
        'surface-sm': '8px',
        'surface-lg': '24px',
        // Legacy aliases
        glass: '16px',
        'glass-sm': '8px',
        'glass-lg': '24px',
      },
      boxShadow: {
        surface: '0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)',
        'surface-hover': '0 4px 12px rgba(0, 0, 0, 0.06), 0 2px 4px rgba(0, 0, 0, 0.03)',
        'surface-elevated': '0 8px 24px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)',
        // Legacy aliases
        glass: '0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)',
        'glass-hover': '0 4px 12px rgba(0, 0, 0, 0.06), 0 2px 4px rgba(0, 0, 0, 0.03)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
