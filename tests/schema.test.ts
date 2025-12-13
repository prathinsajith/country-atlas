import { describe, it, expect } from 'vitest';
import { countries } from '../src/data';

describe('Schema Validation', () => {
    it('should validate all country objects against the schema', () => {
        countries.forEach((country) => {
            expect(country.name).toBeTruthy();
            expect(country.officialName).toBeTruthy();
            if (country.capital) {
                expect(Array.isArray(country.capital)).toBe(true);
            }
            expect(country.iso.alpha2).toHaveLength(2);
            expect(country.iso.alpha3).toHaveLength(3);
            expect(country.geo).toBeDefined();
            if (country.currency) {
                expect(country.currency.code).toBeDefined();
            }
            if (country.flag) {
                expect(country.flag.emoji || country.flag.svg).toBeTruthy();
            }
        });
    });

    it('should have unique ISO2 codes', () => {
        const iso2s = countries.map((c) => c.iso.alpha2);
        const uniqueIso2s = new Set(iso2s);
        expect(uniqueIso2s.size).toBe(iso2s.length);
    });

    it('should have unique ISO3 codes', () => {
        const iso3s = countries.map((c) => c.iso.alpha3);
        const uniqueIso3s = new Set(iso3s);
        expect(uniqueIso3s.size).toBe(iso3s.length);
    });
});
