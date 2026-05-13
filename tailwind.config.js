/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'lake-green': {
          DEFAULT: '#3a9e8f',
          light: '#5cb8aa',
          dark: '#2d7a6e',
        },
        'sky-cyan': {
          DEFAULT: '#7ec8d8',
          light: '#a8dce8',
          dark: '#5aa8bc',
        },
        'pure-white': '#ffffff',
        'warm-white': '#fafbfc',
        'ink-black': '#1a1a1a',
        'ink-gray': '#6b7280',
        'ink-light': '#9ca3af',
      },
      borderRadius: {
        'card': '1.25rem',
      },
      boxShadow: {
        'card': '0 4px 24px rgba(58, 158, 143, 0.15)',
        'card-hover': '0 8px 32px rgba(58, 158, 143, 0.22)',
      },
      fontFamily: {
        sans: [
          'Noto Sans SC',
          'PingFang SC',
          'Hiragino Sans GB',
          'Microsoft YaHei',
          'WenQuanYi Micro Hei',
          'system-ui',
          '-apple-system',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
}
