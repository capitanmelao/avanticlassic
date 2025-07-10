/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Helvetica', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        'helvetica': ['Helvetica', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        'sky': {
          400: '#38bdf8',
        },
      },
    },
  },
  plugins: [],
}