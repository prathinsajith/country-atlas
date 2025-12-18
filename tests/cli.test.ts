import { describe, it, expect } from 'vitest';
import { spawn } from 'child_process';
import path from 'path';

describe('CLI Tests', () => {
    const cliPath = path.resolve(__dirname, '../src/cli.ts');
    const tsxPath = path.resolve(__dirname, '../node_modules/.bin/tsx');

    // Helper to run CLI commands
    const runCLI = (
        args: string[],
    ): Promise<{ stdout: string; stderr: string; exitCode: number }> => {
        return new Promise((resolve) => {
            const child = spawn('node', [tsxPath, cliPath, ...args]);
            let stdout = '';
            let stderr = '';

            child.stdout.on('data', (data) => {
                stdout += data.toString();
            });

            child.stderr.on('data', (data) => {
                stderr += data.toString();
            });

            child.on('close', (code) => {
                resolve({ stdout, stderr, exitCode: code || 0 });
            });
        });
    };

    describe('help command', () => {
        it('should show help when no command provided', async () => {
            const result = await runCLI([]);
            expect(result.stdout).toContain('Country Atlas CLI');
            expect(result.stdout).toContain('Usage:');
            expect(result.exitCode).toBe(0);
        });

        it('should show help with help command', async () => {
            const result = await runCLI(['help']);
            expect(result.stdout).toContain('Country Atlas CLI');
            expect(result.stdout).toContain('atlas lookup');
            expect(result.exitCode).toBe(0);
        });
    });

    describe('lookup command', () => {
        it('should lookup a country by ISO2 code', async () => {
            const result = await runCLI(['lookup', 'IN']);
            expect(result.stdout).toContain('India');
            expect(result.stdout).toContain('IN');
            expect(result.exitCode).toBe(0);
        });

        it('should lookup a country by ISO2 code (lowercase)', async () => {
            const result = await runCLI(['lookup', 'in']);
            expect(result.stdout).toContain('India');
            expect(result.exitCode).toBe(0);
        });

        it('should fail for invalid country code', async () => {
            const result = await runCLI(['lookup', 'XX']);
            expect(result.stderr).toContain('Country not found');
            expect(result.exitCode).toBe(1);
        });

        it('should fail when no query provided', async () => {
            const result = await runCLI(['lookup']);
            expect(result.stderr).toContain('Please provide a search query');
            expect(result.exitCode).toBe(1);
        });
    });

    describe('search command', () => {
        it('should search for countries by partial name', async () => {
            const result = await runCLI(['search', 'united']);
            expect(result.stdout).toContain('United');
            expect(result.stdout).toContain('Flag | Name'); // Table header check
            expect(result.exitCode).toBe(0);
        });

        it('should search with multiple word query', async () => {
            const result = await runCLI(['search', 'united states']);
            expect(result.stdout).toContain('United States');
            expect(result.exitCode).toBe(0);
        });

        it('should show message when no results found', async () => {
            const result = await runCLI(['search', 'zzzzz']);
            expect(result.stdout).toContain('No countries found');
            expect(result.exitCode).toBe(0);
        });

        it('should fail when no search query provided', async () => {
            const result = await runCLI(['search']);
            expect(result.stderr).toContain('Please provide a query');
            expect(result.exitCode).toBe(1);
        });
    });

    describe('region command', () => {
        it('should list countries in Asia', async () => {
            const result = await runCLI(['region', 'Asia']);
            expect(result.stdout).toContain('India');
            expect(result.stdout).toContain('Flag | Name'); // Table header
            expect(result.exitCode).toBe(0);
        });

        it('should list countries in Europe', async () => {
            const result = await runCLI(['region', 'Europe']);
            expect(result.stdout).toContain('Flag | Name');
            expect(result.exitCode).toBe(0);
        });

        it('should handle case insensitive region names', async () => {
            const result = await runCLI(['region', 'africa']);
            expect(result.stdout).toContain('Flag | Name');
            expect(result.exitCode).toBe(0);
        });

        it('should show message for invalid region', async () => {
            const result = await runCLI(['region', 'InvalidRegion']);
            expect(result.stdout).toContain('No countries found');
            expect(result.exitCode).toBe(0);
        });

        it('should fail when no region provided', async () => {
            const result = await runCLI(['region']);
            expect(result.stderr).toContain('Please provide a continent');
            expect(result.exitCode).toBe(1);
        });
    });

    describe('borders command', () => {
        it('should list bordering countries', async () => {
            const result = await runCLI(['borders', 'india']);
            expect(result.stdout).toContain('Pakistan');
            expect(result.stdout).toContain('China');
            expect(result.exitCode).toBe(0);
        });
    });

    describe('unknown command', () => {
        it('should show error for unknown command', async () => {
            const result = await runCLI(['unknown']);
            expect(result.stderr).toContain('Unknown command');
            expect(result.stdout).toContain('Usage:');
            expect(result.exitCode).toBe(1);
        });
    });
});
