import type { Config } from 'tailwindcss';

const presetConfig: Partial<Config> = {
  theme: {
    extend: {
      backgroundColor: {
        'ux-autocomplete-header': 'hsl(var(--ux-autocomplete-header-background) / <alpha-value>)',
        'ux-autocomplete-header-separator': 'hsl(var(--ux-autocomplete-header-separator-background) / <alpha-value>)',
        'ux-autocomplete-item-selected': 'hsl(var(--ux-autocomplete-item-selected-background) / <alpha-value>)',
        'ux-skeleton': 'hsl(var(--ux-skeleton-background) / <alpha-value>)',
      },
      textColor: {
        'ux-placeholder': 'hsl(var(--ux-placeholder-foreground) / <alpha-value>)',
        'ux-warning': 'hsl(var(--ux-warning-foreground) / <alpha-value>)',
        'ux-info': 'hsl(var(--ux-info-foreground) / <alpha-value>)',
      },
    },
  },
};

export default presetConfig;
