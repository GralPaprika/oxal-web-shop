import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Oxal Brand Colors
        oxal: {
          cream: '#f4f0ea',      // Porcelain Mist - Main background
          sandstone: '#cbb8a3',  // Soft Sandstone - Light accent
          teak: '#b29167',       // Teak - Secondary accent
          verdigris: '#525934',  // Verdigris - Primary accent
          desert: '#9f691e',     // Desert - Alternative accent
        },
        // Semantic color aliases
        primary: {
          50: '#f4f0ea',
          100: '#f4f0ea',
          200: '#e8e5db',
          300: '#dcd6cc',
          400: '#d0cbbd',
          500: '#cbb8a3',
          600: '#b29167',
          700: '#525934',
          800: '#525934',
          900: '#525934',
          950: '#2d2d2d',
        },
        secondary: {
          50: '#f4f0ea',
          100: '#f4f0ea',
          200: '#cbb8a3',
          300: '#cbb8a3',
          400: '#b29167',
          500: '#b29167',
          600: '#9f691e',
          700: '#525934',
          800: '#525934',
          900: '#525934',
          950: '#2d2d2d',
        },
      },
      backgroundColor: {
        'oxal-cream': '#f4f0ea',
        'oxal-sandstone': '#cbb8a3',
        'oxal-teak': '#b29167',
        'oxal-verdigris': '#525934',
        'oxal-desert': '#9f691e',
      },
      textColor: {
        'oxal-verdigris': '#525934',
        'oxal-sandstone': '#cbb8a3',
        'oxal-desert': '#9f691e',
      },
      borderColor: {
        'oxal-verdigris': '#525934',
        'oxal-sandstone': '#cbb8a3',
        'oxal-desert': '#9f691e',
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        body: ['var(--font-body)', 'sans-serif'],
        accent: ['var(--font-accent)', 'cursive'],
      },
      backgroundImage: {
        'hero-pattern': "url('https://images.unsplash.com/photo-1516762689617-e1cffcef479d?q=80&w=1000')",
      }
    },
  },
  plugins: [],
};

export default config;