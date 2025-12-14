/**
 * Custom error classes for country-atlas
 */

/**
 * Error thrown when a country is not found
 */
export class CountryNotFoundError extends Error {
    constructor(
        public readonly code: string,
        public readonly searchType: 'iso2' | 'iso3' | 'name' | 'callingCode' = 'iso2',
    ) {
        super(`Country not found with ${searchType}: ${code}`);
        this.name = 'CountryNotFoundError';
        Object.setPrototypeOf(this, CountryNotFoundError.prototype);
    }
}

/**
 * Error thrown when invalid input is provided
 */
export class InvalidInputError extends Error {
    constructor(
        public readonly field: string,
        public readonly value: unknown,
        public readonly reason: string,
    ) {
        super(`Invalid ${field}: ${value}. ${reason}`);
        this.name = 'InvalidInputError';
        Object.setPrototypeOf(this, InvalidInputError.prototype);
    }
}
