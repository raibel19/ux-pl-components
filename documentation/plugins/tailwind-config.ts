import { Plugin } from '@docusaurus/types';
import autoprefixer from 'autoprefixer';
import postcssImport from 'postcss-import';
import tailwindcss from 'tailwindcss';

import tailwindConfig from '../tailwind.config';

//context: LoadContext, options: Props
export default function talwindPlugin(): Plugin {
  return {
    name: 'tailwind-plugin',
    configurePostCss(postcssOptions) {
      postcssOptions.plugins = postcssOptions.plugins || [];

      postcssOptions.plugins.unshift(postcssImport);
      postcssOptions.plugins.push(tailwindcss(tailwindConfig));
      postcssOptions.plugins.push(autoprefixer());

      return postcssOptions;
    },
  };
}
