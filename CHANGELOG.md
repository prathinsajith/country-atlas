# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.4] - 2025-12-14

### Added

#### Phone Number Validation Utilities

- **Validation Functions**: `validatePhoneNumber` - comprehensive phone number validation with detailed results
- **Quick Validation**: `isValidPhoneNumber` - simple boolean check for phone number validity
- **Formatting**: `formatPhoneNumberInternational` - format phone numbers in international format
- **Country Detection**: `getCountryFromPhoneNumber` - auto-detect country from calling code
- **Parsing**: `parsePhoneNumber` - extract country, calling code, and national number components
- **Auto-detection**: Automatically detect country from phone numbers with calling codes (+91, +44, etc.)
- **National Format Support**: Validate and format national phone numbers when country code is provided
- **Smart Cleaning**: Automatically handle special characters, spaces, dashes, and parentheses
- **Comprehensive Validation**: Check phone number length (4-15 digits), format, and country compatibility

#### Flag Image Manipulation Utilities

- **Resizing Functions**: `resizeFlagSvg`, `resizeFlagSvgMaintainRatio` for custom dimensions
- **Preset Sizes**: `FLAG_SIZES` constant with 8 common size presets (TINY, SMALL, MEDIUM, LARGE, XLARGE, ICON, THUMBNAIL, BANNER)
- **Shape Functions**: `applyFlagShape` for creating circular, rounded, or square flags
- **Filter Functions**: `applyFlagFilter` for applying CSS filters (grayscale, brightness, contrast, opacity, blur)
- **Conversion Functions**: `svgToDataUrl`, `svgToBase64DataUrl`, `generateFlagImgTag` for HTML integration
- **Emoji Utilities**: `isoToFlagEmoji`, `emojiToUnicode` for emoji flag conversions

#### Utility Functions

- **Validators**: `isValidISO2`, `isValidISO3`, `isValidCallingCode`, `isValidCurrencyCode` for input validation
- **Formatters**: `getCountryFlag`, `formatPhoneNumber`, `formatCountryWithFlag`, `formatCurrency` for display formatting
- **Type Guards**: `isCountry`, `hasCallingCode`, `hasCurrency`, `hasCapital`, `hasCoordinates`, `isLandlocked`, `isUNMember` for type-safe filtering
- **Sorting**: `sortByName`, `sortByArea`, `groupByContinent`, `groupByRegion`, `groupByCurrency` for data organization
- **Geographic**: `getDistanceBetweenCountries`, `getNearestCountries`, `doCountriesShareBorder` for distance calculations

#### API Enhancements

- **Batch Operations**: `getCountriesByISO2Codes`, `getCountriesByISO3Codes` for fetching multiple countries at once
- **Advanced Search**: `searchCountries` with multi-criteria filtering (continent, region, currency, language, landlocked, unMember, name)
- **Error Handling**: `getCountryByISO2OrThrow`, `getCountryByISO3OrThrow`, `getCountryByNameOrThrow` for fail-fast error handling
- **Custom Errors**: `CountryNotFoundError`, `InvalidInputError` classes for better error handling

#### Default Export

- Added default export for convenience: `import atlas from 'country-atlas'`

#### Documentation

- Added comprehensive "Phone Number Validation" section to README
- Added comprehensive "Flag Image Manipulation" section to README
- Added "Common Use Cases" section to README with real-world examples
- Phone number validation & formatting example
- Currency display example
- Country selector UI example
- Distance calculation example
- Advanced filtering example
- Batch operations example
- Error handling example
- Flag resizing and styling examples

### Improved

- Test coverage increased from 45 to 157 tests
- Added 30 phone validation tests (NEW)
- Added 36 image manipulation tests
- Added 46 utility function tests covering all new features
- Enhanced TypeScript type safety with type guards
- Better developer experience with formatted output helpers
- Improved phone number handling with international format support

### Fixed

- All JSON data verified (250 countries, unique ISO codes, valid coordinates)

## [1.0.3] - 2025-12-13

- License changed from MIT to ISC (consistent across all files)
- Package size optimized from 22MB to 2.1MB (compressed)
- TypeScript declaration files optimized to reduce size

### Improved

- Optimized build configuration for smaller package size

## [1.0.2] - 2025-01-13

### Fixed

- Updated README badges
- Fixed package.json metadata
- Added .npmignore for package size optimization

## [1.0.1] - 2025-12-13

### Added

- Initial public release
- Complete country dataset (250 countries)
- API functions for country lookup
- CLI tool for command-line usage
- TypeScript type definitions
- Optimized SVG flags

## [1.0.0] - 2025-12-13

### Added

- Initial development version
- Basic country data structure
- ISO code support
- Flag data integration
