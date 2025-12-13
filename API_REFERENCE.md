# 📚 API & CLI Reference

> **💡 How to use:** This document details every function and command available in the `country-atlas` package, with copy-paste examples.

---

## 🧩 TypeScript API (Methods)

### Importer
```typescript
import { 
  getCountryByISO2, 
  getAllCountries, 
  searchCountry 
} from 'country-atlas';
```

---

### `getAllCountries()`
Returns the complete list of all countries.

**Method Signature:**
```typescript
function getAllCountries(): Country[]
```

**✅ How to use:**
```typescript
const all = getAllCountries();
console.log(`Loaded ${all.length} countries.`); 
// Output: Loaded 250 countries.
```

---

### `getCountryByISO2(iso2)`
Finds a country by its 2-letter ISO code.

**Method Signature:**
```typescript
function getCountryByISO2(iso2: string): Country | undefined
```

**✅ How to use:**
```typescript
const india = getCountryByISO2('IN');
if (india) {
  console.log(india.name); // "India"
  console.log(india.currency.symbol); // "₹"
}
```

---

### `getCountryByISO3(iso3)`
Finds a country by its 3-letter ISO code.

**Method Signature:**
```typescript
function getCountryByISO3(iso3: string): Country | undefined
```

**✅ How to use:**
```typescript
const usa = getCountryByISO3('USA');
console.log(usa?.capital[0]); // "Washington D.C."
```

---

### `searchCountry(query)`
Performs a fuzzy search on names and codes.

**Method Signature:**
```typescript
function searchCountry(query: string): Country[]
```

**✅ How to use:**
```typescript
const results = searchCountry('korea');
results.forEach(c => console.log(c.name));
// Output:
// South Korea
// North Korea
```

---

### `getCountriesByContinent(continent)`
Returns all countries within a specific continent.

**Method Signature:**
```typescript
function getCountriesByContinent(continent: string): Country[]
```

**✅ How to use:**
```typescript
const asianCountries = getCountriesByContinent('Asia');
console.log(asianCountries.map(c => c.iso.alpha2)); 
// Output: ['AF', 'CN', 'IN', 'JP', ...]
```

---

## 💻 CLI Commands

Run these directly in your terminal.

### `lookup`
**Method:** `npx atlas lookup <code_iso>`
**How to use:**
```bash
npx atlas lookup JP
```
*Displays full JSON data for Japan.*

### `search`
**Method:** `npx atlas search <name>`
**How to use:**
```bash
npx atlas search "United Kingdom"
```
*Lists all countries matching "United Kingdom".*

### `region`
**Method:** `npx atlas region <continent>`
**How to use:**
```bash
npx atlas region Europe
```
*Lists all countries in Europe.*
