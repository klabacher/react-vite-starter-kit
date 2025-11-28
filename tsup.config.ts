import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/main.ts'],
  format: ['esm'],
  target: 'node18',
  outDir: 'dist',
  clean: true,
  sourcemap: true,
  dts: false,
  splitting: false,
  minify: false,
  shims: true,
  external: ['react', 'ink', 'validate-npm-package-name'],
  esbuildOptions(options) {
    options.banner = {
      js: '#!/usr/bin/env node\n',
    };
  },
});
