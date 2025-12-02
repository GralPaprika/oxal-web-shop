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
        oxal: {
          cream: '#f4f0ea',
          sandstone: '#cbb8a3',
          teak: '#b29167',
          verdigris: '#525934',
          desert: '#9f691e',
        },
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
        display: ['var(--font-lora)', 'serif'],
        body: ['var(--font-merriweather)', 'serif'],
        accent: ['var(--font-accent)', 'cursive'],
        serif: ['var(--font-lora)', 'var(--font-merriweather)', 'serif'],
      },
      backgroundImage: {
        'hero-pattern': "url('https://images.unsplash.com/photo-1516762689617-e1cffcef479d?q=80&w=1000')",
      }
    },
  },
  plugins: [],
};

export default config;