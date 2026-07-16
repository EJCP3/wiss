import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

const rootDir = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  plugins: [
    dts({
      tsconfigPath: resolve(rootDir, 'tsconfig.json'),
      entryRoot: 'src',
      rollupTypes: true,
    }),
  ],
  build: {
    sourcemap: true,
    emptyOutDir: true,
    lib: {
      entry: {
        core: resolve(rootDir, 'src/core/index.ts'),
        vanilla: resolve(rootDir, 'src/vanilla/index.ts'),
        island: resolve(rootDir, 'src/styles/island.ts'),
      },
      formats: ['es', 'cjs'],
      fileName: (format, entryName) => `${entryName}.${format === 'es' ? 'js' : 'cjs'}`,
    },
    rollupOptions: {
      external: ['tailwindcss', 'daisyui'],
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'styles.css';
          return assetInfo.name || 'styles.css';
        },
      },
    },
  },
});
