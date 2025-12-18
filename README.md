# 🌍 Country Atlas

[![npm version](https://img.shields.io/npm/v/country-atlas)](https://www.npmjs.com/package/country-atlas)
[![npm downloads](https://img.shields.io/npm/dt/country-atlas)](https://www.npmjs.com/package/country-atlas)
[![license](https://img.shields.io/github/license/prathinsajith/country-atlas)](https://github.com/prathinsajith/country-atlas/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-ready-blue)](https://www.typescriptlang.org/)
[![bundle size](https://img.shields.io/bundlephobia/minzip/country-atlas)](https://bundlephobia.com/package/country-atlas)

> **Production-ready, type-safe, and tree-shakable country metadata for modern applications.**

**Country Atlas** is a comprehensive country intelligence package designed for validation, localization, mapping, phone handling, and UI use cases. It works equally well in frontend and backend environments, ships with zero runtime dependencies, and is optimized for performance.

---

## ✨ Key Features

- **🧩 Fully type-safe** – Strict TypeScript types with literal ISO codes for complete autocomplete support
- **🚩 Native Name Lookup** – Find countries by their native names (e.g., "भारत", "République française")
- **🌲 Tree-shakable** – Import only what you need (regions, utilities, or single lookups)
- **🚫 Zero runtime dependencies** – Pure data + utilities
- **🚩 Infinite-scale flags** – Optimized SVG flags that scale without quality loss
- **📞 Phone intelligence** – Validation, parsing, formatting, and country auto-detection
- **🎨 Flag image utilities** – Resize, shape, filter, and convert SVG flags
- **🌍 Geographic helpers** – Neighbors, bounds, lat/lng, and distance calculation
- **🧪 Well tested** – 160+ tests validating data integrity, performance, and utilities
- **🔄 CI/CD ready** – Automated workflows for testing, build verification, and linting

---

## 📦 Installation

```bash
npm install country-atlas
# or
yarn add country-atlas
# or
pnpm add country-atlas
```

---

## 🚀 Quick Start

### Basic Lookup

```ts
import { getCountryByISO2, getCountryByName } from 'country-atlas';

const india = getCountryByISO2('IN'); // Full autocomplete for ISO codes!
console.log(india?.name); // India
console.log(india?.currency.code); // INR
console.log(india?.flag.emoji); // 🇮🇳

const usa = getCountryByName('united states');
console.log(usa?.iso.alpha3); // USA

// Native Name Lookup
const bharat = getCountryByName('भारत');
console.log(bharat?.name); // India
```

---

## 🔍 Search & Filtering

```ts
import {
    searchCountry,
    getCountriesByContinent,
    getCountryByCallingCode,
    getCountriesByCurrency,
} from 'country-atlas';

const matches = searchCountry('uni');
const asia = getCountriesByContinent('Asia');
const us = getCountryByCallingCode('+1');
const euroZone = getCountriesByCurrency('EUR');

import { getBorderCountries } from 'country-atlas';
const neighbors = getBorderCountries('India'); // Returns array of Country objects
```

---

## ⚡ Performance-Oriented Access

Fetch only the fields you need:

```ts
import { getCountry } from 'country-atlas';

const minimal = getCountry('FR', {
    fields: ['name', 'capital', 'currency'],
});
```

---

## 📋 Exported Constants

Access raw metadata lists directly for select components or dropdowns:

```ts
import { CONTINENTS, ISO2_CODES, ISO3_CODES, CURRENCY_CODES } from 'country-atlas';

console.log(CONTINENTS); // ['Asia', 'Europe', ...]
console.log(ISO2_CODES); // ['AF', 'AX', 'AL', ...]
```

---

## 📞 Phone Number Utilities

```ts
import { utils } from 'country-atlas';

const result = utils.validatePhoneNumber('+1-202-555-0123', 'US');
console.log(result);
/*
{
  isValid: true,
  country: 'US',
  nationalNumber: '2025550123',
  internationalFormat: '+1 202 555 0123',
  callingCode: '+1'
}
*/

utils.isValidPhoneNumber('+44 20 7946 0958', 'GB'); // true
utils.getCountryFromPhoneNumber('+33 1 42 86 82 00'); // France
utils.formatPhoneNumberInternational('2025550123', 'US');
utils.parsePhoneNumber('+1-202-555-0123');
```

---

## 🚩 Flag Image Manipulation

```ts
import { getCountryByISO2, utils } from 'country-atlas';

const country = getCountryByISO2('US');
const flagSvg = country?.flag.svg;

utils.resizeFlagSvg(flagSvg, 320, 240);
utils.resizeFlagSvgMaintainRatio(flagSvg, 200, 200);
utils.resizeFlagWithPreset(flagSvg, 'SMALL'); // 32x24
utils.applyFlagShape(flagSvg, 'circle', 64);
utils.applyFlagFilter(flagSvg, { grayscale: 100 });
utils.svgToDataUrl(flagSvg);
utils.generateFlagImgTag(flagSvg, {
    width: 64,
    height: 48,
    alt: 'United States Flag',
});
```

---

## 🌍 Region-Based Imports (Tree-Shaking)

```ts
import { asia } from 'country-atlas';

console.log(asia.length); // 50+ countries
```

---

## 🖥️ CLI Usage

```bash
# Look up by code or name (India, IN, IND)
npx atlas lookup IN

# List neighboring countries
npx atlas borders "United Kingdom"

# Search with table output (default)
npx atlas search "United"

# Get machine-readable JSON
npx atlas lookup US --json

# List countries by region
npx atlas region Asia
```

---

## 🧱 Data Model (Simplified)

```ts
interface Country {
    name: string;
    officialName: string;
    iso: {
        alpha2: string;
        alpha3: string;
        numeric: string;
    };
    geo: {
        continent: string;
        region: string;
        latlng: [number, number];
        bounds?: [number, number, number, number];
        placeId?: string;
    };
    currency: {
        code: string;
        name: string;
        symbol: string;
    };
    flag: {
        emoji: string;
        svg: string;
    };
}
```

---

## 🧪 Testing & Quality

The package includes **163 comprehensive tests** using **Vitest** to ensure:

- ✅ **36 tests** - Image manipulation & flag utilities
- ✅ **30 tests** - Phone number validation
- ✅ **46 tests** - Utility functions (validators, formatters, guards, sorting, geo)
- ✅ **27 tests** - API functions (Indexing, Native Lookup, Borders)
- ✅ **17 tests** - CLI functionality (Tables, JSON, Borders)
- ✅ **7 tests** - Data integrity, schema validation, search

```bash
# Run all tests (157 tests in ~4s)
npm test

# Run fast unit tests only (141 tests in ~325ms)
npm run test:unit

# Run CLI tests only
npm run test:cli

# Watch mode for development
npm run test:watch
```

**Performance**: Unit tests execute in **325ms** for rapid development feedback!

---

## 📚 Data Sources

- **ISO 3166-1** – Country codes
- **Unicode CLDR** – Locale and formatting data
- **mledoze/countries** – Core country metadata
- **lipis/flag-icons** – High-quality SVG flags

---

## 📄 License

ISC © Prathin Sajith
