import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'mjs' : 'cjs'}`,
    },
    outDir: 'dist',
    sourcemap: true,
    minify: false,
    
    target: 'esnext',
    rollupOptions: {
      external: [],
      output: {
        exports: "named",
        globals: {},
      },
    },
  },
  plugins: [dts()],
});
