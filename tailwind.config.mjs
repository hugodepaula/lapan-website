/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
      colors: {
        brand: {
          50: 'rgb(var(--color-brand-50) / <alpha-value>)',
          100: 'rgb(var(--color-brand-100) / <alpha-value>)',
          200: 'rgb(var(--color-brand-200) / <alpha-value>)',
          400: 'rgb(var(--color-brand-400) / <alpha-value>)',
          600: 'rgb(var(--color-brand-600) / <alpha-value>)',
          800: 'rgb(var(--color-brand-800) / <alpha-value>)',
          900: 'rgb(var(--color-brand-900) / <alpha-value>)'
        },
        accent: {
          50: 'rgb(var(--color-accent-50) / <alpha-value>)',
          100: 'rgb(var(--color-accent-100) / <alpha-value>)',
          500: 'rgb(var(--color-accent-500) / <alpha-value>)',
          600: 'rgb(var(--color-accent-600) / <alpha-value>)',
          700: 'rgb(var(--color-accent-700) / <alpha-value>)'
        },
        neutral: {
          50: 'rgb(var(--color-neutral-50) / <alpha-value>)',
          100: 'rgb(var(--color-neutral-100) / <alpha-value>)',
          200: 'rgb(var(--color-neutral-200) / <alpha-value>)',
          400: 'rgb(var(--color-neutral-400) / <alpha-value>)',
          700: 'rgb(var(--color-neutral-700) / <alpha-value>)',
          900: 'rgb(var(--color-neutral-900) / <alpha-value>)'
        },
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        ink: 'rgb(var(--color-ink) / <alpha-value>)'
      },
      fontFamily: {
        sans: ['Source Sans 3', 'ui-sans-serif', 'sans-serif'],
        serif: ['Literata', 'ui-serif', 'serif']
      },
      maxWidth: {
        content: '74rem'
      },
      boxShadow: {
        soft: '0 10px 30px rgb(var(--color-brand-900) / 0.08)'
      }
    }
  }
};
