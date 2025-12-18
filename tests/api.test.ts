import { describe, it, expect } from 'vitest';
import {
    getCountryByISO2,
    getCountryByISO3,
    getCountryByName,
    getCountriesByContinent,
    getAllCountries,
    getCountry,
    getCountryByCallingCode,
    getCountriesByCurrency,
    getCountriesByLanguage,
    getBorderCountries,
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

    describe('getCountryByCallingCode', () => {
        it('should find country by calling code with +', () => {
            const country = getCountryByCallingCode('+91');
            expect(country).toBeDefined();
            expect(country?.iso.alpha2).toBe('IN');
        });

        it('should find country by calling code without +', () => {
            const country = getCountryByCallingCode('91');
            expect(country).toBeDefined();
            expect(country?.iso.alpha2).toBe('IN');
        });

        it('should return undefined for invalid calling code', () => {
            const country = getCountryByCallingCode('+9999');
            expect(country).toBeUndefined();
        });

        it('should handle calling codes with mixed formats', () => {
            const countryWithPlus = getCountryByCallingCode('+44');
            const countryWithoutPlus = getCountryByCallingCode('44');
            expect(countryWithPlus?.iso.alpha2).toBe('GB');
            expect(countryWithoutPlus?.iso.alpha2).toBe('GB');
        });
    });

    describe('getCountriesByCurrency', () => {
        it('should return all countries using EUR', () => {
            const countries = getCountriesByCurrency('EUR');
            expect(countries.length).toBeGreaterThan(0);
            expect(countries.every((c) => c.currency?.code === 'EUR')).toBe(true);
        });

        it('should return all countries using USD', () => {
            const countries = getCountriesByCurrency('USD');
            expect(countries.length).toBeGreaterThan(0);
            expect(countries.every((c) => c.currency?.code === 'USD')).toBe(true);
        });

        it('should be case insensitive', () => {
            const countries = getCountriesByCurrency('usd');
            expect(countries.length).toBeGreaterThan(0);
        });

        it('should return empty array for non-existent currency', () => {
            const countries = getCountriesByCurrency('XXX');
            expect(countries).toEqual([]);
        });
    });

    describe('getCountriesByLanguage', () => {
        it('should find countries by language (English)', () => {
            const countries = getCountriesByLanguage('English');
            expect(countries.length).toBeGreaterThan(0);
            const us = countries.find((c) => c.iso.alpha2 === 'US');
            const gb = countries.find((c) => c.iso.alpha2 === 'GB');
            expect(us || gb).toBeDefined();
        });

        it('should be case insensitive', () => {
            const countries = getCountriesByLanguage('english');
            expect(countries.length).toBeGreaterThan(0);
        });

        it('should return empty array for non-existent language', () => {
            const countries = getCountriesByLanguage('FakeLanguage');
            expect(countries).toEqual([]);
        });

        it('should find countries by less common languages', () => {
            const countries = getCountriesByLanguage('Hindi');
            expect(countries.length).toBeGreaterThan(0);
            const india = countries.find((c) => c.iso.alpha2 === 'IN');
            expect(india).toBeDefined();
        });
    });
    describe('getCountryByName (Native)', () => {
        it('should find India by native name (Hindi)', () => {
            const country = getCountryByName('भारत');
            expect(country).toBeDefined();
            expect(country?.iso.alpha2).toBe('IN');
        });

        it('should find France by native name', () => {
            const country = getCountryByName('République française');
            expect(country).toBeDefined();
            expect(country?.iso.alpha2).toBe('FR');
        });
    });

    describe('getBorderCountries', () => {
        it('should return bordering countries for India', () => {
            const borders = getBorderCountries('IN');
            expect(borders.length).toBeGreaterThan(0);
            const names = borders.map((c) => c.name);
            expect(names).toContain('Pakistan');
            expect(names).toContain('China');
        });

        it('should return empty for island countries', () => {
            const borders = getBorderCountries('Japan');
            expect(borders).toEqual([]);
        });
    });

    describe('Constants', () => {
        it('should export valid constant lists', async () => {
            const { CONTINENTS, ISO2_CODES, ISO3_CODES, CURRENCY_CODES } =
                await import('../src/api');
            expect(CONTINENTS).toContain('Asia');
            expect(ISO2_CODES).toContain('IN');
            expect(ISO3_CODES).toContain('IND');
            expect(CURRENCY_CODES).toContain('USD');
        });
    });
});
