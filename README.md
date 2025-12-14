# 🌍 Country Atlas

[![npm version](https://img.shields.io/npm/v/country-atlas)](https://www.npmjs.com/package/country-atlas)
[![npm downloads](https://img.shields.io/npm/dt---

## 🌍 Region-Based Imports (Tree-Shaking)

```ts
import { asia } from 'country-atlas';
console.log(asia.length); // 50+ countries
```

---

## 🛠️ Utility Functions Overview

The `utils` module provides a comprehensive set of helper functions:

### Validators

- `isValidISO2(code)` - Validate ISO 3166-1 alpha-2 codes
- `isValidISO3(code)` - Validate ISO 3166-1 alpha-3 codes
- `isValidCurrencyCode(code)` - Validate ISO 4217 currency codes
- `isValidContinent(name)` - Validate continent names

### Phone Validation

- `validatePhoneNumber(number, country)` - Comprehensive phone validation with details
- `isValidPhoneNumber(number, country)` - Quick boolean check
- `getCountryFromPhoneNumber(number)` - Auto-detect country from calling code
- `formatPhoneNumberInternational(number, country)` - Format with international prefix
- `parsePhoneNumber(number)` - Extract calling code and national number

### Formatters

- `formatCurrency(countryCode, amount)` - Format currency with symbol
- `formatCountryWithFlag(countryCode)` - Display country name with flag emoji
- `formatCallingCode(callingCode)` - Ensure proper +prefix

### Type Guards

- `hasCallingCode(country)` - Check if country has calling code
- `hasCapital(country)` - Check if country has capital
- `hasCurrency(country)` - Check if country has currency
- `isLandlocked(country)` - Check if country is landlocked
- And more...

### Sorting & Geographic

- `sortByName(countries)` - Sort countries alphabetically
- `sortByPopulation(countries)` - Sort by population (if available)
- `getDistanceBetweenCountries(country1, country2)` - Calculate distance in km
- `getNearestCountries(country, allCountries, limit)` - Find nearby countries

### Image Manipulation

- `resizeFlagSvg(svg, width, height)` - Resize to exact dimensions
- `resizeFlagSvgMaintainRatio(svg, maxWidth, maxHeight)` - Resize maintaining aspect ratio
- `resizeFlagWithPreset(svg, preset)` - Use preset sizes (ICON, SMALL, MEDIUM, LARGE, etc.)
- `applyFlagShape(svg, shape, size)` - Apply circular or rounded shapes
- `applyFlagFilter(svg, filters)` - Apply CSS filters (grayscale, brightness, etc.)
- `svgToDataUrl(svg)` - Convert SVG to data URL
- `generateFlagImgTag(svg, options)` - Generate HTML img tag

```ts
import { utils } from 'country-atlas';

// Example: Validate, format, and sort
const isValid = utils.isValidISO2('US'); // true
const formatted = utils.formatCurrency('US', 1000); // $1000 USD
const sorted = utils.sortByName(getAllCountries());
```

atlas)](https://www.npmjs.com/package/country-atlas)
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
- **� Phone validation** – Comprehensive phone number validation with auto-detection and international formatting
- **🎨 Image manipulation** – Resize, shape, filter, and convert flag images with 8 preset sizes
- **🛠️ Rich utilities** – 30+ helper functions for validation, formatting, sorting, and geographic calculations
- **�🔁 Dual module support** – Works with both ESM (`import`) and CommonJS (`require`)
- **🧪 Verified & tested** – Based on ISO standards with 157 comprehensive tests

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

## 📞 Phone Number Validation

```ts
import { utils } from 'country-atlas';

// Comprehensive validation with details
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

// Simple boolean check
const isValid = utils.isValidPhoneNumber('+44 20 7946 0958', 'GB'); // true

// Auto-detect country from number
const country = utils.getCountryFromPhoneNumber('+33 1 42 86 82 00');
console.log(country?.iso.alpha2); // FR

// Format number internationally
const formatted = utils.formatPhoneNumberInternational('2025550123', 'US');
console.log(formatted); // +1 202 555 0123

// Parse number components
const parsed = utils.parsePhoneNumber('+1-202-555-0123');
console.log(parsed);
/*
{
  callingCode: '1',
  nationalNumber: '2025550123',
  rawInput: '+1-202-555-0123'
}
*/
```

---

## � Flag Image Manipulation

```ts
import { getCountryByISO2, utils } from 'country-atlas';

const country = getCountryByISO2('US');
const flagSvg = country?.flag.svg;

// Resize flag to custom dimensions
const resized = utils.resizeFlagSvg(flagSvg, 320, 240);

// Resize maintaining aspect ratio
const resizedRatio = utils.resizeFlagSvgMaintainRatio(flagSvg, 200, 200);

// Use preset sizes (ICON, SMALL, MEDIUM, LARGE, XLARGE, HERO, THUMBNAIL, BANNER)
const smallFlag = utils.resizeFlagWithPreset(flagSvg, 'SMALL'); // 32x24
const largeFlag = utils.resizeFlagWithPreset(flagSvg, 'LARGE'); // 128x96
const heroFlag = utils.resizeFlagWithPreset(flagSvg, 'HERO'); // 512x384

// Convert to circular or rounded flag
const circleFlag = utils.applyFlagShape(flagSvg, 'circle', 64);
const roundedFlag = utils.applyFlagShape(flagSvg, 'rounded', 100);

// Apply CSS filters (grayscale, brightness, contrast, opacity, blur)
const grayscale = utils.applyFlagFilter(flagSvg, { grayscale: 100 });
const brightened = utils.applyFlagFilter(flagSvg, { brightness: 150, contrast: 120 });
const faded = utils.applyFlagFilter(flagSvg, { opacity: 50 });

// Convert to data URL or base64
const dataUrl = utils.svgToDataUrl(flagSvg);
const base64 = utils.svgToBase64DataUrl(flagSvg);

// Generate HTML img tag
const imgTag = utils.generateFlagImgTag(flagSvg, {
    width: 64,
    height: 48,
    alt: 'United States Flag',
    className: 'flag-icon',
});

// Convert ISO code to emoji
const emoji = utils.isoToFlagEmoji('US'); // 🇺🇸
const unicode = utils.emojiToUnicode('🇺🇸'); // 1F1FA-1F1F8
```

---

## �🌍 Region-Based Imports (Tree-Shaking)

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
- Phone number validation accuracy
- Image manipulation functions
- **157 comprehensive tests** across all utilities

```bash
npm test
```

---

## � Common Use Cases

### Phone Number Validation & Formatting

```ts
import { utils } from 'country-atlas';

// Validate with comprehensive details
const result = utils.validatePhoneNumber('+44 20 7946 0958', 'GB');
if (result.isValid) {
    console.log(`Valid ${result.country} number: ${result.internationalFormat}`);
}

// Auto-detect country from calling code
const country = utils.getCountryFromPhoneNumber('+81 3-1234-5678');
console.log(`Detected country: ${country?.name}`); // Japan

// Format existing numbers
const formatted = utils.formatPhoneNumberInternational('2025550123', 'US');
console.log(formatted); // +1 202 555 0123
```

### Advanced Phone Features

```ts
import { getCountryByISO2, utils } from 'country-atlas';

const country = getCountryByISO2('US');
if (utils.hasCallingCode(country)) {
    const parsed = utils.parsePhoneNumber('+1-202-555-0123');
    console.log(`Calling code: ${parsed.callingCode}`);
    console.log(`National number: ${parsed.nationalNumber}`);
}
```

### Currency Display

```ts
import { utils } from 'country-atlas';

const formatted = utils.formatCurrency('US', 100);
console.log(formatted); // $100 USD
```

### Country Selector UI

```ts
import { getAllCountries, utils } from 'country-atlas';

const countries = utils.sortByName(getAllCountries());
const options = countries.map((c) => ({
    value: c.iso.alpha2,
    label: utils.formatCountryWithFlag(c.iso.alpha2), // 🇺🇸 United States
}));
```

### Distance Calculations

```ts
import { getCountryByISO2, utils } from 'country-atlas';

const usa = getCountryByISO2('US');
const canada = getCountryByISO2('CA');
const distance = utils.getDistanceBetweenCountries(usa!, canada!);
console.log(`Distance: ${distance?.toFixed(0)} km`);

const nearest = utils.getNearestCountries(usa!, getAllCountries(), 5);
console.log(
    'Nearest countries:',
    nearest.map((n) => n.country.name),
);
```

### Advanced Filtering

```ts
import { searchCountries } from 'country-atlas';

// Find all landlocked countries in Europe using EUR
const results = searchCountries({
    continent: 'Europe',
    currency: 'EUR',
    landlocked: true,
});
```

### Type-Safe Batch Operations

```ts
import { getCountriesByISO2Codes, utils } from 'country-atlas';

const codes = ['US', 'CA', 'MX'];
const countries = getCountriesByISO2Codes(codes);

// Group by currency
const byCurrency = utils.groupByCurrency(countries);
```

### Error Handling

```ts
import { getCountryByISO2OrThrow, CountryNotFoundError } from 'country-atlas';

try {
    const country = getCountryByISO2OrThrow('XX'); // Throws if not found
} catch (error) {
    if (error instanceof CountryNotFoundError) {
        console.error(`Country not found: ${error.code}`);
    }
}
```

---

## �📚 Data Sources

- **ISO 3166-1** – Country codes
- **Unicode CLDR** – Locale and formatting data
- **mledoze/countries** – Primary metadata source
- **lipis/flag-icons** – High-quality SVG flags

---

## 📄 License

ISC © [Prathin Sajith](https://github.com/prathinsajith)
