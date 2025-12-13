import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import type { Country } from '../src/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const NORMALIZED_DIR = path.join(__dirname, '../data/normalized');

async function validate() {
    console.log('Validating data...');
    const data: Country[] = JSON.parse(
        await fs.readFile(path.join(NORMALIZED_DIR, 'countries.json'), 'utf-8'),
    );

    const errors: string[] = [];

    data.forEach((c, i) => {
        if (!c.name) errors.push(`Country #${i} missing name`);
        if (!c.iso.alpha2) errors.push(`Country ${c.name} missing ISO2`);
        if (!c.iso.alpha3) errors.push(`Country ${c.name} missing ISO3`);
        // Add more validation logic
    });

    if (errors.length > 0) {
        console.error(`Validation failed with ${errors.length} errors:`);
        errors.slice(0, 10).forEach((e) => console.error(e));
        if (errors.length > 10) console.error('...');
        process.exit(1);
    }

    console.log('Validation passed!');
}

validate();
