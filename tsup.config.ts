import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/index.ts', 'src/cli.ts'],
    format: ['cjs', 'esm'],
    dts: {
        resolve: true,
        // Reduce .d.ts file size by not including source comments
        compilerOptions: {
            removeComments: true,
        },
    },
    splitting: true, // Enable code splitting for better tree-shaking
    sourcemap: false, // Disable source maps to reduce package size
    clean: true,
    minify: true, // Optimize bundle size as requested
    outDir: 'dist',
    target: 'es2020',
});
