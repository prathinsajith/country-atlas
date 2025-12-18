# 📚 API & CLI Reference

> **💡 How to use:** This document details every function and command available in the `country-atlas` package, with copy-paste examples.

---

## 🧩 TypeScript API (Methods)

### Importer

```typescript
import { getCountryByISO2, getAllCountries, searchCountry } from 'country-atlas';
```

---

### `getAllCountries()`

Returns the complete list of all countries.

**Method Signature:**

```typescript
function getAllCountries(): Country[];
```

**✅ How to use:**

```typescript
const all = getAllCountries();
console.log(`Loaded ${all.length} countries.`);
// Output: Loaded 250 countries.
```

---

function getCountryByISO2(iso2: ISO2 | string): Country | undefined;

````

**✅ How to use:**

```typescript
const india = getCountryByISO2('IN'); // Autocomplete support for 'IN', 'GB', etc.
if (india) {
    console.log(india.name); // "India"
    console.log(india.currency.symbol); // "₹"
}
````

---

### `getCountryByISO3(iso3)`

Finds a country by its 3-letter ISO code.

**Method Signature:**

```typescript
function getCountryByISO3(iso3: ISO3 | string): Country | undefined;
```

**✅ How to use:**

```typescript
const usa = getCountryByISO3('USA');
console.log(usa?.capital[0]); // "Washington D.C."
```

---

### `getCountryByName(name)`

Finds a country by its common, official, or **native name**.

**Method Signature:**

```typescript
function getCountryByName(name: string): Country | undefined;
```

**✅ How to use:**

```typescript
const france = getCountryByName('République française');
const india = getCountryByName('भारत');
```

---

### `searchCountry(query)`

Performs a fuzzy search on names and codes.

**Method Signature:**

```typescript
function searchCountry(query: string): Country[];
```

**✅ How to use:**

```typescript
const results = searchCountry('korea');
results.forEach((c) => console.log(c.name));
// Output:
// South Korea
// North Korea
```

---

### `getCountriesByContinent(continent)`

Returns all countries within a specific continent.

**Method Signature:**

```typescript
function getCountriesByContinent(continent: string): Country[];
```

**✅ How to use:**

```typescript
const asianCountries = getCountriesByContinent('Asia'); // Autocomplete support for 'Asia', 'Europe', etc.
console.log(asianCountries.map((c) => c.iso.alpha2));
// Output: ['AF', 'CN', 'IN', 'JP', ...]
```

---

### `getBorderCountries(query)`

Returns an array of `Country` objects that border the specified country.

**Method Signature:**

```typescript
function getBorderCountries(query: ISO2 | ISO3 | string): Country[];
```

**✅ How to use:**

```typescript
const neighbors = getBorderCountries('Switzerland');
console.log(neighbors.map((c) => c.name));
// Output: ['Germany', 'France', 'Italy', 'Austria', 'Liechtenstein']
```

---

## 📋 Exported Constants

The following constants are exported for easier programmatic access:

| Constant         | Description                                |
| :--------------- | :----------------------------------------- |
| `CONTINENTS`     | String union of all 6 continents.          |
| `ISO2_CODES`     | Array of all 250 ISO 3166-1 alpha-2 codes. |
| `ISO3_CODES`     | Array of all 250 ISO 3166-1 alpha-3 codes. |
| `CURRENCY_CODES` | Unique sorted list of all currency codes.  |

---

## 💻 CLI Commands

Run these directly in your terminal.

### `lookup`

**Method:** `npx atlas lookup <query>`
**How to use:**

```bash
npx atlas lookup JP
npx atlas lookup "United Kingdom" --json
```

_Displays data for the country. Accepts ISO2, ISO3, or Name._

### `search`

**Method:** `npx atlas search <name>`
**How to use:**

```bash
npx atlas search "United"
```

_Lists all countries matching the query in a table format._

### `borders`

**Method:** `npx atlas borders <query>`
**How to use:**

```bash
npx atlas borders "Brazil"
```

_Lists all bordering countries in a table format._

### `region`

**Method:** `npx atlas region <continent>`
**How to use:**

```bash
npx atlas region Europe
```

_Lists all countries in the specified continent._

---

## 🚩 CLI Flags

| Flag      | Description                                         |
| :-------- | :-------------------------------------------------- |
| `--json`  | Output direct JSON instead of Table/formatted text. |
| `--table` | Force table output (default for list commands).     |
| `--help`  | Display help message.                               |
