import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Text', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      colors: {
        border: 'hsl(220 13% 91%)',
        ring: 'hsl(224 71% 45%)',
        background: 'hsl(0 0% 100%)',
        foreground: 'hsl(224 71% 4%)',
        muted: {
          DEFAULT: 'hsl(220 14% 96%)',
          foreground: 'hsl(220 9% 46%)',
        },
        // Deep indigo accent - professional, trustworthy
        accent: {
          50: 'hsl(226 100% 97%)',
          100: 'hsl(226 100% 94%)',
          200: 'hsl(226 100% 87%)',
          300: 'hsl(226 96% 78%)',
          400: 'hsl(226 83% 66%)',
          500: 'hsl(226 71% 55%)',
          600: 'hsl(226 71% 45%)',
          700: 'hsl(226 64% 38%)',
          800: 'hsl(226 57% 32%)',
          900: 'hsl(226 55% 26%)',
        },
        // Semantic colors
        success: {
          DEFAULT: 'hsl(152 69% 31%)',
          light: 'hsl(152 76% 95%)',
        },
        warning: {
          DEFAULT: 'hsl(38 92% 50%)',
          light: 'hsl(48 96% 95%)',
        },
        error: {
          DEFAULT: 'hsl(0 84% 60%)',
          light: 'hsl(0 86% 97%)',
        },
      },
      fontSize: {
        'xs': ['11px', { lineHeight: '1.5', letterSpacing: '0.01em' }],
        'sm': ['13px', { lineHeight: '1.5', letterSpacing: '-0.003em' }],
        'base': ['15px', { lineHeight: '1.6', letterSpacing: '-0.011em' }],
        'lg': ['17px', { lineHeight: '1.5', letterSpacing: '-0.014em' }],
        'xl': ['20px', { lineHeight: '1.4', letterSpacing: '-0.017em' }],
        '2xl': ['24px', { lineHeight: '1.3', letterSpacing: '-0.019em' }],
        '3xl': ['32px', { lineHeight: '1.2', letterSpacing: '-0.021em' }],
        '4xl': ['40px', { lineHeight: '1.1', letterSpacing: '-0.022em' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      borderRadius: {
        'sm': '4px',
        'DEFAULT': '6px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'soft': '0 4px 12px -2px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.04)',
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
      },
      animation: {
        'fade-in': 'fade-in 0.2s ease-out',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
