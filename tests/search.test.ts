import { describe, it, expect } from 'vitest';
import { searchCountry } from '../src/api';

describe('Search Functionality', () => {
    it('should match partial names in search', () => {
        const results = searchCountry('uni');
        expect(results.length).toBeGreaterThan(0);
        const usa = results.find((c) => c.iso.alpha2 === 'US');
        const uk = results.find((c) => c.iso.alpha2 === 'GB');
        expect(usa).toBeDefined();
        expect(uk).toBeDefined();
    });

    it('should return empty array for unmatched search', () => {
        const results = searchCountry('zzzzz');
        expect(results).toEqual([]);
    });
});
