import { getCountryByISO2, getCountryByCallingCode } from '../api';
import { Country } from '../types';

/**
 * Phone number validation and formatting utilities
 */

export interface PhoneValidationResult {
    isValid: boolean;
    country?: Country;
    callingCode?: string;
    nationalNumber?: string;
    formattedNumber?: string;
    error?: string;
}

/**
 * Extract calling code from phone number
 */
function extractCallingCode(phoneNumber: string): string | null {
    // Remove all non-digit characters except +
    const cleaned = phoneNumber.replace(/[^\d+]/g, '');

    // Try to match calling code patterns (1-4 digits after + or 00)
    const plusMatch = cleaned.match(/^\+(\d{1,4})/);
    if (plusMatch) {
        // Try different lengths (from longest to shortest)
        for (let len = 4; len >= 1; len--) {
            const code = '+' + plusMatch[1].substring(0, len);
            return code;
        }
    }

    const zeroMatch = cleaned.match(/^00(\d{1,4})/);
    if (zeroMatch) {
        for (let len = 4; len >= 1; len--) {
            const code = '+' + zeroMatch[1].substring(0, len);
            return code;
        }
    }

    return null;
}

/**
 * Validate phone number against a specific country
 */
export function validatePhoneNumber(
    phoneNumber: string,
    countryCode?: string,
): PhoneValidationResult {
    if (!phoneNumber || phoneNumber.trim().length === 0) {
        return {
            isValid: false,
            error: 'Phone number is required',
        };
    }

    // Clean the phone number
    const cleaned = phoneNumber.replace(/[^\d+]/g, '');

    // If country code is provided, validate against it
    if (countryCode) {
        const country = getCountryByISO2(countryCode);
        if (!country) {
            return {
                isValid: false,
                error: `Invalid country code: ${countryCode}`,
            };
        }

        if (!country.callingCode) {
            return {
                isValid: false,
                error: `Country ${country.name} has no calling code`,
            };
        }

        const callingCode = country.callingCode.replace(/[^\d+]/g, '');
        const hasCallingCode =
            cleaned.startsWith(callingCode) || cleaned.startsWith(callingCode.substring(1));

        if (hasCallingCode) {
            const nationalNumber = cleaned.replace(callingCode, '').replace(/^\+/, '');
            return {
                isValid: nationalNumber.length >= 4 && nationalNumber.length <= 15,
                country,
                callingCode: country.callingCode,
                nationalNumber,
                formattedNumber: `${country.callingCode} ${nationalNumber}`,
                error:
                    nationalNumber.length < 4
                        ? 'Phone number too short'
                        : nationalNumber.length > 15
                          ? 'Phone number too long'
                          : undefined,
            };
        } else {
            // Number doesn't have calling code, assume it's a national number
            if (cleaned.length >= 4 && cleaned.length <= 15) {
                return {
                    isValid: true,
                    country,
                    callingCode: country.callingCode,
                    nationalNumber: cleaned.replace(/^0+/, ''), // Remove leading zeros
                    formattedNumber: `${country.callingCode} ${cleaned.replace(/^0+/, '')}`,
                };
            } else {
                return {
                    isValid: false,
                    country,
                    error: cleaned.length < 4 ? 'Phone number too short' : 'Phone number too long',
                };
            }
        }
    }

    // No country code provided, try to auto-detect from calling code
    const extracted = extractCallingCode(phoneNumber);
    if (extracted) {
        // Try different calling code lengths
        for (let len = extracted.length - 1; len >= 2; len--) {
            const callingCode = extracted.substring(0, len + 1);
            const country = getCountryByCallingCode(callingCode);
            if (country && country.callingCode) {
                const nationalNumber = cleaned
                    .replace(callingCode, '')
                    .replace(/^00/, '')
                    .replace(/^\+/, '')
                    .replace(/^0+/, '');

                const isValid = nationalNumber.length >= 4 && nationalNumber.length <= 15;
                return {
                    isValid,
                    country,
                    callingCode: country.callingCode,
                    nationalNumber,
                    formattedNumber: isValid
                        ? `${country.callingCode} ${nationalNumber}`
                        : undefined,
                    error: !isValid
                        ? nationalNumber.length < 4
                            ? 'Phone number too short'
                            : 'Phone number too long'
                        : undefined,
                };
            }
        }
    }

    // Couldn't determine country
    return {
        isValid: false,
        error: 'Could not determine country from phone number. Please provide country code.',
    };
}

/**
 * Check if phone number is valid for a specific country
 */
export function isValidPhoneNumber(phoneNumber: string, countryCode?: string): boolean {
    return validatePhoneNumber(phoneNumber, countryCode).isValid;
}

/**
 * Format phone number in international format
 */
export function formatPhoneNumberInternational(
    phoneNumber: string,
    countryCode?: string,
): string | null {
    const result = validatePhoneNumber(phoneNumber, countryCode);
    return result.isValid ? result.formattedNumber || null : null;
}

/**
 * Get country from phone number
 */
export function getCountryFromPhoneNumber(phoneNumber: string): Country | null {
    const result = validatePhoneNumber(phoneNumber);
    return result.country || null;
}

/**
 * Parse phone number into components
 */
export function parsePhoneNumber(
    phoneNumber: string,
    countryCode?: string,
): {
    country?: Country;
    callingCode?: string;
    nationalNumber?: string;
} | null {
    const result = validatePhoneNumber(phoneNumber, countryCode);
    if (result.isValid) {
        return {
            country: result.country,
            callingCode: result.callingCode,
            nationalNumber: result.nationalNumber,
        };
    }
    return null;
}
