import { describe, it, expect } from 'vitest';
import {
    getCountryByISO2,
    getCountryByISO3,
    getCountryByName,
    getCountriesByContinent,
    getAllCountries,
    getCountry,
} from '../src/api';

describe('API Functions', () => {
    describe('getAllCountries', () => {
        it('should return all countries', () => {
            const countries = getAllCountries();
            expect(countries.length).toBeGreaterThan(200);
        });
    });

    describe('getCountryByISO2', () => {
        it('should return India for ISO2 code IN', () => {
            const country = getCountryByISO2('IN');
            expect(country).toBeDefined();
            expect(country?.name).toBe('India');
        });

        it('should return undefined for invalid ISO2 code', () => {
            const country = getCountryByISO2('XX');
            expect(country).toBeUndefined();
        });

        it('should be case insensitive', () => {
            const country = getCountryByISO2('in');
            expect(country).toBeDefined();
            expect(country?.name).toBe('India');
        });
    });

    describe('getCountryByISO3', () => {
        it('should return India for ISO3 code IND', () => {
            const country = getCountryByISO3('IND');
            expect(country).toBeDefined();
            expect(country?.iso.alpha2).toBe('IN');
        });

        it('should be case insensitive', () => {
            const country = getCountryByISO3('ind');
            expect(country).toBeDefined();
            expect(country?.iso.alpha2).toBe('IN');
        });
    });

    describe('getCountryByName', () => {
        it('should find country by name regardless of case', () => {
            const country = getCountryByName('india');
            expect(country).toBeDefined();
            expect(country?.iso.alpha2).toBe('IN');
        });

        it('should find country by official name', () => {
            const country = getCountryByName('Republic of India');
            expect(country).toBeDefined();
            expect(country?.iso.alpha2).toBe('IN');
        });
    });

    describe('getCountriesByContinent', () => {
        it('should return only Asian countries', () => {
            const countries = getCountriesByContinent('Asia');
            expect(countries.length).toBeGreaterThan(0);
            expect(countries.every((c) => c.geo.continent === 'Asia')).toBe(true);
        });
    });

    describe('getCountry (selector)', () => {
        it('should return only selected fields', () => {
            const country = getCountry('IN', {
                fields: ['name', 'currency'],
            });

            expect(country).toBeDefined();
            expect(country?.name).toBe('India');
            expect(country?.currency).toBeDefined();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            expect((country as any).geo).toBeUndefined();
        });
    });
});
