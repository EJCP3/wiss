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
        react: resolve(rootDir, 'src/react/index.tsx'),
        vue: resolve(rootDir, 'src/vue/index.ts'),
        svelte: resolve(rootDir, 'src/svelte/index.ts'),
      },
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['tailwindcss', 'daisyui', 'react', 'react-dom', 'react/jsx-runtime', 'vue', 'svelte', 'svelte/internal'],
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].[format].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'styles.css';
          return assetInfo.name || 'styles.css';
        },
      },
    },
  },
});
