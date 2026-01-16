/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'agri-green': '#22c55e',
        'agri-lime': '#84cc16',
        'agri-amber': '#f59e0b',
        'agri-brown': '#78350f',
        'agri-earth': '#44403c',
        'agri-cream': '#fef7ed',
        'agri-leaf': '#166534',
        'agri-sky': '#0ea5e9'
      },
      fontFamily: {
        'display': ['Noto Sans SC', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace']
      },
      animation: {
        'scan': 'scan 2s ease-in-out infinite',
        'grow': 'grow 0.5s ease-out'
      },
      keyframes: {
        scan: {
          '0%, 100%': { transform: 'translateY(0%)', opacity: '0.5' },
          '50%': { transform: 'translateY(100%)', opacity: '1' }
        },
        grow: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        }
      }
    },
  },
  plugins: [],
}
