import react from '@vitejs/plugin-react';
import { glob } from 'glob';
import { fileURLToPath } from 'node:url';
import { extname, relative, resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { libInjectCss } from 'vite-plugin-lib-inject-css';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // tsconfigPaths({
    //   projects: [resolve(__dirname, 'tsconfig.lib.json')],
    // }),
    tsconfigPaths(),
    libInjectCss(),
    dts({ tsconfigPath: resolve(__dirname, 'tsconfig.lib.json') }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'lib/main.ts'),
      formats: ['es'],
    },
    copyPublicDir: false,
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'tailwindcss',
        '@carbon/icons-react',
        '@radix-ui/react-dialog',
        '@radix-ui/react-label',
        '@radix-ui/react-popover',
        '@radix-ui/react-scroll-area',
        '@radix-ui/react-separator',
        '@radix-ui/react-hover-card',
        '@radix-ui/react-tooltip',
        /^node:.*/,
      ],
      input: Object.fromEntries(
        glob.sync('lib/**/*.{ts,tsx}', { ignore: ['lib/**/*.d.ts'] }).map((file) => [
          //The name of the entry point
          // lib/nested/foo.ts becomes nested/foo
          relative('lib', file.slice(0, file.length - extname(file).length)),
          // The absolute path to the entry file
          // lib/nested/foo.ts becomes /project/lib/nested/foo.ts
          fileURLToPath(new URL(file, import.meta.url)),
        ]),
      ),
      output: {
        assetFileNames: 'assets/[name][extname]',
        entryFileNames: '[name].js',
      },
    },
  },
});
