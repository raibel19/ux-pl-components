import type { Config } from 'tailwindcss';

import tailwindInput from './components/compositions/input/tailwind.config-input';

export const presetConfig: Partial<Config> = {
  presets: [tailwindInput],
};

export const uxPlContentPaths: string[] = ['./node_modules/ux-pl-components/dist/**/*.{js,ts,jsx,tsx}'];
