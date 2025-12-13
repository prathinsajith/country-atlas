# 🌍 Country Atlas

[![npm version](https://img.shields.io/npm/v/country-atlas)](https://www.npmjs.com/package/country-atlas)
[![npm downloads](https://img.shields.io/npm/dt/country-atlas)](https://www.npmjs.com/package/country-atlas)
[![license](https://img.shields.io/github/license/prathinsajith/country-atlas)](https://github.com/prathinsajith/country-atlas/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-ready-blue)](https://www.typescriptlang.org/)
[![bundle size](https://img.shields.io/bundlephobia/minzip/country-atlas)](https://bundlephobia.com/package/country-atlas)

> **Production-ready, type-safe, and tree-shakable country metadata for modern applications.**

**Country Atlas** provides authoritative, normalized country metadata designed for validation, localization, mapping, and UI use cases. It works seamlessly in both backend and frontend projects, with zero runtime dependencies and excellent tree-shaking support.

---

## ✨ Key Features

- **🧩 Type-safe** – Strict TypeScript definitions for all entities (`Country`, `Geo`, `Currency`, etc.)
- **🌲 Tree-shakable imports** – Import only the data you need (regions, helpers, or individual lookups)
- **🚫 Zero runtime dependencies** – Pure JSON data and helper functions
- **🚩 High-quality flags** – Optimized inline SVG flags for infinite scalability without quality loss
- **🔁 Dual module support** – Works with both ESM (`import`) and CommonJS (`require`)
- **🧪 Verified & normalized data** – Based on ISO standards and authoritative datasets

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

```ts
import { getCountry } from 'country-atlas';

const minimal = getCountry('FR', {
    fields: ['name', 'capital', 'currency'],
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

Tested with **Vitest** to ensure:

- All required fields exist
- ISO codes are unique
- SVG flags are valid and optimized
- API methods behave correctly

```bash
npm test
```

---

## 📚 Data Sources

- **ISO 3166-1** – Country codes
- **Unicode CLDR** – Locale and formatting data
- **mledoze/countries** – Primary metadata source
- **lipis/flag-icons** – High-quality SVG flags

---

## 📄 License

ISC © [Prathin Sajith](https://github.com/prathinsajith)
