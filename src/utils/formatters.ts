import { getCountryByISO2 } from '../api';

/**
 * Formatting utilities for country data
 */

/**
 * Gets country flag in specified format
 */
export function getCountryFlag(
    isoCode: string,
    format: 'emoji' | 'svg' = 'emoji',
): string | undefined {
    const country = getCountryByISO2(isoCode);
    if (!country) return undefined;

    return format === 'emoji' ? country.flag.emoji : country.flag.svg;
}

/**
 * Formats a phone number with country calling code
 */
export function formatPhoneNumber(phone: string, isoCode: string): string | undefined {
    const country = getCountryByISO2(isoCode);
    if (!country || !country.callingCode) return undefined;

    // Remove all non-digit characters except +
    const cleanPhone = phone.replace(/[^\d+]/g, '');

    // If already has calling code, return as is
    if (cleanPhone.startsWith(country.callingCode)) {
        return cleanPhone;
    }

    // Remove leading zeros and add calling code
    const phoneWithoutZeros = cleanPhone.replace(/^0+/, '');
    return `${country.callingCode}${phoneWithoutZeros}`;
}

/**
 * Formats country name with flag emoji
 */
export function formatCountryWithFlag(isoCode: string): string | undefined {
    const country = getCountryByISO2(isoCode);
    if (!country) return undefined;

    return `${country.flag.emoji} ${country.name}`;
}

/**
 * Formats currency with symbol
 */
export function formatCurrency(isoCode: string, amount?: number): string | undefined {
    const country = getCountryByISO2(isoCode);
    if (!country || !country.currency) return undefined;

    const { symbol, code } = country.currency;

    if (amount !== undefined) {
        return `${symbol}${amount.toLocaleString()} ${code}`;
    }

    return `${symbol} (${code})`;
}
