/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        qm: {
          bg: {
            base: '#0d0f14',
            surface: '#161b2e',
            elevated: '#1e2540',
            card: 'rgba(22, 27, 46, 0.8)',
          },
          primary: {
            100: '#ede9fe',
            300: '#c4b5fd',
            500: '#8b5cf6',
            600: '#7c3aed',
            700: '#6d28d9',
          },
          accent: {
            400: '#22d3ee',
            500: '#06b6d4',
            600: '#0891b2',
          },
          gold: {
            400: '#fbbf24',
            500: '#f59e0b',
            600: '#d97706',
          }
        }
      },
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        'glow-primary': '0 0 20px rgba(139, 92, 246, 0.4)',
        'glow-accent': '0 0 20px rgba(6, 182, 212, 0.4)',
        'glow-gold': '0 0 20px rgba(245, 158, 11, 0.4)',
      }
    },
  },
  plugins: [],
}
