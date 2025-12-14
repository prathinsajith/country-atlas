import { countries } from '../data';
import { Country } from '../types';
import { CountryNotFoundError } from '../errors';

/**
 * Returns all countries in the dataset.
 */
export function getAllCountries(): Country[] {
    return countries;
}

/**
 * Returns a country by its ISO 3166-1 alpha-2 code (case-insensitive).
 */
export function getCountryByISO2(code: string): Country | undefined {
    return countries.find((c) => c.iso.alpha2.toLowerCase() === code.toLowerCase());
}

/**
 * Returns a country by its ISO 3166-1 alpha-3 code (case-insensitive).
 */
export function getCountryByISO3(code: string): Country | undefined {
    return countries.find((c) => c.iso.alpha3.toLowerCase() === code.toLowerCase());
}

/**
 * Returns a country by its common or official name (case-insensitive fuzzy match).
 */
export function getCountryByName(name: string): Country | undefined {
    const query = name.toLowerCase();
    return countries.find(
        (c) =>
            c.name.toLowerCase() === query ||
            c.officialName.toLowerCase() === query ||
            c.iso.alpha2.toLowerCase() === query ||
            c.iso.alpha3.toLowerCase() === query,
    );
}

/**
 * Returns all countries in a specific continent.
 */
export function getCountriesByContinent(continent: string): Country[] {
    const query = continent.toLowerCase();
    return countries.filter((c) => c.geo.continent.toLowerCase() === query);
}

/**
 * Returns a country by its calling code (e.g. "+1", "91").
 * Handles codes with or without '+' prefix.
 */
export function getCountryByCallingCode(callingCode: string): Country | undefined {
    const code = callingCode.replace('+', '');
    return countries.find((c) => {
        const root = c.callingCode?.replace('+', '') || '';
        return root === code;
    });
}

/**
 * Returns all countries that use a specific currency code (e.g. "USD", "EUR").
 */
export function getCountriesByCurrency(currencyCode: string): Country[] {
    const code = currencyCode.toUpperCase();
    return countries.filter((c) => c.currency?.code === code);
}

/**
 * Returns all countries where a specific language is spoken.
 */
export function getCountriesByLanguage(language: string): Country[] {
    const query = language.toLowerCase();
    return countries.filter((c) => c.languages?.some((l) => l.toLowerCase() === query));
}

/**
 * Searches for countries by name, capital, or other fields.
 */
export function searchCountry(query: string): Country[] {
    const q = query.toLowerCase();
    return countries.filter(
        (c) => c.name.toLowerCase().includes(q) || c.officialName.toLowerCase().includes(q),
        // Add more fields if needed
    );
}

/**
 * Advanced selector: Get country by ISO code and return specific fields.
 * Uses Partial<Country> because some fields might be excluded.
 */
export function getCountry(
    code: string,
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
 * Get multiple countries by their ISO2 codes in a single call
 * @param codes Array of ISO 3166-1 alpha-2 codes
 * @returns Array of found countries (missing codes are skipped)
 */
export function getCountriesByISO2Codes(codes: string[]): Country[] {
    return codes.map((code) => getCountryByISO2(code)).filter((c): c is Country => c !== undefined);
}

/**
 * Get multiple countries by their ISO3 codes in a single call
 * @param codes Array of ISO 3166-1 alpha-3 codes
 * @returns Array of found countries (missing codes are skipped)
 */
export function getCountriesByISO3Codes(codes: string[]): Country[] {
    return codes.map((code) => getCountryByISO3(code)).filter((c): c is Country => c !== undefined);
}

/**
 * Advanced search with multiple criteria
 * @param criteria Search criteria object
 * @returns Array of countries matching all criteria
 */
export function searchCountries(criteria: {
    continent?: string;
    region?: string;
    currency?: string;
    language?: string;
    landlocked?: boolean;
    unMember?: boolean;
    name?: string;
}): Country[] {
    return countries.filter((country) => {
        // Continent filter
        if (
            criteria.continent &&
            country.geo.continent.toLowerCase() !== criteria.continent.toLowerCase()
        ) {
            return false;
        }

        // Region filter
        if (
            criteria.region &&
            country.geo.region?.toLowerCase() !== criteria.region.toLowerCase()
        ) {
            return false;
        }

        // Currency filter
        if (criteria.currency && country.currency?.code !== criteria.currency.toUpperCase()) {
            return false;
        }

        // Language filter
        if (
            criteria.language &&
            !country.languages?.some((l) => l.toLowerCase() === criteria.language!.toLowerCase())
        ) {
            return false;
        }

        // Landlocked filter
        if (criteria.landlocked !== undefined && country.geo.landlocked !== criteria.landlocked) {
            return false;
        }

        // UN Member filter
        if (criteria.unMember !== undefined && country.unMember !== criteria.unMember) {
            return false;
        }

        // Name filter (partial match)
        if (
            criteria.name &&
            !country.name.toLowerCase().includes(criteria.name.toLowerCase()) &&
            !country.officialName.toLowerCase().includes(criteria.name.toLowerCase())
        ) {
            return false;
        }

        return true;
    });
}

/**
 * Get country by ISO2 code or throw CountryNotFoundError
 * @param code ISO 3166-1 alpha-2 code
 * @throws {CountryNotFoundError} If country is not found
 */
export function getCountryByISO2OrThrow(code: string): Country {
    const country = getCountryByISO2(code);
    if (!country) {
        throw new CountryNotFoundError(code, 'iso2');
    }
    return country;
}

/**
 * Get country by ISO3 code or throw CountryNotFoundError
 * @param code ISO 3166-1 alpha-3 code
 * @throws {CountryNotFoundError} If country is not found
 */
export function getCountryByISO3OrThrow(code: string): Country {
    const country = getCountryByISO3(code);
    if (!country) {
        throw new CountryNotFoundError(code, 'iso3');
    }
    return country;
}

/**
 * Get country by name or throw CountryNotFoundError
 * @param name Country name (common or official)
 * @throws {CountryNotFoundError} If country is not found
 */
export function getCountryByNameOrThrow(name: string): Country {
    const country = getCountryByName(name);
    if (!country) {
        throw new CountryNotFoundError(name, 'name');
    }
    return country;
}
