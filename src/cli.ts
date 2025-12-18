#!/usr/bin/env node
import {
    getCountryByISO2,
    getCountryByName,
    searchCountry,
    getCountriesByContinent,
    getBorderCountries,
} from './api';
import { Country } from './types';
import { version } from '../package.json';

const args = process.argv.slice(2);
const command = args[0];
const flags = args.filter((arg) => arg.startsWith('--'));
const params = args.filter((arg) => !arg.startsWith('--')).slice(1);
const param = params.join(' ');

function help() {
    console.log(`
Country Atlas CLI v${version}

Usage:
  atlas lookup <query>       Get country details (ISO2/3/Name)
  atlas search <query>       Search countries by name/official name
  atlas region <continent>   List countries in a specific continent
  atlas borders <query>      List all countries bordering a country
  atlas help                 Show this help message
  atlas version              Show version

Options:
  --json                     Output result as JSON
  --table                    Output result as a table (default for lists)

Examples:
  atlas lookup india
  atlas search united --json
  atlas region europe --table
  atlas borders chin
`);
}

function printTable(headers: string[], rows: string[][]) {
    const widths = headers.map((h, i) => Math.max(h.length, ...rows.map((r) => r[i]?.length || 0)));

    const formatRow = (row: string[]) => row.map((cell, i) => cell.padEnd(widths[i])).join(' | ');

    console.log(formatRow(headers));
    console.log(widths.map((w) => '-'.repeat(w)).join('-+-'));
    rows.forEach((row) => console.log(formatRow(row)));
}

if (!command || command === 'help') {
    help();
    process.exit(0);
}

if (command === 'version' || command === '-v' || command === '--version') {
    console.log(`v${version}`);
    process.exit(0);
}

const isJson = flags.includes('--json');

switch (command) {
    case 'lookup': {
        if (!param) {
            console.error('Error: Please provide a search query (ISO code or name).');
            process.exit(1);
        }
        const country = getCountryByISO2(param) || getCountryByName(param);
        if (country) {
            if (isJson) {
                console.log(JSON.stringify(country, null, 2));
            } else {
                console.log(`\n${country.flag.emoji}  ${country.name.toUpperCase()}`);
                console.log('='.repeat(country.name.length + 4));
                console.log(`Official Name : ${country.officialName}`);
                console.log(`ISO Codes     : ${country.iso.alpha2} / ${country.iso.alpha3}`);
                console.log(`Capital       : ${country.capital?.join(', ') || 'N/A'}`);
                console.log(`Region        : ${country.geo.region} (${country.geo.continent})`);
                console.log(
                    `Currency      : ${country.currency?.name} (${country.currency?.code})`,
                );
                console.log(`Calling Code  : ${country.callingCode}`);
                console.log(`Languages     : ${country.languages?.join(', ')}`);
                console.log(`Area          : ${country.geo.areaKm2.toLocaleString()} km²`);
                if (country.geo.borders?.length) {
                    console.log(`Borders       : ${country.geo.borders.join(', ')}`);
                }
                console.log('');
            }
        } else {
            console.error(`Country not found for query: ${param}`);
            process.exit(1);
        }
        break;
    }
    case 'search':
    case 'region':
    case 'borders': {
        if (!param) {
            console.error(
                `Error: Please provide a ${command === 'region' ? 'continent' : 'query'}.`,
            );
            process.exit(1);
        }

        let results: Country[] = [];
        if (command === 'search') results = searchCountry(param);
        else if (command === 'region') results = getCountriesByContinent(param);
        else if (command === 'borders') results = getBorderCountries(param);

        if (results.length > 0) {
            if (isJson) {
                console.log(JSON.stringify(results, null, 2));
            } else {
                const headers = ['Flag', 'Name', 'ISO2', 'Capital', 'Region'];
                const rows = results.map((c) => [
                    c.flag.emoji || '',
                    c.name,
                    c.iso.alpha2,
                    c.capital?.[0] || 'N/A',
                    c.geo.region || 'N/A',
                ]);
                printTable(headers, rows);
                console.log(`\nTotal: ${results.length} countries found.\n`);
            }
        } else {
            console.log('No countries found.');
        }
        break;
    }
    default:
        console.error(`Unknown command: ${command}`);
        help();
        process.exit(1);
}
