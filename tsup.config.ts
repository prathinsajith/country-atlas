import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/index.ts', 'src/cli.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    splitting: true, // Enable code splitting for better tree-shaking
    sourcemap: true,
    clean: true,
    minify: true, // Optimize bundle size as requested
    outDir: 'dist',
    target: 'es2020',
});
