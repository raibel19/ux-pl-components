import { Plugin } from '@docusaurus/types';
import path from 'path';

//context: LoadContext, options: Props
export default async function customWebpackAliasPlugin(): Promise<Plugin> {
  return {
    name: 'docusaurus-custom-webpack-alias',
    configureWebpack(webpackConfig) {
      const parentLibPath = path.resolve(__dirname, '../../lib');
      const newAliases = {
        '@/components': path.resolve(parentLibPath, 'components'),
        '@/components/ui/': path.resolve(parentLibPath, 'components/ui'),
        '@': parentLibPath,
      };

      return {
        resolve: {
          ...webpackConfig.resolve,
          alias: {
            ...webpackConfig.resolve.alias,
            ...newAliases,
          },
        },
      };
    },
  };
}
