import { Country } from '../types';

/**
 * Sorting utility functions for Country arrays
 */

export type SortOrder = 'asc' | 'desc';

/**
 * Sort countries alphabetically by name
 */
export function sortByName(countries: Country[], order: SortOrder = 'asc'): Country[] {
    return [...countries].sort((a, b) => {
        const comparison = a.name.localeCompare(b.name);
        return order === 'asc' ? comparison : -comparison;
    });
}

/**
 * Sort countries by population (note: population data not available in current schema)
 */
export function sortByPopulation(countries: Country[], _order: SortOrder = 'desc'): Country[] {
    // Note: Current Country type doesn't include population data
    // This function is a placeholder for future enhancement
    return [...countries];
}

/**
 * Sort countries by area
 */
export function sortByArea(countries: Country[], order: SortOrder = 'desc'): Country[] {
    return [...countries].sort((a, b) => {
        const areaA = a.geo?.areaKm2 || 0;
        const areaB = b.geo?.areaKm2 || 0;
        const comparison = areaA - areaB;
        return order === 'desc' ? -comparison : comparison;
    });
}

/**
 * Group countries by continent
 */
export function groupByContinent(countries: Country[]): Record<string, Country[]> {
    return countries.reduce(
        (groups, country) => {
            const continent = country.geo?.continent || 'Unknown';
            if (!groups[continent]) {
                groups[continent] = [];
            }
            groups[continent].push(country);
            return groups;
        },
        {} as Record<string, Country[]>,
    );
}

/**
 * Group countries by region
 */
export function groupByRegion(countries: Country[]): Record<string, Country[]> {
    return countries.reduce(
        (groups, country) => {
            const region = country.geo?.region || 'Unknown';
            if (!groups[region]) {
                groups[region] = [];
            }
            groups[region].push(country);
            return groups;
        },
        {} as Record<string, Country[]>,
    );
}

/**
 * Group countries by currency code
 */
export function groupByCurrency(countries: Country[]): Record<string, Country[]> {
    return countries.reduce(
        (groups, country) => {
            const currencyCode = country.currency?.code || 'No Currency';
            if (!groups[currencyCode]) {
                groups[currencyCode] = [];
            }
            groups[currencyCode].push(country);
            return groups;
        },
        {} as Record<string, Country[]>,
    );
}
