import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { optimize } from 'svgo';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const RAW_FLAGS_DIR = path.join(__dirname, '../data/flags/raw');
const OPTIMIZED_FLAGS_DIR = path.join(__dirname, '../data/flags/optimized');

async function optimizeFlags() {
    console.log('Optimizing flags...');
    await fs.mkdir(OPTIMIZED_FLAGS_DIR, { recursive: true });

    const files = await fs.readdir(RAW_FLAGS_DIR);

    for (const file of files) {
        if (!file.endsWith('.svg')) continue;

        const filePath = path.join(RAW_FLAGS_DIR, file);
        const data = await fs.readFile(filePath, 'utf-8');

        const result = optimize(data, {
            path: filePath,
            multipass: true,
            plugins: [
                'preset-default',
                'removeDimensions',
                'removeViewBox', // Keep viewBox if needed for scaling, but usually removing dimensions + keeping viewBox is best.
                // Wait, "Enforce consistent viewBox" in prompt.
                {
                    name: 'removeAttrs',
                    params: {
                        attrs: '(width|height)',
                    },
                },
                {
                    name: 'convertPathData',
                    params: {
                        floatPrecision: 2, // Aggressive rounding for SVG paths
                    }
                }
            ],
        });

        // The prompt says "Enforce consistent viewBox". 
        // lipis/flag-icons are 4x3 usually "0 0 640 480".
        // SVGO might strip it if we are not careful.
        // Let's ensure we keep viewBox.

        // Check if result has error?
        if ('data' in result) {
            await fs.writeFile(path.join(OPTIMIZED_FLAGS_DIR, file), result.data);
        } else {
            console.error(`Failed to optimize ${file}`);
        }
    }
    console.log(`Optimized ${files.length} flags.`);
}

optimizeFlags();
