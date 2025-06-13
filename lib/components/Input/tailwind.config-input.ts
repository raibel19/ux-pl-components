import type { Config } from 'tailwindcss';

const presetConfig: Partial<Config> = {
  theme: {
    extend: {
      backgroundColor: (cnf) => ({
        ...cnf.theme('colors'),
        'ux-input-label': {
          DEFAULT: 'hsl(var(--ux-input-label-background) / <alpha-value>)',
        },
      }),
      textColor: (cnf) => ({
        ...cnf.theme('colors'),
        'ux-input-label': {
          DEFAULT: 'hsl(var(--ux-input-label) / <alpha-value>)',
        },
      }),
    },
  },
};

export default presetConfig;
