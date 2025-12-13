#!/usr/bin/env node
import { getCountryByISO2, searchCountry, getCountriesByContinent } from './api';
import { version } from '../package.json';

const args = process.argv.slice(2);
const command = args[0];
const param = args.slice(1).join(' ');

function help() {
    console.log(`
Country Atlas CLI v${version}

Usage:
  atlas lookup <iso-code>    Get full country details (ISO2/3)
  atlas search <query>       Search countries by name
  atlas region <continent>   List countries in a specific continent
  atlas help                 Show this help message

Examples:
  atlas lookup in
  atlas search united
  atlas region asia
`);
}

if (!command || command === 'help') {
    help();
    process.exit(0);
}

switch (command) {
    case 'lookup': {
        if (!param) {
            console.error('Error: Please provide an ISO code.');
            process.exit(1);
        }
        const country = getCountryByISO2(param);
        if (country) {
            console.log(JSON.stringify(country, null, 2));
        } else {
            console.error(`Country not found for code: ${param}`);
            process.exit(1);
        }
        break;
    }
    case 'search': {
        if (!param) {
            console.error('Error: Please provide a search query.');
            process.exit(1);
        }
        const results = searchCountry(param);
        if (results.length > 0) {
            results.forEach(c => {
                console.log(`${c.flag.emoji}  ${c.name} (${c.iso.alpha2})`);
            });
        } else {
            console.log('No countries found.');
        }
        break;
    }
    case 'region': {
        if (!param) {
            console.error('Error: Please provide a region name.');
            process.exit(1);
        }
        const results = getCountriesByContinent(param);
        if (results.length > 0) {
            console.log(`Countries in ${param}:`);
            results.forEach(c => {
                console.log(`${c.flag.emoji}  ${c.name} (${c.iso.alpha2})`);
            });
        } else {
            console.log(`No countries found in region: ${param}`);
        }
        break;
    }
    default:
        console.error(`Unknown command: ${command}`);
        help();
        process.exit(1);
}
