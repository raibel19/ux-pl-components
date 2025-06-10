import type { Config } from 'tailwindcss';
import tailwindcssAnimate from 'tailwindcss-animate';
import defaultTheme from 'tailwindcss/defaultTheme';

import {presetConfig} from '../lib/tailwind.config-components';

const config: Config = {
  presets: [presetConfig],
  corePlugins: {
    preflight: false,
    container: false,
  },
  darkMode: ["class", '[data-theme="dark"]'],
  content: ["./src/**/*.{jsx,tsx,html}", "../lib/**/*.{js,jsx,ts,tsx,md,mdx}", "./docs/**/*.{md,mdx}",],
  theme: {
     fontFamily: {
      sans: ['var(--font-roboto)', ...defaultTheme.fontFamily.sans],
    },
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        // border: 'hsl(var(--border))',
        // foreground: 'hsl(var(--foreground))',
        // background: 'hsl(var(--background))',
      }
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
