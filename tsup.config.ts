import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    react: 'src/react.ts',
  },
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  external: ['react', '@tanstack/react-query'],
  splitting: false,
  sourcemap: true,
});
