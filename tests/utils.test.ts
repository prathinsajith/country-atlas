import { describe, it, expect } from 'vitest';
import { getAllCountries } from '../src/api';
import {
    // Validators
    isValidISO2,
    isValidISO3,
    isValidCallingCode,
    isValidCurrencyCode,
    // Formatters
    getCountryFlag,
    formatPhoneNumber,
    formatCountryWithFlag,
    formatCurrency,
    // Type Guards
    isCountry,
    hasCallingCode,
    hasCurrency,
    hasCapital,
    hasCoordinates,
    isLandlocked,
    isUNMember,
    // Sorting
    sortByName,
    sortByArea,
    groupByContinent,
    groupByRegion,
    groupByCurrency,
    // Geo
    getDistanceBetweenCountries,
    getNearestCountries,
    doCountriesShareBorder,
} from '../src/utils';

describe('Validators', () => {
    describe('isValidISO2', () => {
        it('should validate correct ISO2 codes', () => {
            expect(isValidISO2('US')).toBe(true);
            expect(isValidISO2('IN')).toBe(true);
            expect(isValidISO2('GB')).toBe(true);
        });

        it('should reject invalid ISO2 codes', () => {
            expect(isValidISO2('USA')).toBe(false);
            expect(isValidISO2('U')).toBe(false);
            expect(isValidISO2('us')).toBe(false);
            expect(isValidISO2('12')).toBe(false);
        });
    });

    describe('isValidISO3', () => {
        it('should validate correct ISO3 codes', () => {
            expect(isValidISO3('USA')).toBe(true);
            expect(isValidISO3('IND')).toBe(true);
            expect(isValidISO3('GBR')).toBe(true);
        });

        it('should reject invalid ISO3 codes', () => {
            expect(isValidISO3('US')).toBe(false);
            expect(isValidISO3('USAA')).toBe(false);
            expect(isValidISO3('usa')).toBe(false);
            expect(isValidISO3('123')).toBe(false);
        });
    });

    describe('isValidCallingCode', () => {
        it('should validate correct calling codes', () => {
            expect(isValidCallingCode('+1')).toBe(true);
            expect(isValidCallingCode('91')).toBe(true);
            expect(isValidCallingCode('+44')).toBe(true);
            expect(isValidCallingCode('1')).toBe(true);
        });

        it('should reject invalid calling codes', () => {
            expect(isValidCallingCode('12345')).toBe(false);
            expect(isValidCallingCode('abc')).toBe(false);
            expect(isValidCallingCode('')).toBe(false);
        });
    });

    describe('isValidCurrencyCode', () => {
        it('should validate correct currency codes', () => {
            expect(isValidCurrencyCode('USD')).toBe(true);
            expect(isValidCurrencyCode('EUR')).toBe(true);
            expect(isValidCurrencyCode('INR')).toBe(true);
        });

        it('should reject invalid currency codes', () => {
            expect(isValidCurrencyCode('US')).toBe(false);
            expect(isValidCurrencyCode('USDD')).toBe(false);
            expect(isValidCurrencyCode('usd')).toBe(false);
            expect(isValidCurrencyCode('123')).toBe(false);
        });
    });
});

describe('Formatters', () => {
    describe('getCountryFlag', () => {
        it('should return emoji flag for valid ISO2 code', () => {
            const flag = getCountryFlag('US', 'emoji');
            expect(flag).toBe('🇺🇸');
        });

        it('should return SVG content for valid ISO2 code', () => {
            const flag = getCountryFlag('US', 'svg');
            expect(flag).toContain('<svg');
            expect(flag).toContain('</svg>');
        });

        it('should handle lowercase codes', () => {
            const flag = getCountryFlag('us', 'emoji');
            expect(flag).toBe('🇺🇸');
        });

        it('should return undefined for invalid codes', () => {
            expect(getCountryFlag('XX', 'emoji')).toBeUndefined();
        });
    });

    describe('formatPhoneNumber', () => {
        it('should format phone number with calling code', () => {
            const formatted = formatPhoneNumber('1234567890', 'US');
            expect(formatted).toContain('+1');
            expect(formatted).toContain('1234567890');
        });

        it('should handle country without calling code', () => {
            expect(formatPhoneNumber('123456', 'AQ')).toBeUndefined();
        });
    });

    describe('formatCountryWithFlag', () => {
        it('should format country name with flag emoji', () => {
            const formatted = formatCountryWithFlag('US');
            expect(formatted).toBe('🇺🇸 United States');
        });

        it('should return undefined for invalid code', () => {
            expect(formatCountryWithFlag('XX')).toBeUndefined();
        });
    });

    describe('formatCurrency', () => {
        it('should format currency without amount', () => {
            const formatted = formatCurrency('US');
            expect(formatted).toContain('$');
            expect(formatted).toContain('USD');
        });

        it('should format currency with amount', () => {
            const formatted = formatCurrency('US', 100);
            expect(formatted).toContain('$');
            expect(formatted).toContain('100');
        });

        it('should return undefined for country without currency', () => {
            expect(formatCurrency('AQ')).toBeUndefined();
        });
    });
});

describe('Type Guards', () => {
    const countries = getAllCountries();
    const usa = countries.find((c) => c.iso.alpha2 === 'US')!;

    describe('isCountry', () => {
        it('should validate valid Country objects', () => {
            expect(isCountry(usa)).toBe(true);
        });

        it('should reject invalid objects', () => {
            expect(isCountry(null)).toBe(false);
            expect(isCountry({})).toBe(false);
            expect(isCountry({ name: 'Test' })).toBe(false);
        });
    });

    describe('hasCallingCode', () => {
        it('should return true for countries with calling codes', () => {
            expect(hasCallingCode(usa)).toBe(true);
        });

        it('should return false for countries without calling codes', () => {
            const antarctica = countries.find((c) => c.iso.alpha2 === 'AQ')!;
            expect(hasCallingCode(antarctica)).toBe(false);
        });
    });

    describe('hasCurrency', () => {
        it('should return true for countries with currency', () => {
            expect(hasCurrency(usa)).toBe(true);
        });

        it('should return false for countries without currency', () => {
            const antarctica = countries.find((c) => c.iso.alpha2 === 'AQ')!;
            expect(hasCurrency(antarctica)).toBe(false);
        });
    });

    describe('hasCapital', () => {
        it('should return true for countries with capital', () => {
            expect(hasCapital(usa)).toBe(true);
        });
    });

    describe('hasCoordinates', () => {
        it('should return true for countries with coordinates', () => {
            expect(hasCoordinates(usa)).toBe(true);
        });
    });

    describe('isLandlocked', () => {
        it('should return false for coastal countries', () => {
            expect(isLandlocked(usa)).toBe(false);
        });

        it('should return true for landlocked countries', () => {
            const switzerland = countries.find((c) => c.iso.alpha2 === 'CH')!;
            expect(isLandlocked(switzerland)).toBe(true);
        });
    });

    describe('isUNMember', () => {
        it('should return true for UN member countries', () => {
            expect(isUNMember(usa)).toBe(true);
        });
    });
});

describe('Sorting Utilities', () => {
    const countries = getAllCountries().slice(0, 10); // Use subset for testing

    describe('sortByName', () => {
        it('should sort countries by name in ascending order', () => {
            const sorted = sortByName(countries, 'asc');
            expect(sorted[0].name <= sorted[1].name).toBe(true);
        });

        it('should sort countries by name in descending order', () => {
            const sorted = sortByName(countries, 'desc');
            expect(sorted[0].name >= sorted[1].name).toBe(true);
        });

        it('should not mutate original array', () => {
            const original = [...countries];
            sortByName(countries);
            expect(countries).toEqual(original);
        });
    });

    describe('sortByArea', () => {
        it('should sort countries by area in descending order', () => {
            const sorted = sortByArea(countries, 'desc');
            expect(sorted[0].geo.areaKm2 >= sorted[1].geo.areaKm2).toBe(true);
        });

        it('should sort countries by area in ascending order', () => {
            const sorted = sortByArea(countries, 'asc');
            expect(sorted[0].geo.areaKm2 <= sorted[1].geo.areaKm2).toBe(true);
        });
    });

    describe('groupByContinent', () => {
        it('should group countries by continent', () => {
            const grouped = groupByContinent(getAllCountries());
            expect(Object.keys(grouped)).toContain('Africa');
            expect(Object.keys(grouped)).toContain('Europe');
            expect(Array.isArray(grouped['Africa'])).toBe(true);
        });
    });

    describe('groupByRegion', () => {
        it('should group countries by region', () => {
            const grouped = groupByRegion(getAllCountries());
            expect(Object.keys(grouped).length).toBeGreaterThan(0);
        });
    });

    describe('groupByCurrency', () => {
        it('should group countries by currency', () => {
            const grouped = groupByCurrency(getAllCountries());
            expect(grouped['USD']).toBeDefined();
            expect(Array.isArray(grouped['USD'])).toBe(true);
        });
    });
});

describe('Geographic Utilities', () => {
    const countries = getAllCountries();
    const usa = countries.find((c) => c.iso.alpha2 === 'US')!;
    const canada = countries.find((c) => c.iso.alpha2 === 'CA')!;
    const france = countries.find((c) => c.iso.alpha2 === 'FR')!;

    describe('getDistanceBetweenCountries', () => {
        it('should calculate distance between countries', () => {
            const distance = getDistanceBetweenCountries(usa, canada);
            expect(distance).toBeDefined();
            expect(distance!).toBeGreaterThan(0);
        });

        it('should return shorter distance for neighbors than distant countries', () => {
            const usaCanadaDistance = getDistanceBetweenCountries(usa, canada)!;
            const usaFranceDistance = getDistanceBetweenCountries(usa, france)!;
            expect(usaCanadaDistance).toBeLessThan(usaFranceDistance);
        });

        it('should return undefined for countries without coordinates', () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const mockCountry = { ...usa, geo: { ...usa.geo, latitude: undefined as any } };
            const distance = getDistanceBetweenCountries(mockCountry, canada);
            expect(distance).toBeUndefined();
        });
    });

    describe('getNearestCountries', () => {
        it('should find nearest countries', () => {
            const nearest = getNearestCountries(usa, countries, 5);
            expect(nearest.length).toBeLessThanOrEqual(5);
            expect(nearest[0].country.iso.alpha2).not.toBe('US');
        });

        it('should sort by distance', () => {
            const nearest = getNearestCountries(usa, countries, 10);
            for (let i = 0; i < nearest.length - 1; i++) {
                expect(nearest[i].distance).toBeLessThanOrEqual(nearest[i + 1].distance);
            }
        });

        it('should return empty array for countries without coordinates', () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const mockCountry = { ...usa, geo: { ...usa.geo, latitude: undefined as any } };
            const nearest = getNearestCountries(mockCountry, countries);
            expect(nearest).toEqual([]);
        });
    });

    describe('doCountriesShareBorder', () => {
        it('should detect shared borders', () => {
            const sharesBorder = doCountriesShareBorder(usa, canada);
            expect(sharesBorder).toBe(true);
        });

        it('should return false for non-neighbors', () => {
            const sharesBorder = doCountriesShareBorder(usa, france);
            expect(sharesBorder).toBe(false);
        });
    });
});
