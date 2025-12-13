import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FLAGS_REPO_BASE = 'https://raw.githubusercontent.com/lipis/flag-icons/main/flags/4x3/';
const RAW_FLAGS_DIR = path.join(__dirname, '../data/flags/raw');
const NORMALIZED_DATA_PATH = path.join(__dirname, '../data/normalized/countries.json');

async function fetchFlags() {
    console.log('Fetching flags...');
    await fs.mkdir(RAW_FLAGS_DIR, { recursive: true });

    // existingnormalized data to get the list of ISO codes
    const countries = JSON.parse(await fs.readFile(NORMALIZED_DATA_PATH, 'utf-8'));

    for (const country of countries) {
        const code = country.iso.alpha2.toLowerCase();
        if (!code) continue;

        const url = `${FLAGS_REPO_BASE}${code}.svg`;
        try {
            const res = await fetch(url);
            if (!res.ok) {
                console.warn(`Warning: Could not fetch flag for ${code} (${country.name}): ${res.status}`);
                continue;
            }
            const svg = await res.text();
            await fs.writeFile(path.join(RAW_FLAGS_DIR, `${code}.svg`), svg);
            // console.log(`Saved ${code}.svg`); // noisy
        } catch (err) {
            console.error(`Error fetching flag for ${code}:`, err);
        }
    }
    console.log('Flag fetch complete.');
}

fetchFlags();
