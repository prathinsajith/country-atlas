/**
 * Validation utilities for country data
 */

/**
 * Validates if a string is a valid ISO 3166-1 alpha-2 code (2 uppercase letters)
 */
export function isValidISO2(code: string): boolean {
    return /^[A-Z]{2}$/.test(code);
}

/**
 * Validates if a string is a valid ISO 3166-1 alpha-3 code (3 uppercase letters)
 */
export function isValidISO3(code: string): boolean {
    return /^[A-Z]{3}$/.test(code);
}

/**
 * Validates if a string is a valid calling code format
 */
export function isValidCallingCode(code: string): boolean {
    return /^\+?\d{1,4}$/.test(code);
}

/**
 * Validates if a string is a valid currency code (3 uppercase letters)
 */
export function isValidCurrencyCode(code: string): boolean {
    return /^[A-Z]{3}$/.test(code);
}
