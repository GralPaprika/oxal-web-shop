// Theme configuration for easy color palette changes
export const theme = {
  colors: {
    // Primary brand colors
    primary: {
      50: 'rgb(var(--color-primary-50) / <alpha-value>)',
      100: 'rgb(var(--color-primary-100) / <alpha-value>)',
      200: 'rgb(var(--color-primary-200) / <alpha-value>)',
      300: 'rgb(var(--color-primary-300) / <alpha-value>)',
      400: 'rgb(var(--color-primary-400) / <alpha-value>)',
      500: 'rgb(var(--color-primary-500) / <alpha-value>)',
      600: 'rgb(var(--color-primary-600) / <alpha-value>)',
      700: 'rgb(var(--color-primary-700) / <alpha-value>)',
      800: 'rgb(var(--color-primary-800) / <alpha-value>)',
      900: 'rgb(var(--color-primary-900) / <alpha-value>)',
      950: 'rgb(var(--color-primary-950) / <alpha-value>)',
    },
    // Secondary accent colors
    secondary: {
      50: 'rgb(var(--color-secondary-50) / <alpha-value>)',
      100: 'rgb(var(--color-secondary-100) / <alpha-value>)',
      200: 'rgb(var(--color-secondary-200) / <alpha-value>)',
      300: 'rgb(var(--color-secondary-300) / <alpha-value>)',
      400: 'rgb(var(--color-secondary-400) / <alpha-value>)',
      500: 'rgb(var(--color-secondary-500) / <alpha-value>)',
      600: 'rgb(var(--color-secondary-600) / <alpha-value>)',
      700: 'rgb(var(--color-secondary-700) / <alpha-value>)',
      800: 'rgb(var(--color-secondary-800) / <alpha-value>)',
      900: 'rgb(var(--color-secondary-900) / <alpha-value>)',
      950: 'rgb(var(--color-secondary-950) / <alpha-value>)',
    },
    // Background colors
    background: {
      primary: 'rgb(var(--color-bg-primary) / <alpha-value>)',
      secondary: 'rgb(var(--color-bg-secondary) / <alpha-value>)',
      tertiary: 'rgb(var(--color-bg-tertiary) / <alpha-value>)',
    },
    // Text colors
    text: {
      primary: 'rgb(var(--color-text-primary) / <alpha-value>)',
      secondary: 'rgb(var(--color-text-secondary) / <alpha-value>)',
      muted: 'rgb(var(--color-text-muted) / <alpha-value>)',
    }
  },
  fontFamily: {
    display: ['var(--font-display)', 'serif'],
    body: ['var(--font-body)', 'sans-serif'],
    accent: ['var(--font-accent)', 'cursive'],
  }
} as const;