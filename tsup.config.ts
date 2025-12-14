import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/index.ts', 'src/cli.ts'],
    format: ['cjs', 'esm'],
    dts: false, // Disable declaration generation - we'll use tsc separately or skip for size
    splitting: true, // Re-enable splitting for better tree-shaking
    sourcemap: false, // Disable source maps to reduce package size
    clean: true,
    minify: true, // Optimize bundle size as requested
    treeshake: true, // Enable aggressive tree-shaking
    outDir: 'dist',
    target: 'es2020',
});
