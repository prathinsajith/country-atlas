import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        // Run tests in parallel with optimized pool
        pool: 'threads',
        poolOptions: {
            threads: {
                singleThread: false,
            },
        },

        // Optimize test execution
        globals: false, // Don't inject globals, use explicit imports
        passWithNoTests: false,

        // Test timeout
        testTimeout: 10000, // 10 seconds max per test
        hookTimeout: 10000,

        // Coverage (optional, but good for CI)
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            exclude: [
                'node_modules/**',
                'dist/**',
                'scripts/**',
                'tests/**',
                '**/*.test.ts',
                '**/*.config.*',
            ],
        },

        // Run tests in parallel
        isolate: false, // Faster - share context between test files

        // Exclude patterns
        exclude: ['node_modules/**', 'dist/**', '.git/**'],
    },
});
