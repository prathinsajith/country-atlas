# Developer Guide

This document explains the internal architecture of the `country-atlas` package. It serves as "proof" of the engineering rigor and automated pipelines used to build this dataset.

## 🏗️ Architecture Overview

The project is structured as an ETL (Extract, Transform, Load) pipeline that produces a static, type-safe dataset.

```mermaid
graph TD
    A[Raw Data Sources] -->|scripts/fetch.ts| B(Raw JSON)
    C[SVG Flags] -->|scripts/fetch-flags.ts| D(Raw SVGs)
    D -->|scripts/optimize-flags.ts| E(Optimized SVGs)
    B -->|scripts/normalize.ts| F{Normalization Engine}
    E -->|Embed| F
    F -->|Minify & Split| G[Normalized JSONs]
    G -->|Build (tsup)| H[Distributable Bundle]
```

## 🔧 ETL Pipeline (`scripts/`)

The core logic resides in the `scripts/` directory. These scripts are strictly typed with TypeScript.

### 1. Extraction (`fetch.ts`, `fetch-flags.ts`)

- Downloads authoritative data from `mledoze/countries` (ISO standards, currencies, languages).
- Downloads vector flags from `lipis/flag-icons`.

### 2. Optimization (`optimize-flags.ts`)

- Uses `svgo` to aggressively compress SVG flags.
- **Techniques:**
    - Strips metadata and comments.
    - Rounds path precision to 2 decimals.
    - Standardizes `viewBox`.
- **Result:** ~50% reduction in flag size compared to raw.

### 3. Transformation (`normalize.ts`)

- Maps raw data to the strict `Country` interface defined in `src/types/`.
- **Data Cleaning:**
    - Rounds geo-coordinates to 4 decimal places (~11m precision).
    - Strips empty fields (`null`, `""`, `[]`) to minimize JSON size.
- **Embedding:** Reads optimized SVGs and embeds them inline into the JSON.
- **Splitting:** Generates region-specific files (`asia.json`, `europe.json`) for tree-shaking.

## 🧪 Testing Strategy

We use `Vitest` to ensure data integrity.

- **Schema Validation:** Every single generated country object is validated against the `Country` TypeScript interface.
- **API Tests:** Verify that lookup functions (`getCountryByISO2`) behave correctly (case-insensitivity, error handling).
- **Flag Integrity:** checks that every embedded string is a valid SVG.

## 📦 Build System

- **Tool:** `tsup` (esbuild-based).
- **Output:**
    - `dist/index.js` (CJS) - Legacy Node.js support.
    - `dist/index.mjs` (ESM) - Modern bundlers (Vite, Webpack).
    - `dist/index.d.ts` (Types) - Full TypeScript support.

## 🛠️ Utility Functions Library

The package includes a comprehensive utilities library organized into specialized modules:

### Validators (`src/utils/validators.ts`)

- `isValidISO2()` - Validate ISO 3166-1 alpha-2 codes
- `isValidISO3()` - Validate ISO 3166-1 alpha-3 codes
- `isValidCallingCode()` - Validate international calling codes
- `isValidCurrencyCode()` - Validate ISO 4217 currency codes

### Phone Number Validation (`src/utils/phone.ts`)

- `validatePhoneNumber()` - Comprehensive phone number validation with detailed results
- `isValidPhoneNumber()` - Quick boolean validation
- `formatPhoneNumberInternational()` - Format phone numbers in international format
- `getCountryFromPhoneNumber()` - Auto-detect country from calling code
- `parsePhoneNumber()` - Parse phone number into components

**Features:**

- Auto-detection of country from calling codes (+91, +44, etc.)
- Support for national and international formats
- Smart cleaning of special characters (spaces, dashes, parentheses)
- Length validation (4-15 digits)
- Detailed error messages

### Formatters (`src/utils/formatters.ts`)

- `getCountryFlag()` - Get flag as emoji or SVG
- `formatPhoneNumber()` - Add calling code to phone numbers
- `formatCountryWithFlag()` - Display country with flag emoji
- `formatCurrency()` - Format currency with symbol and amount

### Type Guards (`src/utils/guards.ts`)

- `isCountry()` - Validate Country object structure
- `hasCallingCode()` - Check if country has calling code
- `hasCurrency()` - Check if country has currency data
- `hasCapital()` - Check if country has capital
- `hasCoordinates()` - Check if country has geographic coordinates
- `isLandlocked()` - Check if country is landlocked
- `isUNMember()` - Check if country is a UN member

### Sorting Utilities (`src/utils/sorting.ts`)

- `sortByName()` - Sort countries alphabetically
- `sortByArea()` - Sort countries by area (km²)
- `groupByContinent()` - Group countries by continent
- `groupByRegion()` - Group countries by region
- `groupByCurrency()` - Group countries by currency code

### Geographic Utilities (`src/utils/geo.ts`)

- `getDistanceBetweenCountries()` - Calculate distance using Haversine formula
- `getNearestCountries()` - Find N nearest countries to a given country
- `doCountriesShareBorder()` - Check if two countries share a border

**Features:**

- Accurate distance calculation in kilometers
- Border detection using ISO codes
- Configurable result limits

### Image Manipulation (`src/utils/image.ts`)

- `resizeFlagSvg()` - Resize SVG flags to exact dimensions
- `resizeFlagSvgMaintainRatio()` - Resize maintaining aspect ratio
- `resizeFlagWithPreset()` - Use preset sizes (TINY, SMALL, MEDIUM, LARGE, XLARGE, ICON, THUMBNAIL, BANNER)
- `applyFlagShape()` - Create circular, rounded, or square flags
- `applyFlagFilter()` - Apply CSS filters (grayscale, brightness, contrast, opacity, blur)
- `svgToDataUrl()` - Convert SVG to URL-encoded data URL
- `svgToBase64DataUrl()` - Convert SVG to base64 data URL
- `generateFlagImgTag()` - Generate complete HTML `<img>` tag
- `isoToFlagEmoji()` - Convert ISO code to flag emoji
- `emojiToUnicode()` - Convert emoji to Unicode codepoints

**Preset Sizes:**

```typescript
FLAG_SIZES = {
  TINY: 16×12,
  SMALL: 32×24,
  MEDIUM: 64×48,
  LARGE: 128×96,
  XLARGE: 256×192,
  ICON: 24×24 (square),
  THUMBNAIL: 100×75,
  BANNER: 800×600
}
```

## 🔍 Enhanced API Functions

### Batch Operations

- `getCountriesByISO2Codes()` - Fetch multiple countries by ISO2 codes
- `getCountriesByISO3Codes()` - Fetch multiple countries by ISO3 codes
- `searchCountries()` - Multi-criteria search with filters

**Search Criteria:**

- `continent` - Filter by continent
- `region` - Filter by region
- `currency` - Filter by currency code
- `language` - Filter by language
- `landlocked` - Filter landlocked countries
- `unMember` - Filter UN member countries
- `name` - Partial name match

### Error Handling

- `getCountryByISO2OrThrow()` - Throws `CountryNotFoundError` if not found
- `getCountryByISO3OrThrow()` - Throws `CountryNotFoundError` if not found
- `getCountryByNameOrThrow()` - Throws `CountryNotFoundError` if not found

**Custom Error Classes:**

- `CountryNotFoundError` - Includes code and search type
- `InvalidInputError` - Includes field, value, and reason

## 🧪 Testing Strategy (Updated)

We use `Vitest` to ensure data integrity and functionality.

### Test Suites (157 tests total)

- **Schema Validation** (3 tests) - Validate Country interface compliance
- **API Tests** (22 tests) - Test all lookup and search functions
- **Flag Tests** (2 tests) - Validate SVG integrity
- **Search Tests** (2 tests) - Test search functionality
- **Utility Tests** (46 tests) - Test validators, formatters, type guards, sorting, and geo utilities
- **Image Tests** (36 tests) - Test all image manipulation functions
- **Phone Tests** (30 tests) - Test phone number validation and formatting
- **CLI Tests** (16 tests) - Test command-line interface

### Coverage Areas

- ✅ Input validation and edge cases
- ✅ Type safety and type guards
- ✅ Phone number formats (international and national)
- ✅ Image resizing and transformations
- ✅ Distance calculations and geographic queries
- ✅ Error handling and custom errors
- ✅ Batch operations and multi-criteria search

## 📊 Package Optimization

### Size Reduction Techniques

1. **TypeScript Declaration Optimization**
    - Use `tsconfig.build.json` to exclude data files from type generation
    - Remove comments from declarations
    - Disable declaration maps

2. **Build Configuration**
    - Disabled source maps (`sourcemap: false`)
    - Enabled minification (`minify: true`)
    - Enabled tree-shaking (`treeshake: true`)
    - Code splitting for better tree-shaking

3. **Package Exclusions** (`.npmignore`)
    - Exclude source files (`src/`)
    - Exclude test files (`tests/`)
    - Exclude scripts (`scripts/`)
    - Exclude raw data (`data/raw/`, `data/flags/raw/`)

**Current Package Stats:**

- Compressed: 2.1 MB
- Unpacked: 7.0 MB
- Files: 27

## 🚀 Development Workflow

### Initial Setup (First Time Contributors)

When you clone this repository, the flag SVG files are **NOT** included in Git (they're in `.gitignore` to keep the repo small). You need to fetch them:

```bash
# Clone the repository
git clone https://github.com/yourusername/country-atlas.git
cd country-atlas

# Install dependencies
npm install

# Fetch flag SVG files (REQUIRED for development)
npm run fetch:flags

# Build the project
npm run build

# Run tests
npm test
```

### 🏁 How to Build the Flag Folder

The flag folder is built in two steps:

#### Step 1: Fetch Raw Flags

```bash
npm run fetch:flags
```

This downloads SVG flags from [lipis/flag-icons](https://github.com/lipis/flag-icons) repository to `data/flags/raw/`

#### Step 2: Optimize Flags

```bash
npm run optimize:flags
```

This compresses SVGs using SVGO and saves them to `data/flags/optimized/`

- Strips metadata and comments
- Rounds path precision to 2 decimals
- Removes width/height attributes
- Results in ~50% size reduction

#### Complete Data Pipeline

```bash
npm run setup
```

This runs the entire ETL pipeline:

1. `fetch:data` - Downloads country data from mledoze/countries
2. `fetch:flags` - Downloads flag SVGs
3. `optimize:flags` - Compresses SVGs
4. `normalize` - Generates normalized JSON files with embedded flags

### Development Commands

```bash
npm run build        # Build the package
npm test            # Run all tests
npm run lint        # Check code quality
npm run format      # Format code with Prettier
npm run size        # Check package size
npm run fetch:data  # Fetch raw country data
npm run fetch:flags # Fetch flag SVG files
npm run optimize:flags # Optimize flag SVGs
npm run normalize   # Generate normalized data files
npm run setup       # Run complete ETL pipeline
```

### Adding New Features

1. Implement feature in `src/`
2. Add TypeScript types in `src/types/`
3. Create tests in `tests/`
4. Update documentation
5. Run full test suite
6. Update CHANGELOG.md

## 📝 Code Organization

```
src/
├── index.ts              # Main entry point with default export
├── cli.ts                # Command-line interface
├── types/                # TypeScript interfaces
│   ├── Country.ts
│   ├── Currency.ts
│   ├── Flag.ts
│   ├── Geo.ts
│   └── index.ts
├── data/                 # Data exports
│   └── index.ts
├── api/                  # API functions
│   └── index.ts
├── utils/                # Utility functions
│   ├── validators.ts     # Input validators
│   ├── formatters.ts     # Output formatters
│   ├── guards.ts         # Type guards
│   ├── sorting.ts        # Sorting utilities
│   ├── geo.ts           # Geographic utilities
│   ├── image.ts         # Image manipulation
│   ├── phone.ts         # Phone validation
│   └── index.ts
└── errors.ts            # Custom error classes
```

## 🎯 Best Practices

### Type Safety

- All functions are fully typed
- Use type guards for runtime validation
- Export all types for consumer use

### Performance

- Use lazy loading where possible
- Minimize bundle size with tree-shaking
- Cache expensive calculations

### Error Handling

- Provide both throwing and non-throwing variants
- Include detailed error messages
- Use custom error classes for better error handling

### Testing

- Test all edge cases
- Test both valid and invalid inputs
- Maintain high test coverage (157 tests and growing)
