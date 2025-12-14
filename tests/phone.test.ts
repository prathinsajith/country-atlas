import { describe, it, expect } from 'vitest';
import {
    validatePhoneNumber,
    isValidPhoneNumber,
    formatPhoneNumberInternational,
    getCountryFromPhoneNumber,
    parsePhoneNumber,
} from '../src/utils/phone';

describe('Phone Number Validation', () => {
    describe('validatePhoneNumber', () => {
        it('should validate US phone number with country code', () => {
            const result = validatePhoneNumber('+1 (555) 123-4567', 'US');
            expect(result.isValid).toBe(true);
            expect(result.country?.iso.alpha2).toBe('US');
            expect(result.callingCode).toBe('+1201');
            expect(result.nationalNumber).toBeTruthy();
        });

        it('should validate Indian phone number', () => {
            const result = validatePhoneNumber('+91 98765 43210', 'IN');
            expect(result.isValid).toBe(true);
            expect(result.country?.iso.alpha2).toBe('IN');
            expect(result.callingCode).toBe('+91');
        });

        it('should validate UK phone number', () => {
            const result = validatePhoneNumber('+44 20 7946 0958', 'GB');
            expect(result.isValid).toBe(true);
            expect(result.country?.iso.alpha2).toBe('GB');
            expect(result.callingCode).toBe('+44');
        });

        it('should validate national format phone number', () => {
            const result = validatePhoneNumber('9876543210', 'IN');
            expect(result.isValid).toBe(true);
            expect(result.country?.iso.alpha2).toBe('IN');
        });

        it('should reject empty phone number', () => {
            const result = validatePhoneNumber('', 'US');
            expect(result.isValid).toBe(false);
            expect(result.error).toBe('Phone number is required');
        });

        it('should reject phone number that is too short', () => {
            const result = validatePhoneNumber('123', 'US');
            expect(result.isValid).toBe(false);
            expect(result.error).toContain('short');
        });

        it('should reject phone number that is too long', () => {
            const result = validatePhoneNumber('12345678901234567890', 'US');
            expect(result.isValid).toBe(false);
            expect(result.error).toContain('long');
        });

        it('should auto-detect country from calling code', () => {
            const result = validatePhoneNumber('+91 9876543210');
            expect(result.isValid).toBe(true);
            expect(result.country?.iso.alpha2).toBe('IN');
        });

        it('should handle phone number with 00 prefix', () => {
            const result = validatePhoneNumber('0091 9876543210');
            expect(result.isValid).toBe(true);
            expect(result.country?.iso.alpha2).toBe('IN');
        });

        it('should reject invalid country code', () => {
            const result = validatePhoneNumber('+1 555-1234', 'XX');
            expect(result.isValid).toBe(false);
            expect(result.error).toContain('Invalid country code');
        });

        it('should handle country without calling code', () => {
            const result = validatePhoneNumber('123456', 'AQ');
            expect(result.isValid).toBe(false);
            expect(result.error).toContain('no calling code');
        });
    });

    describe('isValidPhoneNumber', () => {
        it('should return true for valid phone numbers', () => {
            expect(isValidPhoneNumber('+1 555-1234567', 'US')).toBe(true);
            expect(isValidPhoneNumber('+91 9876543210', 'IN')).toBe(true);
            expect(isValidPhoneNumber('9876543210', 'IN')).toBe(true);
        });

        it('should return false for invalid phone numbers', () => {
            expect(isValidPhoneNumber('', 'US')).toBe(false);
            expect(isValidPhoneNumber('123', 'US')).toBe(false);
            expect(isValidPhoneNumber('invalid', 'US')).toBe(false);
        });
    });

    describe('formatPhoneNumberInternational', () => {
        it('should format US phone number', () => {
            const formatted = formatPhoneNumberInternational('5551234567', 'US');
            expect(formatted).toBeTruthy();
            expect(formatted).toContain('+1');
        });

        it('should format Indian phone number', () => {
            const formatted = formatPhoneNumberInternational('9876543210', 'IN');
            expect(formatted).toBeTruthy();
            expect(formatted).toContain('+91');
        });

        it('should return null for invalid phone number', () => {
            const formatted = formatPhoneNumberInternational('123', 'US');
            expect(formatted).toBeNull();
        });

        it('should format phone number with existing calling code', () => {
            const formatted = formatPhoneNumberInternational('+91 9876543210', 'IN');
            expect(formatted).toBeTruthy();
            expect(formatted).toContain('+91');
        });
    });

    describe('getCountryFromPhoneNumber', () => {
        it('should detect country from phone number with calling code', () => {
            // Use a country with unique calling code
            const country = getCountryFromPhoneNumber('+91 9876543210');
            expect(country?.iso.alpha2).toBe('IN');
        });

        it('should detect country from Indian phone number', () => {
            const country = getCountryFromPhoneNumber('+91 9876543210');
            expect(country?.iso.alpha2).toBe('IN');
        });

        it('should detect country from UK phone number', () => {
            const country = getCountryFromPhoneNumber('+44 20 7946 0958');
            expect(country?.iso.alpha2).toBe('GB');
        });

        it('should return null for phone number without calling code', () => {
            const country = getCountryFromPhoneNumber('9876543210');
            expect(country).toBeNull();
        });

        it('should return null for invalid phone number', () => {
            const country = getCountryFromPhoneNumber('+999 1234567890');
            expect(country).toBeNull();
        });
    });

    describe('parsePhoneNumber', () => {
        it('should parse US phone number', () => {
            const parsed = parsePhoneNumber('+1 555-1234567', 'US');
            expect(parsed).toBeTruthy();
            expect(parsed?.country?.iso.alpha2).toBe('US');
            expect(parsed?.callingCode).toBe('+1201');
            expect(parsed?.nationalNumber).toBeTruthy();
        });

        it('should parse Indian phone number', () => {
            const parsed = parsePhoneNumber('9876543210', 'IN');
            expect(parsed).toBeTruthy();
            expect(parsed?.country?.iso.alpha2).toBe('IN');
            expect(parsed?.callingCode).toBe('+91');
            expect(parsed?.nationalNumber).toBe('9876543210');
        });

        it('should parse phone number with auto-detected country', () => {
            const parsed = parsePhoneNumber('+91 9876543210');
            expect(parsed).toBeTruthy();
            expect(parsed?.country?.iso.alpha2).toBe('IN');
        });

        it('should return null for invalid phone number', () => {
            const parsed = parsePhoneNumber('123', 'US');
            expect(parsed).toBeNull();
        });

        it('should handle phone numbers with special characters', () => {
            const parsed = parsePhoneNumber('+1 (555) 123-4567', 'US');
            expect(parsed).toBeTruthy();
            expect(parsed?.nationalNumber).toBeTruthy();
        });
    });

    describe('Edge Cases', () => {
        it('should handle phone number with spaces', () => {
            const result = validatePhoneNumber('  +91 98765 43210  ', 'IN');
            expect(result.isValid).toBe(true);
        });

        it('should handle phone number with dashes and parentheses', () => {
            const result = validatePhoneNumber('+1-(555)-123-4567', 'US');
            expect(result.isValid).toBe(true);
        });

        it('should handle national number with leading zeros', () => {
            const result = validatePhoneNumber('09876543210', 'IN');
            expect(result.isValid).toBe(true);
            expect(result.nationalNumber).toBe('9876543210'); // Leading zero removed
        });
    });
});
