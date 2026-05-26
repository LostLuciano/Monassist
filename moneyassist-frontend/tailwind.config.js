/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#E3F2FD',
          DEFAULT: '#1E40AF',
          dark: '#0C2340',
        },
        secondary: {
          light: '#ECFDF5',
          DEFAULT: '#10B981',
          dark: '#047857',
        },
        accent: {
          light: '#FEF3C7',
          DEFAULT: '#F97316',
          dark: '#EA580C',
        },
        status: {
          controlled: '#10B981',
          elevated: '#F59E0B',
          critical: '#EF4444',
          info: '#3B82F6',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
      },
      boxShadow: {
        'elevation-1': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'elevation-2': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        'elevation-3': '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        'elevation-4': '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
}
