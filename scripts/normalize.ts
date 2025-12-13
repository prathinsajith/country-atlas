/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import type {
    Country,
    GeoData,
    Currency,
    Flag,
    Timezone,
    Postal,
    Formats,
    Domains,
    ISO,
} from '../src/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const RAW_DIR = path.join(__dirname, '../data/raw');
const NORMALIZED_DIR = path.join(__dirname, '../data/normalized');

// Interfaces for the raw data from mledoze/countries (partial)

// ... Additional helper mappings ...

async function normalize() {
    console.log('Normalizing data...');
    const rawData = JSON.parse(await fs.readFile(path.join(RAW_DIR, 'mledoze.json'), 'utf-8'));

    const normalizedCountries: Country[] = await Promise.all(
        rawData.map(async (raw: any) => {
            // Mapping logic
            const iso: ISO = {
                alpha2: raw.cca2,
                alpha3: raw.cca3,
                numeric: raw.ccn3 || '',
            };

            // Geo
            const round = (n: number) => Math.round(n * 10000) / 10000;

            const geo: GeoData = {
                latitude: raw.latlng ? round(raw.latlng[0]) : 0,
                longitude: raw.latlng ? round(raw.latlng[1]) : 0,
                pointer: {
                    latitude: raw.latlng ? round(raw.latlng[0]) : 0,
                    longitude: raw.latlng ? round(raw.latlng[1]) : 0,
                },
                bounds: {
                    north: 0,
                    south: 0,
                    east: 0,
                    west: 0,
                },
                region: raw.subregion || raw.region || '',
                continent: raw.region || '',
                landlocked: raw.landlocked,
                areaKm2: raw.area,
                borders: raw.borders || [],
            };

            // Currency
            const currencyCode = Object.keys(raw.currencies || {})[0] || '';
            const currencyData = raw.currencies && currencyCode ? raw.currencies[currencyCode] : {};
            const currency: Currency = {
                code: currencyCode,
                name: currencyData?.name || '',
                symbol: currencyData?.symbol || '',
            };

            // Languages
            const languages = Object.values(raw.languages || {}).map((l) => l as string);

            // Timezones
            const timezones: Timezone[] = (raw.timezones || []).map((tz: string) => ({
                name: tz,
                utcOffset: tz.includes('UTC') ? tz.replace('UTC', '') : tz,
            }));

            // Flag
            let svgContent = '';
            try {
                if (iso.alpha2) {
                    const svgPath = path.join(
                        __dirname,
                        '../data/flags/optimized',
                        `${iso.alpha2.toLowerCase()}.svg`,
                    );
                    svgContent = await fs.readFile(svgPath, 'utf-8').catch(() => '');
                }
            } catch (_e) {
                console.warn(`Could not read SVG for ${iso.alpha2}`);
            }

            const flag: Flag = {
                emoji: raw.flag || '',
                svg: svgContent,
            };

            // Domains
            const domains: Domains = {
                topLevelDomain: raw.tld ? raw.tld[0] : '',
                internetTld: raw.tld || [],
            };

            // Postal
            const postal: Postal = {
                codeFormat: raw.postalCode?.format || '',
                example: raw.postalCode?.regex || '',
            };

            // Formats
            const formats: Formats = {
                dateFormat: '',
                weekStart: raw.startOfWeek || '',
            };

            const country: Country = {
                name: raw.name.common,
                officialName: raw.name.official,
                capital: raw.capital || [],
                iso,
                geo,
                nativeNames: raw.name.nativeName || {},
                languages,
                currency,
                callingCode: raw.idd?.root ? raw.idd.root + (raw.idd.suffixes?.[0] || '') : '',
                timezones,
                flag,
                domains,
                postal,
                formats,
                unMember: raw.unMember || false,
            };

            return country;
        }),
    );

    // Helper to strip empty values (Recursively bottom-up)
    const minify = (obj: any): any => {
        if (obj === null || obj === undefined || (typeof obj === 'string' && obj === ''))
            return undefined;

        if (Array.isArray(obj)) {
            const newArr = obj.map(minify).filter((x) => x !== undefined);
            return newArr.length > 0 ? newArr : undefined;
        }

        if (typeof obj === 'object') {
            const newObj: any = {};
            let hasKeys = false;
            for (const key in obj) {
                const val = minify(obj[key]);
                if (val !== undefined) {
                    newObj[key] = val;
                    hasKeys = true;
                }
            }
            return hasKeys ? newObj : undefined;
        }

        return obj;
    };

    await fs.mkdir(NORMALIZED_DIR, { recursive: true });
    await fs.writeFile(
        path.join(NORMALIZED_DIR, 'countries.json'),
        JSON.stringify(minify(normalizedCountries), null, 2),
    ); // Keeping formatted for readability in dev, but dist will be minified.
    // Actually, prompt asked for "most reduced size". User might want the source JSON to be smaller too?
    // Let's keep indentation for "source" data (our repo), but maybe build artifact is minified?
    // The user asked for "package in most reduced size".
    // tsup minifies the JS bundle. The JSONs are imported.
    // So if we minify the keys here, the bundle gets smaller.
    // Let's stick to the plan: strip empties.

    // Split by region (Continent)
    const regions = ['Asia', 'Europe', 'Africa', 'Americas', 'Oceania', 'Antarctic'];
    for (const region of regions) {
        const regionCountries = normalizedCountries.filter((c) => c.geo.continent === region);
        await fs.writeFile(
            path.join(NORMALIZED_DIR, `${region.toLowerCase()}.json`),
            JSON.stringify(minify(regionCountries), null, 2),
        );
        console.log(`Saved ${region}.json (${regionCountries.length} countries)`);
    }

    console.log(`Normalized ${normalizedCountries.length} countries.`);
}

normalize();
