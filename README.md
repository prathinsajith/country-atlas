# 🌍 World Country Data

> **Production-ready, type-safe, and tree-shakable country metadata for modern applications.**

[![NPM Version](https://img.shields.io/npm/v/country-atlas)](https://www.npmjs.com/package/country-atlas)
[![Try on RunKit](https://badge.runkitcdn.com/country-atlas.svg)](https://npm.runkit.com/country-atlas)
[![License: MIT](https://img.shields.io/github/license/prathinsajith/country-atlas)](https://github.com/prathinsajith/country-atlas/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)](https://www.typescriptlang.org/)

A lightweight, zero-dependency Node.js library that provides authoritative data for all countries. Optimized for both backend (validation, enrichment) and frontend (UI components, maps) use.

## 🚀 Features

- **🛡️ Strict TypeScript Support:** Fully typed interfaces (`Country`, `Currency`, `Geo`, etc.).
- **🌲 Tree-Shakable:** Import only the regions or data you need (e.g., `import { asia } from ...`).
- **⚡ Zero Runtime Dependencies:** Pure JSON data and simple helper functions.
- **🚩 Optimized Flags:** Includes high-quality, lightweight SVG flags embedded inline (no external requests).
- **📦 Dual Build:** Supports both ESM (`import`) and CJS (`require`).
- **✅ Verified Data:** Normalized from ISO 3166, CLDR, and authoritative sources.

## 📦 Installation

```bash
npm install country-atlas
# or
yarn add country-atlas
# or
pnpm add country-atlas
```

## 📖 Usage

### Basic Lookup

```typescript
import { getCountryByISO2, getCountryByName } from 'country-atlas';

// Lookup by ISO 3166-1 alpha-2 code
const india = getCountryByISO2('IN');
console.log(india?.name); // "India"
console.log(india?.currency.code); // "INR"
console.log(india?.flag.emoji); // "🇮🇳"

// Fuzzy search by name
const usa = getCountryByName('united states');
console.log(usa?.iso.alpha3); // "USA"
```

### Advanced Search & Filtering

```typescript
import { searchCountry, getCountriesByContinent } from 'country-atlas';

// Search by partial name
const results = searchCountry('uni');
// Returns [United Arab Emirates, United Kingdom, United States, ...]

// Filter by Continent
const asianCountries = getCountriesByContinent('Asia');

// Find by Calling Code
const usa = getCountryByCallingCode('+1');

// Filter by Currency
const euroZone = getCountriesByCurrency('EUR');
```

### Field Selection (Performance)

```typescript
import { getCountry } from 'country-atlas';

// Get only specific fields to reduce memory usage in critical paths
const partialData = getCountry('FR', {
    fields: ['name', 'capital', 'currency'],
});
```

### 📱 Phone Number Validation (Example)

```typescript
import { getCountryByISO2 } from 'country-atlas';

function validatePhonePrefix(phoneNumber: string, isoCode: string) {
    const country = getCountryByISO2(isoCode);
    if (!country?.callingCode) return false;

    // Simple check: does the number start with the country's calling code?
    return phoneNumber.startsWith(country.callingCode);
}

console.log(validatePhonePrefix('+919876543210', 'IN')); // true
```

### Region-Specific Imports (Tree-Shaking)

If you only need data for a specific region, import specifically to reduce bundle size:

```typescript
import { asia } from 'country-atlas';

console.log(asia.length); // 50+ countries
```

## 💻 CLI Usage

The package comes with a built-in zero-dependency CLI.

```bash
# Lookup country by ISO code
npx atlas lookup IN

# Search countries by name
npx atlas search "United States"

# List countries in a region
npx atlas region Asia
```

## 🧩 Data Schema

Each country object strictly follows the `Country` interface:

```typescript
interface Country {
    name: string; // Common name
    officialName: string; // Official full name
    iso: {
        alpha2: string; // "US"
        alpha3: string; // "USA"
        numeric: string; // "840"
    };
    geo: {
        region: string; // "Americas"
        continent: string; // "North America"
        latlng: [number, number];
        // ...
    };
    currency: {
        code: string; // "USD"
        name: string;
        symbol: string; // "$"
    };
    flag: {
        emoji: string; // "🇺🇸"
        svg: string; // Inline optimized SVG string
    };
    // ... languages, timezones, calling codes, TLDs
}
```

## 🛠️ Data Sources

This package normalizes data from the following authoritative projects:

- **ISO 3166-1**: Country codes.
- **mledoze/countries**: Primary dataset foundation.
- **lipis/flag-icons**: High-quality SVG flags.
- **Unicode CLDR**: Locale data.

## 🧪 Testing

This library is rigorously tested with `Vitest` to ensure:

- No missing required fields.
- Unique ISO codes.
- Valid SVG flag content.
- Correct API behavior.

```bash
npm test
```

## 📄 License

MIT © [Prathin Sajith](https://github.com/prathinsajith)
