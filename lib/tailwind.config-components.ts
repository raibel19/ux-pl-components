import type { Config } from 'tailwindcss';

import tailwindAutocomplete from './components/compositions/autocomplete/tailwind.config-autocomplete';
import tailwindInput from './components/compositions/input/tailwind.config-input';

export const presetConfig: Partial<Config> = {
  presets: [tailwindInput, tailwindAutocomplete],
};

export const uxPlContentPaths: string[] = ['./node_modules/ux-pl-components/dist/**/*.{js,ts,jsx,tsx}'];
