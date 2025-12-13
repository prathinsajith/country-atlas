import { describe, it, expect } from 'vitest';
import { getCountryByISO2 } from '../src/api';

describe('Flag Integrity', () => {
    it('should contain optimized SVG flags', () => {
        const country = getCountryByISO2('IN');
        expect(country?.flag.svg.startsWith('<svg')).toBe(true);
    });

    it('should have SVG content for major countries', () => {
        const us = getCountryByISO2('US');
        const gb = getCountryByISO2('GB');
        const fr = getCountryByISO2('FR');

        expect(us?.flag.svg).toBeTruthy();
        expect(gb?.flag.svg).toBeTruthy();
        expect(fr?.flag.svg).toBeTruthy();
    });
});
