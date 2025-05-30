import type { Config } from 'tailwindcss';

export const presetConfig: Partial<Config> = {
  content: [
    './node_modules/ux-pl-components/dist/**/*.{js,ts,jsx,tsx}',
  ],
};

export const uxPlContentPaths: string[] = [
  './node_modules/ux-pl-components/dist/**/*.{js,ts,jsx,tsx}',
];