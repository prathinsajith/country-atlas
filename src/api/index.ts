import { countries } from '../data';
import { Country, ISO2, ISO3, Continent } from '../types';
import { CountryNotFoundError } from '../errors';

// Internal lookup maps for performance
let iso2Map: Map<string, Country> | null = null;
let iso3Map: Map<string, Country> | null = null;
let numericMap: Map<string, Country> | null = null;
let nameMap: Map<string, Country> | null = null;
let callingCodeMap: Map<string, Country[]> | null = null;
let currencyMap: Map<string, Country[]> | null = null;
let languageMap: Map<string, Country[]> | null = null;

/**
 * Initializes all lookup maps once.
 */
function ensureMaps() {
    if (iso2Map) return;

    iso2Map = new Map();
    iso3Map = new Map();
    numericMap = new Map();
    nameMap = new Map();
    callingCodeMap = new Map();
    currencyMap = new Map();
    languageMap = new Map();

    (countries as Country[]).forEach((country) => {
        // ISO Lookups
        const a2 = country.iso.alpha2.toLowerCase();
        const a3 = country.iso.alpha3.toLowerCase();
        const num = country.iso.numeric;

        iso2Map!.set(a2, country);
        iso3Map!.set(a3, country);
        if (num) numericMap!.set(num, country);

        // Name Lookups (common, official, and ISO codes for quick resolve)
        const common = country.name.toLowerCase();
        const official = country.officialName.toLowerCase();
        nameMap!.set(common, country);
        nameMap!.set(official, country);
        nameMap!.set(a2, country);
        nameMap!.set(a3, country);

        // Native Name Lookups
        if (country.nativeNames) {
            Object.values(country.nativeNames).forEach((native) => {
                nameMap!.set(native.common.toLowerCase(), country);
                nameMap!.set(native.official.toLowerCase(), country);
            });
        }

        // Calling Code Index
        if (country.callingCode) {
            const cc = country.callingCode.replace('+', '');
            if (!callingCodeMap!.has(cc)) callingCodeMap!.set(cc, []);
            callingCodeMap!.get(cc)!.push(country);
        }

        // Currency Index
        if (country.currency?.code) {
            const cur = country.currency.code.toUpperCase();
            if (!currencyMap!.has(cur)) currencyMap!.set(cur, []);
            currencyMap!.get(cur)!.push(country);
        }

        // Language Index
        if (country.languages) {
            country.languages.forEach((lang) => {
                const l = lang.toLowerCase();
                if (!languageMap!.has(l)) languageMap!.set(l, []);
                languageMap!.get(l)!.push(country);
            });
        }
    });
}

/**
 * Returns all countries in the dataset.
 */
export function getAllCountries(): Country[] {
    return countries as unknown as Country[];
}

/**
 * Returns a country by its ISO 3166-1 alpha-2 code.
 *
 * @example
 * getCountryByISO2('IN') // Returns India
 */
export function getCountryByISO2(code: ISO2 | string): Country | undefined {
    ensureMaps();
    return iso2Map!.get(code.toLowerCase());
}

/**
 * Returns a country by its ISO 3166-1 alpha-3 code.
 *
 * @example
 * getCountryByISO3('USA') // Returns United States
 */
export function getCountryByISO3(code: ISO3 | string): Country | undefined {
    ensureMaps();
    return iso3Map!.get(code.toLowerCase());
}

/**
 * Returns a country by its common or official name.
 *
 * @example
 * getCountryByName('France')
 * getCountryByName('भारत')
 */
export function getCountryByName(name: string): Country | undefined {
    ensureMaps();
    return nameMap!.get(name.toLowerCase());
}

/**
 * Returns all countries in a specific continent.
 *
 * @example
 * getCountriesByContinent('Asia')
 */
export function getCountriesByContinent(continent: Continent | string): Country[] {
    const query = continent.toLowerCase();
    return (countries as unknown as Country[]).filter(
        (c) => c.geo.continent.toLowerCase() === query,
    );
}

/**
 * Returns countries by their calling code (e.g. "+1", "91").
 * Handles codes with or without '+' prefix.
 */
export function getCountryByCallingCode(callingCode: string): Country | undefined {
    ensureMaps();
    const code = callingCode.replace('+', '');
    const results = callingCodeMap!.get(code);
    return results ? results[0] : undefined;
}

/**
 * Returns all countries that use a specific currency code (e.g. "USD", "EUR").
 */
export function getCountriesByCurrency(currencyCode: string): Country[] {
    ensureMaps();
    const code = currencyCode.toUpperCase();
    return currencyMap!.get(code) || [];
}

/**
 * Returns all countries where a specific language is spoken.
 */
export function getCountriesByLanguage(language: string): Country[] {
    ensureMaps();
    const query = language.toLowerCase();
    return languageMap!.get(query) || [];
}

/**
 * Searches for countries by name or official name.
 *
 * @example
 * searchCountry('United') // Returns USA, UK, UAE, etc.
 */
export function searchCountry(query: string): Country[] {
    const q = query.toLowerCase();
    return (countries as unknown as Country[]).filter(
        (c) => c.name.toLowerCase().includes(q) || c.officialName.toLowerCase().includes(q),
    );
}

/**
 * Advanced selector: Get country by ISO code and return specific fields.
 *
 * @example
 * getCountry('US', { fields: ['name', 'capital'] })
 */
export function getCountry(
    code: ISO2 | string,
    options?: { fields: (keyof Country)[] },
): Partial<Country> | undefined {
    const country = getCountryByISO2(code);
    if (!country) return undefined;

    if (!options || !options.fields || options.fields.length === 0) {
        return country;
    }

    const result: Partial<Country> = {};
    options.fields.forEach((field) => {
        if (field in country) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            result[field] = country[field] as any;
        }
    });

    return result;
}

/**
 * Get multiple countries by their ISO2 codes in a single call.
 */
export function getCountriesByISO2Codes(codes: string[]): Country[] {
    return codes.map((code) => getCountryByISO2(code)).filter((c): c is Country => c !== undefined);
}

/**
 * Get multiple countries by their ISO3 codes in a single call.
 */
export function getCountriesByISO3Codes(codes: string[]): Country[] {
    return codes.map((code) => getCountryByISO3(code)).filter((c): c is Country => c !== undefined);
}

/**
 * Advanced search with multiple criteria.
 *
 * @example
 * searchCountries({ continent: 'Asia', unMember: true })
 */
export function searchCountries(criteria: {
    continent?: Continent | string;
    region?: string;
    currency?: string;
    language?: string;
    landlocked?: boolean;
    unMember?: boolean;
    name?: string;
}): Country[] {
    return (countries as unknown as Country[]).filter((country) => {
        if (
            criteria.continent &&
            country.geo.continent.toLowerCase() !== criteria.continent.toLowerCase()
        )
            return false;
        if (criteria.region && country.geo.region?.toLowerCase() !== criteria.region.toLowerCase())
            return false;
        if (criteria.currency && country.currency?.code !== criteria.currency.toUpperCase())
            return false;
        if (
            criteria.language &&
            !country.languages?.some((l) => l.toLowerCase() === criteria.language!.toLowerCase())
        )
            return false;
        if (criteria.landlocked !== undefined && country.geo.landlocked !== criteria.landlocked)
            return false;
        if (criteria.unMember !== undefined && country.unMember !== criteria.unMember) return false;
        if (
            criteria.name &&
            !country.name.toLowerCase().includes(criteria.name.toLowerCase()) &&
            !country.officialName.toLowerCase().includes(criteria.name.toLowerCase())
        )
            return false;
        return true;
    });
}

/**
 * Get country by ISO2 code or throw CountryNotFoundError.
 */
export function getCountryByISO2OrThrow(code: string): Country {
    const country = getCountryByISO2(code);
    if (!country) throw new CountryNotFoundError(code, 'iso2');
    return country;
}

/**
 * Get country by ISO3 code or throw CountryNotFoundError.
 */
export function getCountryByISO3OrThrow(code: string): Country {
    const country = getCountryByISO3(code);
    if (!country) throw new CountryNotFoundError(code, 'iso3');
    return country;
}

/**
 * Get country by name or throw CountryNotFoundError.
 */
export function getCountryByNameOrThrow(name: string): Country {
    const country = getCountryByName(name);
    if (!country) throw new CountryNotFoundError(name, 'name');
    return country;
}

/**
 * Returns an array of Country objects for all countries bordering the given country.
 * @param code ISO2 or ISO3 code of the country
 */
export function getBorderCountries(code: string): Country[] {
    const country = getCountryByName(code); // Works for ISO2/ISO3/Name
    if (!country || !country.geo.borders) return [];

    return country.geo.borders
        .map((borderCode) => getCountryByISO3(borderCode))
        .filter((c): c is Country => c !== undefined);
}

/**
 * Constants for common data lists
 */
export const CONTINENTS = ['Asia', 'Europe', 'Africa', 'Americas', 'Oceania', 'Antarctic'];

export const ISO2_CODES = countries.map((c) => c.iso.alpha2);
export const ISO3_CODES = countries.map((c) => c.iso.alpha3);
export const CURRENCY_CODES = Array.from(
    new Set(countries.map((c) => c.currency?.code).filter((c): c is string => !!c)),
).sort();
