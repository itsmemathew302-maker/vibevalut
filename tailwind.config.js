/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "surface-bright": "#31394d",
        "surface-container": "#171f33",
        "on-error": "#690005",
        "surface-tint": "#d0bcff",
        "on-tertiary": "#640039",
        "tertiary-container": "#f751a1",
        "on-secondary-fixed": "#001f26",
        "on-tertiary-container": "#570032",
        "outline-variant": "#494454",
        "on-secondary-container": "#00424e",
        "inverse-primary": "#6d3bd7",
        "outline": "#958ea0",
        "surface-container-lowest": "#060e20",
        "primary-fixed-dim": "#d0bcff",
        "primary-fixed": "#e9ddff",
        "secondary": "#06B6D4", // cyber cyan
        "on-error-container": "#ffdad6",
        "surface-variant": "#2d3449",
        "inverse-on-surface": "#283044",
        "primary": "#8B5CF6", // electric violet
        "on-primary-container": "#340080",
        "background": "#0b1326",
        "primary-container": "#a078ff",
        "secondary-container": "#03b5d3",
        "on-secondary": "#003640",
        "error": "#ffb4ab",
        "on-background": "#dae2fd",
        "tertiary": "#EC4899", // neon pink
        "error-container": "#93000a",
        "inverse-surface": "#dae2fd",
        "tertiary-fixed-dim": "#ffb0cd",
        "surface-container-high": "#222a3d",
        "tertiary-fixed": "#ffd9e4",
        "surface-container-low": "#131b2e",
        "secondary-fixed-dim": "#4cd7f6",
        "surface-container-highest": "#2d3449",
        "surface-dim": "#0b1326",
        "on-secondary-fixed-variant": "#004e5c",
        "on-surface-variant": "#cbc3d7",
        "on-primary-fixed-variant": "#5516be",
        "on-primary": "#3c0091",
        "surface": "#0b1326",
        "on-primary-fixed": "#23005c",
        "secondary-fixed": "#acedff",
        "on-tertiary-fixed-variant": "#8c0053",
        "on-tertiary-fixed": "#3e0022",
        "on-surface": "#dae2fd"
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
      spacing: {
        "margin-desktop": "48px",
        "stack-sm": "8px",
        "stack-md": "16px",
        "gutter": "24px",
        "stack-lg": "32px",
        "margin-mobile": "20px",
        "container-max": "1440px"
      },
      fontFamily: {
        "headline-md": ["Plus Jakarta Sans"],
        "display-lg": ["Plus Jakarta Sans"],
        "label-caps": ["Plus Jakarta Sans"],
        "title-lg": ["Plus Jakarta Sans"],
        "body-main": ["Plus Jakarta Sans"],
        "body-sm": ["Plus Jakarta Sans"],
        "display-lg-mobile": ["Plus Jakarta Sans"],
        "poppins": ["Poppins", "sans-serif"]
      }
    },
  },
  plugins: [],
}
