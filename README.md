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

- **🧩 Fully type-safe** – Strict TypeScript types for `Country`, `Geo`, `Currency`, `Flag`, and more
- **🌲 Tree-shakable** – Import only what you need (regions, utilities, or single lookups)
- **🚫 Zero runtime dependencies** – Pure data + utilities
- **🚩 Infinite-scale flags** – Optimized SVG flags that scale without quality loss
- **📞 Phone intelligence** – Validation, parsing, formatting, and country auto-detection
- **🎨 Flag image utilities** – Resize, shape, filter, and convert SVG flags
- **🌍 Geographic helpers** – Bounds, lat/lng, distance calculation, nearest countries
- **🔁 Dual module support** – Works with ESM and CommonJS
- **🧪 Well tested** – 150+ tests validating data integrity and utilities

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

const india = getCountryByISO2('IN');
console.log(india?.name); // India
console.log(india?.currency.code); // INR
console.log(india?.flag.emoji); // 🇮🇳

const usa = getCountryByName('united states');
console.log(usa?.iso.alpha3); // USA
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
npx atlas lookup IN
npx atlas search "United States"
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

The package is tested using **Vitest** to ensure:

- Data completeness and consistency
- ISO and currency code uniqueness
- SVG validity and optimization
- Utility correctness
- Phone validation accuracy

```bash
npm test
```

---

## 📚 Data Sources

- **ISO 3166-1** – Country codes
- **Unicode CLDR** – Locale and formatting data
- **mledoze/countries** – Core country metadata
- **lipis/flag-icons** – High-quality SVG flags

---

## 📄 License

ISC © Prathin Sajith
