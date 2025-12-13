import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCES = {
    mledoze: 'https://raw.githubusercontent.com/mledoze/countries/master/countries.json',
};

const RAW_DIR = path.join(__dirname, '../data/raw');

async function fetchSource(name: string, url: string) {
    console.log(`Fetching ${name} from ${url}...`);
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.statusText}`);
        const data = await res.json();
        await fs.writeFile(path.join(RAW_DIR, `${name}.json`), JSON.stringify(data, null, 2));
        console.log(`Saved ${name}.json`);
    } catch (error) {
        console.error(`Error fetching ${name}:`, error);
        process.exit(1);
    }
}

async function main() {
    await fs.mkdir(RAW_DIR, { recursive: true });
    await fetchSource('mledoze', SOURCES.mledoze);
    console.log('All sources fetched successfully.');
}

main();
