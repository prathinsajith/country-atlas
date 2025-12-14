import { Country } from '../types';

/**
 * Type guard functions for runtime type checking
 */

/**
 * Checks if a value is a valid Country object
 */
export function isCountry(value: unknown): value is Country {
    if (typeof value !== 'object' || value === null) {
        return false;
    }

    const obj = value as Record<string, unknown>;

    return (
        typeof obj.name === 'string' &&
        typeof obj.officialName === 'string' &&
        typeof obj.iso === 'object' &&
        obj.iso !== null &&
        typeof (obj.iso as Record<string, unknown>).alpha2 === 'string' &&
        typeof (obj.iso as Record<string, unknown>).alpha3 === 'string'
    );
}

/**
 * Checks if a country has a calling code
 */
export function hasCallingCode(country: Country): country is Country & { callingCode: string } {
    return typeof country.callingCode === 'string' && country.callingCode.length > 0;
}

/**
 * Checks if a country has currency information
 */
export function hasCurrency(
    country: Country,
): country is Country & { currency: NonNullable<Country['currency']> } {
    return country.currency !== null && country.currency !== undefined;
}

/**
 * Checks if a country has capital information
 */
export function hasCapital(
    country: Country,
): country is Country & { capital: NonNullable<Country['capital']> } {
    return Array.isArray(country.capital) && country.capital.length > 0;
}

/**
 * Checks if a country has geographic coordinates
 */
export function hasCoordinates(country: Country): boolean {
    return (
        country.geo !== undefined &&
        country.geo.latitude !== undefined &&
        country.geo.longitude !== undefined
    );
}

/**
 * Checks if a country is landlocked
 */
export function isLandlocked(country: Country): boolean {
    return country.geo?.landlocked === true;
}

/**
 * Checks if a country is a UN member
 */
export function isUNMember(country: Country): boolean {
    return country.unMember === true;
}
