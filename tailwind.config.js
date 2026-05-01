/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx,mdx}','./components/**/*.{js,ts,jsx,tsx,mdx}','./app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0e0f0c', 'ink-2': '#161710', 'ink-3': '#1e2019',
        surface: '#252720', raised: '#2d3027', rim: '#383b30',
        lime: '#b8f53c', 'lime-dim': '#7aaa1e', 'lime-bg': '#1c2410',
        coral: '#ff6b4a', 'coral-bg': '#251410',
        sand: '#e8e0c8', 'sand-2': '#b8b09a', 'sand-3': '#6b6558',
        sky: '#5ec4ff',
        't1': '#eceade', 't2': '#9a9688', 't3': '#5c5a52',
      },
      fontFamily: {
        display: ['Cabinet Grotesk', 'Syne', 'sans-serif'],
        body: ['Instrument Sans', 'sans-serif'],
        mono: ['Syne Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
